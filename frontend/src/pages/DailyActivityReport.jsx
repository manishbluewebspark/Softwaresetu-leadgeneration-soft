
// import React, { useEffect, useState } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import axios from "axios";
// import QuickFilter from "./QuickFilter";

// export default function CustomerStatus() {
//   const [quickFilterText, setQuickFilterText] = useState("");
//   const [rowData, setRowData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [selectedRowId, setSelectedRowId] = useState(null);

//   console.log(rowData, 'rowData...')

//   // Fetch data
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const res = await axios.get(`${apiUrl}/customers/get-status-employee-current`);
//   //       const data = res.data.data || [];
//   //       setRowData(data);


//   //       if (data.length > 0) {
//   //         const hiddenFields = ["assigned_to", "Pending"];

//   //         const dynamicCols = Object.keys(data[0])
//   //           .filter((key) => !hiddenFields.includes(key))
//   //           .map((key) => {
//   //             if (key === "date") {
//   //               return {
//   //                 headerName: "DATE",
//   //                 field: key,
//   //                 flex: 1,
//   //                 valueFormatter: (p) =>
//   //                   p.value ? new Date(p.value).toLocaleString() : "-"
//   //               };
//   //             }



//   //             if (key === "employee") {
//   //               return {
//   //                 headerName: "EMPLOYEE",
//   //                 field: key,
//   //                 flex: 4,
//   //                 valueFormatter: (params) =>
//   //                   params.value ? String(params.value).toUpperCase() : "",
//   //               };
//   //             }

//   //             if (key === "total_lead") {
//   //               return {
//   //                 headerName: "TOTAL LEAD",
//   //                 field: key,

//   //                 valueFormatter: (params) =>
//   //                   params.value ? String(params.value).toUpperCase() : "",
//   //               };
//   //             }


//   //             if (key === "total_pending") {
//   //               return {
//   //                 headerName: "TOTAL PENDING",
//   //                 field: key,

//   //                 valueFormatter: (params) =>
//   //                   params.value ? String(params.value).toUpperCase() : "",
//   //               };
//   //             }


//   //             return {
//   //               headerName: key.replace(/_/g, " ").toUpperCase(),
//   //               field: key,
//   //               flex: 1,
//   //             };
//   //           });

