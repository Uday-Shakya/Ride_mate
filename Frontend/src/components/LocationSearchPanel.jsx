import React from 'react'
import 'remixicon/fonts/remixicon.css'

const LocationSearchPanel = (props) => {

    const locations = ["HNO.71 Bank ColoNy Morar, Gwalior",
                       "HNO.74 Bank ColoNy Morar, Gwalior",
                        "HNO.78 Bank ColoNy Morar, Gwalior",
                        "HNO.56 Bank ColoNy Morar, Gwalior"
    ]

  return (
    <div>
      {
            locations.map(function(elem, idx){
                  return <div key={idx} onClick={()=>{
                        props.setVehiclePanel(true)
                        props.setPanelOpen(false)
                  } }  className='flex gap-1 border-2 p-3 active:border-black rounded-xl items-center my-2 justify-start'>
        <h2 className='bg-[#eee] h-7 flex item-center justify-center w-10 rounded full'> <i class="ri-map-pin-fill"></i></h2>
              <h4 className='font-medium'> {elem}</h4>
        </div>
            })
      }
        {/*This Is Sample DAta--*/}
        
    </div>
  )
}

export default LocationSearchPanel