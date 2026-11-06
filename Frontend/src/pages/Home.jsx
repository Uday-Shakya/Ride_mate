import React, { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingforDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import RideMate_Logo from '../assets/RideMate_Logo.png'
import DarkModeToggle from "../components/DarkModeToggle";
import RateCaptainModal from "../components/RateCaptainModal";
import UserRidesModal from "../components/UserRidesModal";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  // Rating feature state
  const [unratedRide, setUnratedRide] = useState(null);
  const [ratingRide, setRatingRide] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showUserRidesModal, setShowUserRidesModal] = useState(false);

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    const emitJoin = () => { socket.emit("join", { userType: "user", userId: user._id }); };
    emitJoin();
    socket.on('connect', emitJoin);
    return () => { socket.off('connect', emitJoin); };
  }, [user, socket]);

  const fetchLatestUnratedRide = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/latest-unrated`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data._id) {
        setUnratedRide(response.data);
      } else {
        setUnratedRide(null);
      }
    } catch (err) {
      console.log('Error checking unrated ride:', err);
    }
  };

  useEffect(() => {
    fetchLatestUnratedRide();
  }, []);

  useEffect(() => {
    const handleRideConfirmed = (confirmedRide) => { setVehicleFound(false); setWaitingForDriver(true); setRide(confirmedRide); };
    const handleRideStarted = (startedRide) => { setWaitingForDriver(false); navigate("/riding", { state: { ride: startedRide } }); };
    const handleRideEnded = (endedRide) => {
      console.log('[Home] Ride ended socket event:', endedRide);
      setWaitingForDriver(false);
      setVehicleFound(false);
      if (endedRide && endedRide._id) {
        setRatingRide(endedRide);
        setUnratedRide(endedRide);
        setShowRatingModal(true);
      }
    };

    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);
    socket.on("ride-ended", handleRideEnded);
    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
      socket.off("ride-ended", handleRideEnded);
    };
  }, [socket, navigate]);

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, { params: { input: e.target.value }, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setPickupSuggestions(response.data);
    } catch {}
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, { params: { input: e.target.value }, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setDestinationSuggestions(response.data);
    } catch {}
  };

  const submitHandler = (e) => { e.preventDefault() };

  useGSAP(function () {
    if (panelOpen) {
      gsap.to(panelRef.current, { height: "70%", padding: "24px" });
      gsap.to(panelCloseRef.current, { opacity: 1 });
    } else {
      gsap.to(panelRef.current, { height: "0%", padding: 0 });
      gsap.to(panelCloseRef.current, { opacity: 0 });
    }
  }, [panelOpen]);

  useGSAP(() => {
    gsap.set(vehiclePanelRef.current, { y: '100%', visibility: 'hidden' });
    gsap.set(confirmRidePanelRef.current, { y: '100%', visibility: 'hidden' });
    gsap.set(vehicleFoundRef.current, { y: '100%', visibility: 'hidden' });
    gsap.set(waitingForDriverRef.current, { y: '100%', visibility: 'hidden' });
  }, []);

  useGSAP(function () {
    if (vehiclePanel) { gsap.set(vehiclePanelRef.current, { visibility: 'visible' }); gsap.to(vehiclePanelRef.current, { y: 0 }); }
    else { gsap.to(vehiclePanelRef.current, { y: '100%', onComplete: () => { gsap.set(vehiclePanelRef.current, { visibility: 'hidden' }); } }); }
  }, [vehiclePanel]);

  useGSAP(function () {
    if (confirmRidePanel) { gsap.set(confirmRidePanelRef.current, { visibility: 'visible' }); gsap.to(confirmRidePanelRef.current, { y: 0 }); }
    else { gsap.to(confirmRidePanelRef.current, { y: '100%', onComplete: () => { gsap.set(confirmRidePanelRef.current, { visibility: 'hidden' }); } }); }
  }, [confirmRidePanel]);

  useGSAP(function () {
    if (vehicleFound) { gsap.set(vehicleFoundRef.current, { visibility: 'visible' }); gsap.to(vehicleFoundRef.current, { y: 0 }); }
    else { gsap.to(vehicleFoundRef.current, { y: '100%', onComplete: () => { gsap.set(vehicleFoundRef.current, { visibility: 'hidden' }); } }); }
  }, [vehicleFound]);

  useGSAP(function () {
    if (waitingForDriver) { gsap.set(waitingForDriverRef.current, { visibility: 'visible' }); gsap.to(waitingForDriverRef.current, { y: 0 }); }
    else { gsap.to(waitingForDriverRef.current, { y: '100%', onComplete: () => { gsap.set(waitingForDriverRef.current, { visibility: 'hidden' }); } }); }
  }, [waitingForDriver]);

  async function findTrip() {
    setVehiclePanel(true); setPanelOpen(false);
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, { params: { pickup, destination }, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
    setFare(response.data);
  }

  async function createRide() {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, { pickup, destination, vehicleType }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
  }

  return (
    <div className="h-screen relative overflow-hidden dm-bg-page">
      {/* Logo */}
      <div className="absolute left-5 top-5 z-10">
        <img className="w-16" src={RideMate_Logo} alt="" />
      </div>
      {/* Top right actions */}
      <div className="absolute right-5 top-5 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowUserRidesModal(true)}
          className="dm-icon-btn px-3 py-1.5 rounded-full border dm-border shadow-lg flex items-center gap-1.5 text-xs font-bold hover:scale-105 active:scale-95 transition-all bg-amber-500/10 text-amber-500 border-amber-500/30"
          title="Rate Captain & Past Trips"
        >
          <i className="ri-star-smile-fill text-amber-400 text-sm"></i>
          <span>Rate Captain</span>
        </button>

        <div className="dm-toggle-pill backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
          <DarkModeToggle />
        </div>
      </div>

      {/* Floating Unrated Ride Alert Banner */}
      {unratedRide && (
        <div className="fixed top-16 left-4 right-4 z-30 max-w-md mx-auto dm-modal p-3.5 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center justify-between animate-slide-down">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
              <i className="ri-star-smile-fill"></i>
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block">Rate Your Captain</span>
              <h4 className="text-xs font-bold dm-text-primary truncate">
                How was your ride with {unratedRide.captain?.fullname?.firstname || 'Captain'}?
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={() => {
                setRatingRide(unratedRide);
                setShowRatingModal(true);
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-gray-950 text-xs font-black rounded-xl shadow-md transition-all active:scale-95"
            >
              Rate Now
            </button>
            <button
              onClick={() => setUnratedRide(null)}
              className="w-7 h-7 rounded-full dm-bg-card dm-text-muted hover:opacity-80 flex items-center justify-center text-sm"
              title="Dismiss"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>
      )}

      <div className="h-screen w-screen">
        <LiveTracking />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 dm-panel relative">
          <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className="absolute opacity-0 right-6 top-6 text-2xl dm-text-primary cursor-pointer">
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold dm-text-primary">Find a Trip</h4>
          <form className="relative py-3" onSubmit={submitHandler}>
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input onClick={() => { setPanelOpen(true); setActiveField("pickup"); }} value={pickup} onChange={handlePickupChange} className="dm-input px-12 py-2 text-lg rounded-lg w-full border" type="text" placeholder="Enter Pickup Location" />
            <input onClick={() => { setPanelOpen(true); setActiveField("destination"); }} value={destination} onChange={handleDestinationChange} className="dm-input px-12 py-2 text-lg rounded-lg w-full mt-3 border" type="text" placeholder="Enter Drop Location" />
          </form>
          <button onClick={findTrip} className="dm-btn-primary px-4 py-2 rounded-lg mt-3 w-full font-semibold">
            Find Trip
          </button>
        </div>
        <div ref={panelRef} className="dm-panel h-0">
          <LocationSearchPanel suggestions={activeField === "pickup" ? pickupSuggestions : destinationSuggestions} setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel} setPickup={setPickup} setDestination={setDestination} activeField={activeField} />
        </div>
      </div>
      <div ref={vehiclePanelRef} className={`fixed w-full dm-panel bottom-0 translate-y-full invisible px-3 py-10 pt-12 z-10 ${!vehiclePanel ? 'pointer-events-none' : 'pointer-events-auto'}`}>
        <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>
      <div ref={confirmRidePanelRef} className={`fixed w-full bottom-0 translate-y-full invisible dm-panel px-3 py-6 pt-12 z-20 ${!confirmRidePanel ? 'pointer-events-none' : 'pointer-events-auto'}`}>
        <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>
      <div ref={vehicleFoundRef} className={`fixed w-full bottom-0 translate-y-full invisible dm-panel px-3 py-6 pt-12 z-30 ${!vehicleFound ? 'pointer-events-none' : 'pointer-events-auto'}`}>
        <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
      </div>
      <div ref={waitingForDriverRef} className={`fixed w-full bottom-0 translate-y-full invisible dm-panel px-3 py-6 pt-12 z-40 ${!waitingForDriver ? 'pointer-events-none' : 'pointer-events-auto'}`}>
        <WaitingforDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
      </div>

      {/* Rate Captain Modal */}
      <RateCaptainModal
        ride={ratingRide}
        isOpen={showRatingModal}
        onClose={() => {
          setShowRatingModal(false);
          fetchLatestUnratedRide();
        }}
        onRated={() => {
          fetchLatestUnratedRide();
        }}
      />

      {/* User Rides & Ratings History Modal */}
      <UserRidesModal
        isOpen={showUserRidesModal}
        onClose={() => setShowUserRidesModal(false)}
        onSelectRideToRate={(selectedRide) => {
          setRatingRide(selectedRide);
          setShowUserRidesModal(false);
          setShowRatingModal(true);
        }}
      />
    </div>
  );
};

export default Home;
