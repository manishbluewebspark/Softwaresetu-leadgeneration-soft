// import React, { useState, useEffect, useMemo } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import axios from "axios";
// import { User, Calendar } from "lucide-react";

// export default function DealStatusMonthly() {
//     const [rowData, setRowData] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState("all");
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [loading, setLoading] = useState(false);

//     // Generate years (current year se 5 years piche tak)
//     const years = useMemo(() => {
//         const currentYear = new Date().getFullYear();
//         return Array.from({ length: 6 }, (_, i) => currentYear - i);
//     }, []);

//     // Columns definition - sirf 2 columns
//     const columns = useMemo(() => [
//         {
//             headerName: "MONTH",
//             field: "month",
//             sortable: true,
//             filter: true,
//             width: 200,
//             cellStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' }
//         },
//         {
//             headerName: "TOTAL DEALS",
//             field: "total_deals",
//             sortable: true,
//             filter: true,
//             width: 150,
//             cellStyle: { backgroundColor: '#dcfce7', fontWeight: 'bold' },
//             valueFormatter: (params) => params.value || '0'
//         }
//     ], []);

//     // Fetch users
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const res = await axios.get(`${import.meta.env.VITE_API_URL}/employee/get`);
//                 setUsers(res.data);
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//             }
//         };
//         fetchUsers();
//     }, []);

//     // Fetch deal data
//     useEffect(() => {
//         const fetchDealData = async () => {
//             setLoading(true);
//             try {
//                 const params = {
//                     year: selectedYear
//                 };
                
//                 if (selectedUser !== 'all') {
//                     params.userId = selectedUser;
//                 }

//                 const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers/monthly-deals`, { params });
//                 setRowData(res.data);
//             } catch (error) {
//                 console.error("Error fetching deal data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDealData();
//     }, [selectedUser, selectedYear]);

//     // Calculate total deals
//     const totalDeals = useMemo(() => {
//         return rowData.reduce((sum, item) => sum + (parseInt(item.total_deals) || 0), 0);
//     }, [rowData]);

//     const handleReset = () => {
//         setSelectedUser("all");
//         setSelectedYear(new Date().getFullYear());
//     };

//     return (
//         <div className="p-6 bg-gray-50 shadow-md rounded-lg">
//             <h2 className="text-xl font-bold mb-4">Monthly Deal Status Report</h2>

//             {/* Filters Section */}
//             <div className="flex items-end gap-4 mb-6 flex-wrap">
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
//                                 <option key={user.id} value={user.id}>
//                                     {user.name}
//                                 </option>
//                             ))}
//                         </select>
//                         <User className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
//                     </div>
//                 </div>

//                 {/* Year Dropdown */}
//                 <div>
//                     <label className="block text-sm font-medium mb-1">Select Year</label>
//                     <div className="relative">
//                         <select
//                             value={selectedYear}
//                             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                             className="border rounded px-3 py-2 w-32 appearance-none bg-white cursor-pointer"
//                         >
//                             {years.map((year) => (
//                                 <option key={year} value={year}>
//                                     {year}
//                                 </option>
//                             ))}
//                         </select>
//                         <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
//                     </div>
//                 </div>

//                 {/* Reset Button */}
//                 <button
//                     onClick={handleReset}
//                     className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//                 >
//                     Reset
//                 </button>
//             </div>

//             {/* Summary Stats - Sirf total deals */}
//             {totalDeals > 0 && (
//                 <div className="mb-6">
//                     <div className="bg-green-50 p-4 rounded-lg border border-green-200 inline-block">
//                         <div className="text-sm text-green-600 font-medium">Total Deals ({selectedYear})</div>
//                         <div className="text-2xl font-bold text-green-800">
//                             {totalDeals}
//                         </div>
//                         <div className="text-xs text-green-600 mt-1">
//                             {selectedUser === 'all' ? 'All Users' : `User: ${users.find(u => u.id == selectedUser)?.name}`}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Loading State */}
//             {loading && (
//                 <div className="text-center py-8">
//                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     <p className="mt-2 text-gray-600">Loading deal data...</p>
//                 </div>
//             )}

