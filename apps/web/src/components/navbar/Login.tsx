"use client"

import React from 'react'
import { Button } from '../ui/button'

export default function Login() {

   const handleLogin = () => {
      window.location.href = `http://localhost:4000/auth/google`
   }

   return (
      <div>
         <Button 
            onClick={handleLogin} 
            className='bg-[#bef163] p-2.5 px-5 rounded-4xl cursor-pointer hover:text-black transition-all duration-300'
         >Login</Button>
      </div>
   )
}
