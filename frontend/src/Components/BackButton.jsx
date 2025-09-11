import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ 
  to = "/Builder-Dashboard", 
  text = "Back to Dashboard", 
  icon = "fas fa-arrow-left",
  onClick,
  className = "",
  style = {},
  variant = "default"
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  const buttonStyle = variant === 'white' ? {
    background: 'rgba(102, 126, 234, 0.2)',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '25px',
    color: '#667eea',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    alignSelf: 'flex-start',
    backdropFilter: 'blur(10px)',
    ...style
  } : {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '25px',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    alignSelf: 'flex-start',
    backdropFilter: 'blur(10px)',
    ...style
  };

  return (
    <button
      className={`mb-3 ${className}`}
      onClick={handleClick}
      style={buttonStyle}

    >
      <i className={`${icon} me-2`}></i>
      {text}
    </button>
  );
};

export default BackButton;