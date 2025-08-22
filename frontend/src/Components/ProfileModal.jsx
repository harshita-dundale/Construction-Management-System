import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CgProfile } from "react-icons/cg";

const CLOUD_NAME = "dalh0rbn1"; // Cloudinary cloud name
const UPLOAD_PRESET = "ml_default"; // Cloudinary upload preset

const DEFAULT_PROFILE_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

const ProfileModal = ({ show, handleClose }) => {
  const { user } = useAuth0();
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleClose]);

  useEffect(() => {
    const fetchProfileImage = async () => {
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
      } catch (err) {
        console.error("Failed to fetch image", err);
      }
    };

    fetchProfileImage();
  }, [user]);

  if (!user) return null;

  const profileSrc = !imageError
    ? profileImage || user.picture
    : DEFAULT_PROFILE_IMAGE;

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

  return (
    <>
      {show && <div className="modal-backdrop fade show"></div>}

      <div
        className={`modal fade ${show ? "show d-block" : "d-none"}`}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header border-bottom-0 justify-content-center position-relative">
              <h5 className="modal-title fw-bold text-center w-100">
                <CgProfile
                  className="mb-1 me-2"
                  style={{ transform: "scale(1.3)" }}
                />
                My Profile
              </h5>
              <button
                type="button"
                className="btn-close position-absolute end-0 top-50 translate-middle-y me-3"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body px-4 py-4">
              <div className="row gy-4">
                {/* Left Side */}
                <div className="col-12 col-md-4 text-center">
                  <img
                    src={profileSrc}
                    alt="Profile"
                    className="rounded-circle shadow"
                    width="180"
                    height="180"
                    style={{ objectFit: "cover", border: "2px solid gray" }}
                    onError={() => setImageError(true)}
                  />
                  <p className="mt-3 fw-semibold text-dark mb-1">{user.name}</p>
                  <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
                    {/* </strong><strong> */}
                    Email Verified: {user.email_verified ? "Yes" : "No"}
                  </p>
                  <p className="text-muted" style={{ fontSize: "15px" }}>
                    <strong>Role:</strong>{" "}
                    {localStorage.getItem("userRole") || "Not selected"}
                  </p>

                  {/* Upload Section */}
                  <div className="mt-3">
                    <label className="btn btn-sm btn-outline-secondary">
                      {isUploading ? "Uploading..." : "Change Profile Picture"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Right Side */}
                <div className="col-12 col-md-8">
                  <div className="row g-3 mb-4">
                    {[
                      { label: "Username", value: user.nickname },
                      { label: "Email", value: user.email },
                      {
                        label: "Last Updated",
                        value: new Date(user.updated_at).toLocaleString(),
                      },
                      { label: "User ID", value: user.sub },
                    ].map((field, index) => (
                      <div className="col-12 text-start " key={index}>
                        <label
                          className="fw-bold text-dark mb-0 me-3 "
                          style={{ width: "120px" }}
                        >
                          {field.label}:
                        </label>
                        <input
                          type="text"
                          className="form-control text-muted rounded-2"
                          value={field.value}
                          readOnly
                          style={{
                            backgroundColor: "#f9f9f9",
                            cursor: "default",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="modal-footer border-top-0 ">
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={handleClose}
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
