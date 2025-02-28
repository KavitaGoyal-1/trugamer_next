import React, { FC } from 'react'

interface IProps {
    children: React.ReactNode;
}

const Container:FC<IProps> = ({children}) => {            
  return (
    <div className='w-[95%] md:w-[90%] m-auto z-20'>{children}</div>
  )
}     

export default Container