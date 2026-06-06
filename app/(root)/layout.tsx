import { requiresAuth } from '@/modules/authentication/actions'
import { getAllChats } from '@/modules/chat/actions'
import ChatSidebar from '@/modules/chat/components/chat-sidebar'

import React from 'react'

const Layout =async ({children}:{children:React.ReactNode}) => {

  

    const session = await requiresAuth()


    const {data:chats} = await getAllChats();



  return (
    <div className='flex h-screen overflow-hidden'>
      <ChatSidebar user={session?.user} chats={chats} />
        <main className='flex-1 overflow-hidden'>
            {children}
        </main>

    </div>
  )
}

export default Layout