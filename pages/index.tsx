import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import Dashboard from '../components/Dashboard/Dashboard'
import { WagmiProvider, InjectedConnector } from 'wagmi'
import { providers as multicall } from '@0xsequence/multicall'
import axios from 'axios'
import { providers } from 'ethers'

declare let window: {
  ethereum?: any
  web3?: any
  location: any
}

const Home: NextPage = () => {

  const [provider, setProvider] = useState<multicall.MulticallProvider>()

  useEffect(() => {
    connectProvider()

    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => window.location.reload(false))
      window.ethereum.on('accountsChanged', () => window.location.reload(false))
    }
  }, [])

  const connectProvider = async () => {
    if (window.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum)
      await updateProvider(provider)
      console.log('Using injected "window.ethereum" provider')
    } else if (window.web3 && window.web3.currentProvider) {
      const provider = new providers.Web3Provider(window.web3.currentProvider)
      await updateProvider(provider)
      console.log('Using injected "window.web3" provider')
    } else {
      console.log('No web3 provider available')
    }
  }

  const updateProvider = async (newProvider: providers.Provider) => {
    const { chainId } = await newProvider.getNetwork()
    emitAnalyticsEvent(`connect_wallet_${chainId}`)
    const multicallProvider = new multicall.MulticallProvider(newProvider, { verbose: true })
    setProvider(multicallProvider)
  }

  const emitAnalyticsEvent = (eventName: string) => {
    if (window && (window as any).sa_event) {
      (window as any).sa_event(eventName)
    }
  }

  return (
    <WagmiProvider
      autoConnect
      connectors={[new InjectedConnector()]}
      provider={provider}
    >
      <div className='main-wrapper'>
        <Sidebar />
        <Dashboard />
      </div>
    </WagmiProvider>
  )
}

export default Home
