import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import RideMate_Logo from '../assets/RideMate_Logo.png'
import DarkModeToggle from '../components/DarkModeToggle'

const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const navigate = useNavigate()
  const {user, setUser} = React.useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const newUser = { fullname: { firstname: firstName, lastname: lastName }, email, password }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)
      if(response.status === 201){
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }
      setEmail(''); setFirstName(''); setLastName(''); setPassword('')
    } catch (err) {
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        setError(err.response.data.errors.map(e => e.msg).join(', '))
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Registration failed. Please check your inputs and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

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
              <input required className='dm-input w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base' type="text" placeholder='First name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <input required className='dm-input w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base' type="text" placeholder='Last name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <h3 className='text-lg font-medium mb-2 dm-text-primary'>Enter Your Email</h3>
            <input required value={email} onChange={(e) => setEmail(e.target.value)} className='dm-input mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base' type="email" placeholder="email@example.com" />
            <h3 className='text-lg font-medium mb-2 dm-text-primary'>Enter Password</h3>
            <input className='dm-input mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base' value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="password" />
            <button disabled={loading} className='dm-btn-primary disabled:opacity-60 font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg cursor-pointer'>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className='text-center dm-text-muted'>
            Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link>
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

export default UserSignup