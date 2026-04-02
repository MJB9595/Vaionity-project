import React from 'react'
import './Button.scss'

const Button = ({
  text,
  className = '',
  onClick,
  backico = '',
  disabled = false,
  icons = false
}) => {

  const backIconSrc = 
    backico === 'wh' ? "/images/arrow-back-wh.svg" :
    backico === 'bh' ? "/images/arrow-back.svg" : null

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
    >
      {backIconSrc && <img src={backIconSrc} alt="back" className="btn-icon-back" />}
      {text}
      {icons && <img src='/images/arrow.svg' alt="arrow" className="btn-icon-forward" />}
    </button>
  )
}

export default Button