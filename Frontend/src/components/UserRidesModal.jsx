import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserRidesModal = ({ isOpen, onClose, onSelectRideToRate }) => {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRides = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/user-rides`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setRides(response.data || []);
    } catch (err) {
      console.error('Failed to fetch user rides:', err);
      setError('Unable to load your rides. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRides();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="dm-modal rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl border-t sm:border dm-border max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b dm-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
              <i className="ri-history-line"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold dm-text-primary">My Trips & Ratings</h3>
              <p className="text-xs dm-text-muted">Rate your captains or view past feedback</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full dm-bg-card dm-text-muted hover:opacity-80 flex items-center justify-center transition-opacity"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {isLoading ? (
            <div className="text-center py-10 space-y-2">
              <i className="ri-loader-4-line animate-spin text-3xl text-amber-500"></i>
              <p className="text-xs dm-text-muted">Loading your past rides...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-center">
              <p>{error}</p>
              <button
                onClick={fetchRides}
                className="mt-2 px-3 py-1 bg-rose-500 text-white rounded-lg text-xs font-bold"
              >
                Retry
              </button>
            </div>
          ) : rides.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/50 flex items-center justify-center text-3xl dm-text-muted">
                <i className="ri-roadster-line"></i>
              </div>
              <div>
                <h4 className="text-sm font-bold dm-text-primary">No completed trips yet</h4>
                <p className="text-xs dm-text-muted mt-1 max-w-xs mx-auto">
                  Once you complete a ride with a Captain, you can rate and review your trip experience here.
                </p>
              </div>
            </div>
          ) : (
            rides.map((ride) => {
              const captain = ride.captain;
              const captainName = captain?.fullname
                ? `${captain.fullname.firstname || ''} ${captain.fullname.lastname || ''}`.trim()
                : 'Captain';
              const isRated = Boolean(ride.rating);

              return (
                <div
                  key={ride._id}
                  className="p-4 dm-bg-card rounded-2xl border dm-border space-y-3 hover:border-amber-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover border dm-border shadow-sm"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
                        alt="Captain"
                      />
                      <div>
                        <h4 className="text-sm font-bold dm-text-primary capitalize">
                          {captainName}
                        </h4>
                        <p className="text-[11px] dm-text-muted capitalize">
                          {captain?.vehicle?.color || ''} {captain?.vehicle?.vehicleType || 'Vehicle'} • {captain?.vehicle?.plate || 'DL 01 AB 1234'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold dm-text-primary">
                        ₹{ride.fare || 0}
                      </span>
                      <p className="text-[10px] dm-text-muted capitalize">
                        {ride.status}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 bg-black/10 dark:bg-black/30 p-2.5 rounded-xl border dm-border">
                    <p className="truncate dm-text-primary">
                      <i className="ri-map-pin-2-fill text-rose-500 mr-1.5"></i>
                      <span className="opacity-75">From:</span> {ride.pickup}
                    </p>
                    <p className="truncate dm-text-primary">
                      <i className="ri-map-pin-user-line text-emerald-500 mr-1.5"></i>
                      <span className="opacity-75">To:</span> {ride.destination}
                    </p>
                  </div>

                  {/* Rating Section */}
                  <div className="flex items-center justify-between pt-1">
                    {isRated ? (
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 font-bold">
                          <i className="ri-star-fill text-amber-400"></i>
                          <span>{ride.rating} / 5</span>
                        </span>
                        {ride.feedback && (
                          <span className="text-[11px] dm-text-muted truncate max-w-[140px]">
                            "{ride.feedback}"
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1">
                        <i className="ri-error-warning-line"></i> Not rated yet
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectRideToRate(ride)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                        isRated
                          ? 'dm-bg-surface border dm-border dm-text-primary hover:opacity-80'
                          : 'bg-amber-500 hover:bg-amber-600 text-gray-950 font-extrabold ring-2 ring-amber-400/50'
                      }`}
                    >
                      <i className="ri-star-smile-fill mr-1"></i>
                      {isRated ? 'Change Rating' : 'Rate Captain'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t dm-border">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 dm-btn-primary font-bold text-sm rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRidesModal;

