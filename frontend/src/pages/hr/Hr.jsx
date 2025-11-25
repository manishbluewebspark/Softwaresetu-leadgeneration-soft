import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OfferLetterModal from "../../components/OfferLetterModal";
import axios from "axios";
import { toast } from "react-toastify";

import { 
  FaPlus, 
  FaFilePdf, 
  FaEye, 
  FaTrash, 
  FaFileAlt,
  FaSpinner,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaIdCard,
  FaListAlt,
  FaThLarge
} from "react-icons/fa";

const Hr = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [offerLetters, setOfferLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [pdfLoadingId, setPdfLoadingId] = useState(null); // NEW
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [templatesRes, offerLettersRes] = await Promise.all([
        axios.get(`${apiUrl}/templates`),
        axios.get(`${apiUrl}/offerletters`)
      ]);

      setTemplates(templatesRes.data);
      setOfferLetters(offerLettersRes.data);

      toast.success("Data loaded successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => setShowPopup(true);

  const viewPDF = async (htmlString) => {
    setPdfLoadingId(htmlString); // Start loader
    try {
      const response = await axios.post(
        `${apiUrl}/offerletters/generate-pdf`,
        { htmlContent: htmlString },
        { 
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'offer-letter.pdf';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Error generating PDF");
    } finally {
      setPdfLoadingId(null); // Stop loader
    }
  };

  const deleteOfferLetter = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer letter?")) {
      return;
    }

    setDeletingId(id);
    try {
      await axios.delete(`${apiUrl}/offerletters/${id}`);
      setOfferLetters(offerLetters.filter(letter => letter.id !== id));
      toast.success("Offer letter deleted");
    } catch (error) {
      console.error("Error deleting offer letter:", error);
      toast.error("Error deleting offer letter");
    } finally {
      setDeletingId(null);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return '-';
    return `₹${Number(salary).toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen p-6 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaThLarge className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">HR Dashboard</h1>
          </div>
          <p className="text-gray-600 ml-11">Manage offer letters and templates efficiently</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Generate Offer Letter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <FaFilePdf className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Generate Offer Letter</h2>
                <p className="text-gray-600 text-sm">Create new offer letters for candidates</p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <FaPlus className="h-4 w-4" />
              Generate Offer Letter
            </button>
          </div>

          {/* Templates */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <FaListAlt className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Manage Templates</h2>
                <p className="text-gray-600 text-sm">Create and manage offer letter templates</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/template")}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <FaPlus className="h-4 w-4" />
              Go to Templates
            </button>
          </div>
        </div>

        {/* Offer Letter Table */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaFileAlt className="h-6 w-6 text-blue-600" />
                Generated Offer Letters
              </h2>
              <p className="text-gray-600 mt-1">View and manage all generated offer letters</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <FaFileAlt className="h-4 w-4" />
              <span className="font-medium">{offerLetters.length} offer letters</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : offerLetters.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offer letters yet</h3>
              <p className="text-gray-500 mb-6">Get started by generating your first offer letter.</p>
              <button
                onClick={handleGenerate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2 mx-auto"
              >
                <FaPlus className="h-4 w-4" />
                Generate Offer Letter
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaUserTie className="h-4 w-4" />
                          Employee
                        </div>
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="h-4 w-4" />
                          Joining Date
                        </div>
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaMoneyBillWave className="h-4 w-4" />
                          Salary
                        </div>
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {offerLetters.map((letter) => (
                      <tr key={letter.id} className="hover:bg-gray-50">
                        
                        {/* Employee */}
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaIdCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {letter.employee_name}
                              </div>
                              <div className="text-xs text-gray-500">ID: {letter.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Position */}
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm text-gray-900">{letter.position}</div>
                        </td>

                        {/* Joining Date */}
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm bg-blue-50 px-2 py-1 rounded-md inline-block">
                            {formatDate(letter.joining_date)}
                          </div>
                        </td>

                        {/* Salary */}
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md inline-block">
                            {formatSalary(letter.salary)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2">

                            {/* View PDF */}
                            <button
                              onClick={() => viewPDF(letter.final_html)}
                              disabled={pdfLoadingId === letter.final_html}
                              className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                            >
                              {pdfLoadingId === letter.final_html ? (
                                <FaSpinner className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <FaEye className="h-3 w-3 mr-1" />
                              )}
                              Download PDF
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteOfferLetter(letter.id)}
                              disabled={deletingId === letter.id}
                              className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                            >
                              {deletingId === letter.id ? (
                                <FaSpinner className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <FaTrash className="h-3 w-3 mr-1" />
                              )}
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal */}
      {showPopup && (
        <OfferLetterModal
          employee={null}
          templates={templates}
          onClose={() => setShowPopup(false)}
          onSuccess={() => {
            setShowPopup(false);
            fetchData();
            toast.success("Offer Letter Created Successfully");
          }}
        />
      )}
    </div>
  );
};

export default Hr;