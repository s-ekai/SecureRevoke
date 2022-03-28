import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar/Sidebar'
import Dashboard from '../components/Dashboard/Dashboard'

const Home: NextPage = () => {
  return (
    <div className='main-wrapper'>
      <Sidebar />
      <Dashboard />
    </div>
  )
}

export default Home
