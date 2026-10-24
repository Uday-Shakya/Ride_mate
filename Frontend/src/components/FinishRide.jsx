import React from 'react'
import { useNavigate } from 'react-router-dom'

const FinishRide = (props) => {
  const navigate = useNavigate()

  function handleProceedToPayment() {
    if (!props.ride?._id) {
      console.error('Ride data is missing or undefined');
      navigate('/captain-home');
      return;
    }

    if (props.setFinishRidePanel) {
      props.setFinishRidePanel(false);
    }

    navigate('/captain-payment', { state: { ride: props.ride } });
  }

  return (
    <div>
      <h5
        className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
        onClick={() => {
          if (props.setFinishRidePanel) {
            props.setFinishRidePanel(false);
          }
        }}
      >
        <i className="text-3xl dm-text-muted hover:opacity-80 ri-arrow-down-double-line transition-opacity"></i>
      </h5>

      <h3 className='text-2xl font-bold mb-5 dm-text-primary'>Complete Ride</h3>

      <div className='flex items-center justify-between p-4 bg-amber-400 rounded-2xl shadow-sm mt-4 text-gray-950'>
        <div className='flex items-center gap-3'>
          <img
            className='h-12 w-12 rounded-full object-cover border-2 border-white shadow'
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt="Customer"
          />
          <div>
            <h2 className='text-lg font-bold leading-tight'>
              {props.ride?.user?.fullname
                ? `${props.ride.user.fullname.firstname || ''} ${props.ride.user.fullname.lastname || ''}`.trim()
                : 'Customer'}
            </h2>
            <p className='text-xs font-semibold opacity-80'>Passenger</p>
          </div>
        </div>
        <span className='px-3 py-1 bg-amber-500 font-bold text-xs rounded-full'>
          Arrived
        </span>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5 dm-bg-card rounded-2xl border dm-border p-2'>
          <div className='flex items-center gap-4 p-3 border-b dm-border'>
            <div className='w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg'>
              <i className="ri-map-pin-2-fill"></i>
            </div>
            <div className='flex-1 overflow-hidden'>
              <h3 className='text-xs font-bold dm-text-muted uppercase tracking-wider'>Pickup</h3>
              <p className='text-sm font-medium dm-text-primary truncate'>{props.ride?.pickup || 'Pickup location'}</p>
            </div>
          </div>

          <div className='flex items-center gap-4 p-3 border-b dm-border'>
            <div className='w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg'>
              <i className="ri-map-pin-user-line"></i>
            </div>
            <div className='flex-1 overflow-hidden'>
              <h3 className='text-xs font-bold dm-text-muted uppercase tracking-wider'>Destination</h3>
              <p className='text-sm font-medium dm-text-primary truncate'>{props.ride?.destination || 'Destination location'}</p>
            </div>
          </div>

          <div className='flex items-center gap-4 p-3'>
            <div className='w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg'>
              <i className="ri-wallet-2-line"></i>
            </div>
            <div className='flex-1'>
              <h3 className='text-xs font-bold dm-text-muted uppercase tracking-wider'>Fare to Collect</h3>
              <p className='text-xl font-extrabold dm-text-primary'>₹{props.ride?.fare || 0}</p>
            </div>
          </div>
        </div>

        <div className='mt-6 w-full space-y-2'>
          <button
            onClick={handleProceedToPayment}
            className='w-full py-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-lg shadow-green-600/30 transition-all'
          >
            <i className="ri-secure-payment-line text-xl"></i>
            Proceed to Collect Payment (Cash / UPI)
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinishRide