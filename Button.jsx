import React from 'react';
import './Button.css';

const Button = ({ children, type, size, disabled, onClick }) => {
  const buttonClasses = `button button-${type} button-${size}` + (disabled ? ' button-disabled' : '');

  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button className={buttonClasses} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
};

Button.defaultProps = {
  disabled: false,
  type: 'secondary'
};

export default Button;
