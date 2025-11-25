// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// export default function EmployeeDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState([]);
//   const [err, setErr] = useState("");
//   const apiUrl = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const fetchEmployee = async () => {
//       try {
//         const { data } = await api.get(`${apiUrl}/employee/customer-details/${id}`);
//         console.log(data);
//         setEmployee(data); 
//       } catch (e) {
//         setErr(e.response?.data?.message || "Failed to load employee");
//       }
//     };
//     fetchEmployee();
//   }, [id]);

//   if (err) return <div className="p-6 text-red-500">{err}</div>;

//   const columns = [
//     { headerName: "id", field: "id", sortable: true, filter: true },
//     { headerName: "Name", field: "name", sortable: true, filter: true },
//     { headerName: "Email", field: "email", sortable: true, filter: true },
//     { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
//     { headerName: "Address", field: "address", sortable: true, filter: true },
//     { headerName: "Status", field: "status", sortable: true, filter: true },
//     {
//       headerName: "Joined",
//       field: "created_at",
//       sortable: true,
//       filter: true,
//       valueFormatter: ({ value }) => (value ? new Date(value).toLocaleDateString() : "-"),
//     },
//   ];

//   return (
// <div className="p-6 bg-gray-50 shadow-md rounded-lg">
//   <h1 className="text-2xl font-semibold mb-5">Employee Details</h1>
  

//   <div className="ag-theme-quartz w-full">
//     <AgGridReact
//       rowData={employee}
//       columnDefs={columns}
//       pagination={true}
//       domLayout="autoHeight"
//       paginationPageSize={20}
//     />
//   </div>
// </div>

//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]);
  const [err, setErr] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await api.get(`${apiUrl}/employee/customer-details/${id}`);
        console.log(data);
        setEmployee(data); 
        
        // Calculate pending count
        const pendingEmployees = data.filter(emp => 
          emp.status?.toLowerCase() === 'pending'
        );
        setPendingCount(pendingEmployees.length);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load employee");
      }
    };
    fetchEmployee();
  }, [id]);

  if (err) return <div className="p-6 text-red-500">{err}</div>;

  const columns = [
    { headerName: "id", field: "id", sortable: true, filter: true },
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
    { headerName: "Address", field: "address", sortable: true, filter: true },
    { 
      headerName: "Status", 
      field: "status", 
      sortable: true, 
      filter: true,
      cellStyle: (params) => {
        if (params.value?.toLowerCase() === 'pending') {
          return { backgroundColor: '#fef3c7', color: '#92400e' }; // Yellow background for pending
        }
        return null;
      }
    },
    {
      headerName: "Joined",
      field: "created_at",
      sortable: true,
      filter: true,
      valueFormatter: ({ value }) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-5">Employee Details</h1>
      
      {/* Pending Count Display */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <span className="text-orange-600 font-bold text-lg">⏳</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Pending Employees</h3>
              <p className="text-sm text-gray-600">Employees awaiting approval or action</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{pendingCount}</div>
            <div className="text-sm text-gray-500">out of {employee.length} total</div>
          </div>
        </div>
        
        {/* Progress bar */}
        {employee.length > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(pendingCount / employee.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{pendingCount} pending</span>
              <span>{employee.length - pendingCount} completed</span>
            </div>
          </div>
        )}
      </div>

      <div className="ag-theme-quartz w-full">
        <AgGridReact
          rowData={employee}
          columnDefs={columns}
          pagination={true}
          domLayout="autoHeight"
          paginationPageSize={20}
        />
      </div>
    </div>
  );
}