import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';
import DarkModeToggle from '../components/DarkModeToggle';

const CaptainPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { captain } = useContext(CaptainDataContext);

  const ride = location.state?.ride;

  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'upi'
  const [cashReceived, setCashReceived] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const fareAmount = ride?.fare || 0;
  const captainUpiId = captain?.email ? `${captain.email.split('@')[0]}@ridemate` : 'captain.ride@upi';
  const upiPayUrl = `upi://pay?pa=${captainUpiId}&pn=RideMate%20Captain&am=${fareAmount}&cu=INR&tn=Ride%20Fare`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(upiPayUrl)}`;

  // Redirect back if no ride state is found
  useEffect(() => {
    if (!ride) {
      console.warn('No ride data found on payment page, redirecting to captain home');
      navigate('/captain-home');
    }
  }, [ride, navigate]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(captainUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompleteRide = async () => {
    if (!ride?._id) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        setIsCompleted(true);
        // Automatically return to captain-home after showing the success celebration
        setTimeout(() => {
          navigate('/captain-home');
        }, 2500);
      }
    } catch (err) {
      console.error('Error completing ride:', err);
      // If the ride was already marked complete, still proceed gracefully
      if (err.response?.status === 400 || err.response?.data?.message?.includes('not ongoing')) {
        setIsCompleted(true);
        setTimeout(() => navigate('/captain-home'), 2000);
      } else {
        alert(err.response?.data?.message || 'Failed to finish ride. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  if (!ride) return null;

  const customerName = ride.user?.fullname
    ? `${ride.user.fullname.firstname || ''} ${ride.user.fullname.lastname || ''}`.trim()
    : 'Customer';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="px-5 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            to="/captain-riding"
            state={{ ride }}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            <i className="ri-arrow-left-line text-lg"></i>
          </Link>
          <div>
            <h1 className="text-base font-bold tracking-tight">Collect Payment</h1>
            <p className="text-xs text-slate-400">Ride #{ride._id ? ride._id.slice(-6).toUpperCase() : '000000'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Pending Payment
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-5 pb-32">
        {/* Total Fare Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-xl shadow-emerald-950/40">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-emerald-100 text-xs font-medium tracking-wider uppercase">Total Amount to Collect</p>
              <h2 className="text-4xl font-extrabold mt-1 tracking-tight">₹{fareAmount}</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              <i className="ri-wallet-3-line"></i>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-emerald-100 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                {customerName.charAt(0)}
              </div>
              <span className="font-medium text-white">{customerName}</span>
            </div>
            <span className="bg-black/20 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              Standard Fare
            </span>
          </div>
        </div>

        {/* Trip Overview Pill */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <i className="ri-map-pin-2-fill text-emerald-400 text-lg mt-0.5"></i>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pickup</p>
              <p className="text-xs text-slate-200 line-clamp-1">{ride.pickup}</p>
            </div>
          </div>
          <div className="border-t border-slate-800/80"></div>
          <div className="flex items-start gap-3">
            <i className="ri-map-pin-user-fill text-rose-400 text-lg mt-0.5"></i>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Destination</p>
              <p className="text-xs text-slate-200 line-clamp-1">{ride.destination}</p>
            </div>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Select Payment Option
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Cash Tab */}
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                paymentMethod === 'cash'
                  ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                    paymentMethod === 'cash' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <i className="ri-money-dollar-circle-line"></i>
                </div>
                {paymentMethod === 'cash' && (
                  <i className="ri-checkbox-circle-fill text-emerald-400 text-lg"></i>
                )}
              </div>
              <p className="font-semibold text-sm text-slate-100">Cash Payment</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Collect paper currency</p>
            </button>

            {/* UPI Tab */}
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                paymentMethod === 'upi'
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                    paymentMethod === 'upi' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <i className="ri-qr-code-line"></i>
                </div>
                {paymentMethod === 'upi' && (
                  <i className="ri-checkbox-circle-fill text-cyan-400 text-lg"></i>
                )}
              </div>
              <p className="font-semibold text-sm text-slate-100">UPI / QR Code</p>
              <p className="text-[11px] text-slate-400 mt-0.5">GPay, PhonePe, Paytm</p>
            </button>
          </div>
        </div>

        {/* Method Detail Card */}
        {paymentMethod === 'cash' ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl">
                  <i className="ri-hand-coin-line"></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-200">Collect Physical Cash</h3>
                  <p className="text-xs text-slate-400">Ask the passenger for ₹{fareAmount}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">Amount Due</span>
              <span className="text-2xl font-black text-emerald-400">₹{fareAmount}</span>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer hover:bg-slate-950/70 transition-colors">
              <input
                type="checkbox"
                checked={cashReceived}
                onChange={(e) => setCashReceived(e.target.checked)}
                className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300 select-none">
                I have collected <strong className="text-white">₹{fareAmount}</strong> in cash from the passenger
              </span>
            </label>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-center">
            <div>
              <h3 className="font-bold text-sm text-slate-200">Scan & Pay via UPI</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ask the customer to scan the QR code below</p>
            </div>

            {/* QR Code Container */}
            <div className="flex justify-center my-3">
              <div className="bg-white p-3 rounded-2xl shadow-lg shadow-black/50 border-4 border-slate-800">
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48 rounded-lg object-contain"
                />
              </div>
            </div>

            {/* UPI ID Pill with Copy */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400">Captain UPI ID</p>
                <p className="text-xs font-mono font-medium text-slate-200">{captainUpiId}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <i className={copiedUpi ? "ri-check-line text-emerald-400" : "ri-file-copy-line"}></i>
                {copiedUpi ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Supported Apps Logos */}
            <div className="pt-2 flex items-center justify-center gap-4 text-slate-400 text-xs">
              <span className="inline-flex items-center gap-1">
                <i className="ri-google-fill text-sm"></i> GPay
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="ri-phone-find-line text-sm"></i> PhonePe
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="ri-bank-card-fill text-sm"></i> Paytm
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="ri-qr-scan-2-line text-sm"></i> BHIM
              </span>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 cursor-pointer text-left hover:bg-slate-950/70 transition-colors">
              <input
                type="checkbox"
                checked={upiVerified}
                onChange={(e) => setUpiVerified(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300 select-none">
                I have verified the payment notification of <strong className="text-white">₹{fareAmount}</strong> on my UPI app
              </span>
            </label>
          </div>
        )}
      </main>

      {/* Floating Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 max-w-lg mx-auto w-full z-20">
        <button
          type="button"
          disabled={isSubmitting || (paymentMethod === 'cash' ? !cashReceived : !upiVerified)}
          onClick={handleCompleteRide}
          className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
            isSubmitting || (paymentMethod === 'cash' ? !cashReceived : !upiVerified)
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : paymentMethod === 'cash'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30'
          }`}
        >
          {isSubmitting ? (
            <>
              <i className="ri-loader-4-line animate-spin text-lg"></i>
              Completing Ride...
            </>
          ) : (
            <>
              <i className="ri-check-double-line text-lg"></i>
              Confirm Payment & Complete Ride
            </>
          )}
        </button>
      </footer>

      {/* Fullscreen Success Celebration Overlay */}
      {isCompleted && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-5xl text-emerald-400 mb-6 shadow-2xl shadow-emerald-500/30 animate-bounce">
            <i className="ri-checkbox-circle-fill"></i>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">Payment Confirmed!</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xs">
            Received <strong className="text-emerald-400">₹{fareAmount}</strong> via {paymentMethod === 'cash' ? 'Cash' : 'UPI'} from {customerName}.
          </p>

          <div className="mt-6 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 inline-flex items-center gap-2">
            <i className="ri-check-line text-emerald-400"></i>
            Ride finished successfully
          </div>

          <p className="text-xs text-slate-500 mt-8 animate-pulse">
            Returning to Captain Dashboard...
          </p>
        </div>
      )}
    </div>
  );
};

export default CaptainPayment;