//             {/* AG Grid */}
//             {!loading && (
//                 <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
//                     <AgGridReact
//                         rowData={rowData}
//                         columnDefs={columns}
//                         pagination={true}
//                         paginationPageSize={12}
//                         defaultColDef={{
//                             resizable: true,
//                             sortable: true,
//                             filter: true
//                         }}
//                     />
//                 </div>
//             )}

//             {/* No Data Message */}
//             {!loading && rowData.length === 0 && (
//                 <div className="text-center py-8 text-gray-500">
//                     No deal data found for the selected criteria
//                 </div>
//             )}
//         </div>
//     );
// }

// import React, { useState, useEffect, useMemo } from "react";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import axios from "axios";
// import { User, Calendar, Shield } from "lucide-react";

// export default function DealStatusMonthly() {
//     const [rowData, setRowData] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState("all");
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [loading, setLoading] = useState(false);
    
//     // Get current user from localStorage
//     const [currentUser, setCurrentUser] = useState(null);

//     // Generate years (current year se 5 years piche tak)
//     const years = useMemo(() => {
//         const currentYear = new Date().getFullYear();
//         return Array.from({ length: 6 }, (_, i) => currentYear - i);
//     }, []);

//     // Columns definition - sirf 2 columns
//     const columns = useMemo(() => [
//         {
//             headerName: "MONTH",
//             field: "month",
//             sortable: true,
//             filter: true,
//             width: 200,
//             cellStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' }
//         },
//         {
//             headerName: "TOTAL DEALS",
//             field: "total_deals",
//             sortable: true,
//             filter: true,
//             width: 150,
//             cellStyle: { backgroundColor: '#dcfce7', fontWeight: 'bold' },
//             valueFormatter: (params) => params.value || '0'
//         }
//     ], []);

//     // Get current user from localStorage on component mount
//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             try {
//                 const userData = JSON.parse(storedUser);
//                 setCurrentUser(userData);
                
//                 // Agar user admin nahi hai to automatically uska ID set karo
//                 if (userData.role !== 'admin') {
//                     setSelectedUser(userData.id.toString());
//                 }
//             } catch (error) {
//                 console.error("Error parsing user data:", error);
//             }
//         }
//     }, []);

//     // Fetch users - sirf admin ke liye
//     useEffect(() => {
//         const fetchUsers = async () => {
//             // Sirf admin hi users list fetch karega
//             if (currentUser?.role === 'admin') {
//                 try {
//                     const res = await axios.get(`${import.meta.env.VITE_API_URL}/employee/get`);
//                     setUsers(res.data);
//                 } catch (error) {
//                     console.error("Error fetching users:", error);
//                 }
//             }
//         };
//         fetchUsers();
//     }, [currentUser]);

//     // Fetch deal data
//     useEffect(() => {
//         const fetchDealData = async () => {
//             if (!currentUser) return; // Wait until user data is loaded
            
//             setLoading(true);
//             try {
//                 const params = {
//                     year: selectedYear
//                 };
                
//                 // Agar current user admin hai to selectedUser use karo
//                 // Agar normal user hai to automatically uska ID bhejo
//                 if (currentUser.role === 'admin') {
//                     if (selectedUser !== 'all') {
//                         params.userId = selectedUser;
//                     }
//                 } else {
//                     // Normal user ke liye automatically uska ID bhejo
//                     params.userId = currentUser.id;
//                 }

//                 const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers/monthly-deals`, { params });
//                 setRowData(res.data);
//             } catch (error) {
//                 console.error("Error fetching deal data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDealData();
//     }, [selectedUser, selectedYear, currentUser]);

