import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import RideMate_Logo from '../assets/RideMate_Logo.png'
import DarkModeToggle from '../components/DarkModeToggle'

const CaptainSignup = () => {
    const navigate = useNavigate()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ vehicleColor, setVehicleColor ] = useState('')
    const [ vehiclePlate, setVehiclePlate ] = useState('')
    const [ vehicleCapacity, setVehicleCapacity ] = useState('')
    const [ vehicleType, setVehicleType ] = useState('')
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const { captain, setCaptain } = React.useContext(CaptainDataContext)
  
    const submitHandler = async (e) => {
      e.preventDefault(); setError(''); setLoading(true)
      const captainData = { fullname: { firstname: firstName, lastname: lastName }, email, password, vehicle: { color: vehicleColor, plate: vehiclePlate, capacity: Number(vehicleCapacity), vehicleType } }
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
        if (response.status === 201) {
          const data = response.data
          setCaptain(data.captain)
          localStorage.setItem('token', data.token)
          navigate('/captain-home')
        }
        setEmail(''); setFirstName(''); setLastName(''); setPassword(''); setVehicleColor(''); setVehiclePlate(''); setVehicleCapacity(''); setVehicleType('')
      } catch (err) {
        if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
          setError(err.response.data.errors.map(e => e.msg).join(', '))
        } else if (err.response?.data?.message) {
          setError(err.response.data.message)
        } else {
          setError('Registration failed. Please check your inputs and try again.')
        }
      } finally { setLoading(false) }
    }

  const inputClass = 'dm-input rounded-lg px-4 py-2 border text-lg placeholder:text-base'

  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between dm-bg-page'>
        <div>
          <div className='flex items-center justify-between mb-10'>
            <img className='w-16' src={RideMate_Logo} alt="" />
            <DarkModeToggle />
          </div>

          {error && (
            <div className='dm-error border px-4 py-2.5 rounded-lg mb-5 text-sm font-medium'>
              {error}
            </div>
          )}

          <form onSubmit={submitHandler}>
            <h3 className='text-lg w-1/2 font-medium mb-2 dm-text-primary'>What's your name</h3>
            <div className='flex gap-4 mb-5'>
              <input required className={`${inputClass} w-1/2`} type="text" placeholder='First name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input required className={`${inputClass} w-1/2`} type="text" placeholder='Last name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <h3 className='text-lg font-medium mb-2 dm-text-primary'>Enter Your Email</h3>
            <input required value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} mb-5 w-full`} type="email" placeholder="email@example.com" />
            <h3 className='text-lg font-medium mb-2 dm-text-primary'>Enter Password</h3>
            <input className={`${inputClass} mb-5 w-full`} value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="password" />
            <h3 className='text-lg font-medium mb-2 dm-text-primary'>Vehicle Information</h3>
            <div className='flex gap-4 mb-7'>
              <input required className={`${inputClass} w-1/2`} type="text" placeholder='Vehicle Color' value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
              <input required className={`${inputClass} w-1/2`} type="text" placeholder='Vehicle Plate' value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
            </div>
            <div className='flex gap-4 mb-7'>
              <input required className={`${inputClass} w-1/2`} type="number" placeholder='Vehicle Capacity' value={vehicleCapacity} onChange={(e) => setVehicleCapacity(e.target.value)} />
              <select required className={`${inputClass} w-1/2`} value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                <option value="" disabled>Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
            </div>
            <button disabled={loading} className='dm-btn-primary disabled:opacity-50 font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg cursor-pointer'>
              {loading ? 'Creating Captain Account...' : 'Create Captain Account'}
            </button>
          </form>

          <p className='text-center dm-text-muted'>
            Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link>
          </p>
        </div>
        <div>
          <p className='text-[10px] leading-tight dm-text-muted'>
            This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup