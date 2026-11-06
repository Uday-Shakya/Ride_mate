import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';
import ChangeProfilePictureModal from './ChangeProfilePictureModal';

const VEHICLE_IMAGES = {
  car: 'https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png',
  moto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648177797/assets/fc/ddecaa-2eee-48fe-87f0-614aa7cee7d3/original/Uber_Moto_312x208_pixels_Mobile.png',
  motorcycle: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648177797/assets/fc/ddecaa-2eee-48fe-87f0-614aa7cee7d3/original/Uber_Moto_312x208_pixels_Mobile.png',
  auto: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
};

const CaptainDetails = () => {
  const { captain, setCaptain } = useContext(CaptainDataContext);

  const [stats, setStats] = useState({
    earnedToday: 0,
    totalJobs: 0,
    totalDistance: 0,
    hoursOnline: 0,
    rating: captain?.rating || 5.0,
    totalRatings: captain?.totalRatings || 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setStats({
          earnedToday: response.data.earnedToday || 0,
          totalJobs: response.data.totalJobs || 0,
          totalDistance: response.data.totalDistance || 0,
          hoursOnline: response.data.hoursOnline || 0,
          rating: response.data.rating || 5.0,
          totalRatings: response.data.totalRatings || 0,
        });

        // Sync profilePicture if changed
        if (response.data.profilePicture && response.data.profilePicture !== captain?.profilePicture) {
          if (setCaptain) {
            setCaptain((prev) => ({
              ...prev,
              profilePicture: response.data.profilePicture,
            }));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load captain real stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [captain?.profilePicture, setCaptain]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const vehicle = captain?.vehicle;
  const vehicleType = vehicle?.vehicleType?.toLowerCase() || 'car';
  const vehicleImage = VEHICLE_IMAGES[vehicleType] || VEHICLE_IMAGES.car;
  const captainFullName = captain?.fullname
    ? `${captain.fullname.firstname || ''} ${captain.fullname.lastname || ''}`.trim()
    : 'Captain';

  const avatarUrl =
    captain?.profilePicture ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3.5">
          {/* Avatar with click to change */}
          <div
            className="relative group cursor-pointer"
            onClick={() => setIsPhotoModalOpen(true)}
            title="Click to change profile picture"
          >
            <img
              className="h-14 w-14 rounded-full object-cover border-2 border-amber-400 shadow-md group-hover:opacity-90 group-hover:ring-2 group-hover:ring-amber-400 transition-all"
              src={avatarUrl}
              alt="Captain profile"
            />
            <span className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-gray-950 w-5 h-5 rounded-full text-xs shadow flex items-center justify-center font-bold border border-white dark:border-slate-900 transition-transform group-hover:scale-110">
              <i className="ri-camera-fill text-[10px]"></i>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold capitalize dm-text-primary leading-tight">
                {captainFullName}
              </h4>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="text-[11px] font-semibold text-amber-500 hover:underline"
              >
                Change photo
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
                <i className="ri-star-fill text-amber-400 text-xs"></i>
                {stats.rating ? Number(stats.rating).toFixed(1) : '5.0'}
              </span>
              <span className="text-[11px] dm-text-muted">
                ({stats.totalRatings} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Today's Earnings */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5">
            <h4 className="text-2xl font-black dm-text-primary">
              ₹{stats.earnedToday}
            </h4>
            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="text-xs dm-text-muted hover:dm-text-primary p-1 rounded-full transition-all"
              title="Refresh earnings"
            >
              <i className={`ri-refresh-line ${isLoading ? 'animate-spin text-amber-500' : ''}`}></i>
            </button>
          </div>
          <p className="text-xs dm-text-muted font-bold uppercase tracking-wider">
            Earned Today (Live)
          </p>
        </div>
      </div>

      {/* Real Statistics 4-Grid */}
      <div className="grid grid-cols-4 p-3 dm-bg-card rounded-2xl border dm-border text-center gap-1">
        <div className="p-1.5">
          <i className="text-xl mb-1 text-amber-400 ri-star-smile-fill block"></i>
          <h5 className="text-base font-extrabold dm-text-primary">
            {stats.rating ? Number(stats.rating).toFixed(1) : '5.0'}
          </h5>
          <p className="text-[10px] dm-text-muted font-bold">Rating</p>
        </div>
        <div className="p-1.5">
          <i className="text-xl mb-1 text-violet-500 ri-timer-2-line block"></i>
          <h5 className="text-base font-extrabold dm-text-primary">
            {stats.hoursOnline}
          </h5>
          <p className="text-[10px] dm-text-muted font-bold">Hours</p>
        </div>
        <div className="p-1.5">
          <i className="text-xl mb-1 text-emerald-500 ri-road-map-line block"></i>
          <h5 className="text-base font-extrabold dm-text-primary">
            {stats.totalDistance} KM
          </h5>
          <p className="text-[10px] dm-text-muted font-bold">Distance</p>
        </div>
        <div className="p-1.5">
          <i className="text-xl mb-1 text-sky-500 ri-checkbox-circle-line block"></i>
          <h5 className="text-base font-extrabold dm-text-primary">
            {stats.totalJobs}
          </h5>
          <p className="text-[10px] dm-text-muted font-bold">Completed Jobs</p>
        </div>
      </div>

      {/* Captain's Vehicle Card */}
      <div className="p-3.5 dm-bg-card rounded-2xl border dm-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center p-1 border border-amber-500/20 shrink-0">
            <img
              src={vehicleImage}
              alt={vehicleType}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black dm-text-primary tracking-wider uppercase font-mono">
                {vehicle?.plate || 'DL 01 AB 1234'}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {captain?.status || 'Active'}
              </span>
            </div>
            <p className="text-xs dm-text-muted capitalize">
              {vehicle?.color || 'White'} {vehicle?.vehicleType || 'Vehicle'} • {vehicle?.capacity || 4} Seater
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold dm-text-muted uppercase tracking-wider block">
            Vehicle Type
          </span>
          <span className="text-xs font-bold dm-text-primary capitalize bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-md">
            {vehicle?.vehicleType || 'Car'}
          </span>
        </div>
      </div>

      {/* Change Profile Picture Modal */}
      <ChangeProfilePictureModal
        isOpen={isPhotoModalOpen}
        currentImage={captain?.profilePicture}
        onClose={() => setIsPhotoModalOpen(false)}
        onUpdated={(updatedCaptain) => {
          if (setCaptain) {
            setCaptain((prev) => ({
              ...prev,
              profilePicture: updatedCaptain.profilePicture,
            }));
          }
          fetchStats();
        }}
      />
    </div>
  );
};

export default CaptainDetails;
