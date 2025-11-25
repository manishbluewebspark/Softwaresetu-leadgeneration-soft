import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Import close icon

const apiUrl = import.meta.env.VITE_API_URL;

const OfferLetterModal = ({ onClose, templates }) => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${apiUrl}/offerletters/generate`, form);
      alert("Offer Letter Generated Successfully!");
      console.log("Generated Letter:", res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error generating offer letter");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-30 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
        {/* Header with Close Button */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={form.joiningDate}
              onChange={handleChange}
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary <span className="text-red-500">*</span>
            </label>
            <input
              name="salary"
              placeholder="Enter salary amount"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={form.salary}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Fixed Buttons at Bottom */}
        <div className="p-6 border-t border-gray-200 space-y-3 bg-white">
          <button
            onClick={handleSubmit}
            disabled={!form.templateId || !form.name || !form.position || !form.joiningDate || !form.salary}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Generate Offer Letter
          </button>
          
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferLetterModal;