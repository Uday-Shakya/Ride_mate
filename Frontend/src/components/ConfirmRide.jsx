import React from 'react'

const ConfirmRide = (props) => {
  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={()=>{
        props.setConfirmRidePanel ? props.setConfirmRidePanel(false) : props.setVehiclePanel(false)
      }}><i className="text-3xl dm-text-muted ri-arrow-down-double-line"></i></h5>
       <h3 className='text-2xl font-semibold mb-5 dm-text-primary'>Confirm Your Ride</h3>
       <div className='flex gap-2 justify-between flex-col items-center'>
       <img className='h-20 object-contain' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="Vehicle"/>
       <div className='w-full mt-5 dm-bg-card rounded-2xl border dm-border p-2'>
        <div className='flex items-center gap-4 p-3 border-b dm-border'>
          <i className="text-lg ri-map-pin-2-fill text-rose-500"></i>
          <div>
              <h3 className='text-xs uppercase font-bold dm-text-muted'>Pickup</h3>
              <p className='text-sm font-medium dm-text-primary'>{props.pickup}</p>
          </div>
        </div>
        <div className='flex items-center gap-4 p-3 border-b dm-border'>
          <i className="text-lg ri-map-pin-user-line text-emerald-500"></i>
          <div>
              <h3 className='text-xs uppercase font-bold dm-text-muted'>Destination</h3>
              <p className='text-sm font-medium dm-text-primary'>{props.destination}</p>
          </div>
        </div>
        <div className='flex items-center gap-4 p-3'>
          <i className="text-lg ri-wallet-2-line text-amber-500"></i>
          <div>
              <h3 className='text-xs uppercase font-bold dm-text-muted'>Fare</h3>
              <p className='text-xl font-bold dm-text-primary'>₹{props.fare[props.vehicleType]}</p>
              <p className='text-xs dm-text-muted'>Cash / UPI</p>
          </div>
        </div>

       </div>
       <button onClick={()=>{
        props.setVehicleFound(true)
        props.setConfirmRidePanel(false)
        props.createRide()
       }} className='w-full mt-5 bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-xl shadow-lg transition-colors'> Confirm </button>
       </div>
    </div>
  )
}

export default ConfirmRide