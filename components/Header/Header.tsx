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
        <Image src="/images/menu.svg" className='section-header-sp_menu-image' width={20} height={20} alt="menu" />
        <h3 className='section-header-sp_title text-center'>SecureRevoke</h3>
      </header>
    </div>
  )
}

export default Header