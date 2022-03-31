import React from "react";

const Sidebar: React.FC = () => {
    return (
      <div className='section-sidebar' id='sidebar'>
        <a className='section-sidebar_title'>SecureRevoke β</a>

        <div className='section-sidebar_links'>
          <a className='section-sidebar_link'>
            <p className='section-sidebar_link-text'>・EVM ERC20</p>
          </a>
          <a className='section-sidebar_link'>
            <p className='section-sidebar_link-text' style={{ opacity: 0.5 }}>・EVM ERC271</p>
          </a>
          <a className='section-sidebar_link'>
            <p className='section-sidebar_link-text' style={{ opacity: 0.5 }}>・WASM ERC20</p>
          </a>
          <a className='section-sidebar_link'>
            <p className='section-sidebar_link-text' style={{ opacity: 0.5 }}>・WASM ERC271</p>
          </a>
        </div>

        <div className='section-sidebar_footer-links'>
          <a className='section-sidebar_footer-link hidden'>・What is SecureRevoke?</a>
          <a className='section-sidebar_footer-link hidden'>・Twitter</a>
          <a className='section-sidebar_footer-link hidden'>・GitHub</a>
        </div>
      </div>
    )
  }

  export default Sidebar