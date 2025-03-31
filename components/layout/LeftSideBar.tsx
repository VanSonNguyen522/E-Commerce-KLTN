import React from 'react'
import Image from 'next/image'
const LeftSideBar = () => {
  return (
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden">
      <Image src="/Logo.png" alt="logo" width={150} height={70} />
    </div>
  )
}

export default LeftSideBar
