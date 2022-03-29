import { BigNumber, Contract, providers } from 'ethers'
import { getAddress, hexDataSlice } from 'ethers/lib/utils'
import { TokenMapping } from '../../common/interface'
import { convertString, toFloat, unpackResult } from '../../common/util'
import { Allowance } from './interfaces'

// TODO: throw error if token is not ERC20
export async function getTokenData(contract: Contract, ownerAddress: string, tokenMapping: TokenMapping = {}) {
  const tokenData = tokenMapping[getAddress(contract.address)]

  const [totalSupplyBN, balance, symbol, decimals] = await Promise.all([
    unpackResult(contract.functions.totalSupply()),
    convertString(unpackResult(contract.functions.balanceOf(ownerAddress))),
    tokenData?.symbol ?? unpackResult(contract.functions.symbol()),
    tokenData?.decimals ?? unpackResult(contract.functions.decimals()),
  ])

  const totalSupply = totalSupplyBN.toString()
  return { symbol, decimals, totalSupply, balance }
}

export function formatAllowance(allowance: string, decimals: number, totalSupply: string): string {
  const allowanceBN = BigNumber.from(allowance)
  const totalSupplyBN = BigNumber.from(totalSupply)

  if (allowanceBN.gt(totalSupplyBN)) {
    return 'Unlimited'
  }

  return toFloat(Number(allowanceBN), decimals)
}

export async function getAllowancesFromApprovals(contract: Contract, ownerAddress: string, approvals: providers.Log[]) {
  const deduplicatedApprovals = approvals
    .filter((approval, i) => i === approvals.findIndex(other => approval.topics[2] === other.topics[2]))

  let allowances: Allowance[] = await Promise.all(
    deduplicatedApprovals.map((approval) => getAllowanceFromApproval(contract, ownerAddress, approval))
  )

  return allowances
}

async function getAllowanceFromApproval(multicallContract: Contract, ownerAddress: string, approval: providers.Log) {
  const spender = getAddress(hexDataSlice(approval.topics[2], 12))
  const allowance = (await unpackResult(multicallContract.functions.allowance(ownerAddress, spender))).toString()

  return { spender, allowance }
}