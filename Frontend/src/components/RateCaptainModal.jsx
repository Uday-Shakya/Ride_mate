import React, { useState } from 'react';
import axios from 'axios';

const COMPLIMENT_TAGS = [
  { id: 'clean', label: 'Clean Vehicle', icon: 'ri-sparkling-fill' },
  { id: 'safe', label: 'Safe Driver', icon: 'ri-shield-check-fill' },
  { id: 'polite', label: 'Polite & Friendly', icon: 'ri-user-smile-fill' },
  { id: 'ontime', label: 'On Time', icon: 'ri-time-fill' },
  { id: 'route', label: 'Smooth Route', icon: 'ri-compass-3-fill' },
  { id: 'music', label: 'Great Music', icon: 'ri-music-2-fill' },
];

const RATING_DESCRIPTIONS = {
  1: { label: 'Poor', emoji: '😞', color: 'text-rose-500' },
  2: { label: 'Fair', emoji: '😐', color: 'text-amber-500' },
  3: { label: 'Good', emoji: '🙂', color: 'text-yellow-500' },
  4: { label: 'Very Good', emoji: '😊', color: 'text-emerald-500' },
  5: { label: 'Excellent!', emoji: '🌟', color: 'text-amber-400' },
};

const RateCaptainModal = ({ ride, isOpen, onClose, onRated }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const captain = ride?.captain;
  const captainFirstName = captain?.fullname?.firstname || 'Captain';
  const captainFullName = captain?.fullname
    ? `${captain.fullname.firstname || ''} ${captain.fullname.lastname || ''}`.trim()
    : 'Captain';
  const currentAvgRating = captain?.rating ? Number(captain.rating).toFixed(1) : '5.0';
  const totalReviews = captain?.totalRatings || 0;

  const toggleTag = (label) => {
    if (selectedTags.includes(label)) {
      setSelectedTags(selectedTags.filter((t) => t !== label));
    } else {
      setSelectedTags([...selectedTags, label]);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!ride?._id) {
      setErrorMessage('Ride details not found');
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage('Please select a rating between 1 and 5 stars');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Combine compliments and user notes
    const combinedFeedback = [
      selectedTags.length > 0 ? `[${selectedTags.join(', ')}]` : '',
      comment.trim(),
    ]
      .filter(Boolean)
      .join(' - ');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/rate-captain`,
        {
          rideId: ride._id,
          rating,
          feedback: combinedFeedback,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        setIsSubmitted(true);
        if (onRated) {
          onRated(response.data);
        }
        setTimeout(() => {
          if (onClose) onClose();
        }, 2200);
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit rating. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;
  const ratingInfo = RATING_DESCRIPTIONS[activeRating] || RATING_DESCRIPTIONS[5];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="dm-modal rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl border-t sm:border dm-border max-h-[90vh] overflow-y-auto space-y-5 animate-slide-up">
        {isSubmitted ? (
          /* Success Screen */
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-4xl shadow-lg ring-4 ring-emerald-500/30 animate-bounce">
              <i className="ri-check-line"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold dm-text-primary">
                Thank You for Rating!
              </h3>
              <p className="text-sm dm-text-muted mt-1">
                Your feedback helps Captain <strong className="dm-text-primary">{captainFirstName}</strong> maintain great service on RideMate.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 font-bold text-base">
              <i className="ri-star-fill text-amber-400 text-lg"></i>
              <span>{rating} / 5 Stars Given</span>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 dm-btn-primary font-bold text-sm rounded-xl transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Rating Form */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b dm-border">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-500">
                  Ride Completed
                </span>
                <h3 className="text-xl font-bold dm-text-primary">
                  Rate Your Captain
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full dm-bg-card dm-text-muted hover:opacity-80 flex items-center justify-center transition-opacity"
                title="Skip rating"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Captain Summary Card */}
            <div className="flex items-center gap-3.5 p-3.5 mt-4 dm-bg-card rounded-2xl border dm-border">
              <img
                className="h-14 w-14 rounded-full object-cover border-2 border-amber-400 shadow"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
                alt="Captain avatar"
              />
              <div className="flex-1 overflow-hidden">
                <h4 className="text-base font-bold dm-text-primary truncate capitalize">
                  {captainFullName}
                </h4>
                <p className="text-xs dm-text-muted capitalize truncate">
                  {captain?.vehicle?.color || ''} {captain?.vehicle?.vehicleType || 'Vehicle'} • <span className="font-mono font-semibold">{captain?.vehicle?.plate || 'DL 01 AB 1234'}</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    <i className="ri-star-fill text-amber-400 text-xs"></i>
                    {currentAvgRating}
                  </span>
                  <span className="text-[11px] dm-text-muted">
                    ({totalReviews} past reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Star Rating */}
            <div className="text-center py-4 my-2 dm-bg-surface rounded-2xl border dm-border">
              <p className="text-xs font-semibold dm-text-muted mb-2">
                How would you rate your ride with {captainFirstName}?
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= activeRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-3xl sm:text-4xl transition-all duration-150 hover:scale-125 focus:outline-none"
                    >
                      <i
                        className={
                          isFilled
                            ? 'ri-star-fill text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                            : 'ri-star-line text-slate-400 dark:text-slate-600'
                        }
                      ></i>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <span className="text-lg">{ratingInfo.emoji}</span>
                <span className={`text-sm font-extrabold ${ratingInfo.color}`}>
                  {ratingInfo.label}
                </span>
              </div>
            </div>

            {/* Compliment Tags */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold dm-text-muted uppercase tracking-wider block">
                What went well?
              </label>
              <div className="flex flex-wrap gap-2">
                {COMPLIMENT_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag.label);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.label)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/40 shadow-sm scale-105'
                          : 'dm-bg-card dm-text-muted dm-border hover:opacity-80'
                      }`}
                    >
                      <i className={tag.icon}></i>
                      <span>{tag.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment */}
            <div className="space-y-1 mb-4">
              <label className="text-xs font-bold dm-text-muted uppercase tracking-wider block">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Share positive notes or suggestions for ${captainFirstName}...`}
                rows={2}
                maxLength={300}
                className="w-full dm-input p-3 text-sm rounded-xl border dm-border focus:outline-none resize-none"
              ></textarea>
            </div>

            {errorMessage && (
              <div className="p-3 mb-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-center gap-2">
                <i className="ri-error-warning-fill text-base"></i>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-gray-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-lg"></i>
                    <span>Submitting Rating...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-star-smile-fill text-lg"></i>
                    <span>Submit {rating} Star Rating</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 dm-bg-card dm-text-muted hover:dm-text-primary text-xs font-bold rounded-xl transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateCaptainModal;

