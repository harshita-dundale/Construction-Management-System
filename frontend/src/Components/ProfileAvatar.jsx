import  { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import { LuLogOut } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import "./ProfileAvatar.css";

const ProfileAvatar = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.modern-profile-dropdown')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  if (!isAuthenticated || !user) return null;

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    logout({ returnTo: window.location.origin });
  };

  const firstLetter = user.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <>
      <div className="modern-profile-dropdown">
        <div className="profile-trigger" onClick={toggleDropdown} style={{background: 'none', backgroundColor: 'transparent', boxShadow: 'none', border: 'none'}}>
          {imageError ? (
            <div className="profile-avatar-fallback">
              {firstLetter}
            </div>
          ) : (
            <img
              src={user.picture}
              alt="Profile"
              className="profile-avatar-image"
              onError={() => setImageError(true)}
            />
          )}
          <div className="profile-status-indicator"></div>
        </div>

        {showDropdown && (
          <div className="modern-dropdown-menu">
            {/* User Info Header */}
            <div className="dropdown-header">
              <div className="user-avatar">
                {imageError ? (
                  <div className="avatar-fallback">{firstLetter}</div>
                ) : (
                  <img src={user.picture} alt="Profile" className="avatar-image" onError={() => setImageError(true)} />
                )}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="dropdown-body">
              <button className="dropdown-item-modern" onClick={() => setShowModal(true)}>
                <div className="item-icon profile-icon">
                  <CgProfile />
                </div>
                <div className="item-content">
                  <span className="item-title">My Profile</span>
                  <span className="item-subtitle">View and edit profile</span>
                </div>
              </button>
              
              <button className="dropdown-item-modern logout-item" onClick={handleLogout}>
                <div className="item-icon logout-icon">
                  <LuLogOut />
                </div>
                <div className="item-content">
                  <span className="item-title">Logout</span>
                  <span className="item-subtitle">Sign out of account</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      <ProfileModal show={showModal} handleClose={() => setShowModal(false)} />
      
      {/* Enhanced Styles */}
      <style jsx>{`
        .modern-profile-dropdown {
          position: relative;
        }
        
        .profile-trigger {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          background: none;
          border: none;
          padding: 0;
        }
        
        .profile-trigger:hover {
          transform: scale(1.05);
        }
        
        .profile-avatar-fallback,
        .profile-avatar-image {
          width: 40px;
          height: 40px;
          border-radius: 50% !important;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          object-fit: cover;
        }
        
        .profile-avatar-fallback {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }
        
        .profile-avatar-image {
          object-fit: cover;
        }
        
        .profile-status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #38ef7d;
          border: 2px solid white;
          border-radius: 50%;
        }
        
        .modern-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          min-width: 280px;
          z-index: 1000;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .dropdown-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .user-avatar {
          position: relative;
        }
        
        .avatar-fallback,
        .avatar-image {
          width: 50px;
          height: 50px;
          border-radius: 50% !important;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }
        
        .avatar-fallback {
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.3rem;
        }
        
        .avatar-image {
          object-fit: cover;
        }
        
        .user-info {
          flex: 1;
          min-width: 0;
        }
        
        .user-name {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-email {
          font-size: 0.85rem;
          opacity: 0.9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .dropdown-body {
          padding: 0.5rem 0;
        }
        
        .dropdown-item-modern {
          width: 100%;
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: left;
        }
        
        .dropdown-item-modern:hover {
          background: #f8f9fa;
        }
        
        .logout-item:hover {
          background: rgba(255, 107, 107, 0.1);
        }
        
        .item-icon {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        
        .profile-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .item-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        
        .logout-icon {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
        }
        
        .item-content {
          flex: 1;
          min-width: 0;
        }
        
        .item-title {
          display: block;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }
        
        .item-subtitle {
          display: block;
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        @media (max-width: 768px) {
          .modern-dropdown-menu {
            left: 50%;
            right: auto;
            transform: translateX(-50%);
            width: 90vw;
            max-width: 320px;
          }
          
          .dropdown-header {
            padding: 1rem;
          }
          
          .user-avatar .avatar-fallback,
          .user-avatar .avatar-image {
            width: 40px;
            height: 40px;
          }
          
          .dropdown-item-modern {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default ProfileAvatar;