//   //         setColumns(dynamicCols);
//   //       } else {
//   //         setColumns([]); // reset columns agar data empty h
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching customer status:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${apiUrl}/customers/get-status-employee-current`);
//         const data = res.data.data || [];
//         setRowData(data);

//         if (data.length > 0) {
//           const hiddenFields = ["assigned_to", "Pending", "date"];

//           // yaha define karo kis column ko kis order me dikhana hai
//           const preferredOrder = ["employee", "date", "total_today", "total_pending", "total_lead", 'Follow_Up'];

//           const dynamicCols = Object.keys(data[0])
//             .filter((key) => !hiddenFields.includes(key))
//             .map((key) => {
//               if (key === "date") {
//                 return {
//                   headerName: "DATE",
//                   field: key,
//                   flex: 1,
//                   valueFormatter: (p) =>
//                     p.value ? new Date(p.value).toLocaleString() : "-",
//                 };
//               }

//               if (key === "employee") {
//                 return {
//                   headerName: "EMPLOYEE",
//                   field: key,
//                   width: 900,
//                   minWidth: 600,
//                   valueFormatter: (params) =>
//                     params.value ? String(params.value).toUpperCase() : "",
//                 };
//               }

//               if (key === "total_lead") {
//                 return {
//                   headerName: "TOTAL LEAD",
//                   field: key,
//                   valueFormatter: (params) =>
//                     params.value ? String(params.value).toUpperCase() : "",
//                 };
//               }

//               if (key === "total_today") {
//                 return {
//                   headerName: "WORKING TODAY",
//                   field: key,
//                   valueFormatter: (params) =>
//                     params.value ? String(params.value).toUpperCase() : "",
//                 };
//               }


//               if (key === "total_pending") {
//                 return {
//                   headerName: "TOTAL PENDING",
//                   field: key,
//                   valueFormatter: (params) =>
//                     params.value ? String(params.value).toUpperCase() : "",
//                 };
//               }

//               return {
//                 headerName: key.replace(/_/g, " ").toUpperCase(),
//                 field: key,
//                 flex: 1,
//               };
//             });


//           const orderedCols = [
//             ...preferredOrder
//               .map((col) => dynamicCols.find((c) => c.field === col))
//               .filter(Boolean),
//             ...dynamicCols.filter((c) => !preferredOrder.includes(c.field)),
//           ];

//           setColumns(orderedCols);
//         } else {
//           setColumns([]); // reset columns agar data empty h
//         }
//       } catch (error) {
//         console.error("Error fetching customer status:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);



//   return (
//     <div className="p-6 bg-gray-50 shadow-md rounded-lg">

//       <div className="flex justify-between p-4">
//         <h2 className="text-xl font-bold mb-4">
//           Daily Activity Report (
//           {" "}
//           {new Date().toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })}
//           {" "}
//           )

//         </h2>


//         <QuickFilter
//           value={quickFilterText}
//           onChange={setQuickFilterText}
//         />



//       </div>


//       {loading ? (
//         <p className="text-gray-600">Loading data...</p>
//       ) : rowData.length === 0 ? (
//         <p className=" font-medium">No data available 🚫</p>
//       ) : (
//         <div className="ag-theme-alpine" style={{ height: 692 }}>
//           <AgGridReact
//             rowData={rowData}
//             columnDefs={columns}
//             pagination={true}
//             paginationPageSize={100}
//             defaultColDef={{ sortable: true, filter: true, resizable: true, minWidth: 180, flex: 1 }}
//             suppressHorizontalScroll={false}

//             quickFilterText={quickFilterText}
//             onRowClicked={(params) => setSelectedRowId(params.data.rawId)}
//             getRowStyle={(params) => {
//               if (params.data.id === selectedRowId) {
//                 return {
//                   backgroundColor: '#c4c4c4',
//                   borderLeft: '4px solid #22c55e',
//                   transition: 'background-color 0.3s ease',
//                 };
//               }
//               return null;
//             }}

//           />
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import QuickFilter from "./QuickFilter";

export default function CustomerStatus() {
  const [quickFilterText, setQuickFilterText] = useState("");
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selectedRowId, setSelectedRowId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'))
  console.log(user, 'user...')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/customers/get-status-employee-current`);
        let data = res.data.data || [];

        // ✅ Add unique rowId to each row
        data = data.map((item, index) => ({ ...item, rowId: index }));

  

        if(user.role==="employee")
        {
      
          const useractivity =data.filter((val)=>val.assigned_to ===user.id)
          setRowData(useractivity);
        }
        else
        {
        setRowData(data);
        }


        if (data.length > 0) {
          const hiddenFields = ["assigned_to", "Pending", "date"];

          const preferredOrder = ["employee", "date", "total_today", "total_pending", "total_lead", 'Follow_Up'];

          const dynamicCols = Object.keys(data[0])
            .filter((key) => !hiddenFields.includes(key))
            .map((key) => {
              if (key === "date") {
                return {
                  headerName: "DATE",
                  field: key,
                  flex: 1,
                  valueFormatter: (p) => p.value ? new Date(p.value).toLocaleString() : "-",
                };
              }

              if (key === "employee") {
                return {
                  headerName: "EMPLOYEE",
                  field: key,
                  width: 900,
                  minWidth: 600,
                  valueFormatter: (params) => params.value ? String(params.value).toUpperCase() : "",
                };
              }

              if (key === "total_lead") {
                return {
                  headerName: "TOTAL LEAD",
                  field: key,
                  valueFormatter: (params) => params.value ? String(params.value).toUpperCase() : "",
                };
              }

              if (key === "total_today") {
                return {
                  headerName: "WORKING TODAY",
                  field: key,
                  valueFormatter: (params) => params.value ? String(params.value).toUpperCase() : "",
                };
              }

              if (key === "total_pending") {
                return {
                  headerName: "TOTAL PENDING",
                  field: key,
                  valueFormatter: (params) => params.value ? String(params.value).toUpperCase() : "",
                };
              }

              return {
                headerName: key.replace(/_/g, " ").toUpperCase(),
                field: key,
                flex: 1,
              };
            });

          const orderedCols = [
            ...preferredOrder
              .map((col) => dynamicCols.find((c) => c.field === col))
              .filter(Boolean),
            ...dynamicCols.filter((c) => !preferredOrder.includes(c.field)),
          ];

          setColumns(orderedCols);
        } else {
          setColumns([]);
        }
      } catch (error) {
        console.error("Error fetching customer status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 shadow-md rounded-lg">
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-bold mb-4">
          Daily Activity Report (
          {new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          )
        </h2>
        <QuickFilter value={quickFilterText} onChange={setQuickFilterText} />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading data...</p>
      ) : rowData.length === 0 ? (
        <p className=" font-medium">No data available 🚫</p>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 725 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={100}
            defaultColDef={{ sortable: true, filter: true, resizable: true, minWidth: 180, flex: 1 }}
            suppressHorizontalScroll={false}
            quickFilterText={quickFilterText}

            // ✅ Use rowId for selection
            onRowClicked={(params) => setSelectedRowId(params.data.rowId)}
            getRowStyle={(params) => {
              if (params.data.rowId === selectedRowId) {
                return {
                  backgroundColor: '#c4c4c4',
                  borderLeft: '4px solid #22c55e',
                  transition: 'background-color 0.3s ease',
                };
              }
              return null;
            }}
          />
        </div>
      )}
    </div>
  );
}
