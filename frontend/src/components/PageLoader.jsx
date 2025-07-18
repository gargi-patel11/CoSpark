import { LoaderIcon } from 'lucide-react'
import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function PageLoader() {
  const {theme} = useTheme() ; 
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
      <LoaderIcon className='animate-spin size-10 text-primary'/>
    </div>
  )
}

