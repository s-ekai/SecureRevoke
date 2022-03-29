import React, { useEffect, useState } from 'react'
import { Log } from '@ethersproject/abstract-provider'
import { TokenMapping } from '../common/interface'
import Erc20TokenList from '../EVM/ERC20/Erc20TokenList'
import { hexZeroPad, Interface } from 'ethers/lib/utils'
import { ERC20 } from '../common/abis'

import { getLogs } from '../common/util'
import { ClipLoader } from 'react-spinners'
import { useProvider } from 'wagmi'
import { providers as multicall } from '@0xsequence/multicall'

interface Props {
  inputAddress?: string
  tokenMapping?: TokenMapping
}

function TokenList({
  inputAddress,
  tokenMapping,
}: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const [approvalEvents, setApprovalEvents] = useState<Log[]>()

  const provider = useProvider()

  useEffect(() => {
    loadData()
  }, [inputAddress, provider])

  const loadData = async () => {
    console.log(inputAddress)
    if (!inputAddress) return
    if (!(provider instanceof multicall.MulticallProvider)) return

    const ERC20Interface = new Interface(ERC20)

    const approvalFilter = {
        topics: [ERC20Interface.getEventTopic('Approval'), hexZeroPad(inputAddress, 32)]
      }
    const foundApprovalEvents = await getLogs(provider, approvalFilter, 540000, 560000)

    setApprovalEvents(foundApprovalEvents)

    setLoading(false)
  }

  if (!inputAddress) {
    return null;
  }

  if (loading || [approvalEvents].includes(undefined)) {
    return (<ClipLoader css="margin: 10px;" size={40} color={'#000'} loading={loading} />)
  }

  return (
    <Erc20TokenList
      inputAddress={inputAddress}
      tokenMapping={tokenMapping}
      approvalEvents={approvalEvents}
    />
  );
}

export default TokenList