import React from 'react'

interface Props {
  revoke: () => Promise<void>
  canRevoke: boolean
  id: string
}

const RevokeButton = ({ canRevoke, revoke, id }: Props) => {
  let button = (<button className="button background-main" style={{ marginRight: 0 }} disabled={!canRevoke} onClick={revoke}>Revoke</button>)

  // Add tooltip if the button is disabled
  if (!canRevoke) {
    button = (<button className="button background-main" style={{ marginRight: 0, backgroundColor: 'gray' }}>Revoked</button>)
  }

  return button
}

export default RevokeButton
