import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import RideMate_Logo from '../assets/RideMate_Logo.png'
import DarkModeToggle from '../components/DarkModeToggle'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const {user, setUser} = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { email, password }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
    if(response.status === 200){
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }
    setEmail('')
    setPassword('')
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between dm-bg-page'>
      <div>
        <div className='flex items-center justify-between mb-10'>
          <img className='w-16' src={RideMate_Logo} alt="" />
          <DarkModeToggle />
        </div>
        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2 dm-text-primary'>What's Your Email ?</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='dm-input mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder="email@example.com"
          />
          <h3 className='text-lg font-medium mb-2 dm-text-primary'>Enter Your Password</h3>
          <input
            className='dm-input mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="password"
          />
          <button className='dm-btn-primary font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg'>
            Login
          </button>
        </form>
        <p className='text-center dm-text-muted'>
          New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link>
        </p>
      </div>
      <div>
        <Link to='/captain-login' className='dm-btn-captain flex items-center justify-center font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg'>
          Sign in as Captain
        </Link>
      </div>
    </div>
  )
}

export default UserLogin