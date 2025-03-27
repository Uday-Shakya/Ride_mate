import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const UserLogout = () => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    axios.get(`${import.meta.env.VITE_API_BASE_URI}/users/logout`,{
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