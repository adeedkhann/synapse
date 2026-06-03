"use client"

import { authClient } from "@/lib/auth-client"

const SignInPage = () => {
  return (
    <section className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100'>
        
        {/* Header Section */}
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
            Welcome back
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Don't have an account?{' '}
            <a href='#/signup' className='font-medium text-indigo-600 hover:text-indigo-500 transition-colors'>
              Sign up for free
            </a>
          </p>
        </div>

        {/* Form Section */}
        <form className='mt-8 space-y-6' onSubmit={(e) => e.preventDefault()}>
          <div className='space-y-4 rounded-md shadow-sm'>
            <div>
              <label htmlFor='email-address' className='block text-sm font-medium text-gray-700 mb-1'>
                Email address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors'
                placeholder='you@example.com'
              />
            </div>
            
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors'
                placeholder='••••••••'
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer'
              />
              <label htmlFor='remember-me' className='ml-2 block text-gray-900 cursor-pointer select-none'>
                Remember me
              </label>
            </div>

            <a href='#/forgot' className='font-medium text-indigo-600 hover:text-indigo-500 transition-colors'>
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer shadow-sm'
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Divider Line */}
        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center' aria-hidden='true'>
            <div className='w-full border-t border-gray-200' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>Or continue with</span>
          </div>
        </div>

        {/* Social Logins */}
        <div className=''>
          <button className='w-full inline-flex justify-center py-2.5 px-2 gap-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
          onClick={()=>{
            authClient.signIn.social({
              provider:"github",
              callbackURL:"/"
            })
          }}
          >
            <span className=''>Sign in with GitHub</span>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
              <path fillRule='evenodd' d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z' clipRule='evenodd' />
            </svg>
          </button>
        </div>

      </div>
    </section>
  )
}

export default SignInPage