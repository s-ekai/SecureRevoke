import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { BigNumber, Contract } from 'ethers'
import { formatAllowance } from './util'
import { Erc20TokenData } from '../../common/interface'
import { addressToAppName, shortenAddress, getDappListName, lookupEnsName, fromFloat } from '../../common/util'
import RevokeButton from '../../common/RevokeButton'
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi'
import { toFloat } from '../../common/util'
import Image from 'next/image'

interface Props {
  spender: string
  allowance: string
  inputAddress: string
  token: Erc20TokenData
  onRevoke: (spender: string) => void;
}

function Erc20Allowance({ spender, allowance, inputAddress, token, onRevoke }: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const [ensSpender, setEnsSpender] = useState<string | undefined>()
  // const [spenderAppName, setSpenderAppName] = useState<string | undefined>()
  const [updatedAllowance, setUpdatedAllowance] = useState<string | undefined>()

  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  const [{ data: accountData }] = useAccount()
  const [{ data: networkData }] = useNetwork()
  const chainId = networkData?.chain?.id ?? 1

  useEffect(() => {
    loadData()
  }, [spender, allowance])

  const loadData = async () => {
    setLoading(true)

    const newEnsSpender = await lookupEnsName(spender, provider)
    setEnsSpender(newEnsSpender)

    const dappListNetworkName = getDappListName(chainId)
    // const newSpenderAppName = await addressToAppName(spender, dappListNetworkName)
    // setSpenderAppName(newSpenderAppName)

    setLoading(false)
  }

  const revoke = async () => update('0')

  const update = async (newAllowance: string) => {
    const bnNew = BigNumber.from(fromFloat(newAllowance, token.decimals))
    const writeContract = new Contract(token.contract.address, token.contract.interface, signer ?? provider)

    let tx
    // Not all ERC20 contracts allow for simple changes in approval to be made
    // https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    // so we tell the user to revoke instead if the contract doesn't allow the simple use
    // of contract.approve(0)
    try {
      console.debug(`Calling contract.approve(${spender}, ${bnNew.toString()})`)
      tx = await writeContract.functions.approve(spender, bnNew)
    } catch (e) {
      const code = e.error?.code ?? e.code
      console.debug(`failed, code ${code}`)
      if (code === -32000) {
        // toast.error("This token does not support updating allowances, please revoke instead", {
        //   position: "top-left",
        // })
      }

      // ignore other errors
      console.log('Ran into issue while revoking', e)
    }

    if (tx) {
      await tx.wait(1)
      console.debug('Reloading data')

      if (newAllowance === '0') {
        onRevoke(spender)
      } else {
        // TODO: Update allowance order after update
        setUpdatedAllowance(fromFloat(newAllowance, token.decimals))
      }
    }
  }

  if (loading) {
    return (<div><ClipLoader size={10} color={'#000'} loading={loading} /></div>)
  }

  const spenderDisplay = ensSpender || spender
  const shortenedSpenderDisplay = ensSpender || shortenAddress(spender)

  const explorerBaseUrl = 'https://astar.subscan.io/address'

  const shortenedLink = explorerBaseUrl
    ? (<a className="monospace" href={`${explorerBaseUrl}/${spender}`}>{shortenedSpenderDisplay}</a>)
    : shortenedSpenderDisplay

  const regularLink = explorerBaseUrl
    ? (<a className="monospace" href={`${explorerBaseUrl}/${spender}`}>{spenderDisplay}</a>)
    : spenderDisplay

  const canUpdate = inputAddress === accountData?.address && formatAllowance(allowance, token.decimals, token.totalSupply) !== '0.000'

  return (

    <div className='section-home_card'>

      <div className='section-home_card-header'>
        <div className='section-home_card-header_top'>
          <div className='section-home_card-header_top-left'>
            {
              allowance !== '0'
                ? ''
                : <Image src="/images/check.png" width={20} height={20} style={{ marginRight: 0 }} alt="check mark" />
            }
            {token.symbol}
          </div>
        </div>

        <div className='section-home_card-header_bottom'>
          <div className='section-home_card-header_bottom-left'>({ token.contract.address }<Image src="/images/open-link.svg" width={14} height={14} alt="link" />)</div>
        </div>

      </div>

      <div className="section-home_card-body display-block">
        <div className="section-home_card-body_left-header-link background-white">Spender: { spenderDisplay }</div>
        <div className="section-home_card-body_left-header-link background-white">Allowance: {formatAllowance(updatedAllowance ?? allowance, token.decimals, token.totalSupply)}</div>
        <div className="section-home_card-body_left-header-link background-white">Curren Balance: {toFloat(Number(token.balance), token.decimals)}</div>

        {<RevokeButton canRevoke={canUpdate} revoke={revoke} id={`revoke-${token.symbol}-${spender}`} />}
      </div>
    </div>

  )
}

export default Erc20Allowance