//     // Calculate total deals
//     const totalDeals = useMemo(() => {
//         return rowData.reduce((sum, item) => sum + (parseInt(item.total_deals) || 0), 0);
//     }, [rowData]);

//     const handleReset = () => {
//         setSelectedYear(new Date().getFullYear());
//         // Agar admin hai to user filter bhi reset karo
//         if (currentUser?.role === 'admin') {
//             setSelectedUser("all");
//         }
//     };

//     // Agar user data load nahi hua hai to loading show karo
//     if (!currentUser) {
//         return (
//             <div className="p-6 bg-gray-50 shadow-md rounded-lg">
//                 <div className="text-center py-8">
//                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     <p className="mt-2 text-gray-600">Loading user data...</p>
//                 </div>
//             </div>
//         );
//     }

//     const isAdmin = currentUser.role === 'admin';

//     return (
//         <div className="p-6 bg-gray-50 shadow-md rounded-lg">
//             {/* Header with User Info */}
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Monthly Deal Status Report</h2>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                     {isAdmin ? (
//                         <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
//                             <Shield className="w-4 h-4 text-blue-600" />
//                             <span>Admin Mode</span>
//                         </div>
//                     ) : (
//                         <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
//                             <User className="w-4 h-4 text-green-600" />
//                             <span>User Mode</span>
//                         </div>
//                     )}
//                     <span>•</span>
//                     <span>{currentUser.name}</span>
//                 </div>
//             </div>

//             {/* Filters Section */}
//             <div className="flex items-end gap-4 mb-6 flex-wrap">
//                 {/* User Dropdown - Sirf admin ke liye */}
//                 {isAdmin && (
//                     <div>
//                         <label className="block text-sm font-medium mb-1">Select User</label>
//                         <div className="relative">
//                             <select
//                                 value={selectedUser}
//                                 onChange={(e) => setSelectedUser(e.target.value)}
//                                 className="border rounded px-3 py-2 w-48 appearance-none bg-white cursor-pointer"
//                             >
//                                 <option value="all">All Users</option>
//                                 {users.map((user) => (
//                                     <option key={user.id} value={user.id}>
//                                         {user.name}
//                                     </option>
//                                 ))}
//                             </select>
//                             <User className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
//                         </div>
//                     </div>
//                 )}

//                 {/* Year Dropdown - Sabke liye */}
//                 <div>
//                     <label className="block text-sm font-medium mb-1">Select Year</label>
//                     <div className="relative">
//                         <select
//                             value={selectedYear}
//                             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                             className="border rounded px-3 py-2 w-32 appearance-none bg-white cursor-pointer"
//                         >
//                             {years.map((year) => (
//                                 <option key={year} value={year}>
//                                     {year}
//                                 </option>
//                             ))}
//                         </select>
//                         <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
//                     </div>
//                 </div>

//                 {/* Reset Button */}
//                 <button
//                     onClick={handleReset}
//                     className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//                 >
//                     Reset
//                 </button>
//             </div>

//             {/* User Info Card - Normal user ke liye */}
//             {!isAdmin && (
//                 <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                             <User className="w-5 h-5 text-green-600" />
//                         </div>
//                         <div>
//                             <h3 className="font-semibold text-gray-800">{currentUser.name}</h3>
//                             <p className="text-sm text-gray-600">Viewing your deal performance for {selectedYear}</p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Summary Stats - Sirf total deals */}
//             {totalDeals > 0 && (
//                 <div className="mb-6">
//                     <div className="bg-green-50 p-4 rounded-lg border border-green-200 inline-block">
//                         <div className="text-sm text-green-600 font-medium">
//                             {isAdmin ? 'Total Deals' : 'Your Total Deals'} ({selectedYear})
//                         </div>
//                         <div className="text-2xl font-bold text-green-800">
//                             {totalDeals}
//                         </div>
//                         <div className="text-xs text-green-600 mt-1">
//                             {isAdmin ? (
//                                 selectedUser === 'all' ? 'All Users' : `User: ${users.find(u => u.id == selectedUser)?.name}`
//                             ) : (
//                                 `Your Performance`
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Loading State */}
//             {loading && (
//                 <div className="text-center py-8">
//                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                     <p className="mt-2 text-gray-600">Loading deal data...</p>
//                 </div>
//             )}

//             {/* AG Grid */}
//             {!loading && (
//                 <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
//                     <AgGridReact
//                         rowData={rowData}
//                         columnDefs={columns}
//                         pagination={true}
//                         paginationPageSize={12}
//                         defaultColDef={{
//                             resizable: true,
//                             sortable: true,
//                             filter: true
//                         }}
//                     />
//                 </div>
//             )}

//             {/* No Data Message */}
//             {!loading && rowData.length === 0 && (
//                 <div className="text-center py-8 text-gray-500">
//                     {isAdmin ? 'No deal data found for the selected criteria' : 'No deal data found for your account'}
//                 </div>
//             )}
//         </div>
//     );
// }

import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { User, Calendar, Shield, X, Eye } from "lucide-react";

export default function DealStatusMonthly() {
    const [rowData, setRowData] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("all");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMonthData, setSelectedMonthData] = useState(null);
    
    // Get current user from localStorage
    const [currentUser, setCurrentUser] = useState(null);

    // Generate years (current year se 5 years piche tak)
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 6 }, (_, i) => currentYear - i);
    }, []);

    // Columns definition
    const columns = useMemo(() => [
        {
            headerName: "MONTH",
            field: "month",
            sortable: true,
            filter: true,
            width: 200,
            cellStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' }
        },
        {
            headerName: "TOTAL DEALS",
            field: "total_deals",
            sortable: true,
            filter: true,
            width: 180,
            cellStyle: { backgroundColor: '#dcfce7', fontWeight: 'bold' },
            valueFormatter: (params) => params.value || '0',
            cellRenderer: (params) => {
                const count = params.value || 0;
                const hasDeals = count > 0;
                
                return (
                    <div className="flex items-center justify-between">
                        <span>{count}</span>
                        {hasDeals && (
                            <button
                                onClick={() => handleViewLeads(params.data)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm ml-2 px-2 py-0.2 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                            >
                                <Eye className="w-3 h-3" />
                                View Leads
                            </button>
                        )}
                    </div>
                );
            }
        }
    ], []);

    // Get current user from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setCurrentUser(userData);
                
                // Agar user admin nahi hai to automatically uska ID set karo
                if (userData.role !== 'admin') {
                    setSelectedUser(userData.id.toString());
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    // Fetch users - sirf admin ke liye
    useEffect(() => {
        const fetchUsers = async () => {
            // Sirf admin hi users list fetch karega
            if (currentUser?.role === 'admin') {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/employee/get`);
                    setUsers(res.data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            }
        };
        fetchUsers();
    }, [currentUser]);

    // Fetch deal data
    useEffect(() => {
        const fetchDealData = async () => {
            if (!currentUser) return; // Wait until user data is loaded
            
            setLoading(true);
            try {
                const params = {
                    year: selectedYear
                };
                
                // Agar current user admin hai to selectedUser use karo
                // Agar normal user hai to automatically uska ID bhejo
                if (currentUser.role === 'admin') {
                    if (selectedUser !== 'all') {
                        params.userId = selectedUser;
                    }
                } else {
                    // Normal user ke liye automatically uska ID bhejo
                    params.userId = currentUser.id;
                }

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/customers/monthly-deals`, { params });
                setRowData(res.data);
            } catch (error) {
                console.error("Error fetching deal data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDealData();
    }, [selectedUser, selectedYear, currentUser]);

    // Handle view leads button click
    const handleViewLeads = (monthData) => {
        setSelectedMonthData(monthData);
        setModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalOpen(false);
        setSelectedMonthData(null);
    };

    // Calculate total deals
    const totalDeals = useMemo(() => {
        return rowData.reduce((sum, item) => sum + (parseInt(item.total_deals) || 0), 0);
    }, [rowData]);

    const handleReset = () => {
        setSelectedYear(new Date().getFullYear());
        // Agar admin hai to user filter bhi reset karo
        if (currentUser?.role === 'admin') {
            setSelectedUser("all");
        }
    };

    // Agar user data load nahi hua hai to loading show karo
    if (!currentUser) {
        return (
            <div className="p-6 bg-gray-50 shadow-md rounded-lg">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    const isAdmin = currentUser.role === 'admin';

    return (
        <div className="p-6 bg-gray-50 shadow-md rounded-lg">
            {/* Header with User Info */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Monthly Deal Status Report</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    {isAdmin ? (
                        <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span>Admin Mode</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                            <User className="w-4 h-4 text-green-600" />
                            <span>User Mode</span>
                        </div>
                    )}
                    <span>•</span>
                    <span>{currentUser.name}</span>
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex items-end gap-4 mb-6 flex-wrap">
                {/* User Dropdown - Sirf admin ke liye */}
                {isAdmin && (
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
                )}

                {/* Year Dropdown - Sabke liye */}
                <div>
                    <label className="block text-sm font-medium mb-1">Select Year</label>
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="border rounded px-3 py-2 w-32 appearance-none bg-white cursor-pointer"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleReset}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* User Info Card - Normal user ke liye */}
            {!isAdmin && (
                <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{currentUser.name}</h3>
                            <p className="text-sm text-gray-600">Viewing your deal performance for {selectedYear}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats - Sirf total deals */}
            {totalDeals > 0 && (
                <div className="mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 inline-block">
                        <div className="text-sm text-green-600 font-medium">
                            {isAdmin ? 'Total Deals' : 'Your Total Deals'} ({selectedYear})
                        </div>
                        <div className="text-2xl font-bold text-green-800">
                            {totalDeals}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                            {isAdmin ? (
                                selectedUser === 'all' ? 'All Users' : `User: ${users.find(u => u.id == selectedUser)?.name}`
                            ) : (
                                `Your Performance`
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Loading deal data...</p>
                </div>
            )}

            {/* AG Grid */}
            {!loading && (
                <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columns}
                        pagination={true}
                        paginationPageSize={12}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: true
                        }}
                    />
                </div>
            )}

            {/* No Data Message */}
            {!loading && rowData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    {isAdmin ? 'No deal data found for the selected criteria' : 'No deal data found for your account'}
                </div>
            )}

            {/* Leads Modal */}
            {modalOpen && selectedMonthData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Leads for {selectedMonthData.month} {selectedMonthData.year}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Total {selectedMonthData.total_deals} deals found
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {selectedMonthData.leads && selectedMonthData.leads.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedMonthData.leads.map((lead, index) => (
                                        <div key={lead.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Customer Name</label>
                                                    {
                                                        lead.name?<>
                                                         <p className="font-semibold">{lead.name }</p>
                                                        </>:<>
                                                         <p className="font-semibold">N/A</p>
                                                        </>
                                                    }
                                                   
                                                </div>
                                                
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                                    {
                                                        lead.email?<>
                                                    <p className="text-blue-600">{lead.email}</p>
                                                    </>:<>
                                                    <p className="text-blue-600">N/A</p>
                                                    </>}
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Phone</label>
                                                    <p>{lead.mobile || 'N/A'}</p>
                                                </div>
                                               
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Assigned To</label>
                                                    <p>{lead.assigned_user_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Status</label>
                                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                        {lead.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                                    <p className="text-sm">
                                                        {new Date(lead.updated_at).toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-600">First Update</label>
                                                    <p className="text-sm">
                                                        {new Date(lead.created_at).toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No leads found for {selectedMonthData.month} {selectedMonthData.year}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end p-6 border-t bg-gray-50">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}