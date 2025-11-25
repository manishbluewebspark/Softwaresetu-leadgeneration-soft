// import React, { useEffect, useState, useMemo } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import axios from 'axios';
// import { RefreshCw, Users, Clock, Play, Phone, User, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const MyPerformance = () => {
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dateRange, setDateRange] = useState('today');
//   const [timeRange, setTimeRange] = useState(null);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const apiUrl = import.meta.env.VITE_API_URL;

//   // Chart data fetch karna - sirf current user ke liye
//   useEffect(() => {
//     fetchChartData();
//   }, [dateRange, user]);

//   const fetchChartData = async () => {
//     if (!user?.id) return;
    
//     setLoading(true);
//     try {
//       const params = {
//         employee_id: user.id, // Sirf current user ka ID
//         date_range: dateRange
//       };

//       const response = await axios.get(`${apiUrl}/analytics/hourly-calls`, { params });
      
//       if (response.data.success) {
//         setChartData(response.data.data);
//         setTimeRange(response.data.time_range);
//       }
//     } catch (error) {
//       console.error('Error fetching performance data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchChartData();
//   };

//   // Custom tooltip component
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
//           <p className="font-bold">{`Time Range: ${payload[0].payload.time_range}`}</p>
//           <p className="text-blue-600 flex items-center gap-2">
//             <Phone className="w-4 h-4" />
//             {`${payload[0].value} Calls`}
//           </p>
//           <p className="text-xs text-gray-500 mt-1">
//             Based on your status updates
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Calculate summary stats
//   const summaryStats = useMemo(() => {
//     if (chartData.length === 0) return null;
    
//     const totalCalls = chartData.reduce((sum, item) => sum + item.call_count, 0);
//     const peakHour = chartData.reduce((max, item) => 
//       item.call_count > max.call_count ? item : max, 
//       {time_range: '', call_count: 0}
//     );
//     const avgPerHour = chartData.length > 0 ? Math.round(totalCalls / chartData.length) : 0;

//     return { 
//       totalCalls, 
//       peakHour: peakHour.time_range, 
//       peakHourCalls: peakHour.call_count,
//       avgPerHour 
//     };
//   }, [chartData]);

//   // Format time for Indian time display
//   const formatIndianTime = (dateTimeString) => {
//     if (!dateTimeString) return 'N/A';
    
//     const date = new Date(dateTimeString);
//     return date.toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//       timeZone: 'Asia/Kolkata'
//     });
//   };

//   // Format time range for display
//   const formatTimeDisplay = (timeRange) => {
//     if (!timeRange) return 'Loading...';
    
//     const start = timeRange.start_hour;
//     const end = timeRange.end_hour;
    
//     // Convert 24-hour to 12-hour format for Indian time
//     const formatTo12Hour = (time24) => {
//       const [hours, minutes] = time24.split(':');
//       const hour = parseInt(hours);
//       const ampm = hour >= 12 ? 'PM' : 'AM';
//       const hour12 = hour % 12 || 12;
//       return `${hour12}:${minutes} ${ampm}`;
//     };

//     return `${formatTo12Hour(start)} - ${formatTo12Hour(end)}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back
//             </button>
//             <div className="flex items-center gap-3">
//               <User className="w-8 h-8 text-blue-600" />
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">My Performance</h1>
//                 <p className="text-gray-600">Your call activity and performance metrics</p>
//               </div>
//             </div>
//           </div>

//           {/* Refresh Button */}
//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//             {loading ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>

//         {/* User Info Card */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//                 <User className="w-8 h-8 text-blue-600" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
//                 <p className="text-gray-600">{user?.email}</p>
//                 <p className="text-sm text-gray-500">Employee ID: {user?.id}</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-gray-600">Performance Period</p>
//               <select
//                 value={dateRange}
//                 onChange={(e) => setDateRange(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="today">Today</option>
//                 <option value="week">This Week</option>
//                 <option value="month">This Month</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Main Chart Card */}
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           {/* Header with Controls */}
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//             <div className="flex items-center gap-3">
//               <Users className="w-6 h-6 text-blue-600" />
//               <div>
//                 <h2 className="text-xl font-semibold">Your Call Activity</h2>
//                 {timeRange && (
//                   <p className="text-sm text-gray-600 flex items-center gap-1">
//                     <Play className="w-3 h-3" />
//                     Showing your calls from {formatTimeDisplay(timeRange)}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Time Range Info */}
//           {timeRange && (
//             <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//               <div className="flex items-center gap-3">
//                 <Clock className="w-5 h-5 text-blue-600" />
//                 <div>
//                   <p className="font-medium text-blue-800">Your Activity Time Range</p>
//                   <p className="text-sm text-blue-600">
                  
