import { ModeToggle } from '@/components/mode-toggle'
import { requiresAuth } from '@/modules/authentication/actions'
import ChatSidebar from '@/modules/chat/components/chat-sidebar'

import React from 'react'

const Layout =async ({children}:{children:React.ReactNode}) => {

    const session = await requiresAuth()
  return (
    <div className='flex h-screen overflow-hidden'>
      <ChatSidebar user={session?.user}/>
        <main className='flex-1 overflow-hidden'>
          <ModeToggle />
            {children}
        </main>

    </div>
  )
}

export default Layout