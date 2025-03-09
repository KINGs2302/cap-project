"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../dashboard/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUpload } from "react-icons/fi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    address: "",
    profilePhoto: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile(data);
        setUpdatedProfile({
          name: data.name,
          address: data.address || "",
          profilePhoto: data.profilePhoto,
        });
        toast.success("Profile loaded successfully!");
      } catch (error) {
        toast.error("Error fetching profile!");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      let imageUrl = updatedProfile.profilePhoto;

      // If a new image file is selected, upload it
      if (imageFile) {
        const formData = new FormData();
        formData.append("profilePhoto", imageFile);
        formData.append("name", updatedProfile.name);
        formData.append("address", updatedProfile.address);

        const response = await fetch("http://localhost:5000/api/auth/update-profile", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to update profile");

        const data = await response.json();
        setProfile(data);
        setEditMode(false);
        setImageFile(null);
        setPreview("");
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Error updating profile!");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-lg mx-auto mt-28 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-20 w-20 rounded-full bg-gray-300 mx-auto"></div>
            <div className="h-6 w-1/2 bg-gray-300 mx-auto mt-4"></div>
            <div className="h-4 w-3/4 bg-gray-300 mx-auto mt-2"></div>
            <div className="h-4 w-1/2 bg-gray-300 mx-auto mt-2"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Profile Photo */}
            <div className="relative">
              <img
                src={preview || updatedProfile.profilePhoto || "/default-profile.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full border border-gray-300 object-cover"
              />
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer shadow-md">
                  <FiUpload className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>

            {/* Name */}
            <h2 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">
              {editMode ? (
                <input
                  type="text"
                  className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
                  value={updatedProfile.name}
                  onChange={(e) => setUpdatedProfile({ ...updatedProfile, name: e.target.value })}
                />
              ) : (
                profile.name
              )}
            </h2>

            {/* Email & GST Number (Read-Only) */}
            <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
            <p className="text-gray-700 dark:text-gray-400">GST No: {profile.gstNo}</p>

            {/* Address */}
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              <strong>Address:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
                  value={updatedProfile.address}
                  onChange={(e) => setUpdatedProfile({ ...updatedProfile, address: e.target.value })}
                />
              ) : (
                profile.address || "No address provided"
              )}
            </p>

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;