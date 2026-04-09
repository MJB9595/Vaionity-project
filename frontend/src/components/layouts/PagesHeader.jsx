import React from 'react'
import Button from '../ui/Button'
import './PagesHeader.scss'
const PagesHeader = ({
      title = '',
  buttonText = '',
  onClick,
  buttonClass = '',
  showButton = true,
}) => {
  return (
     <header className='pages-header'>
        <h2 className='pages-title'>{title}</h2>

      {showButton && (
        <Button
          text={buttonText}
          className={buttonClass}
          onClick={onClick}
        />
      )}
    </header>
  )
}

export default PagesHeader