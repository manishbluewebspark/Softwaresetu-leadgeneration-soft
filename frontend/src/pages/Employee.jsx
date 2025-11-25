// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import RoleGuard from "../components/RoleGuard.jsx";
// import { AgGridReact } from "ag-grid-react";
// import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { Eye, Edit } from "lucide-react";
// import axios from "axios";
// import "./dealTable.css";
// import QuickFilter from "./QuickFilter";


// ModuleRegistry.registerModules([AllCommunityModule]);

// export default function Employees() {
//   const [quickFilterText, setQuickFilterText] = useState("");
//   const [list, setList] = useState([]);
//   const [err, setErr] = useState("");
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const navigate = useNavigate();
//   const gridRef = useRef(null);
//   const apiUrl = import.meta.env.VITE_API_URL;


//   const fetchEmployees = async () => {
//     try {
//       const { data } = await axios.get(`${apiUrl}/employee/get`);
//       setList(Array.isArray(data) ? data : []);
//     } catch (e) {
//       setErr(e.response?.data?.message || "Failed to fetch");
//       setList([]);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const columnDefs = useMemo(
//     () => [
//       // { headerName: "ID", field: "id", filter: "agNumberColumnFilter", minWidth: 100 },
//       { headerName: "Name", field: "name", filter: "agTextColumnFilter", flex: 1 },
//       { headerName: "Email", field: "email", filter: "agTextColumnFilter", flex: 1 },
//       {
//         headerName: "Joined",
//         field: "created_at",
//         valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleDateString() : "-"),
//         minWidth: 150,
//       },
//       {
//         headerName: "Action",
//         field: "id",
//         cellRenderer: (params) => (
//           <div className="flex gap-2">
//             {/* View button */}
//             <button
//               onClick={() => navigate(`/employees/${params.value}`)}
//               className="rounded-lg flex items-center gap-1"
//               title="View"
//             >
//               <Eye size={16} />
//             </button>

//             {/* Edit button */}
//             <button
//               onClick={() => navigate(`/employees/edit/${params.value}`)}
//               className="rounded-lg flex items-center gap-1"
//               title="Edit"
//             >
//               <Edit size={16} />
//             </button>
//           </div>
//         ),
//         minWidth: 150,
//       },
//     ],
//     [navigate]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       sortable: true,
//       filter: true,
//       resizable: true,
//     }),
//     []
//   );

//   return (
//     <RoleGuard
//       role="admin"
//       fallback={<div className="card p-6">Only admins can view this.</div>}
//     >
//       <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-semibold">Employees</h1>

//           <div className="flex gap-4">


//             <button
//               className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
//               onClick={() => navigate("/employees/status")}
//             >
//               Status
//             </button>

//             <button
//               className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
//               onClick={() => navigate("/employees/add-employee")}
//             >
//               Add Employee
//             </button>

//             <QuickFilter
//               value={quickFilterText}
//               onChange={setQuickFilterText}
//             />
//           </div>

//         </div>
//         <div className="ag-theme-alpine" style={{ height: 700, width: "100%" }}>
//           <AgGridReact
//             ref={gridRef}
//             rowData={list}
//             columnDefs={columnDefs}
//             defaultColDef={defaultColDef}
//             pagination={true}
//             paginationPageSize={100}
//             animateRows={true}
//             quickFilterText={quickFilterText}
//               onRowClicked={(params) => setSelectedRowId(params.data.id)}
//   getRowStyle={(params) => {
//     if (params.data.id === selectedRowId) {
//       return {
//         backgroundColor: '#c4c4c4', 
//         borderLeft: '4px solid #22c55e',
//         transition: 'background-color 0.3s ease',
//       };
//     }
//     return null;
//   }}
//           />
//         </div>

//         {err && <div className="text-red-500">{err}</div>}
//       </div>
//     </RoleGuard>
//   );
// }



import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RoleGuard from "../components/RoleGuard.jsx";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Eye, Edit, Users, AlertCircle, User } from "lucide-react";
import axios from "axios";
import "./dealTable.css";
import QuickFilter from "./QuickFilter";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Employees() {
  const [quickFilterText, setQuickFilterText] = useState("");
  const [list, setList] = useState([]);
  const [totalPendingLeads, setTotalPendingLeads] = useState(0);
  const [err, setErr] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/employee/get-active-pending`);
      setList(Array.isArray(data.employees) ? data.employees : []);
      setTotalPendingLeads(data.totalPendingLeads || 0);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to fetch");
      setList([]);
      setTotalPendingLeads(0);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const columnDefs = useMemo(
    () => [
      { 
        headerName: "Name", 
        field: "name", 
        filter: "agTextColumnFilter", 
        flex: 1 
      },
      { 
        headerName: "Email", 
        field: "email", 
        filter: "agTextColumnFilter", 
        flex: 1 
      },
      { 
        headerName: "Mobile", 
        field: "mobile", 
        filter: "agTextColumnFilter", 
        flex: 1 
      },
      {
        headerName: "Pending Leads",
        field: "pending_leads_count",
        filter: "agNumberColumnFilter",
        cellRenderer: (params) => (
          <div className={`inline-flex items-center px-3 py-0.1 rounded-full text-sm font-medium ${
            params.value > 0 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
          
            {params.value}
          </div>
        ),
        minWidth: 150,
        comparator: (valueA, valueB) => valueA - valueB, // Number sorting ke liye
      },
      {
        headerName: "Joined",
        field: "created_at",
        valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleDateString() : "-"),
        minWidth: 150,
      },
      {
        headerName: "Action",
        field: "id",
        cellRenderer: (params) => (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/employees/${params.value}`)}
              className="rounded-lg flex items-center gap-1 text-gray-500 hover:text-gray-800"
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => navigate(`/employees/edit/${params.value}`)}
              className="rounded-lg flex items-center gap-1 text-gray-500 hover:text-gray-800"
              title="Edit"
            >
              <Edit size={16} />
            </button>
          </div>
        ),
        minWidth: 150,
      },
    ],
    [navigate]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  return (
    <RoleGuard
      role="admin"
      fallback={<div className="card p-6">Only admins can view this.</div>}
    >
      <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
        {/* Header Section with Stats */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Employees</h1>
            <p className="text-gray-600">Manage your team members and their leads</p>
          </div>

          {/* Total Pending Leads Counter */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertCircle size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Pending Leads</p>
              <p className="text-2xl font-bold text-orange-700">{totalPendingLeads}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons and Filter */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
              onClick={() => navigate("/employees/status")}
            >
              <Users size={18} />
              Status
            </button>

            <button
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
              onClick={() => navigate("/employees/add-employee")}
            >
              <User size={18} />
              Add Employee
            </button>
          </div>

          <QuickFilter
            value={quickFilterText}
            onChange={setQuickFilterText}
          />
        </div>

        {/* AG Grid Table */}
        <div className="ag-theme-alpine" style={{ height: 700, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={list}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={100}
            animateRows={true}
            quickFilterText={quickFilterText}
            onRowClicked={(params) => setSelectedRowId(params.data.id)}
            getRowStyle={(params) => {
              if (params.data.id === selectedRowId) {
                return {
                  backgroundColor: '#f0f9ff', 
                  borderLeft: '4px solid #3b82f6',
                  transition: 'background-color 0.3s ease',
                };
              }
              return null;
            }}
          />
        </div>

        {err && <div className="text-red-500">{err}</div>}
      </div>
    </RoleGuard>
  );
}