import React from 'react'

const WaitingforDriver = (props) => {
  return (
    <div>
    <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={()=>{
      if (typeof props.waitingForDriver === 'function') {
        props.waitingForDriver(false)
      } else if (typeof props.setWaitingForDriver === 'function') {
        props.setWaitingForDriver(false)
      }
    }}><i className="text-3xl dm-text-muted ri-arrow-down-double-line"></i></h5>
    
      <div className='flex items-center justify-between'>
      <img className='h-12 object-contain' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Vehicle" />
      <div className='text-right'>
      <h2 className='text-lg font-bold capitalize dm-text-primary'>{props.ride?.captain?.fullname ? `${props.ride.captain.fullname.firstname || ''} ${props.ride.captain.fullname.lastname || ''}`.trim() : 'Captain'}</h2>
      <div className='flex items-center justify-end gap-1.5 my-0.5'>
        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 text-xs font-bold border border-amber-500/20'>
          <i className="ri-star-fill text-amber-400 text-xs"></i>
          <span>{props.ride?.captain?.rating ? Number(props.ride.captain.rating).toFixed(1) : '5.0'}</span>
          <span className='opacity-70 text-[10px]'>({props.ride?.captain?.totalRatings || 0})</span>
        </span>
      </div>
      <h4 className='text-xl font-extrabold -mt-0.5 -mb-0.5 dm-text-primary tracking-wider'>{props.ride?.captain?.vehicle?.plate || 'DL 01 AB 1234'}</h4>
      <p className='text-sm dm-text-muted'>{props.ride?.captain?.vehicle?.color || ''} {props.ride?.captain?.vehicle?.vehicleType || 'Vehicle'}</p>
      {props.ride?.otp && (
        <span className='inline-block mt-1 px-3 py-0.5 bg-violet-600 text-white font-mono font-bold text-sm rounded-md'>OTP: {props.ride.otp}</span>
      )}
      </div>
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
     </div>
  </div>
  )
}

export default WaitingforDriver