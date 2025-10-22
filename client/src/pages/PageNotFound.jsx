// /client/src/pages/PageNotFound.jsx

import React from 'react';
import {useNavigate} from 'react-router-dom'

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>

      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white'>404 - Page Not Found</h2>
      
      <button onClick={() => navigate('/')} className='flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer'>
        Go back to Home
      </button>

    </div>
  )
}

export default PageNotFound
