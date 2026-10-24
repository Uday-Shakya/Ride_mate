import React, {useContext} from 'react'
import {CaptainDataContext} from '../context/CaptainContext'

const CaptainDetails = () => {

  const {captain} = useContext(CaptainDataContext)

  return (
    <div> 
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-3'>
            <img className='h-12 w-12 rounded-full object-cover border-2 dm-border shadow' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="Captain"  />
            <h4 className='text-lg font-bold capitalize dm-text-primary'> {captain?.fullname ? `${captain.fullname.firstname || ''} ${captain.fullname.lastname || ''}`.trim() : 'Captain'}</h4>
          </div>
          <div className='text-right'>
            <h4 className='text-xl font-extrabold dm-text-primary'>₹295</h4>
            <p className='text-xs dm-text-muted'>Earned Today</p>
          </div>
        </div>
        <div className='grid grid-cols-3 p-4 mt-6 dm-bg-card rounded-2xl border dm-border text-center gap-2'>
          <div className='p-2'>
            <i className="text-2xl mb-1 text-violet-500 ri-timer-2-line"></i>
            <h5 className='text-lg font-bold dm-text-primary'>10.2</h5>
            <p className='text-xs dm-text-muted'>Hours Online</p>
          </div>
          <div className='p-2'>
            <i className="text-2xl mb-1 text-emerald-500 ri-speed-up-line"></i>
            <h5 className='text-lg font-bold dm-text-primary'>30 KM</h5>
            <p className='text-xs dm-text-muted'>Distance</p>
          </div>
          <div className='p-2'>
            <i className="text-2xl mb-1 text-amber-500 ri-booklet-line"></i>
            <h5 className='text-lg font-bold dm-text-primary'>20</h5>
            <p className='text-xs dm-text-muted'>Total Jobs</p>
          </div>
        </div>
    </div>
  )
}

export default CaptainDetails