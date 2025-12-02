// import React, { useState } from "react";
// import axios from "axios";
// import { X, Loader2 } from "lucide-react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const apiUrl = import.meta.env.VITE_API_URL;

// const OfferLetterModal = ({ onClose, templates }) => {
//   // Auto set today's date in YYYY-MM-DD (readonly)
//   const today = new Date().toISOString().split("T")[0];

//   const [form, setForm] = useState({
//     currentDate: today,
//     name: "",
//     position: "",
//     joiningDate: "",
//     salary: "",
//     templateId: ""
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     // Validate required fields
//     if (!form.templateId || !form.name || !form.position || !form.joiningDate || !form.salary) {
//       toast.error("Please fill all required fields", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//       return;
//     }

//     setLoading(true);
    
//     try {
//       const res = await axios.post(`${apiUrl}/offerletters/generate`, form);
      
//       toast.success("Offer Letter Generated Successfully!", {
//         position: "top-center",
//         autoClose: 3000,
//       });
      
//       console.log("Generated Letter:", res.data);
      
//       // Wait a moment before closing to show the success message
//       setTimeout(() => {
//         onClose();
//       }, 500);
      
//     } catch (err) {
//       console.error(err);
      
//       let errorMessage = "Error generating offer letter";
//       if (err.response?.data?.message) {
//         errorMessage = err.response.data.message;
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       toast.error(errorMessage, {
//         position: "top-center",
//         autoClose: 4000,
//       });
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to check if form is valid
//   const isFormValid = () => {
//     return form.templateId && form.name && form.position && form.joiningDate && form.salary;
//   };

//   return (
//     <>
//       <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-30 flex justify-center items-center p-4 z-50">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
//           {/* Header with Close Button */}
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl relative">
//             <button
//               onClick={onClose}
//               disabled={loading}
//               className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <X size={20} />
//             </button>
//             <h2 className="text-2xl font-bold text-white text-center pr-8">
//               Generate Offer Letter
//             </h2>
//             <p className="text-blue-100 text-center mt-1">
//               Fill in the employee details
//             </p>
//           </div>

//           {/* Scrollable Form Content */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-4">
//             {/* Template Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Template <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="templateId"
//                 value={form.templateId}
//                 onChange={handleChange}
//                 disabled={loading}
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 <option value="">Choose a template...</option>
//                 {templates.map(t => (
//                   <option key={t.id} value={t.id}>{t.name}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Current Date (Readonly) */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Issue Date
//               </label>
//               <input
//                 name="currentDate"
//                 type="date"
//                 readOnly
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
//                 value={form.currentDate}
//               />
//               <p className="text-xs text-gray-400 mt-1">Today's date (auto-filled)</p>
//             </div>

//             {/* Employee Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Employee Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="name"
//                 placeholder="Enter full name"
//                 disabled={loading}
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//                 value={form.name}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Position */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Position <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="position"
//                 placeholder="Enter job position"
//                 disabled={loading}
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//                 value={form.position}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Joining Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Joining Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="joiningDate"
//                 type="date"
//                 disabled={loading}
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//                 value={form.joiningDate}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Salary */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Salary <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="salary"
//                 placeholder="Enter salary amount"
//                 disabled={loading}
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//                 value={form.salary}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* Fixed Buttons at Bottom */}
//           <div className="p-6 border-t border-gray-200 space-y-3 bg-white">
//             <button
//               onClick={handleSubmit}
//               disabled={!isFormValid() || loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="animate-spin" size={20} />
//                   Generating...
//                 </>
//               ) : (
//                 "Generate Offer Letter"
//               )}
//             </button>
            
//             <button
//               onClick={onClose}
//               disabled={loading}
//               className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OfferLetterModal;


import React, { useState } from "react";
import axios from "axios";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_API_URL;

const OfferLetterModal = ({ onClose, templates, onSuccess }) => {
  // Auto set today's date in YYYY-MM-DD (readonly)
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    currentDate: today,
    name: "",
    position: "",
    joiningDate: "",
    salary: "",
    templateId: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!form.templateId || !form.name || !form.position || !form.joiningDate || !form.salary) {
      toast.error("Please fill all required fields", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    
    try {
      const res = await axios.post(`${apiUrl}/offerletters/generate`, form);
      
      toast.success("Offer Letter Generated Successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      
      console.log("Generated Letter Response:", res.data);
      
      // Call onSuccess callback if provided - यहाँ हम सिर्फ success signal भेजेंगे
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(); // सिर्फ success होने का signal
      }
      
      // Reset form
      setForm({
        currentDate: today,
        name: "",
        position: "",
        joiningDate: "",
        salary: "",
        templateId: ""
      });
      
      // Wait a moment before closing to show the success message
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (err) {
      console.error("Error generating offer letter:", err);
      
      let errorMessage = "Error generating offer letter";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
      });
      
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if form is valid
  const isFormValid = () => {
    return form.templateId && form.name && form.position && form.joiningDate && form.salary;
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
          {/* Header with Close Button */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl relative">
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white text-center pr-8">
              Generate Offer Letter
            </h2>
            <p className="text-blue-100 text-center mt-1">
              Fill in the employee details
            </p>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template <span className="text-red-500">*</span>
              </label>
              <select
                name="templateId"
                value={form.templateId}
                onChange={handleChange}
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">Choose a template...</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Current Date (Readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>
              <input
                name="currentDate"
                type="date"
                readOnly
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                value={form.currentDate}
              />
              <p className="text-xs text-gray-400 mt-1">Today's date (auto-filled)</p>
            </div>

            {/* Employee Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                placeholder="Enter full name"
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                name="position"
                placeholder="Enter job position"
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                value={form.position}
                onChange={handleChange}
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joining Date <span className="text-red-500">*</span>
              </label>
              <input
                name="joiningDate"
                type="date"
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                value={form.joiningDate}
                onChange={handleChange}
                min={today}
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary <span className="text-red-500">*</span>
              </label>
              <input
                name="salary"
                type="number"
                placeholder="Enter salary amount"
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                value={form.salary}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Fixed Buttons at Bottom */}
          <div className="p-6 border-t border-gray-200 space-y-3 bg-white">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                "Generate Offer Letter"
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfferLetterModal;