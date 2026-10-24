import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext.jsx'
import RideMate_Logo from '../assets/RideMate_Logo.png'
import DarkModeToggle from '../components/DarkModeToggle'

const Captainlogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, { email, password })
      if (response.status === 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
      setEmail(''); setPassword('')
    } catch (err) {
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        setError(err.response.data.errors.map(e => e.msg).join(', '))
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } finally { setLoading(false); }
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between dm-bg-page'>
      <div>
        <div className='flex items-center justify-between mb-4'>
          <img className='w-20' src={RideMate_Logo} alt="" />
          <DarkModeToggle />
        </div>

        {error && (
          <div className='dm-error border px-4 py-2.5 rounded-lg mb-5 text-sm font-medium'>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2 dm-text-primary'>What's your email</h3>
          <input required value={email} onChange={(e) => setEmail(e.target.value)} className='dm-input mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base' type="email" placeholder='email@example.com' />
          <h3 className='text-lg font-medium mb-2 dm-text-primary'>Enter Password</h3>
          <input className='dm-input mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base' value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder='password' />
          <button disabled={loading} className='dm-btn-primary disabled:opacity-60 font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className='text-center dm-text-muted'>
          Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link>
        </p>
      </div>
      <div>
        <Link to='/login' className='dm-btn-user flex items-center justify-center font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg'>
          Sign in as User
        </Link>
      </div>
    </div>
  )
}

export default Captainlogin