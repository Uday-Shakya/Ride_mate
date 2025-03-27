import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProtectedWrapper = ( 
    {children}
) => {

    const token= localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
    if(!token){
        navigate('/login')
    }
  }, [token])
  return (
    <>
    {children}
    </>
  )
}

export default UserProtectedWrapper