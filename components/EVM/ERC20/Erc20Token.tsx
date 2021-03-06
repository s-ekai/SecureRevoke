import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { Erc20TokenData } from '../../common/interface'
import { Allowance } from './interfaces'
import { compareBN, toFloat } from '../../common/util'
import Erc20Allowance from './Erc20Allowance'
import { getAllowancesFromApprovals } from './util'

interface Props {
  token: Erc20TokenData
  inputAddress: string
}

function Erc20Token({ token, inputAddress }: Props) {
  const [allowances, setAllowances] = useState<Allowance[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadData()
  }, [inputAddress])

  const loadData = async () => {
    setLoading(true)

    const loadedAllowances = (await getAllowancesFromApprovals(token.contract, inputAddress, token.approvals))
      .sort((a, b) => -1 * compareBN(a.allowance, b.allowance))

    setAllowances(loadedAllowances)
    setLoading(false)
  }

  // Do not render tokens without balance or allowances
  const balanceString = toFloat(Number(token.balance), token.decimals)
  if (balanceString === '0.000' && allowances.length === 0) return null

  if (loading) {
    return (<div className="Token"><ClipLoader size={20} color={'#000'} loading={loading} /></div>)
  }

  return (
    <div>
      {
        allowances.length === 0
          ? ''
          : allowances.map((allowance, i) => (
            <Erc20Allowance
              key={i}
              spender={allowance.spender}
              allowance={allowance.allowance}
              inputAddress={inputAddress}
              token={token}
              onRevoke={(spender) => {
                setAllowances((previousAllowances) => previousAllowances.filter(allowance => allowance.spender !== spender))
              }}
            />
          ))
      }
    </div>
  )
}

export default Erc20Token
