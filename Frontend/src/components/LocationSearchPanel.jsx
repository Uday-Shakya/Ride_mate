import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
    }

    return (
        <div>
            {/* Display fetched suggestions */}
            {
                suggestions.map((elem, idx) => (
                    <div key={idx} onClick={() => handleSuggestionClick(elem)} className='flex gap-4 border p-3 rounded-xl items-center my-2 justify-start dm-bg-card dm-border cursor-pointer hover:opacity-80 transition-opacity'>
                        <h2 className='dm-bg-surface h-8 flex items-center justify-center w-12 rounded-full dm-text-primary'><i className="ri-map-pin-fill"></i></h2>
                        <h4 className='font-medium dm-text-primary'>{elem}</h4>
                    </div>
                ))
            }
        </div>
    )
}

export default LocationSearchPanel