import React from "react";
import { useAccount, useConnect } from 'wagmi'
import { shortenAddress } from "../common/util";

const ConnectButton: React.FC = () => {
  const [{ data: connectData }, connect] = useConnect()
  const [{ data: accountData }] = useAccount({ fetchEns: true })

  const buttonText = accountData?.ens?.name ?? shortenAddress(accountData?.address) ?? 'Connect wallet'

  return (
    <button className='section-header_link background-main wallet-button wallet-button' onClick={() => connect(connectData.connectors[0])}>{buttonText}</button>
  )
}

export default ConnectButton