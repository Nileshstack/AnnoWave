import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AnonWave. All rights reserved.
      </footer>
    </div>
  )
}

export default Footer
