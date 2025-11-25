import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [name, setName] = useState(storedUser.name || "");
  const [imagePreview, setImagePreview] = useState(storedUser.image || "");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleImageChange = (e) => {
    const img = e.target.files[0];
    if (img) {
      // Validate file type
      if (!img.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (img.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setFile(img);
      setImagePreview(URL.createObjectURL(img));
      toast.info("Image selected successfully!");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);
    
    // Show loading toast
    const toastId = toast.loading("Updating profile...");
    
    try {
      const formData = new FormData();
      formData.append("id", storedUser.id); 
      formData.append("name", name);
      if (file) formData.append("image", file);

      const res = await axios.put(`${apiUrl}/auth/update-profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        const updated = { 
          ...storedUser,        
          ...res.data.user        
        };

        localStorage.setItem("user", JSON.stringify(updated));
        setImagePreview(updated.logo);
        window.dispatchEvent(new Event("profileUpdated"));
        
        // Update to success toast
        toast.update(toastId, {
          render: "Profile updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      
      // Update to error toast
      toast.update(toastId, {
        render: error.response?.data?.message || "Error updating profile",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Edit Logo</h2>
          <p className="text-blue-100 mt-1">Update your Logo</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={imagePreview || "/default-user.png"}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-all duration-300 group-hover:scale-105"
                alt="Profile"
              />
              <label 
                htmlFor="imageUpload"
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:scale-110"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-gray-500 text-sm mt-3">Click the camera icon to change photo</p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}