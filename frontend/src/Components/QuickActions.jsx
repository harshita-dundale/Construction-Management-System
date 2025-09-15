import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './QuickActions.css';

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const selectedProject = useSelector(state => state.project.selectedProject);

  const actions = [
    { icon: 'fas fa-plus', label: 'Add Job', path: '/Project_pannel', color: '#28a745' },
    { icon: 'fas fa-calendar-check', label: 'Attendance', path: '/dashboard', color: '#007bff' },
    { icon: 'fas fa-rupee-sign', label: 'Payroll', path: '/payroll', color: '#ffc107' },
    { icon: 'fas fa-boxes', label: 'Materials', path: '/material-management', color: '#6f42c1' }
  ];

  const handleAction = (path) => {
    if (!selectedProject) {
      alert('Please select a project first');
      return;
    }
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="quick-actions-fab">
      <button 
        className={`fab-main ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-plus'}`}></i>
      </button>
      
      <div className={`fab-menu ${isOpen ? 'open' : ''}`}>
        {actions.map((action, index) => (
          <button
            key={index}
            className="fab-item"
            style={{ '--delay': `${index * 0.1}s`, '--color': action.color }}
            onClick={() => handleAction(action.path)}
            title={action.label}
          >
            <i className={action.icon}></i>
            <span className="fab-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;