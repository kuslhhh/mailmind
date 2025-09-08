"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function IconM() {
   return (
      <div className='flex justify-start items-center gap-1 font-bold '>
         <Image
            src={"/iconM.png"}
            alt='M-icon'
            width={40}
            height={40}
            className='rounded-full'
            onClick={() => {
               <Link href={"/"} />
            }}
         />
         <span>Mailmind</span>
      </div>
   )
}
