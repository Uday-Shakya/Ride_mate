import React from 'react'

const RidePopUp = (props) => {
  return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={()=>{
        props.setRidePopupPanel(false)
      }}><i className="text-3xl dm-text-muted ri-arrow-down-double-line"></i></h5>
       <h3 className='text-2xl font-semibold mb-5 dm-text-primary'>New Ride Available</h3>
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
       <div className='mt-5 w-full space-y-2'>
          <button onClick={() => {
              props.setConfirmRidePopupPanel(true)
              props.confirmRide()
          }} className='bg-green-600 hover:bg-green-700 w-full text-white font-semibold p-3 rounded-xl shadow-lg transition-colors'>Accept</button>

          <button onClick={() => {
              props.setRidePopupPanel(false)
          }} className='w-full dm-bg-card dm-text-secondary font-semibold p-3 rounded-xl border dm-border hover:opacity-80 transition-opacity'>Ignore</button>
       </div>
       </div>
    </div>
  )
}

export default RidePopUp