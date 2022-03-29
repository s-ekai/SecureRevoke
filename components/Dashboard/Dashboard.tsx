import React, { useState, useEffect } from 'react'
import Header from "../Header/Header";
import { ClipLoader } from 'react-spinners'
import TokenMappingList from '../../data/token-list.json';
import { useNetwork } from 'wagmi'
import { isSupportedNetwork } from '../common/util'
import { useAccount } from 'wagmi'
import { TokenMapping, TokenFromList } from '../common/interface'
import { getAddress } from 'ethers/lib/utils'
import TokenList from "./TokenList";

function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false)
  const [tokenStandard, setTokenStandard] = useState<'ERC20' | 'ERC721'>('ERC20')
  const [inputAddress, setInputAddress] = useState<string>()
  const [tokenMapping, setTokenMapping] = useState<TokenMapping>()
  const [{ data: networkData }] = useNetwork()
  const chainId = networkData?.chain?.id ?? 592
  const networkName = networkData?.chain?.name ?? `Network with chainId ${chainId}`
  const [{ data: accountData }] = useAccount({ fetchEns: true })
  const connectedAddress = accountData?.address

  useEffect(() => {
    setInputAddress(connectedAddress)
  }, [connectedAddress])

  useEffect(() => {
    loadData()
  }, [chainId])

  const loadData = async () => {
    console.log('11')
    const tokens: TokenFromList[] = TokenMappingList.tokens

    const tokenMappingHash = {}
    for (const token of tokens) {
      tokenMappingHash[getAddress(token.address)] = token
    }
    setTokenMapping(tokenMappingHash)
  }

  if (!isSupportedNetwork(chainId)) {
    return (
      <div>{networkName} is not supported. Now only support Astar Network. Please change Network</div>
    )
  }

  if (loading) {
    return (<ClipLoader css="margin: 10px;" size={40} color={'#000'} loading={loading} />)
  }

  return (
    <div className='section'>
      <Header />

      <div className='section-common_header'>
        <h3 className='section-common_header-title'>EVM ERC20 Approvals</h3>
      </div>

      <div className='section-home'>
        <div className='section-home_cards'>
          <TokenList
            inputAddress={inputAddress}
            tokenMapping={tokenMapping}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard