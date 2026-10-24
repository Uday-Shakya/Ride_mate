import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
     const [otp, setOtp] = useState('')
     const navigate = useNavigate()

     const submitHander = async (e) => {
      e.preventDefault()

      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
          params: {
              rideId: props.ride._id,
              otp: otp
          },
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.status === 200) {
          props.setConfirmRidePopupPanel(false)
          props.setRidePopupPanel(false)
          navigate('/captain-riding', { state: { ride: response.data || props.ride } })
        }
      } catch (err) {
        console.error('Error starting ride:', err);
        alert(err.response?.data?.message || 'Invalid OTP or unable to start ride');
      }
    }
  return (
    <div>
    <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={()=>{
    props.setConfirmRidePopupPanel(false)
  }}><i className="text-3xl dm-text-muted ri-arrow-down-double-line"></i></h5>
   <h3 className='text-2xl font-semibold mb-5 dm-text-primary'>Confirm this ride to Start</h3>
   <div className='flex items-center justify-between p-3 bg-amber-400 rounded-xl mt-4 text-gray-950'>
     <div className='flex items-center gap-3'>
     <img className='h-12 w-12 rounded-full object-cover border-2 border-white shadow' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
     <h2 className='text-lg font-bold'> {props.ride?.user?.fullname ? `${props.ride.user.fullname.firstname || ''} ${props.ride.user.fullname.lastname || ''}`.trim() : 'Passenger'} </h2>
     </div>
     <h5 className='text-lg font-bold'>2.2 KM</h5>
   </div>
   <div className='flex gap-2 justify-between flex-col items-center'>
   <div className='w-full mt-5 dm-bg-card rounded-2xl border dm-border p-2'>
    <div className='flex items-center gap-4 p-3 border-b dm-border'>
    <i className="text-lg ri-map-pin-2-fill text-rose-500"></i>
    <div>
        <h3 className='text-xs uppercase font-bold dm-text-muted'>Pickup</h3>
        <p className='text-sm font-medium dm-text-primary'>{props.ride?.pickup}</p>
    </div>
    </div>
    <div className='flex items-center gap-4 p-3 border-b dm-border'>
    <i className="text-lg ri-map-pin-user-line text-emerald-500"></i>
    <div>
        <h3 className='text-xs uppercase font-bold dm-text-muted'>Destination</h3>
        <p className='text-sm font-medium dm-text-primary'>{props.ride?.destination}</p>
    </div>
    </div>
    <div className='flex items-center gap-4 p-3'>
    <i className="text-lg ri-wallet-2-line text-amber-500"></i>
    <div>
        <h3 className='text-xs uppercase font-bold dm-text-muted'>Fare</h3>
        <p className='text-xl font-bold dm-text-primary'>₹{props.ride?.fare}</p>
        <p className='text-xs dm-text-muted'>Cash / UPI</p>
    </div>
    </div>

   </div>
   <div className='mt-6 w-full'>
   <form onSubmit={submitHander}>
    <input value={otp} onChange={(e)=> setOtp(e.target.value)} type="text" placeholder='Enter OTP' className='dm-input px-6 py-4 font-mono text-lg rounded-xl w-full border dm-border' />
    <button className='w-full mt-4 flex justify-center bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-xl shadow-lg transition-colors'> Confirm </button>
    <button type="button" onClick={()=> {
      props.setConfirmRidePopupPanel(false)
      props.setRidePopupPanel(false)
    }} className='w-full mt-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-semibold p-3 rounded-xl transition-colors'> Cancel </button>
   </form>
   </div>
   </div>
  </div>
  )
}

export default ConfirmRidePopUp