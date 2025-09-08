import React from 'react'
import IconM from './icon'
import Login from './Login'

export default function Navbar() {
   return (
      <>
         <div className='flex justify-between items-center p-2 mx-20 mt-5 gap-96 rounded-2xl'>
            <div>
               <IconM />
            </div>
            <div className='flex gap-10 justify-center items-center '>
               <div className='underline bg-[#262626] p-2.5 px-5 rounded-4xl cursor-pointer hover:bg-[#bef364] hover:text-black transition-all duration-300 '>
                  about
               </div>
               <div>
                  <Login/>
               </div>
            </div>
         </div>
      </>
   )
}
