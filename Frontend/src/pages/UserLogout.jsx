import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const UserLogout = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const baseUrl = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URI;
    axios.get(`${baseUrl}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    } ).then((respose) => {
        if(respose.status === 200){
            localStorage.removeItem('token')
            window.location.href = '/login'
        }

    })

  return (
    <div>UserLogout</div>
  )
}

export default UserLogout