import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";

const CLOUD_NAME = "dalh0rbn1";
const UPLOAD_PRESET = "ml_default";
const DEFAULT_PROFILE_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

const ProfileModal = ({ show, handleClose }) => {
  const { user } = useAuth0();
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user?.email) return;

        const encodedEmail = encodeURIComponent(user.email);
        const res = await fetch(
          `http://localhost:5000/api/auth/get-user/${encodedEmail}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setProfileImage(data.profileImage);
        setPhoneNumber(data.phoneNo || "");
        setExperience(data.experience || "");
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (!user) return null;

  const profileSrc = !imageError
    ? profileImage || user.picture
    : DEFAULT_PROFILE_IMAGE;

  // Save phone number to backend
  const savePhoneNumber = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Phone number cannot be empty");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          phoneNo: phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update phone number");
      }

      setIsEditingPhone(false);
      toast.success("Phone number updated successfully!");
    } catch (error) {
      console.error("Error updating phone number:", error);
      toast.error("Failed to update phone number");
    } finally {
      setIsSaving(false);
    }
  };

  // Save experience to backend
  const saveExperience = async () => {
    if (!experience.trim()) {
      toast.error("Experience cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          experience: parseInt(experience),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update experience");
      }

      setIsEditingExperience(false);
      toast.success("Experience updated successfully!");
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error("Failed to update experience");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload image to Cloudinary & save to backend
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      // Save uploaded image URL to backend
      const saveRes = await fetch(
        "http://localhost:5000/api/auth/profile-image",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auth0Id: user.sub,
            imageUrl: data.secure_url,
          }),
        }
      );

      if (!saveRes.ok) {
        throw new Error("Failed to save profile image URL to backend");
      }

      setProfileImage(data.secure_url);
      setImageError(false);
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete profile image
  const handleDeleteImage = async () => {
    if (!profileImage) return;
    
    setIsUploading(true);
    try {
      const saveRes = await fetch(
        "http://localhost:5000/api/auth/profile-image",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auth0Id: user.sub,
            imageUrl: null,
          }),
        }
      );

      if (!saveRes.ok) {
        throw new Error("Failed to delete profile image");
      }

      setProfileImage(null);
      setImageError(false);
    } catch (err) {
      console.error("Image delete failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {show && <div className="modal-backdrop-modern"></div>}

      <div className={`modern-profile-modal ${show ? "show" : ""}`}>
        <div className="modal-container">
          <div className="modal-content-modern">
            {/* Header */}
            <div className="modal-header-modern">
              <div className="header-content">
                <div className="header-icon">
                  <CgProfile />
                </div>
                <div className="header-text">
                  <h4 className="modal-title">My Profile</h4>
                  {/* <p className="modal-subtitle">View and manage your account information</p> */}
                </div>
              </div>
              <button className="close-button-simple" onClick={handleClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Body */}
            <div className="modal-body-modern">
              <div className="profile-layout">
                {/* Profile Section */}
                <div className="profile-section">
                  <div className="profile-image-container">
                    <div className="image-wrapper">
                      <img
                        src={profileSrc}
                        alt="Profile"
                        className="profile-image"
                        onError={() => setImageError(true)}
                      />
                      <div className="image-overlay">
                        <i className="fas fa-camera"></i>
                      </div>
                    </div>
                    
                    <div className="upload-section">
                      <label className="upload-button">
                        {isUploading ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-upload me-2"></i>
                            Change Picture
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                      
                      {profileImage && (
                        <button 
                          className="delete-button"
                          onClick={handleDeleteImage}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-trash me-2"></i>
                              Delete Picture
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="profile-basic-info">
                    <h5 className="user-name">{user.name}</h5>
                    <div className="user-meta">
                      <div className="meta-item">
                        <i className="fas fa-shield-alt me-2"></i>
                        <span className={`verification-badge ${
                          user.email_verified ? 'verified' : 'unverified'
                        }`}>
                          {user.email_verified ? 'Verified Account' : 'Unverified'}
                        </span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-user-tag me-2"></i>
                        <span className="role-badge">
                          {localStorage.getItem("userRole") || "No Role Selected"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="details-section">
                  <h6 className="section-title">
                    <i className="fas fa-info-circle me-2"></i>
                    Account Details
                  </h6>
                  
                  <div className="details-grid">
                    {/* Username */}
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="detail-content">
                        <label className="detail-label">Username</label>
                        <div className="detail-value">{user.nickname || "Not set"}</div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="detail-content">
                        <label className="detail-label">Email Address</label>
                        <div className="detail-value">{user.email}</div>
                      </div>
                    </div>

                    {/* Phone Number - Editable */}
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div className="detail-content">
                        <label className="detail-label">Phone Number</label>
                        {isEditingPhone ? (
                          <div className="edit-field">
                            <input
                              type="tel"
                              className="edit-input"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Enter 10-digit phone number"
                              maxLength="10"
                              pattern="\d{10}"
                            />
                            <div className="edit-actions">
                              <button 
                                className="save-btn" 
                                onClick={savePhoneNumber}
                                disabled={isSaving}
                              >
                                {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                              </button>
                              <button 
                                className="cancel-btn" 
                                onClick={() => setIsEditingPhone(false)}
                                disabled={isSaving}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="detail-value-editable">
                            <span>{phoneNumber || "Not set"}</span>
                            <button 
                              className="edit-btn" 
                              onClick={() => setIsEditingPhone(true)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Experience - Editable */}
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-medal"></i>
                      </div>
                      <div className="detail-content">
                        <label className="detail-label">Experience (Years)</label>
                        {isEditingExperience ? (
                          <div className="edit-field">
                            <input
                              type="number"
                              className="edit-input"
                              value={experience}
                              onChange={(e) => setExperience(e.target.value)}
                              placeholder="Years of experience"
                              min="0"
                            />
                            <div className="edit-actions">
                              <button 
                                className="save-btn" 
                                onClick={saveExperience}
                                disabled={isSaving}
                              >
                                {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                              </button>
                              <button 
                                className="cancel-btn" 
                                onClick={() => setIsEditingExperience(false)}
                                disabled={isSaving}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="detail-value-editable">
                            <span>{experience || "Not set"}</span>
                            <button 
                              className="edit-btn" 
                              onClick={() => setIsEditingExperience(true)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="detail-content">
                        <label className="detail-label">Last Updated</label>
                        <div className="detail-value">
                          {new Date(user.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* User ID */}
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-id-card"></i>
                      </div>
                      <div className="detail-content">
                        <label className="detail-label">User ID</label>
                        <div className="detail-value">{user.sub.substring(0, 20) + '...'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer-modern">
              <div className="footer-info">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Profile information is synced with your authentication provider
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .modal-backdrop-modern {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          z-index: 1040;
        }
        
        .modern-profile-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          padding: 1rem;
        }
        
        .modern-profile-modal.show {
          opacity: 1;
          visibility: visible;
        }
        
        .modal-container {
          width: 100%;
          max-width: 900px;
          margin: auto;
        }
        
        .modal-content-modern {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }
        
        .modern-profile-modal.show .modal-content-modern {
          transform: scale(1);
        }
        
        .modal-header-modern {
          background: white;
          color: #2c3e50;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e9ecef;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .header-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }
        
        .modal-title {
          color: #2c3e50;
            margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        // .modal-subtitle {
        //   color: #2c3e50;
        //   margin: 0;
        //   opacity: 0.9;
        //   font-size: 0.9rem;
        // }
        
        .close-button-simple {
          background: none;
          border: none;
          color: #6c757d;
          font-size: 1.5rem;
          transition: all 0.3s ease;
          padding: 0.5rem;
        }
        
        .close-button-simple:hover {
          color: #495057;
          transform: scale(1.1);
        }
        
        .modal-body-modern {
          padding: 2rem;
        }
        
        .profile-layout {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }
        
        .profile-section {
          text-align: center;
        }
        
        .profile-image-container {
          margin-bottom: 1.5rem;
        }
        
        .image-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }
        
        .profile-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(102, 126, 234, 0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .image-wrapper:hover .image-overlay {
          opacity: 1;
        }
        
        .upload-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
        }
        
        .upload-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .delete-button {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          border: none;
          border-radius: 25px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          margin-left: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .delete-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        
        .delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .profile-basic-info {
          text-align: center;
        }
        
        .user-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .user-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }
        
        .verification-badge.verified {
          color: #11998e;
          font-weight: 600;
        }
        
        .verification-badge.unverified {
          color: #ff6b6b;
          font-weight: 600;
        }
        
        .role-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .details-section {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 1.5rem;
        }
        
        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }
        
        .details-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: white;
          padding: 0.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .detail-icon {
          width: 25px;
          height: 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        
        .detail-content {
          flex: 1;
          min-width: 0;
        }
        
        .detail-label {
          display: block;
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: 600;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 0.95rem;
          color: #2c3e50;
          font-weight: 500;
          word-break: break-word;
        }

        .detail-value-editable {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.95rem;
          color: #2c3e50;
          font-weight: 500;
        }

        .edit-btn {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .edit-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: scale(1.1);
        }

        .edit-field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edit-input {
          flex: 1;
          padding: 0.5rem;
          border: 2px solid #667eea;
          border-radius: 6px;
          font-size: 0.9rem;
          outline: none;
        }

        .edit-actions {
          display: flex;
          gap: 0.25rem;
        }

        .save-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn:hover {
          background: #218838;
          transform: scale(1.1);
        }

        .cancel-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #c82333;
          transform: scale(1.1);
        }

        .save-btn:disabled,
        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .modal-footer-modern {
          background: white;
          padding: 1.5rem 2rem;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        
        @media (max-width: 768px) {
          .modal-container {
            width: 95%;
            max-height: 95vh;
          }
          
          .profile-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .modal-header-modern {
            padding: 1.5rem;
          }
          
          .modal-body-modern {
            padding: 1.5rem;
          }
          
          .profile-image {
            width: 120px;
            height: 120px;
          }
        }
      `}} />
    </>
  );
};

export default ProfileModal;