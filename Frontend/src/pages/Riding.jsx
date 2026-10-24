import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import DarkModeToggle from '../components/DarkModeToggle'

const Riding = () => {
  const location = useLocation()
  const { ride } = location.state || {}
  const { socket } = useContext(SocketContext)
  const navigate = useNavigate()

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('upi') // 'upi' or 'cash'

  const fareAmount = ride?.fare || 0
  const captainName = ride?.captain?.fullname?.firstname || 'Captain'
  const captainUpiId = ride?.captain?.email ? `${ride.captain.email.split('@')[0]}@ridemate` : 'captain.ride@upi'
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
    `upi://pay?pa=${captainUpiId}&pn=RideMate&am=${fareAmount}&cu=INR`
  )}`

  useEffect(() => {
    const handleRideEnded = () => {
      console.log('[Riding] Ride ended event received, redirecting home');
      navigate('/home');
    };

    socket.on('ride-ended', handleRideEnded);

    return () => {
      socket.off('ride-ended', handleRideEnded);
    };
  }, [socket, navigate]);

  return (
    <div className='h-screen relative overflow-hidden dm-bg-page'>
      {/* Top bar with home link and dark mode toggle */}
      <div className='fixed right-4 top-4 z-20 flex items-center gap-2'>
        <div className='dm-toggle-pill backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border dm-border'>
          <DarkModeToggle />
        </div>
        <Link to='/home' className='h-11 w-11 dm-icon-btn shadow-lg border dm-border flex items-center justify-center rounded-full hover:scale-105 transition-transform'>
          <i className="text-xl font-medium ri-home-5-line"></i>
        </Link>
      </div>

      <div className='h-1/2 w-full'>
        <LiveTracking/>
      </div>

      <div className='h-1/2 p-5 flex flex-col justify-between dm-panel rounded-t-3xl shadow-2xl relative z-10 -mt-6 border-t dm-border'>
        <div>
          <div className='flex items-center justify-between pb-4 border-b dm-border'>
            <img className='h-14 object-contain' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Vehicle" />
            <div className='text-right'>
              <h2 className='text-lg font-bold dm-text-primary capitalize'>{captainName} {ride?.captain?.fullname?.lastname || ''}</h2>
              <h4 className='text-xl font-extrabold dm-text-primary tracking-wider'>{ride?.captain?.vehicle?.plate || 'DL 01 AB 1234'}</h4>
              <p className='text-xs dm-text-muted capitalize'>{ride?.captain?.vehicle?.color || 'White'} {ride?.captain?.vehicle?.vehicleType || 'Vehicle'}</p>
            </div>
          </div>

          <div className='w-full mt-4 space-y-3'>
            <div className='flex items-center gap-4 p-3 dm-bg-card rounded-2xl border dm-border'>
              <div className='w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg'>
                <i className="ri-map-pin-user-line"></i>
              </div>
              <div className='flex-1 overflow-hidden'>
                <h3 className='text-xs font-bold dm-text-muted uppercase tracking-wider'>Destination</h3>
                <p className='text-sm font-semibold dm-text-primary truncate'>{ride?.destination || 'Destination'}</p>
              </div>
            </div>

            <div className='flex items-center gap-4 p-3 dm-bg-card rounded-2xl border dm-border'>
              <div className='w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg'>
                <i className="ri-wallet-2-line"></i>
              </div>
              <div className='flex-1'>
                <h3 className='text-xs font-bold dm-text-muted uppercase tracking-wider'>Fare</h3>
                <p className='text-2xl font-black dm-text-primary'>₹{fareAmount}</p>
              </div>
              <span className='px-3 py-1 dm-tag-cash text-xs font-bold rounded-full'>
                Cash / UPI
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowPaymentModal(true)}
          className='w-full py-4 bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-bold text-base rounded-2xl shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 transition-all'
        >
          <i className="ri-secure-payment-line text-xl"></i>
          Make a Payment (₹{fareAmount})
        </button>
      </div>

      {/* Passenger Payment Modal Bottom Sheet */}
      {showPaymentModal && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in'>
          <div className='dm-modal rounded-t-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-slide-up max-h-[85vh] overflow-y-auto border-t dm-border'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-bold dm-text-primary'>Pay Ride Fare</h3>
                <p className='text-xs dm-text-muted'>Total amount: <strong className='text-emerald-500 text-sm'>₹{fareAmount}</strong></p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className='w-9 h-9 rounded-full dm-bg-card dm-text-muted hover:opacity-80 flex items-center justify-center transition-opacity'
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Selector */}
            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={() => setSelectedMethod('upi')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedMethod === 'upi'
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 ring-2 ring-cyan-500 font-bold'
                    : 'dm-border dm-text-muted hover:dm-bg-card'
                }`}
              >
                <i className="ri-qr-code-line text-2xl"></i>
                <p className='text-xs font-bold mt-1'>UPI / QR</p>
              </button>
              <button
                onClick={() => setSelectedMethod('cash')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedMethod === 'cash'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-2 ring-emerald-500 font-bold'
                    : 'dm-border dm-text-muted hover:dm-bg-card'
                }`}
              >
                <i className="ri-hand-coin-line text-2xl"></i>
                <p className='text-xs font-bold mt-1'>Cash</p>
              </button>
            </div>

            {selectedMethod === 'upi' ? (
              <div className='text-center space-y-3 p-4 dm-bg-card rounded-2xl border dm-border'>
                <p className='text-xs dm-text-muted font-medium'>Scan QR with Google Pay, PhonePe, or Paytm</p>
                <div className='flex justify-center'>
                  <img src={qrCodeUrl} alt="UPI QR" className='w-44 h-44 rounded-xl border-2 border-white shadow-md bg-white' />
                </div>
                <div className='dm-bg-surface px-3 py-2 rounded-xl border dm-border flex items-center justify-between text-xs'>
                  <span className='dm-text-muted'>UPI ID:</span>
                  <span className='font-mono font-bold dm-text-primary'>{captainUpiId}</span>
                </div>
              </div>
            ) : (
              <div className='p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-center space-y-2'>
                <div className='w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center text-2xl'>
                  <i className="ri-money-dollar-circle-fill"></i>
                </div>
                <h4 className='text-base font-bold text-emerald-600 dark:text-emerald-400'>Pay ₹{fareAmount} in Cash</h4>
                <p className='text-xs text-emerald-600/80 dark:text-emerald-400/80'>Hand over exact cash to captain {captainName} upon arrival.</p>
              </div>
            )}

            <button
              onClick={() => setShowPaymentModal(false)}
              className='w-full py-3.5 dm-btn-primary font-bold text-sm rounded-xl transition-all'
            >
              Done / Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Riding