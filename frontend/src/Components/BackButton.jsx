import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ 
  to = "/Builder-Dashboard", 
  text = "Back to Dashboard", 
  icon = "fas fa-arrow-left",
  onClick,
  className = "",
  style = {},
  variant = "default" // "default" for gradient background, "outline" for white background
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  const buttonClass = variant === "outline" ? "btn-back-outline" : "btn-back";

  return (
    <button
      className={`${buttonClass} mb-3 ${className}`}
      onClick={handleClick}
      style={{ alignSelf: 'flex-start', ...style }}
    >
      <i className={`${icon} me-2`}></i>
      {text}
    </button>
  );
};

export default BackButton;