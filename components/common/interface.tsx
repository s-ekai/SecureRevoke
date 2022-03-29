import { Contract, providers } from 'ethers'

export interface TokenFromList {
  chainId: number
  address: string
  name: string
  symbol: string
  logoURI: string
  decimals?: number
}

export interface TokenMapping {
  [index: string]: TokenFromList
}

export interface Erc20TokenData {
  contract: Contract
  icon: string
  symbol: string
  decimals: number
  balance: string
  totalSupply: string
  registered: boolean
  approvals: Array<providers.Log>
}