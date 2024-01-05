import { ChatDisplay } from '@/components/Chat'
import React from 'react'
import { mails } from "@/components/data"

const NoPersistent = () => {
  return (
    <div className='flex justify-center items-center'>
        <ChatDisplay mail={mails[0]} />
    </div>
  )
}

export default NoPersistent