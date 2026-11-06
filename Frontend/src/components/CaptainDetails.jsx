import React, {useContext} from 'react'
import {CaptainDataContext} from '../context/CaptainContext'

const CaptainDetails = () => {

  const {captain} = useContext(CaptainDataContext)

  return (
    <div> 
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-3'>
            <img className='h-12 w-12 rounded-full object-cover border-2 dm-border shadow' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="Captain"  />
            <div>
              <h4 className='text-lg font-bold capitalize dm-text-primary'> {captain?.fullname ? `${captain.fullname.firstname || ''} ${captain.fullname.lastname || ''}`.trim() : 'Captain'}</h4>
              <div className='flex items-center gap-1.5 mt-0.5'>
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 text-xs font-bold border border-amber-500/30'>
                  <i className="ri-star-fill text-amber-400 text-xs"></i>
                  {captain?.rating ? Number(captain.rating).toFixed(1) : '5.0'}
                </span>
                <span className='text-[11px] dm-text-muted'>
                  ({captain?.totalRatings || 0} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className='text-right'>
            <h4 className='text-xl font-extrabold dm-text-primary'>₹295</h4>
            <p className='text-xs dm-text-muted'>Earned Today</p>
          </div>
        </div>
        <div className='grid grid-cols-4 p-3 mt-6 dm-bg-card rounded-2xl border dm-border text-center gap-1'>
          <div className='p-1.5'>
            <i className="text-xl mb-1 text-amber-400 ri-star-fill"></i>
            <h5 className='text-base font-bold dm-text-primary'>{captain?.rating ? Number(captain.rating).toFixed(1) : '5.0'}</h5>
            <p className='text-[10px] dm-text-muted'>Rating</p>
          </div>
          <div className='p-1.5'>
            <i className="text-xl mb-1 text-violet-500 ri-timer-2-line"></i>
            <h5 className='text-base font-bold dm-text-primary'>10.2</h5>
            <p className='text-[10px] dm-text-muted'>Hours</p>
          </div>
          <div className='p-1.5'>
            <i className="text-xl mb-1 text-emerald-500 ri-speed-up-line"></i>
            <h5 className='text-base font-bold dm-text-primary'>30 KM</h5>
            <p className='text-[10px] dm-text-muted'>Distance</p>
          </div>
          <div className='p-1.5'>
            <i className="text-xl mb-1 text-sky-500 ri-booklet-line"></i>
            <h5 className='text-base font-bold dm-text-primary'>20</h5>
            <p className='text-[10px] dm-text-muted'>Jobs</p>
          </div>
        </div>
    </div>
  )
}

export default CaptainDetails