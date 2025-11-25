// import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import axios from "axios";

// import { ModuleRegistry } from "ag-grid-community";
// import { MasterDetailModule } from "ag-grid-enterprise";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Calendar, User } from "lucide-react";

// ModuleRegistry.registerModules([MasterDetailModule]);

// // ✅ Custom Input for DatePicker
// const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
//     <div
//         onClick={onClick}
//         ref={ref}
//         className="flex items-center justify-between border rounded px-2 py-2 w-40 cursor-pointer bg-white"
//     >
//         <span className="text-sm">{value || placeholder}</span>
//         <Calendar className="w-4 h-4 text-gray-500" />
//     </div>
// ));

// export default function UserWiseDemoFollow() {
//     const [rowData, setRowData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);

//     const today = new Date();
//     const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
//     const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);


//     const [fromDate, setFromDate] = useState(firstDay);
//     const [toDate, setToDate] = useState(lastDay);

//     const [selectedRowId, setSelectedRowId] = useState(null);
//     const [users, setUsers] = useState([
//         { user_id: '6', employee_name: 'Goutam Dhangar' },
//         { user_id: '7', employee_name: 'Sneha Tiwari' },
//     ]);
//     const [selectedUser, setSelectedUser] = useState("all");
//     const [loading, setLoading] = useState(false);

//     const gridRef = useRef(null);

//     const columns = [
//         {
//             headerName: "DATE",
//             field: "demo_date",
//             sortable: true,
//             filter: true,
//             valueFormatter: (params) => {
//                 if (!params.value) return "";
//                 const date = new Date(params.value);
//                 const day = String(date.getDate()).padStart(2, "0");
//                 const month = String(date.getMonth() + 1).padStart(2, "0");
//                 const year = date.getFullYear();
//                 return `${day}-${month}-${year}`;
//             },
//         },
//         {
//             headerName: "TOTAL DEMOS",
//             field: "total_demos",
//             sortable: true,
//             filter: true,
//             cellStyle: { backgroundColor: '#f0f9ff' }
//         },
//         {
//             headerName: "TOTAL FOLLOW UPS",
//             field: "total_followups",
//             sortable: true,
//             filter: true,
//             cellStyle: { backgroundColor: '#f0fdf4' }
//         },
//         {
//             headerName: "TOTAL",
//             field: "total_all",
//             sortable: true,
//             filter: true,
//             cellStyle: { backgroundColor: '#fefce8', fontWeight: 'bold' }
//         },
//     ];

//     const detailColumns = [
//         { headerName: "NAME", field: "name" },
//         { headerName: "MOBILE", field: "mobile" },
//         { headerName: "EMPLOYEE", field: "employee_name" },
//         { headerName: "STATUS", field: "status" },
//         {
//             headerName: "FOLLOWUP DATE/TIME",
//             field: "followup_datetime",
//             valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString() : ""),
//         },
//     ];

