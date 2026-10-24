import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'
import DarkModeToggle from '../components/DarkModeToggle'
import RideMate_Logo from '../assets/RideMate_Logo.png'

const CaptainHome = () => {

  const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
  const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)
  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)
  const [ ride, setRide ] = useState(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)

  // Socket join & location tracking
  useEffect(() => {
    if (!captain?._id) return;

    const emitJoin = () => {
      console.log('[CaptainHome] Joining socket as captain:', captain._id, 'Socket ID:', socket.id);
      socket.emit('join', {
        userId: captain._id,
        userType: 'captain'
      });
    };

    emitJoin();
    socket.on('connect', emitJoin);

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            socket.emit('update-location-captain', {
              userId: captain._id,
              location: {
                ltd: position.coords.latitude,
                lng: position.coords.longitude
              }
            });
          },
          err => {
            console.warn('[CaptainHome] Geolocation unavailable:', err.message);
          }
        );
      }
    };

    updateLocation();
    const locationInterval = setInterval(updateLocation, 10000);

    return () => {
      socket.off('connect', emitJoin);
      clearInterval(locationInterval);
    };
  }, [captain, socket]);

  // Handle incoming ride request
  useEffect(() => {
    const handleNewRide = (data) => {
      console.log('[CaptainHome] New ride request received:', data);
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on('new-ride', handleNewRide);

    return () => {
      socket.off('new-ride', handleNewRide);
    };
  }, [socket]);

  async function confirmRide() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
        rideId: ride._id,
        captainId: captain._id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (err) {
      console.error('[CaptainHome] Error confirming ride:', err);
    }
  }

  useGSAP(function () {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(0)',
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: 'translateY(100%)',
      });
    }
  }, [ridePopupPanel]);

  useGSAP(function () {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: 'translateY(0)',
      });
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: 'translateY(100%)',
      });
    }
  }, [confirmRidePopupPanel]);

  return (
    <div className='h-screen dm-bg-page overflow-hidden relative'>
      <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-10 pointer-events-none'>
        <img className='w-16 pointer-events-auto' src={RideMate_Logo} alt='RideMate'/>
        <div className='flex items-center gap-3 pointer-events-auto'>
          <div className='dm-toggle-pill backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border dm-border'>
            <DarkModeToggle />
          </div>
          <Link to='/captain-login' className='h-10 w-10 dm-icon-btn border dm-border flex items-center justify-center rounded-full shadow-md hover:scale-105 transition-transform'>
            <i className="text-lg font-medium ri-logout-box-r-line"></i>
          </Link>
        </div>
      </div>
      <div className='h-1/2'>
        <LiveTracking/>
      </div>
      <div className='h-2/5 p-6 dm-panel shadow-2xl relative z-10'>
        <CaptainDetails/>
      </div>
      <div ref={ridePopupPanelRef} className='fixed z-20 w-full bottom-0 translate-y-full dm-panel px-3 py-10 pt-12 shadow-2xl'> 
        <RidePopUp 
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide} 
        />
      </div>
      <div ref={confirmRidePopupPanelRef} className='fixed z-20 w-full h-screen bottom-0 translate-y-full dm-panel px-3 py-10 pt-14 shadow-2xl'> 
        <ConfirmRidePopUp 
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
          setRidePopupPanel={setRidePopupPanel} 
        />
      </div>
    </div>
  );
};

export default CaptainHome;