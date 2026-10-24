import React from 'react'
import { Link } from 'react-router-dom'
import RideMate_Logo from '../assets/RideMate_Logo.png'
import DarkModeToggle from '../components/DarkModeToggle'

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1609320493407-83ef5fc2b9c2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full'>
        <div className='flex items-center justify-between px-5'>
          <img className='w-20' src={RideMate_Logo} alt='logo' />
          <div className='dm-toggle-pill backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg'>
            <DarkModeToggle />
          </div>
        </div>
        <div className='dm-bg-surface py-4 pb-7 px-4'>
          <h2 className='text-2xl font-bold dm-text-primary'>Get Started with Ridemate</h2>
          <Link to='/login' className='dm-btn-primary flex items-center justify-center w-full py-3 rounded mt-4 font-medium'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start