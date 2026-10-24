import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import DarkModeToggle from '../components/DarkModeToggle'
import RideMate_Logo from '../assets/RideMate_Logo.png'

const CaptainRiding = () => {

    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride

    useGSAP(function () {
        if (finishRidePanel) {
          gsap.to(finishRidePanelRef.current, {
            transform: 'translateY(0)',
          })
         } else {
           gsap.to(finishRidePanelRef.current, {
            transform: 'translateY(100%)',
          })
         }
      }, [finishRidePanel])

  return (
    <div className='h-screen relative flex flex-col justify-end dm-bg-page overflow-hidden'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-10 pointer-events-none'>
        <img className='w-16 pointer-events-auto' src={RideMate_Logo} alt='RideMate'/>
        <div className='flex items-center gap-3 pointer-events-auto'>
          <div className='dm-toggle-pill backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border dm-border'>
            <DarkModeToggle />
          </div>
          <Link to='/captain-home' className='h-10 w-10 dm-icon-btn border dm-border flex items-center justify-center rounded-full shadow-md hover:scale-105 transition-transform'>
            <i className="text-lg font-medium ri-home-5-line"></i>
          </Link>
        </div>
      </div>
      
      <div 
        className='h-1/5 p-6 flex items-center justify-between relative bg-amber-400 pt-10 cursor-pointer shadow-lg z-10 text-gray-900'
        onClick={() => {
          setFinishRidePanel(true)
        }}
      >
        <h5 className='p-1 text-center w-[90%] absolute top-0'>
          <i className="text-3xl text-gray-900 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className='text-xl font-bold text-gray-900'>4 KM away</h4>
        <button className='bg-green-600 hover:bg-green-700 text-white font-semibold p-3 px-10 rounded-lg shadow-md transition-colors'>
          Finish Ride
        </button>
      </div>

      <div ref={finishRidePanelRef} className='fixed z-20 w-full bottom-0 translate-y-full dm-panel px-3 py-10 pt-12 shadow-2xl'> 
        <FinishRide 
          ride={rideData}
          setFinishRidePanel={setFinishRidePanel} 
        />
      </div>

      <div className='h-screen fixed w-screen top-0 z-0'>
        <LiveTracking />
      </div>
    </div>
  )
}

export default CaptainRiding