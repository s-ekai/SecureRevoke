import { Filter, Log } from '@ethersproject/abstract-provider'
import { TokenMapping } from './interface'
import { BigNumberish, BigNumber, providers } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import axios from 'axios'

export function shortenAddress(address?: string): string {
  return address && `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`
}

export function isSupportedNetwork(chainId: number): boolean {
  const supportedNetworks = [592]
  return supportedNetworks.includes(chainId);
}

export const getLogs = async (
  provider: providers.Provider,
  baseFilter: Filter,
  fromBlock: number,
  toBlock: number
): Promise<Log[]> => {
  const filter = { ...baseFilter, fromBlock, toBlock };
  try {
    const result = await provider.getLogs(filter);
    return result;
  } catch (error) {
    const errorMessage = error?.error?.message ?? error?.message;
    if (errorMessage !== 'query returned more than 10000 results') {
      throw error;
    }

    const middle = fromBlock + Math.floor((toBlock - fromBlock) / 2);
    const leftPromise = getLogs(provider, baseFilter, fromBlock, middle);
    const rightPromise = getLogs(provider, baseFilter, middle + 1, toBlock);
    const [left, right] = await Promise.all([leftPromise, rightPromise]);
    return [...left, ...right];
  }
};

export const getLogsRecursively = async (
  provider: providers.Provider,
  baseFilter: Filter,
  fromBlock: number,
  toBlock: number,
  currentBlock: number
): Promise<Log[]> => {
  console.log(currentBlock)
  const nextBlock = currentBlock + 20000;

  if (currentBlock <= toBlock) {
    return [...(await getLogs(provider, baseFilter, currentBlock, nextBlock)), ...(await getLogsRecursively(provider, baseFilter, fromBlock, toBlock, nextBlock))]
  } else {
    return [];
  }
};


export const convertString = async (promise: Promise<any>) => String(await promise)

export function toFloat(n: number, decimals: number): string {
  return (n / (10 ** decimals)).toFixed(3)
}

export const unpackResult = async (promise: Promise<any>) => (await promise)[0]

export function isRegistered(tokenAddress: string, tokenMapping?: TokenMapping): boolean {
  if (!tokenMapping) return true
  return tokenMapping[getAddress(tokenAddress)] !== undefined;
}

export async function getTokenIcon(tokenAddress: string, chainId: number, tokenMapping: TokenMapping = {}) {
  const normalisedAddress = getAddress(tokenAddress)

  const tokenData = tokenMapping[normalisedAddress]
  const iconFromMapping = !tokenData?.logoURI?.startsWith('/') && tokenData?.logoURI

  const icon = iconFromMapping || 'erc20.png'

  return icon
}

export function compareBN(a: BigNumberish, b: BigNumberish): number {
  a = BigNumber.from(a)
  b = BigNumber.from(b)
  const diff = a.sub(b)
  return diff.isZero() ? 0 : diff.lt(0) ? -1 : 1
}

export function fromFloat(floatString: string, decimals: number): string {
  const sides = floatString.split('.')
  if (sides.length === 1) return floatString.padEnd(decimals + floatString.length, '0')
  if (sides.length > 2) return '0'

  return sides[1].length > decimals
    ? sides[0] + sides[1].slice(0, decimals)
    : sides[0] + sides[1].padEnd(decimals, '0')
}

export async function addressToAppName(address: string, networkName?: string): Promise<string | undefined> {
  if (!networkName) return undefined

  const DAPP_LIST_BASE_URL = "/contract-list"

  try {
    const { data } = await axios.get(`${DAPP_LIST_BASE_URL}/${getAddress(address)}.json`)
    return data.appName
  } catch {
    return undefined
  }
}

export function getDappListName(chainId: number): string | undefined {
  const mapping = {
    1: 'ethereum',
    56: 'smartchain',
    100: 'xdai',
    137: 'matic',
    1088: 'metis',
    10000: 'smartbch',
    42161: 'arbitrum',
    43114: 'avalanche',
    592: 'astar',
  }

  return mapping[chainId]
}

export async function lookupEnsName(address: string, provider: providers.Provider): Promise<string | undefined> {
  try {
    return await provider.lookupAddress(address)
  } catch {
    return undefined
  }
}