//                     Showing {chartData.length} hours of your call activity
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Chart */}
//           <div className="h-80 w-full">
//             {loading ? (
//               <div className="flex items-center justify-center h-full">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               </div>
//             ) : chartData.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis 
//                     dataKey="hour" 
//                     label={{ 
//                       value: 'Time Slots (HH:00 - HH:00) - IST', 
//                       position: 'insideBottom', 
//                       offset: -5 
//                     }} 
//                   />
//                   <YAxis 
//                     label={{ value: 'Number of Calls', angle: -90, position: 'insideLeft' }} 
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Bar 
//                     dataKey="call_count" 
//                     name="Your Calls" 
//                     fill="#3b82f6" 
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-500">
//                 No call activity data available for the selected period
//               </div>
//             )}
//           </div>

//           {/* Summary Stats */}
//           {summaryStats && summaryStats.totalCalls > 0 && (
//             <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <p className="text-sm text-blue-600">Your Total Calls</p>
//                 <p className="text-2xl font-bold text-blue-800">
//                   {summaryStats.totalCalls}
//                 </p>
//                 <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
//                   <Phone className="w-3 h-3" />
//                   Status updates
//                 </p>
//               </div>
//               <div className="bg-green-50 p-4 rounded-lg">
//                 <p className="text-sm text-green-600">Your Peak Activity</p>
//                 <p className="text-lg font-bold text-green-800">
//                   {summaryStats.peakHour}
//                 </p>
//                 <p className="text-xs text-green-600 mt-1">
//                   {summaryStats.peakHourCalls} calls
//                 </p>
//               </div>
//               <div className="bg-purple-50 p-4 rounded-lg">
//                 <p className="text-sm text-purple-600">Your Avg per Hour</p>
//                 <p className="text-2xl font-bold text-purple-800">
//                   {summaryStats.avgPerHour}
//                 </p>
//               </div>
//               <div className="bg-orange-50 p-4 rounded-lg">
//                 <p className="text-sm text-orange-600">Your Time Coverage</p>
//                 <p className="text-lg font-bold text-orange-800">
//                   {timeRange ? `${timeRange.start_hour} to ${timeRange.end_hour}` : 'N/A'}
//                 </p>
//                 <p className="text-xs text-orange-600 mt-1">
//                   Based on your first update
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Additional Performance Metrics */}
//         {summaryStats && summaryStats.totalCalls > 0 && (
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Productivity Hours</span>
//                   <span className="font-bold">{chartData.filter(item => item.call_count > 0).length} hrs</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Best Performing Hour</span>
//                   <span className="font-bold text-green-600">{summaryStats.peakHour}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Calls per Active Hour</span>
//                   <span className="font-bold">{Math.round(summaryStats.totalCalls / chartData.filter(item => item.call_count > 0).length)}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Active Time Period</span>
//                   <span className="font-bold">{chartData.length} hrs</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Average Calls per Hour</span>
//                   <span className="font-bold">{summaryStats.avgPerHour}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Total Activity</span>
//                   <span className="font-bold text-blue-600">{summaryStats.totalCalls} calls</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyPerformance;

