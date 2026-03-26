import React from 'react'
import './Input.scss'
const Input = ({
  lable,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  onBlur,
  error,
  icon,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className='input-group'>
      {lable && <lable className="input-lable">{lable}</lable>}
      <div className="input-wrapper">
        {icon && <span className='input-icon'>{icon}</span>}
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className='input-field'
          {...props}
          />
      </div>
      {error && <p className='input-error'>{error}</p>}
    </div>
  )
}

export default Input