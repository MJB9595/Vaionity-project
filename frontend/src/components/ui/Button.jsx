import React from 'react'
import './Button.scss'
const Button = ({
  text,
  className,
  onClick,
  backico = '',
  icons }) => {
  
    const backIconSrc =
        backico == 'wh' ? "/images/arrow-back-wh.svg" :
        backico == 'bh' ? "/images/arrow-back.svg" : null


  return (
    <button onClick={onClick} className={`btn ${className}`}>
      {
        backIconSrc && <img src={backIconSrc} />
      }
      {text}
      {icons && <img src='/images/arrow.svg' />}
    </button>
  )
}

export default Button