import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { RefreshCw, Users, Clock, Play, Phone, User, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyPerformance = () => {
  const [chartData, setChartData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('today');
  const [timeRange, setTimeRange] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  // Get current user from localStorage for role check
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        
        // Agar user admin nahi hai to automatically uska ID set karo
        if (userData.role !== 'admin') {
          setSelectedEmployee(userData.id.toString());
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Fetch employees - sirf admin ke liye
  useEffect(() => {
    const fetchEmployees = async () => {
      // Sirf admin hi employees list fetch karega
      if (currentUser?.role === 'admin') {
        try {
          const response = await axios.get(`${apiUrl}/analytics/employees`);
          if (response.data.success) {
            setEmployees(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      }
    };
    fetchEmployees();
  }, [currentUser, apiUrl]);

  // Chart data fetch karna
  useEffect(() => {
    fetchChartData();
  }, [dateRange, selectedEmployee, currentUser]);

  const fetchChartData = async () => {
    if (!currentUser) return; // Wait until user data is loaded
    
    setLoading(true);
    try {
      const params = {
        date_range: dateRange
      };

      // Agar current user admin hai to selectedEmployee use karo
      // Agar normal user hai to automatically uska ID bhejo
      if (currentUser.role === 'admin') {
        if (selectedEmployee !== 'all') {
          params.employee_id = selectedEmployee;
        }
      } else {
        // Normal user ke liye automatically uska ID bhejo
        params.employee_id = currentUser.id;
      }

      const response = await axios.get(`${apiUrl}/analytics/hourly-calls`, { params });
      
      if (response.data.success) {
        setChartData(response.data.data);
        setTimeRange(response.data.time_range);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchChartData();
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-bold">{`Time Range: ${payload[0].payload.time_range}`}</p>
          <p className="text-blue-600 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {`${payload[0].value} Calls`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {currentUser?.role === 'admin' ? 'Based on status updates' : 'Based on your status updates'}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (chartData.length === 0) return null;
    
    const totalCalls = chartData.reduce((sum, item) => sum + item.call_count, 0);
    const peakHour = chartData.reduce((max, item) => 
      item.call_count > max.call_count ? item : max, 
      {time_range: '', call_count: 0}
    );
    const avgPerHour = chartData.length > 0 ? Math.round(totalCalls / chartData.length) : 0;

    return { 
      totalCalls, 
      peakHour: peakHour.time_range, 
      peakHourCalls: peakHour.call_count,
      avgPerHour 
    };
  }, [chartData]);

  // Format time for Indian time display
  const formatIndianTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  };

  // Format time range for display
  const formatTimeDisplay = (timeRange) => {
    if (!timeRange) return 'Loading...';
    
    const start = timeRange.start_hour;
    const end = timeRange.end_hour;
    
    // Convert 24-hour to 12-hour format for Indian time
    const formatTo12Hour = (time24) => {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    return `${formatTo12Hour(start)} - ${formatTo12Hour(end)}`;
  };

  const handleReset = () => {
    setDateRange('today');
    // Agar admin hai to employee filter bhi reset karo
    if (currentUser?.role === 'admin') {
      setSelectedEmployee('all');
    }
  };

  // Agar user data load nahi hua hai to loading show karo
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {isAdmin ? 'Performance Analytics' : 'My Performance'}
                </h1>
                <p className="text-gray-600">
                  {isAdmin ? 'Call activity and performance metrics' : 'Your call activity and performance metrics'}
                </p>
              </div>
            </div>
          </div>

          {/* Role Badge */}
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Admin Mode</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                <User className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">My Performance</span>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{currentUser?.name}</h2>
                <p className="text-gray-600">{currentUser?.email}</p>
                <p className="text-sm text-gray-500">
                  {isAdmin ? 'Administrator' : `Employee ID: ${currentUser?.id}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Employee Dropdown - Sirf admin ke liye */}
              {isAdmin && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Select Employee</p>
                  <div className="relative">
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="border rounded px-3 py-2 w-48 appearance-none bg-white cursor-pointer"
                    >
                      <option value="all">All Employees</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                    <User className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Date Range Filter - Sabke liye */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Performance Period</p>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors mt-6"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main Chart Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {/* Header with Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">
                  {isAdmin ? 'Call Activity Analytics' : 'Your Call Activity'}
                </h2>
                {timeRange && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {isAdmin ? 'Showing calls from' : 'Showing your calls from'} {formatTimeDisplay(timeRange)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Time Range Info */}
          {timeRange && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">
                    {isAdmin ? 'Activity Time Range' : 'Your Activity Time Range'}
                  </p>
                  <p className="text-sm text-blue-600">
                    {isAdmin ? (
                      selectedEmployee === 'all' ? (
                        'Showing all employees data'
                      ) : (
                        `Showing data for ${employees.find(e => e.id == selectedEmployee)?.name || 'selected employee'}`
                      )
                    ) : (
                      'Showing your call activity'
                    )}
                    <span className="mx-2">•</span>
                    Showing {chartData.length} hours of call activity
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="h-80 w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    label={{ 
                      value: 'Time Slots (HH:00 - HH:00) - IST', 
                      position: 'insideBottom', 
                      offset: -5 
                    }} 
                  />
                  <YAxis 
                    label={{ value: 'Number of Calls', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="call_count" 
                    name={isAdmin ? 'Calls' : 'Your Calls'} 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {isAdmin ? 'No call activity data available' : 'No call activity data available for your account'}
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {summaryStats && summaryStats.totalCalls > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">
                  {isAdmin ? 'Total Calls' : 'Your Total Calls'}
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {summaryStats.totalCalls}
                </p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Status updates
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">
                  {isAdmin ? 'Peak Activity' : 'Your Peak Activity'}
                </p>
                <p className="text-lg font-bold text-green-800">
                  {summaryStats.peakHour}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {summaryStats.peakHourCalls} calls
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">
                  {isAdmin ? 'Avg per Hour' : 'Your Avg per Hour'}
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  {summaryStats.avgPerHour}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">
                  {isAdmin ? 'Time Coverage' : 'Your Time Coverage'}
                </p>
                <p className="text-lg font-bold text-orange-800">
                  {timeRange ? `${timeRange.start_hour} to ${timeRange.end_hour}` : 'N/A'}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Based on {isAdmin ? 'first update' : 'your first update'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Performance Metrics */}
        {summaryStats && summaryStats.totalCalls > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                {isAdmin ? 'Performance Insights' : 'Your Performance Insights'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Productivity Hours</span>
                  <span className="font-bold">{chartData.filter(item => item.call_count > 0).length} hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best Performing Hour</span>
                  <span className="font-bold text-green-600">{summaryStats.peakHour}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Calls per Active Hour</span>
                  <span className="font-bold">{Math.round(summaryStats.totalCalls / chartData.filter(item => item.call_count > 0).length)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                {isAdmin ? 'Summary' : 'Your Summary'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Time Period</span>
                  <span className="font-bold">{chartData.length} hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Calls per Hour</span>
                  <span className="font-bold">{summaryStats.avgPerHour}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Activity</span>
                  <span className="font-bold text-blue-600">{summaryStats.totalCalls} calls</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPerformance;