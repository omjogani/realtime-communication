"use client";

import ChooseCommunicationType from '@/components/ChooseCommunicationType'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

const Home = () => {
  const [username, setUsername] = useState("");
  return (
    <div className='flex flex-col items-center justify-center'>
      <Input 
        className='w-1/2 mt-4'
        type="text"
        onChange={(e)=> setUsername(e.target.value)}
        placeholder="Your name..."
        required
        autoComplete='false'
      />
      <ChooseCommunicationType username={username} />
    </div>
  )
}

export default Home