//     // Fetch users on component mount
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers/users`);
//                 setUsers(res.data);
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//             }
//         };

//         fetchUsers();
//     }, []);

//     // Fetch data based on selected user
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const params = {};
//                 if (selectedUser !== 'all') {
//                     params.userId = selectedUser;
//                 }

//                 const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers/daily-demos-user`, {
//                     params
//                 });
                

//                 // ✅ Process data to add totals
//                 const processedData = res.data.map((item, index) => {
//                     // Calculate totals from demo_data
//                     const demoData = item.demo_data || [];
//                     const totalDemos = demoData.filter(d => d.status === 'Demo').length;
//                     const totalFollowups = demoData.filter(d => d.status === 'Follow Up').length;
//                     const totalAll = totalDemos + totalFollowups;

//                     return {
//                         ...item,
//                         rowId: index,
//                         total_demos: totalDemos,
//                         total_followups: totalFollowups,
//                         total_all: totalAll
//                     };
//                 });

//                 setRowData(processedData);

//                 // Apply date filter
//                 const today = new Date().toISOString().split("T")[0];
//                 const todayData = processedData.filter((item) => item.demo_date === today);
//                 setFilteredData(todayData);
//             } catch (error) {
//                 console.error("Error fetching daily demos:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [selectedUser]);

//     // Apply date filtering
//     useEffect(() => {
//         if (!fromDate && !toDate) {
//             const today = new Date().toISOString().split("T")[0];
//             const todayData = rowData.filter((item) => item.demo_date === today);
//             setFilteredData(todayData);
//         } else {
//             const filtered = rowData.filter((item) => {
//                 const itemDate = new Date(item.demo_date);
//                 const start = fromDate ? new Date(fromDate) : null;
//                 const end = toDate ? new Date(toDate) : null;

//                 if (start) start.setHours(0, 0, 0, 0);
//                 if (end) end.setHours(23, 59, 59, 999);

//                 if (start && end) return itemDate >= start && itemDate <= end;
//                 if (start) return itemDate >= start;
//                 if (end) return itemDate <= end;
//                 return true;
//             });
//             setFilteredData(filtered);
//         }
//     }, [fromDate, toDate, rowData]);

//     const detailCellRendererParams = useMemo(() => {
//         return {
//             detailGridOptions: {
//                 columnDefs: detailColumns,
//                 defaultColDef: { flex: 1, resizable: true },
//                 pagination: true,
//                 paginationPageSize: 5,
//             },
//             getDetailRowData: (params) => {
//                 params.successCallback(params.data.demo_data || []);
//             },
//         };
//     }, []);

//     // const handleReset = () => {
//     //     setFromDate(new Date());
//     //     setToDate(new Date());
//     //     setSelectedUser("all");
//     // };

//     const handleReset = () => {
//   const today = new Date();
//   const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
//   const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//   setFromDate(firstDay);
//   setToDate(lastDay);
//   setSelectedUser("all");
// };

//     return (
//         <div className="p-6 bg-gray-50 shadow-md rounded-lg">
//             <h2 className="text-xl font-bold mb-4">User Wise Demo & Follow Up Status</h2>

//             {/* Filters Section */}
//             <div className="flex items-end gap-4 mb-4 flex-wrap">
//                 {/* User Dropdown */}
//                 <div>
//                     <label className="block text-sm font-medium mb-1">Select User</label>
//                     <div className="relative">
//                         <select
//                             value={selectedUser}
//                             onChange={(e) => setSelectedUser(e.target.value)}
//                             className="border rounded px-3 py-2 w-48 appearance-none bg-white cursor-pointer"
//                         >
//                             <option value="all">All Users</option>
//                             {users.map((user) => (
//                                 <option key={user.user_id} value={user.user_id}>
//                                     {user.employee_name}
//                                 </option>
//                             ))}
//                         </select>
//                         <User className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
//                     </div>
//                 </div>

//                 {/* Date Filters */}
//                 <div>
//                     <label className="block text-sm font-medium">From Date</label>
//                     <DatePicker
//                         selected={fromDate}
//                         onChange={(date) => setFromDate(date)}
//                         customInput={<CustomDateInput placeholder="Select date" />}
//                         dateFormat="dd-MM-yyyy"
//                         popperPlacement="bottom-start"
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium">To Date</label>
//                     <DatePicker
//                         selected={toDate}
//                         onChange={(date) => setToDate(date)}
//                         customInput={<CustomDateInput placeholder="Select date" />}
//                         dateFormat="dd-MM-yyyy"
//                         popperPlacement="bottom-start"
//                     />
//                 </div>

//                 {/* Reset Button */}
//                 <button
//                     onClick={handleReset}
//                     className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//                 >
//                     Reset
//                 </button>
//             </div>

//             {/* Loading State */}
//             {loading && (
//                 <div className="text-center py-4">
//                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     <p className="mt-2 text-gray-600">Loading data...</p>
//                 </div>
//             )}

//             {/* AG Grid */}
//             <div className="ag-theme-alpine" style={{ height: 650, width: "100%" }}>
//                 <AgGridReact
//                     ref={gridRef}
//                     rowData={filteredData}
//                     columnDefs={columns}
//                     masterDetail={true}
//                     detailCellRendererParams={detailCellRendererParams}
//                     pagination={true}
//                     paginationPageSize={100}
//                     onRowClicked={(params) => {
//                         // Expand/collapse row
//                         params.node.setExpanded(!params.node.expanded);

//                         // ✅ Highlight only clicked row
//                         setSelectedRowId(params.data.rowId);
//                     }}
//                     getRowStyle={(params) => {
//                         if (params.data.rowId === selectedRowId) {
//                             return {
//                                 backgroundColor: "#c4c4c4",
//                                 borderLeft: "4px solid #22c55e",
//                                 transition: "background-color 0.3s ease",
//                             };
//                         }
//                         return null;
//                     }}
//                 />
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect, useMemo, useRef, forwardRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";

import { ModuleRegistry } from "ag-grid-community";
import { MasterDetailModule } from "ag-grid-enterprise";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, User } from "lucide-react";

