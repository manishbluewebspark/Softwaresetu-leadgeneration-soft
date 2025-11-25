import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
 // 🔧 your base API URL

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch all employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}/employee/get-active`);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);


  const toggleStatus = async (id, currentStatus) => {
    try {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, status: !currentStatus } : emp
        )
      );

      await axios.put(`${apiUrl}/employee/status/${id}`, {
        status: !currentStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error);

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, status: currentStatus } : emp
        )
      );
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Employee Management
          </h1>
          <p className="text-gray-600">
            Manage employee status and information
          </p>
        </div>
        <div className="mb-6">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search employees by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:outline-none"
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentEmployees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {employee.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={employee.status}
                        onChange={() =>
                          toggleStatus(employee.id, employee.status)
                        }
                      />
                      <div
                        className={`w-12 h-6 rounded-full peer transition-colors ${
                          employee.status ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white rounded-full w-4 h-4 transition-transform ${
                          employee.status ? "translate-x-6" : "translate-x-0"
                        }`}
                      ></div>
                    </label>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        employee.status ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-end items-center mt-6 gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
            </span>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;