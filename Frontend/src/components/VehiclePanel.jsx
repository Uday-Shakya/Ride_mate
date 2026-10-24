import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
       <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={()=>{
        props.setVehiclePanel(false)
      }}><i className="text-3xl dm-text-muted ri-arrow-down-double-line"></i></h5>
        <h3 className='text-2xl font-semibold mb-5 dm-text-primary'>Choose a Vehicle</h3>
        <div onClick={()=> {
            props.setConfirmRidePanel(true)
            props.selectVehicle('car')

        }} className='flex border rounded-xl mb-2 p-3 w-full items-center justify-between dm-bg-card dm-border cursor-pointer hover:border-violet-500 transition-colors'>
              <img className='h-10 object-contain' src='https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png' alt="Car"/>
              <div className='ml-2 w-1/2'>
                <h4 className='font-medium text-base dm-text-primary'>Cab Economy <span className='text-xs dm-text-muted'><i className='ri-user-3-fill'></i> 4</span></h4>
                <h5 className='font-medium text-sm dm-text-secondary'>2 min away</h5>
                <p className='font-medium text-xs dm-text-muted'>Affordable Compact Rides</p>
              </div>
              <h2 className='text-lg font-semibold dm-text-primary'>₹{props.fare.car}</h2>
        </div>
        <div onClick={()=> {
            props.setConfirmRidePanel(true)
            props.selectVehicle('moto')

        }} className='flex border rounded-xl mb-2 p-3 w-full items-center justify-between dm-bg-card dm-border cursor-pointer hover:border-violet-500 transition-colors'>
              <img className='h-10 object-contain' src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648177797/assets/fc/ddecaa-2eee-48fe-87f0-614aa7cee7d3/original/Uber_Moto_312x208_pixels_Mobile.png' alt="Moto"/>
              <div className='ml-2 w-1/2'>
                <h4 className='font-medium text-base dm-text-primary'>Moto <span className='text-xs dm-text-muted'><i className='ri-user-3-fill'></i> 1</span></h4>
                <h5 className='font-medium text-sm dm-text-secondary'>5 min away</h5>
                <p className='font-medium text-xs dm-text-muted'>Affordable motorcycle rides</p>
              </div>
              <h2 className='text-lg font-semibold dm-text-primary'>₹{props.fare.moto}</h2>
        </div>
        <div onClick={()=> {
            props.setConfirmRidePanel(true)
            props.selectVehicle('auto')
        }} className='flex border rounded-xl mb-2 p-3 w-full items-center justify-between dm-bg-card dm-border cursor-pointer hover:border-violet-500 transition-colors'>
              <img className='h-10 object-contain' src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png' alt="Auto"/>
              <div className='ml-2 w-1/2'>
                <h4 className='font-medium text-base dm-text-primary'>Auto <span className='text-xs dm-text-muted'><i className='ri-user-3-fill'></i> 3</span></h4>
                <h5 className='font-medium text-sm dm-text-secondary'>3 min away</h5>
                <p className='font-medium text-xs dm-text-muted'>Affordable Rides</p>
              </div>
              <h2 className='text-lg font-semibold dm-text-primary'>₹{props.fare.auto}</h2>
        </div>
      </div>
  )
}

export default VehiclePanel