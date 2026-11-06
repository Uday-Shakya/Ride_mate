import React, { useState } from 'react';
import axios from 'axios';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
];

const ChangeProfilePictureModal = ({ isOpen, currentImage, onClose, onUpdated }) => {
  const [selectedImage, setSelectedImage] = useState(currentImage || PRESET_AVATARS[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
        setErrorMessage('');
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      setSelectedImage(customUrl.trim());
      setErrorMessage('');
    }
  };

  const handleSave = async () => {
    if (!selectedImage) {
      setErrorMessage('Please select or upload a profile picture.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/captains/profile-picture`,
        { profilePicture: selectedImage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        if (onUpdated) {
          onUpdated(response.data.captain || { profilePicture: selectedImage });
        }
        onClose();
      }
    } catch (err) {
      console.error('Failed to update profile picture:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to update profile picture. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="dm-modal rounded-3xl max-w-md w-full p-6 shadow-2xl border dm-border space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b dm-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
              <i className="ri-user-smile-line"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold dm-text-primary">Change Profile Picture</h3>
              <p className="text-xs dm-text-muted">Update your avatar visible to passengers</p>
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

        {/* Current Preview */}
        <div className="text-center py-2">
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-xl mx-auto"
              onError={(e) => {
                e.target.src = PRESET_AVATARS[0];
              }}
            />
            <span className="absolute bottom-0 right-0 bg-amber-500 text-gray-950 p-1.5 rounded-full text-xs shadow font-bold">
              <i className="ri-check-line"></i>
            </span>
          </div>
          <p className="text-xs font-semibold dm-text-muted mt-2">Selected Preview</p>
        </div>

        {/* Preset Avatars */}
        <div>
          <label className="text-xs font-bold dm-text-muted uppercase tracking-wider block mb-2">
            Choose from Presets
          </label>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_AVATARS.map((avatar, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(avatar)}
                className={`relative rounded-full overflow-hidden transition-all duration-150 aspect-square ${
                  selectedImage === avatar
                    ? 'ring-3 ring-amber-400 scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img src={avatar} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom File */}
        <div>
          <label className="text-xs font-bold dm-text-muted uppercase tracking-wider block mb-1.5">
            Or Upload From Device
          </label>
          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed dm-border dm-bg-card hover:border-amber-400 cursor-pointer transition-colors text-xs font-bold dm-text-primary">
            <i className="ri-upload-cloud-line text-lg text-amber-500"></i>
            <span>Browse Device Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Or Paste URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold dm-text-muted uppercase tracking-wider block">
            Or Paste Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 dm-input px-3 py-2 text-xs rounded-xl border dm-border"
            />
            <button
              type="button"
              onClick={handleApplyCustomUrl}
              className="px-3 py-2 dm-bg-card border dm-border text-xs font-bold rounded-xl hover:opacity-80 transition-opacity dm-text-primary"
            >
              Use
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <i className="ri-error-warning-fill"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 dm-bg-card border dm-border dm-text-muted hover:dm-text-primary font-bold text-xs rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-gray-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <i className="ri-loader-4-line animate-spin text-base"></i>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <i className="ri-save-line text-base"></i>
                <span>Save Picture</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePictureModal;

