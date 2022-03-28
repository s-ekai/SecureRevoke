import React from "react";
import Image from 'next/image'

const Dashboard: React.FC = () => {
    return (
        <div className='section'>
        <header className='section-header-pc'>
          <p className='section-header_link' style={{color: '#FCB156' }}>now support only Astar Network</p>
          <a href='' className='section-header_link background-main wallet-button wallet-button'>Connect wallet</a>
        </header>

        <header className='section-header-sp'>
          <Image src="/images/menu.svg" className='section-header-sp_menu-image' width={20} height={20} alt="menu" />
          <h3 className='section-header-sp_title text-center'>SecureRevoke</h3>
        </header>

        <div className='section-common_header'>
          <h3 className='section-common_header-title'>EVM ERC20 Approvals</h3>
        </div>

        <div className='section-home'>
          <div className='section-home_cards'>
            <div className='section-home_card'>
              <div className='section-home_card-header'>
                <div className='section-home_card-header_top'>
                  <div className='section-home_card-header_top-left'>
                    <Image src="/images/check.png" width={20} height={20} style={{ marginRight: 0 }} alt="check mark" />
                    lWASTR
                  </div>
                </div>

                <div className='section-home_card-header_bottom'>
                  <div className='section-home_card-header_bottom-left'>(0xf630b6d8EB75d3DC9153AAB9e4b6666d4561D6e5<Image src="/images/open-link.svg" width={14} height={14} alt="link" />)</div>
                  <div className='section-home_card-header_bottom-right pc-500'>Date: 2021-07-31 13:59</div>
                </div>

                <div className='section-home_card-header_bottom section-home_card-header_bottom-sp sp-flex-500'>
                  <div className='section-home_card-header_bottom-right'>Date: 2021-07-31 13:59</div>
                </div>
              </div>

              <div className="section-home_card-body display-block">
                <div className="section-home_card-body_left-header-link background-white">Transaction: 0xf630b6d8EB75d3DC9153AAB9e4b6666d4561D6e5<Image src="/images/open-link.svg" width={14} height={14} alt="link" /></div>
                <div className="section-home_card-body_left-header-link background-white">Allowance: 100</div>
                <div className="section-home_card-body_left-header-link background-white">Curren Balance: 0.00</div>

                <div className="button background-main" style={{ marginRight: 0, backgroundColor: 'gray' }}>Revoked</div>
              </div>
            </div>

            <div className='section-home_card'>
              <div className='section-home_card-header'>
                <div className='section-home_card-header_top'>
                  <div className='section-home_card-header_top-left'>
                    MATIC
                  </div>
                </div>

                <div className='section-home_card-header_bottom'>
                  <div className='section-home_card-header_bottom-left'>(0xf630b6d8EB75d3DC9153AAB9e4b6666d4561D6e5<Image src="/images/open-link.svg" width={14} height={14} alt="link" />)</div>
                  <div className='section-home_card-header_bottom-right pc-500'>Date: 2021-07-31 13:59</div>
                </div>

                <div className='section-home_card-header_bottom section-home_card-header_bottom-sp sp-flex-500'>
                  <div className='section-home_card-header_bottom-right'>Date: 2021-07-31 13:59</div>
                </div>
              </div>

              <div className="section-home_card-body" style={{ display: 'block' }}>
                <div className="section-home_card-body_left-header-link" style={{ backgroundColor: 'white' }}>Transaction: 0xf630b6d8EB75d3DC9153AAB9e4b6666d4561D6e5<Image src="/images/open-link.svg" width={14} height={14} alt="link" /></div>
                <div className="section-home_card-body_left-header-link" style={{ backgroundColor: 'white' }}>Allowance: 100</div>
                <div className="section-home_card-body_left-header-link" style={{ backgroundColor: 'white' }}>Curren Balance: 0.00</div>

                <div className="button background-main" style={{ marginRight: 0 }}>Revoke</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default Dashboard