ModuleRegistry.registerModules([MasterDetailModule]);

// ✅ Custom Input for DatePicker
const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div
        onClick={onClick}
        ref={ref}
        className="flex items-center justify-between border rounded px-2 py-2 w-40 cursor-pointer bg-white"
    >
        <span className="text-sm">{value || placeholder}</span>
        <Calendar className="w-4 h-4 text-gray-500" />
    </div>
));

export default function UserWiseDemoFollow() {
    const [rowData, setRowData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [fromDate, setFromDate] = useState(firstDay);
    const [toDate, setToDate] = useState(lastDay);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [users, setUsers] = useState([
        { user_id: '6', employee_name: 'Goutam Dhangar' },
        { user_id: '7', employee_name: 'Sneha Tiwari' },
    ]);
    const [selectedUser, setSelectedUser] = useState("all");
    const [loading, setLoading] = useState(false);

    console.log(selectedUser,'selectedUser..')


    const gridRef = useRef(null);

    const columns = [
        {
            headerName: "DATE",
            field: "demo_date",
            sortable: true,
            filter: true,
            valueFormatter: (params) => {
                if (!params.value) return "";
                const date = new Date(params.value);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            },
        },
        {
            headerName: "TOTAL DEMOS",
            field: "total_demos",
            sortable: true,
            filter: true,
            cellStyle: { backgroundColor: '#f0f9ff' },
            valueFormatter: (params) => params.value || '0'
        },
        {
            headerName: "TOTAL FOLLOW UPS",
            field: "total_followups",
            sortable: true,
            filter: true,
            cellStyle: { backgroundColor: '#f0fdf4' },
            valueFormatter: (params) => params.value || '0'
        },
        // {
        //     headerName: "TOTAL",
        //     field: "total_all",
        //     sortable: true,
        //     filter: true,
        //     cellStyle: { backgroundColor: '#fefce8', fontWeight: 'bold' },
        //     valueFormatter: (params) => params.value || '0'
        // },
        {
            headerName: "TOTAL WORKED",
            field: "total_worked",
            sortable: true,
            filter: true,
            cellStyle: { backgroundColor: '#fef2f2' },
            valueFormatter: (params) => params.value || '0'
        },
    ];

    const detailColumns = [
        { headerName: "NAME", field: "name" },
        { headerName: "MOBILE", field: "mobile" },
        { headerName: "EMPLOYEE", field: "employee_name" },
        { headerName: "STATUS", field: "status" },
        {
            headerName: "FOLLOWUP DATE/TIME",
            field: "followup_datetime",
            valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString() : ""),
        },
    ];

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/employee/get`);
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    

    // Fetch data based on selected user
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = {};
                if (selectedUser !== 'all') {
                    params.userId = selectedUser;
                }

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers/daily-demos-user`, {
                    params
                });

                console.log("API Response:", res.data); // Debugging ke liye

                // ✅ Directly use the data from backend (no need to process)
                const processedData = res.data.map((item, index) => ({
                    ...item,
                    rowId: index,
                    // Convert string numbers to numbers for proper sorting
                    total_demos: parseInt(item.total_demos) || 0,
                    total_followups: parseInt(item.total_followups) || 0,
                    total_all: parseInt(item.total_all) || 0,
                    total_worked: parseInt(item.total_worked) || 0,
                }));

                setRowData(processedData);
                setFilteredData(processedData); // Initially show all data

            } catch (error) {
                console.error("Error fetching daily demos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedUser]);

    // Apply date filtering
    useEffect(() => {
        if (rowData.length === 0) return;

        if (!fromDate && !toDate) {
            // If no dates selected, show all data
            setFilteredData(rowData);
        } else {
            const filtered = rowData.filter((item) => {
                if (!item.demo_date) return false;
                
                const itemDate = new Date(item.demo_date);
                const start = fromDate ? new Date(fromDate) : null;
                const end = toDate ? new Date(toDate) : null;

                if (start) start.setHours(0, 0, 0, 0);
                if (end) end.setHours(23, 59, 59, 999);

                if (start && end) return itemDate >= start && itemDate <= end;
                if (start) return itemDate >= start;
                if (end) return itemDate <= end;
                return true;
            });
            setFilteredData(filtered);
        }
    }, [fromDate, toDate, rowData]);

    const detailCellRendererParams = useMemo(() => {
        return {
            detailGridOptions: {
                columnDefs: detailColumns,
                defaultColDef: { flex: 1, resizable: true },
                pagination: true,
                paginationPageSize: 5,
            },
            getDetailRowData: (params) => {
                // Agar demo_data nahi hai toh empty array bhejo
                params.successCallback(params.data.demo_data || []);
            },
        };
    }, []);

    const handleReset = () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        setFromDate(firstDay);
        setToDate(lastDay);
        setSelectedUser("all");
    };


    return (
        <div className="p-6 bg-gray-50 shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">User Wise Demo & Follow Up Status</h2>

            {/* Filters Section */}
            <div className="flex items-end gap-4 mb-4 flex-wrap">
                {/* User Dropdown */}
                <div>
                    <label className="block text-sm font-medium mb-1">Select User</label>
                    <div className="relative">
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="border rounded px-3 py-2 w-48 appearance-none bg-white cursor-pointer"
                        >
                            <option value="all">All Users</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <User className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* Date Filters */}
                <div>
                    <label className="block text-sm font-medium">From Date</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        customInput={<CustomDateInput placeholder="Select date" />}
                        dateFormat="dd-MM-yyyy"
                        popperPlacement="bottom-start"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">To Date</label>
                    <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        customInput={<CustomDateInput placeholder="Select date" />}
                        dateFormat="dd-MM-yyyy"
                        popperPlacement="bottom-start"
                    />
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleReset}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Summary Stats */}
            {filteredData.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded border">
                        <div className="text-sm text-blue-600">Total Demos</div>
                        <div className="text-xl font-bold">
                            {filteredData.reduce((sum, item) => sum + (parseInt(item.total_demos) || 0), 0)}
                        </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded border">
                        <div className="text-sm text-green-600">Total Follow Ups</div>
                        <div className="text-xl font-bold">
                            {filteredData.reduce((sum, item) => sum + (parseInt(item.total_followups) || 0), 0)}
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded border">
                        <div className="text-sm text-yellow-600">Total All</div>
                        <div className="text-xl font-bold">
                            {filteredData.reduce((sum, item) => sum + (parseInt(item.total_all) || 0), 0)}
                        </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded border">
                        <div className="text-sm text-red-600">Total Worked</div>
                        <div className="text-xl font-bold">
                            {filteredData.reduce((sum, item) => sum + (parseInt(item.total_worked) || 0), 0)}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading data...</p>
                </div>
            )}

            {/* AG Grid */}
            <div className="ag-theme-alpine" style={{ height: 650, width: "100%" }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={filteredData}
                    columnDefs={columns}
                    masterDetail={true}
                    detailCellRendererParams={detailCellRendererParams}
                    pagination={true}
                    paginationPageSize={100}
                    // onRowClicked={(params) => {
                    //     // Expand/collapse row
                    //     params.node.setExpanded(!params.node.expanded);

                    //     // ✅ Highlight only clicked row
                    //     setSelectedRowId(params.data.rowId);
                    // }}
                    getRowStyle={(params) => {
                        if (params.data.rowId === selectedRowId) {
                            return {
                                backgroundColor: "#c4c4c4",
                                borderLeft: "4px solid #22c55e",
                                transition: "background-color 0.3s ease",
                            };
                        }
                        return null;
                    }}
                />
            </div>
        </div>
    );
}