// import React, { useEffect, useState, forwardRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Calendar } from "lucide-react";
// import QuickFilter from "./QuickFilter";

// // ✅ Custom Input for DatePicker
// const CustomDateInput = forwardRef(({ value, onClick }, ref) => {
//   const displayValue = value || new Date().toLocaleDateString("en-GB");
//   return (
//     <div
//       onClick={onClick}
//       ref={ref}
//       className="flex items-center justify-between border rounded px-2 py-2 w-44 cursor-pointer bg-white"
//     >
//       <span className="text-sm">{displayValue}</span>
//       <Calendar className="w-4 h-4 text-gray-500" />
//     </div>
//   );
// });


// export default function SourceStatus() {
//   const [quickFilterText, setQuickFilterText] = useState("");
//   const [rowData, setRowData] = useState([]);
//   const [columnDefs, setColumnDefs] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [viewMode, setViewMode] = useState("employee"); // "employee" | "source"



//   const apiUrl = import.meta.env.VITE_API_URL;

//   // ✅ Format date for API (YYYY-MM-DD)
//   const formatDateForApi = (date) => {
//     if (!date) return null;
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   // ✅ Fetch Data (Employee-wise or Source-wise)
//   const fetchData = async () => {
//     try {
//       let url = "";

//       if (viewMode === "employee") {
//         url = `${apiUrl}/customers/get-status-employee`;
//         const formattedStart = formatDateForApi(fromDate);
//         const formattedEnd = formatDateForApi(toDate);
//         if (formattedStart && formattedEnd) {
//           url += `?start=${formattedStart}&end=${formattedEnd}`;
//         }
//       } else if (viewMode === "source") {
//         // 👇 New API for Source-wise Daily Status
//         const formattedDate = formatDateForApi(new Date());
//         url = `${apiUrl}/customers/source-status-daily?date=${formattedDate}`;
//       }

//       const res = await axios.get(url);
//       const data = res.data.data || [];

//       // ✅ Add unique rowId to each row
//       const dataWithRowId = data.map((row, index) => ({ ...row, rowId: index }));
//       setRowData(dataWithRowId);

//       // ✅ Create dynamic columns
//       if (data.length > 0) {
//         const keys = Object.keys(data[0]);
//         const hiddenFields =
//           viewMode === "employee" ? ["assigned_to"] : [];

//         const cols = keys.map((key) => {
//           if (hiddenFields.includes(key)) {
//             return {
//               headerName: key.replace(/_/g, " ").toUpperCase(),
//               field: key,
//               hide: true,
//             };
//           }

//           if (key === "month") {
//             return {
//               headerName: "MONTH",
//               field: key,
//               flex: 1,
//               valueFormatter: (p) =>
//                 new Date(p.value).toLocaleString("default", {
//                   month: "long",
//                   year: "numeric",
//                 }),
//             };
//           }

//           if (key === "date") {
//             return {
//               headerName: "DATE",
//               field: key,
//               flex: 1,
//               valueFormatter: (p) =>
//                 new Date(p.value).toLocaleDateString("en-GB"),
//             };
//           }

//           return {
//             headerName: key.replace(/_/g, " ").toUpperCase(),
//             field: key,
//             flex: 1,
//             minWidth: 160,
//           };
//         });

//         setColumnDefs(cols);
//       } else {
//         setColumnDefs([]);
//       }
//     } catch (error) {
//       console.error("Error fetching customer status:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [fromDate, toDate, viewMode]);

//   return (
//     <div className="p-6 bg-gray-50 shadow-md rounded-lg relative">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">
//           {viewMode === "employee"
//             ? "Customer Status (Employee Wise)"
//             : "Customer Status (Source Wise)"}
//         </h2>

//         {/* 🔀 Toggle Button for View Mode */}
//         <div className="flex gap-2">
//           <button
//             className={`px-4 py-2 rounded ${
//               viewMode === "employee"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//             onClick={() => setViewMode("employee")}
//           >
//             Employee Wise
//           </button>
//           <button
//             className={`px-4 py-2 rounded ${
//               viewMode === "source"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//             onClick={() => setViewMode("source")}
//           >
//             Source Wise (Daily)
//           </button>
//         </div>
//       </div>

//       {/* ✅ Date Pickers (only visible for employee view) */}
//       {viewMode === "employee" && (
//         <div className="flex justify-between items-end gap-4 mb-4">
//           <div className="flex items-end gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium">From Date</label>
//               <DatePicker
//                 selected={fromDate}
//                 onChange={(date) => setFromDate(date)}
//                 customInput={<CustomDateInput />}
//                 dateFormat="dd-MM-yyyy"
//                 popperPlacement="bottom-start"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium">To Date</label>
//               <DatePicker
//                 selected={toDate}
//                 onChange={(date) => setToDate(date)}
//                 customInput={<CustomDateInput />}
//                 dateFormat="dd-MM-yyyy"
//                 popperPlacement="bottom-start"
//               />
//             </div>

//             <button
//               onClick={() => {
//                 setFromDate(new Date());
//                 setToDate(new Date());
//               }}
//               className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
//             >
//               Reset
//             </button>
//           </div>

//           <div className="flex items-end gap-4 mb-4">
//             <QuickFilter value={quickFilterText} onChange={setQuickFilterText} />
//           </div>
//         </div>
//       )}

