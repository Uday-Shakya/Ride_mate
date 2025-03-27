import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
        <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1609320493407-83ef5fc2b9c2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full '>
            <img className='w-14 ml-8' src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' alt='logo' />
        <div className='bg-white py-4 pb-7 px-4'>
            <h2 className='text-2xl font-bold'>Get Started with Ridemate</h2>
            <Link to='/login' className='flex item-center justify-center w-full bg-black text-white py-3 rounded mt-4'>Continue</Link>
        </div>
        </div>
    </div>
  )
}

export default Start