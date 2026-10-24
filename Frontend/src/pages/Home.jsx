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

  useEffect(() => {
    const handleRideConfirmed = (confirmedRide) => { setVehicleFound(false); setWaitingForDriver(true); setRide(confirmedRide); };
    const handleRideStarted = (startedRide) => { setWaitingForDriver(false); navigate("/riding", { state: { ride: startedRide } }); };
    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);
    return () => { socket.off("ride-confirmed", handleRideConfirmed); socket.off("ride-started", handleRideStarted); };
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
      {/* Dark mode toggle */}
      <div className="absolute right-5 top-5 z-10">
        <div className="dm-toggle-pill backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
          <DarkModeToggle />
        </div>
      </div>

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
    </div>
  );
};

export default Home;