//       {/* ✅ AG Grid */}
//       <div className="ag-theme-alpine" style={{ height: 625 }}>
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           pagination
//           paginationPageSize={100}
//           defaultColDef={{
//             sortable: true,
//             filter: true,
//             resizable: true,
//             minWidth: 180,
//             flex: 1,
//           }}
//           suppressHorizontalScroll={false}
//           quickFilterText={quickFilterText}
//           onRowClicked={(params) => setSelectedRowId(params.data.rowId)}
//           getRowStyle={(params) => {
//             if (params.data.rowId === selectedRowId) {
//               return {
//                 backgroundColor: "#c4c4c4",
//                 borderLeft: "4px solid #22c55e",
//                 transition: "background-color 0.3s ease",
//               };
//             }
//             return null;
//           }}
//         />
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState, forwardRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import QuickFilter from "./QuickFilter";

// ✅ Custom Input for DatePicker
const CustomDateInput = forwardRef(({ value, onClick }, ref) => {
  const displayValue = value || new Date().toLocaleDateString("en-GB");
  return (
    <div
      onClick={onClick}
      ref={ref}
      className="flex items-center justify-between border rounded px-2 py-2 w-44 cursor-pointer bg-white"
    >
      <span className="text-sm">{displayValue}</span>
      <Calendar className="w-4 h-4 text-gray-500" />
    </div>
  );
});

export default function SourceStatus() {
  const [quickFilterText, setQuickFilterText] = useState("");
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [viewMode, setViewMode] = useState("employee"); // "employee" | "source"

  const apiUrl = import.meta.env.VITE_API_URL;

  // ✅ Format date for API (YYYY-MM-DD)
  const formatDateForApi = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ✅ Fetch Data
  const fetchData = async () => {
    try {
      let url = "";

      if (viewMode === "employee") {
        // Employee Wise
        const formattedStart = formatDateForApi(fromDate);
        const formattedEnd = formatDateForApi(toDate);
        url = `${apiUrl}/customers/get-status-employee?start=${formattedStart}&end=${formattedEnd}`;
      } else {
        // Source Wise (Daily)
        const formattedDate = formatDateForApi(new Date());
        url = `${apiUrl}/customers/source-status-daily?date=${formattedDate}`;
      }

      const res = await axios.get(url);
      let data = res.data?.data || [];

      // ✅ Ensure data is array
      if (!Array.isArray(data)) {
        console.warn("Unexpected API response:", data);
        data = [];
      }

      // ✅ Add Row IDs
      const dataWithRowId = data.map((row, index) => ({
        ...row,
        rowId: index,
      }));

      setRowData(dataWithRowId);

      // ✅ Auto-generate columns dynamically
      // if (dataWithRowId.length > 0) {
      //   const keys = Object.keys(dataWithRowId[0]);
      //   const cols = keys.map((key) => ({
      //     headerName: key.replace(/_/g, " ").toUpperCase(),
      //     field: key,
      //     flex: 1,
      //     minWidth: 160,
      //     cellStyle: { textAlign: "center" },
      //   }));
      //   setColumnDefs(cols);
      // } else {
      //   setColumnDefs([]);
      // }
      if (dataWithRowId.length > 0) {
        const keys = Object.keys(dataWithRowId[0]).filter((key) => key !== "rowId");

        const cols = keys.map((key) => ({
          headerName: key.replace(/_/g, " ").toUpperCase(),
          field: key,
          flex: 1,
          minWidth: 110,
          cellStyle: { textAlign: "center" },
        }));

        setColumnDefs(cols);
      } else {
        setColumnDefs([]);
      }

    } catch (err) {
      console.error("Error fetching customer status:", err);
    }
  };

  // ✅ Refetch whenever filters or mode change
  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, viewMode]);

  return (
    <div className="p-6 bg-gray-50 shadow-md rounded-lg relative">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {viewMode === "employee"
            ? "Customer Status (Employee Wise)"
            : "Customer Status (Source Wise - Daily)"}
        </h2>

        {/* 🔀 Toggle Button */}
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${viewMode === "employee"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setViewMode("employee")}
          >
            Employee Wise
          </button>
          <button
            className={`px-4 py-2 rounded ${viewMode === "source"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
            onClick={() => setViewMode("source")}
          >
            Source Wise
          </button>
        </div>
      </div>

      {/* 🔹 Filters */}
      <div className="flex justify-between items-end gap-4 mb-4">
        {/* Date Filters (only for employee view) */}
        {viewMode === "employee" && (
          <div className="flex items-end gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">From Date</label>
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                customInput={<CustomDateInput />}
                dateFormat="dd-MM-yyyy"
                popperPlacement="bottom-start"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">To Date</label>
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                customInput={<CustomDateInput />}
                dateFormat="dd-MM-yyyy"
                popperPlacement="bottom-start"
              />
            </div>

            <button
              onClick={() => {
                setFromDate(new Date());
                setToDate(new Date());
              }}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        )}

        {/* Search Filter */}
        <div className="flex items-end gap-4 mb-4">
          <QuickFilter value={quickFilterText} onChange={setQuickFilterText} />
        </div>
      </div>

      {/* 🔹 AG Grid */}
      <div className="ag-theme-alpine" style={{ height: 625 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={100}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            minWidth: 180,
            flex: 1,
          }}
          suppressHorizontalScroll={false}
          quickFilterText={quickFilterText}
          onRowClicked={(params) => setSelectedRowId(params.data.rowId)}
          getRowStyle={(params) =>
            params.data.rowId === selectedRowId
              ? {
                backgroundColor: "#c4c4c4",
                borderLeft: "4px solid #22c55e",
                transition: "background-color 0.3s ease",
              }
              : null
          }
        />
      </div>
    </div>
  );
}
