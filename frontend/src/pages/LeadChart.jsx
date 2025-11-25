// import React, { useEffect, useState, useMemo } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import axios from 'axios';
// import { RefreshCw, Users } from 'lucide-react';

// const LeadChart = () => {
//   const [chartData, setChartData] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState('all');
//   const [loading, setLoading] = useState(false);
//   const [dateRange, setDateRange] = useState('today'); // today, week, month

//   const apiUrl = import.meta.env.VITE_API_URL;

//   // Employees fetch karna
//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // Chart data fetch karna
//   useEffect(() => {
//     fetchChartData();
//   }, [selectedEmployee, dateRange]);

//   const fetchEmployees = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/employees`);
//       setEmployees(response.data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const fetchChartData = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         employee_id: selectedEmployee === 'all' ? null : selectedEmployee,
//         date_range: dateRange
//       };

//       const response = await axios.get(`${apiUrl}/analytics/hourly-calls`, { params });
//       setChartData(response.data);
//     } catch (error) {
//       console.error('Error fetching chart data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchChartData();
//   };

//   const formatTooltip = (value, name) => {
//     return [`${value} Calls`, 'Calls'];
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg">
//       {/* Header with Controls */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//         <div className="flex items-center gap-3">
//           <Users className="w-6 h-6 text-blue-600" />
//           <h2 className="text-xl font-semibold">Hourly Call Analytics</h2>
//         </div>
        
//         <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
//           {/* Employee Filter */}
//           <select
//             value={selectedEmployee}
//             onChange={(e) => setSelectedEmployee(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="all">All Employees</option>
//             {employees.map(emp => (
//               <option key={emp.id} value={emp.id}>
//                 {emp.name}
//               </option>
//             ))}
//           </select>

//           {/* Date Range Filter */}
//           <select
//             value={dateRange}
//             onChange={(e) => setDateRange(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="today">Today</option>
//             <option value="week">This Week</option>
//             <option value="month">This Month</option>
//           </select>

//           {/* Refresh Button */}
//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//             {loading ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="h-80 w-full">
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : chartData.length > 0 ? (
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis 
//                 dataKey="hour" 
//                 label={{ value: 'Hours', position: 'insideBottom', offset: -5 }} 
//               />
//               <YAxis 
//                 label={{ value: 'Number of Calls', angle: -90, position: 'insideLeft' }} 
//               />
//               <Tooltip formatter={formatTooltip} />
//               <Legend />
//               <Bar 
//                 dataKey="call_count" 
//                 name="Calls" 
//                 fill="#3b82f6" 
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-500">
//             No data available for selected filters
//           </div>
//         )}
//       </div>

//       {/* Summary Stats */}
//       {chartData.length > 0 && (
//         <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-blue-50 p-3 rounded-lg">
//             <p className="text-sm text-blue-600">Total Calls</p>
//             <p className="text-2xl font-bold text-blue-800">
//               {chartData.reduce((sum, item) => sum + item.call_count, 0)}
//             </p>
//           </div>
//           <div className="bg-green-50 p-3 rounded-lg">
//             <p className="text-sm text-green-600">Peak Hour</p>
//             <p className="text-2xl font-bold text-green-800">
//               {chartData.reduce((max, item) => 
//                 item.call_count > max.call_count ? item : max, 
//                 {hour: '', call_count: 0}
//               ).hour}
//             </p>
//           </div>
//           <div className="bg-purple-50 p-3 rounded-lg">
//             <p className="text-sm text-purple-600">Avg per Hour</p>
//             <p className="text-2xl font-bold text-purple-800">
//               {Math.round(
//                 chartData.reduce((sum, item) => sum + item.call_count, 0) / chartData.length
//               )}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeadChart;

import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { RefreshCw, Users, Clock, Play, Phone } from 'lucide-react';

const LeadChart = () => {
  const [chartData, setChartData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('today');
  const [timeRange, setTimeRange] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Employees fetch karna
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Chart data fetch karna
  useEffect(() => {
    fetchChartData();
  }, [selectedEmployee, dateRange]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/analytics/employees`);
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const params = {
        employee_id: selectedEmployee === 'all' ? null : selectedEmployee,
        date_range: dateRange
      };

      const response = await axios.get(`${apiUrl}/analytics/hourly-calls`, { params });
      
      if (response.data.success) {
        setChartData(response.data.data);
        setTimeRange(response.data.time_range);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
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
            Based on status updates
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
      second: '2-digit',
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Call Activity Analytics</h2>
            {timeRange && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Play className="w-3 h-3" />
                Showing calls from first status update at {formatTimeDisplay(timeRange)}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Employee Filter */}
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Employees</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Time Range Info */}
      {timeRange && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Call Activity Time Range</p>
              <p className="text-sm text-blue-600">
               
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
                name="Calls (Status Updates)" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No call activity data available for selected filters
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {summaryStats && summaryStats.totalCalls > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">Total Calls</p>
            <p className="text-2xl font-bold text-blue-800">
              {summaryStats.totalCalls}
            </p>
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Status updates today
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600">Peak Activity</p>
            <p className="text-lg font-bold text-green-800">
              {summaryStats.peakHour}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {summaryStats.peakHourCalls} calls
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-600">Avg per Hour</p>
            <p className="text-2xl font-bold text-purple-800">
              {summaryStats.avgPerHour}
            </p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-600">Time Coverage</p>
            <p className="text-lg font-bold text-orange-800">
              {timeRange ? `${timeRange.start_hour} to ${timeRange.end_hour}` : 'N/A'}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Based on first update
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadChart;