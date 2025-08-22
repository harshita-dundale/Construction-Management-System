// import  { useState, useEffect } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useNavigate } from 'react-router-dom';
// import ProfileModal from './ProfileModal';
// import { LuLogOut } from "react-icons/lu";
// import { CgProfile } from "react-icons/cg";
// import "./ProfileAvatar.css";

// const ProfileAvatar = () => {
//   const { user, logout, isAuthenticated } = useAuth0();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [imageError, setImageError] = useState(false);
//   const navigate = useNavigate();

//   // Inject mobile dropdown CSS dynamically
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//       @media (max-width: 768px) {
//         .dropdown-menu.dropdown-menu-end {
//           left: 50% !important;
//           right: auto !important;
//           transform: translateX(-50%) !important;
//           width: 90vw !important;
//           max-width: 320px;
//           box-sizing: border-box;
//         }
//         .dropdown {
//           position: relative;
//         }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   if (!isAuthenticated || !user) return null;

//   const toggleDropdown = () => setShowDropdown(!showDropdown);

//   const handleLogout = () => {
//     localStorage.removeItem('userRole');
//     logout({ returnTo: window.location.origin });
//   };

//   const firstLetter = user.name?.charAt(0)?.toUpperCase() || '?';

//   return (
//     <>
//       <div className="dropdown">
//         {imageError ? (
//           <div
//             onClick={toggleDropdown}
//             className="rounded-circle d-flex align-items-center justify-content-center profile-avatar"
//             id="profileDropdown"
//             data-bs-toggle="dropdown"
//             aria-expanded={showDropdown}
//           >
//             {firstLetter}
//           </div>
//         ) : (
//           <img
//             src={user.picture}
//             alt="Profile"
//             className="rounded-circle profile-avatar-img"
//             onClick={toggleDropdown}
//             onError={() => setImageError(true)}
//             id="profileDropdown"
//             data-bs-toggle="dropdown"
//             aria-expanded={showDropdown}
//           />
//         )}

//         <ul
//           className={`dropdown-menu dropdown-menu-end ${
//             showDropdown ? 'show' : ''
//           }`}
//           aria-labelledby="profileDropdown"
//         >
//           <li>
//             <span className="dropdown-item-text fw-bold">{user.name}</span>
//           </li>
//           <li>
//             <span className="dropdown-item-text text-muted small">{user.email}</span>
//           </li>
//           <li>
//             <hr className="dropdown-divider" />
//           </li>
//           <li>
//             <button className="dropdown-item" onClick={() => setShowModal(true)} >
//             <CgProfile /> My Profile
//             </button>
//           </li>
//           <li>
//             <hr className="dropdown-divider" />
//           </li>
//           <li>
//             <button className="dropdown-item text-danger" onClick={handleLogout}>
//             <LuLogOut /> Logout
//             </button>
//           </li>
//         </ul>
//       </div>

//       <ProfileModal show={showModal} handleClose={() => setShowModal(false)} />
//     </>
//   );
// };

// export default ProfileAvatar;
import React, { useState } from 'react';
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

  if (!isAuthenticated || !user) return null;

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    logout({ returnTo: window.location.origin });
  };

  const firstLetter = user.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <>
      <div className="dropdown">
        {imageError ? (
          <div
            onClick={toggleDropdown}
            className="rounded-circle d-flex align-items-center justify-content-center profile-avatar"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded={showDropdown}
          >
            {firstLetter}
          </div>
        ) : (
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle profile-avatar-img"
            onClick={toggleDropdown}
            onError={() => setImageError(true)}
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded={showDropdown}
          />
        )}

        <ul
          className={`dropdown-menu dropdown-menu-end ${showDropdown ? 'show' : ''}`}
          aria-labelledby="profileDropdown"
        >
          <li>
            <span className="dropdown-item-text fw-bold">{user.name}</span>
          </li>
          <li>
            <span className="dropdown-item-text text-muted small">{user.email}</span>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item" onClick={() => setShowModal(true)}>
              <CgProfile /> My Profile
            </button>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item text-danger" onClick={handleLogout}>
              <LuLogOut /> Logout
            </button>
          </li>
        </ul>
      </div>

      <ProfileModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
};

export default ProfileAvatar;
