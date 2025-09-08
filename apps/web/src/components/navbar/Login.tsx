"use client"

import React from 'react'
import { Button } from '../ui/button'
import { loginWithGoogle } from '@/lib/api'

export default function Login() {

   

   return (
      <div>
         <Button 
            onClick={loginWithGoogle} 
            size={"lg"}
            className=' bg-[#bef163] rounded-4xl cursor-pointer hover:text-black transition-all duration-300'
         >Login</Button>
      </div>
   )
}
