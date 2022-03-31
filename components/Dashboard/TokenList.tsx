import React, { useEffect, useState } from 'react'
import { Log, Filter } from '@ethersproject/abstract-provider'
import { TokenMapping } from '../common/interface'
import Erc20TokenList from '../EVM/ERC20/Erc20TokenList'
import { hexZeroPad, Interface } from 'ethers/lib/utils'
import { ERC20 } from '../common/abis'

import { getLogs } from '../common/util'
import { ClipLoader } from 'react-spinners'
import { useProvider } from 'wagmi'
import { providers as multicall } from '@0xsequence/multicall'
import { providers } from 'ethers'
import { ProgressBar } from 'react-bootstrap'

interface Props {
  inputAddress?: string
  tokenMapping?: TokenMapping
}

function TokenList({
  inputAddress,
  tokenMapping,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const [approvalEvents, setApprovalEvents] = useState<Log[]>()
  const [maxBlock, setMaxblock] = useState<number>(0)
  const [currentBlock, setCurrentBlock] = useState<number>(0)


  const provider = useProvider()

  useEffect(() => {
    loadData()
  }, [inputAddress, provider])

  const loadData = async () => {
    if (!inputAddress) return
    if (!(provider instanceof multicall.MulticallProvider)) return

    const ERC20Interface = new Interface(ERC20)
    const latestBlockNumber = await provider.getBlockNumber()
    setMaxblock(latestBlockNumber)

    const approvalFilter = {
        topics: [ERC20Interface.getEventTopic('Approval'), hexZeroPad(inputAddress, 32)]
      }
    // TODO: it is too slow, i have to improve. MUST: improve
    const getLogsRecursively = async (
      provider: providers.Provider,
      baseFilter: Filter,
      fromBlock: number,
      toBlock: number,
      currentBlock: number
    ): Promise<Log[]> => {
      // INFO: more than 20000, timeout error happend
      let previousBlock = currentBlock - 20000;
      setCurrentBlock(previousBlock)

      if (previousBlock < 0) {
        previousBlock = 0
      }

      if (previousBlock != 0) {
        const logs = await getLogs(provider, baseFilter, previousBlock, currentBlock);

        if (logs.length > 0) {
          setApprovalEvents(currentApprovalEvents => currentApprovalEvents ? [...currentApprovalEvents, ...logs] : logs)
        }

        await getLogsRecursively(provider, baseFilter, fromBlock, toBlock, previousBlock)
      } else {
      }
    };

    getLogsRecursively(provider, approvalFilter, 0, latestBlockNumber, latestBlockNumber)

  }

  if (!inputAddress) {
    return null;
  }

  if (loading || [approvalEvents].includes(undefined)) {
    return (<ClipLoader css="margin: 10px;" size={40} color={'#000'} loading={loading} />)
  }

  return (
    <div>
      <span>Searching { (maxBlock - currentBlock) >= maxBlock ? maxBlock : maxBlock - currentBlock } Blocks / { maxBlock } Blocks</span>
      <ProgressBar variant="warning" now={Math.floor((maxBlock - currentBlock) / maxBlock * 100)} label={`${Math.floor((maxBlock - currentBlock) / maxBlock * 100) >= 100 ? 100 : Math.floor((maxBlock - currentBlock) / maxBlock * 100) }%`} />
      <br />
      <Erc20TokenList
        inputAddress={inputAddress}
        tokenMapping={tokenMapping}
        approvalEvents={approvalEvents}
      />
    </div>
  );
}

export default TokenList