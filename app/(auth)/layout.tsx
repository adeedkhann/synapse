import { requiresUnAuth } from '@/modules/authentication/actions'
import React from 'react'

const AuthLayout = async({children}:{children:React.ReactNode}) => {
  await requiresUnAuth();
  return (
    <div>
        {children}
    </div>
  )
}

export default AuthLayout
