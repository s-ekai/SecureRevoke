import React from "react";
import Image from 'next/image'
import ConnectButton from "./ConnectButton";

const Header: React.FC = () => {
  return (
    <div>
      <header className='section-header-pc'>
        <p className='section-header_link color-main'>now support only Astar Network</p>
        <ConnectButton />
      </header>

      <header className='section-header-sp'>
        <h3 className='section-header-sp_title text-center section-header_link'>SecureRevoke β</h3>
        <ConnectButton />
      </header>
    </div>
  )
}

export default Header