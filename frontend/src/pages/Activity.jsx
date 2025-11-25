// import { useEffect, useState, useMemo, forwardRef } from "react";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Activity, Calendar, NotebookPen, NotepadText, SquarePen, User } from "lucide-react";
// import QuickFilter from "./QuickFilter";
// import { useNavigate } from "react-router-dom";
// import StatusModal from "../components/StatusModal";
// import NoteModal from "../components/NoteModal";
// import LeadHistoryModal from "../components/LeadHistoryModal";
// import { MessageCircle } from "lucide-react";

// export default function Activityy() {
//   const [rowData, setRowData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [quickFilterText, setQuickFilterText] = useState("");

//   const userData = JSON.parse(localStorage.getItem("user"));
//   const userId = userData?.id;
//   const today = new Date();
//   const [fromDate, setFromDate] = useState(today);
//   const [toDate, setToDate] = useState(today);
//   const [statusFullData, setStatusFullData] = useState([]);
//   const [isChange, setIsChange] = useState(false);
//   const [statusData, setStatusData] = useState([]);
//   const [statusModalData, setStatusModalData] = useState(null);
//   const [dateTimeMap, setDateTimeMap] = useState({});
//   const [commentMap, setCommentMap] = useState({});
//   const [noteModalData, setNoteModalData] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   const userss = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     Demo: 0,
//     FollowUp: 0,
//     Deal: 0,
//     Interested: 0,
//   });

//   // 📊 Fetch stats
//   useEffect(() => {
//     axios
//       .get(`${apiUrl}/customers/fetch-customer-status/${userss?.id}`)
//       .then((res) => {
//         const newStats = {
//           Demo: 0,
//           FollowUp: 0,
//           Deal: 0,
//           Interested: 0,
//         };

//         res.data.data.forEach((item) => {
//           if (item.status === "Demo") newStats.Demo++;
//           if (item.status === "Follow Up") newStats.FollowUp++;
//           if (item.status === "Deal") newStats.Deal++;
//           if (item.status === "Interested") newStats.Interested++;
//         });

//         setStats(newStats);
//       })
//       .catch((err) => {
//         console.error("Error fetching customer status:", err);
//       });
//   }, []);

//   const fetchStatuses = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/status`);
//       const filterStatus = res.data.map((status) => status.name);
//       setStatusData(filterStatus);
//       setStatusFullData(res.data);
//     } catch (err) {
//       console.error("Error fetching statuses:", err);
//       toast.error("Failed to load statuses");
//     }
//   };

//   useEffect(() => {

//     fetchStatuses();
//   }, [isChange]);

//   // 📑 Table columns
//   const columnDefs = useMemo(
//     () => [
//       { headerName: "Name", field: "name", sortable: true, filter: true, minWidth: 300 },
//       // { headerName: "Email", field: "email", sortable: true, filter: true },
//       { headerName: "Mobile", field: "mobile", sortable: true, filter: true },

//       {
//         headerName: "Comment",
//         field: "comment",
//         minWidth: 700,
//         autoHeight: true,
//         cellRenderer: (params) => (
//           <div className="flex items-center justify-between gap-2">

//             <span className="truncate max-w-[600px]">{params.data.comment}</span>

//             <button
//               className="p-1 text-gray-600 rounded hover:bg-gray-300"
//               onClick={() => setSelectedCustomer(params.data.customer_id)}
//               title="View Comments"
//             >
//               <MessageCircle size={18} />
//             </button>
//           </div>
//         ),
//       }
//       ,
//       { headerName: "Status", field: "status", sortable: true, filter: true },
//       {
//         headerName: "Status Change",
//         field: "status",
//         width: 180,
//         maxWidth: 180,
//         cellRenderer: (params) => (
//           <div className="flex gap-8 items-center justify-center">
//             <button
//               className="p-1 rounded hover:bg-gray-100 flex"
//               onClick={() =>
//                 setStatusModalData({
//                   customer_id: params.data.customer_id,
//                   newStatus: params.value,
//                 })
//               }
//             >
//               <SquarePen size={14} className="text-gray-600" />
//             </button>

//             <span class="border-l border-gray-400 h-6 inline-block"></span>

//             <button
//               className="p-1 rounded hover:bg-gray-100 flex"
//               onClick={() => {
//                 console.log("Customer ID:", params.data.customer_id);
//                 setNoteModalData({
//                   customer_id: params.data.customer_id,
//                 });
//               }}
//             >
//               <NotepadText size={14} className="text-gray-600" />
//             </button>
//           </div>
//         ),
//       },
//       {
//         headerName: "Updated At",
//         field: "updated_at",
//         sortable: true,
//         filter: true,
//         sort: "desc",
//         valueFormatter: (params) =>
//           params.value
//             ? new Date(params.value).toLocaleString("en-IN", {
//               day: "2-digit",
//               month: "2-digit",
//               year: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit",
//               hour12: true,
//             })
//             : "",
//       },
//     ],
//     []
//   );




//   // 📥 Fetch history data
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/activity/${userId}`);
//         setRowData(res.data);
//         setFilteredData(res.data); // Default: show all
//       } catch (error) {
//         console.error("Error fetching history:", error);
//       }
//     };

//     if (userId) {
//       fetchHistory();
//     }
//   }, [userId, apiUrl]);

//   // ✅ Submit पर filter
//   const handleFilter = () => {
//     if (fromDate && toDate) {
//       const filtered = rowData.filter((item) => {
//         const updatedAt = new Date(item.updated_at);

//         const from = new Date(fromDate);
//         from.setHours(0, 0, 0, 0); // start of day

//         const to = new Date(toDate);
//         to.setHours(23, 59, 59, 999); // end of day

//         return updatedAt >= from && updatedAt <= to;
//       });
//       setFilteredData(filtered);
//     } else {
//       setFilteredData(rowData);
//     }
//   };

//   // 📅 Custom date input
//   const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
//     <div
//       onClick={onClick}
//       ref={ref}
//       className="flex items-center justify-between border rounded px-2 py-2 w-40 cursor-pointer bg-white"
//     >
//       <span className="text-sm">{value || placeholder}</span>
//       <Calendar className="w-4 h-4 text-gray-500" />
//     </div>
//   ));

//   return (
//     <div className="p-6 bg-gray-50 rounded-lg shadow-md">
//       {/* Stats cards */}
//       <div className="flex flex-wrap gap-6 justify-center">
//         {/* Demo */}
//         <div
//           className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
//           onClick={() => {
//             navigate("/demo");
//           }}
//         >
//           <Activity className="w-8 h-8 text-blue-500 mr-3" />
//           <div className="flex gap-4 items-start">
//             <p className="text-gray-400 text-sm mt-1">Demo</p>
//             <p className="text-xl font-bold text-gray-800">{stats.Demo}</p>
//           </div>
//         </div>

//         {/* Follow Up */}
//         <div
//           className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
//           onClick={() => {
//             navigate("/follow-up");
//           }}
//         >
//           <Calendar className="w-8 h-8 text-green-500 mr-3" />
//           <div className="flex gap-4 items-start">
//             <p className="text-gray-400 text-sm mt-1">Followup</p>
//             <p className="text-xl font-bold text-gray-800">{stats.FollowUp}</p>
//           </div>
//         </div>

//         {/* Interested */}
//         <div
//           className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
//           onClick={() => {
//             navigate("/user-interested");
//           }}
//         >
//           <User className="w-8 h-8 text-pink-500 mr-3" />
//           <div className="flex gap-4 items-start">
//             <p className="text-gray-400 text-sm mt-1">Interested</p>
//             <p className="text-xl font-bold text-gray-800">{stats.Interested}</p>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex gap-4 mb-4 justify-between py-8">
//         <h2 className="text-xl font-bold">Activity</h2>

//         <div className="flex gap-4">
//           {/* From Date */}
//           {/* <div className="flex items-center gap-4">
//             <label className="block text-sm mt-2 font-medium">From</label>
//             <DatePicker
//               selected={fromDate}
//               onChange={(date) => setFromDate(date)}
//               customInput={<CustomDateInput placeholder="Select from date" />}
//               dateFormat="dd-MM-yyyy"
//               popperPlacement="bottom-start"
//             />
//           </div> */}

//           {/* To Date */}
//           {/* <div className="flex items-center gap-4">
//             <label className="block text-sm mt-2 font-medium">To</label>
//             <DatePicker
//               selected={toDate}
//               onChange={(date) => setToDate(date)}
//               customInput={<CustomDateInput placeholder="Select to date" />}
//               dateFormat="dd-MM-yyyy"
//               popperPlacement="bottom-start"
//             />
//           </div> */}

//           {/* ✅ Submit Button */}
//           {/* <button
//             onClick={handleFilter}
//             className="relative bg-blue-500 text-white h-10 px-8 text-sm rounded hover:bg-blue-600"
//           >
//             Submit
//           </button> */}

//           {/* Quick Filter */}
//           <QuickFilter
//             value={quickFilterText}
//             onChange={setQuickFilterText}
//             className="h-10 w-48 border border-gray-300 rounded-md px-3"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="ag-theme-alpine" style={{ height: 570 }}>
//         <AgGridReact
//           rowData={filteredData}
//           columnDefs={columnDefs}
//           pagination={true}
//           paginationPageSize={100}
//           quickFilterText={quickFilterText}
//         />
//         <StatusModal
//           statusModalData={statusModalData}
//           setStatusModalData={setStatusModalData}
//           statusData={statusData}
//           statusFullData={statusFullData}
//           commentMap={commentMap}
//           setCommentMap={setCommentMap}
//           dateTimeMap={dateTimeMap}
//           setDateTimeMap={setDateTimeMap}
//           setIsChange={setIsChange}
//         />
//         <NoteModal
//           noteModalData={noteModalData}
//           setNoteModalData={setNoteModalData}
//         />

//         {selectedCustomer && (
//           <LeadHistoryModal
//             customerId={selectedCustomer}
//             onClose={() => setSelectedCustomer(null)}
//           />
//         )}

//       </div>

//     </div>
//   );
// }

import { useEffect, useState, useMemo, forwardRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Activity, Calendar, NotepadText, SquarePen, User } from "lucide-react";
import QuickFilter from "./QuickFilter";
import { useNavigate } from "react-router-dom";
import StatusModal from "../components/StatusModal";
import NoteModal from "../components/NoteModal";
import LeadHistoryModal from "../components/LeadHistoryModal";
import { MessageCircle } from "lucide-react";
import SourceFilter from  '../components/SourceFilter'

export default function Activityy() {
  const [rowData, setRowData] = useState([]);
  const [rowCopyData, setCopyRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [quickFilterText, setQuickFilterText] = useState("");
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;
  const [statusFullData, setStatusFullData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [statusModalData, setStatusModalData] = useState(null);
  const [dateTimeMap, setDateTimeMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
  const [noteModalData, setNoteModalData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSource, setSelectedSource] = useState("0");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    Demo: 0,
    FollowUp: 0,
    Deal: 0,
    Interested: 0,
  });

  // Fetch stats
  useEffect(() => {
    axios
      .get(`${apiUrl}/customers/fetch-customer-status/${userId}`)
      .then((res) => {
        const newStats = { Demo: 0, FollowUp: 0, Deal: 0, Interested: 0 };
        res.data.data.forEach((item) => {
          if (item.status === "Demo") newStats.Demo++;
          if (item.status === "Follow Up") newStats.FollowUp++;
          if (item.status === "Deal") newStats.Deal++;
          if (item.status === "Interested") newStats.Interested++;
        });
        setStats(newStats);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch statuses
  const fetchStatuses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/status`);
      setStatusData(res.data.map((s) => s.name));
      setStatusFullData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [isChange]);

  // Columns
  const columnDefs = useMemo(
    () => [
      { headerName: "Name", field: "name", sortable: true, filter: true, minWidth: 300, cellRenderer: "agGroupCellRenderer" },
      { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
      {
headerName: "Comment",
field: "comment",
minWidth: 700,
autoHeight: true,
cellRenderer: (params) => (
<div className="flex items-center justify-between gap-2">

<span className="truncate max-w-[600px]">{params.data.comment}</span>

<button
className="p-1 text-gray-600 rounded hover:bg-gray-300"
onClick={() => setSelectedCustomer(params.data.customer_id)}
title="View Comments"
>
<MessageCircle size={18} />
</button>
</div>
),
},
      { headerName: "Status", field: "status", sortable: true, filter: true },
      {
        headerName: "Status Change",
        field: "status",
        width: 180,
        maxWidth: 180,
        cellRenderer: (params) => (
          <div className="flex gap-8 items-center justify-center">
            <button
              className="p-1 rounded hover:bg-gray-100 flex"
              onClick={() => setStatusModalData({ 
               customer_id: params.data.customer_id,
                currentStatus: params.value,
                newStatus: params.value,
                batch_id: params.data.batch_id,
              })
            }
            >
              <SquarePen size={14} className="text-gray-600" />
            </button>
            <span className="border-l border-gray-400 h-6 inline-block"></span>
            <button
              className="p-1 rounded hover:bg-gray-100 flex"
              onClick={() => setNoteModalData({ customer_id: params.data.customer_id })}
            >
              <NotepadText size={14} className="text-gray-600" />
            </button>
          </div>
        ),
      },
      {
        headerName: "Updated At",
        field: "updated_at",
        sortable: true,
        filter: true,
        sort: "desc",
        valueFormatter: (params) =>
          params.value
            ? new Date(params.value).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })
            : "",
      },
    ],
    []
  );

  // Detail grid (collapse)
  const detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        { headerName: "Name", field: "name", sortable: true, filter: true },
        { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
        { headerName: "Comment", field: "comment", flex: 1 },
        { headerName: "Status", field: "status", flex: 1 },
        {
          headerName: "Updated At",
          field: "updated_at",
          valueFormatter: (params) =>
            new Date(params.value).toLocaleString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }),
        },
      ],
      defaultColDef: { flex: 1 },
    },
    getDetailRowData: (params) => {
      params.successCallback(params.data.history || []);
    },
  };

  // Fetch activity and prepare latest + history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${apiUrl}/activity/${userId}`);
        const data = res.data;

        // Group by customer_id
        const grouped = {};
        data.forEach((item) => {
          if (!grouped[item.customer_id]) grouped[item.customer_id] = [];
          grouped[item.customer_id].push(item);
        });

        // Prepare main row: latest activity per customer
        const mainRows = Object.values(grouped).map((items) => {
          const sorted = items.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          return {
            ...sorted[0], // latest
            history: sorted.slice(1), // previous activities
          };
        });

        setRowData(mainRows);
         setCopyRowData(mainRows);
        setFilteredData(mainRows);
      } catch (err) {
        console.error(err);
      }
    };

    if (userId) fetchHistory();
  }, [userId, apiUrl]);




      useEffect(() => {


if(selectedSource!="0")
{
let filter = rowCopyData.filter((val)=>val.batch_id==selectedSource)
setFilteredData(filter)

}
else
{
let dataaa = rowCopyData
setFilteredData(dataaa)

}

}, [selectedSource]);



  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Stats cards */}
      <div className="flex flex-wrap gap-6 justify-center mb-6">
        <div className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer" onClick={() => navigate("/demo")}>
          <Activity className="w-8 h-8 text-blue-500 mr-3" />
          <div className="flex gap-4 items-start">
            <p className="text-gray-400 text-sm mt-1">Demo</p>
            <p className="text-xl font-bold text-gray-800">{stats.Demo}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer" onClick={() => navigate("/follow-up")}>
          <Calendar className="w-8 h-8 text-green-500 mr-3" />
          <div className="flex gap-4 items-start">
            <p className="text-gray-400 text-sm mt-1">Followup</p>
            <p className="text-xl font-bold text-gray-800">{stats.FollowUp}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer" onClick={() => navigate("/user-interested")}>
          <User className="w-8 h-8 text-pink-500 mr-3" />
          <div className="flex gap-4 items-start">
            <p className="text-gray-400 text-sm mt-1">Interested</p>
            <p className="text-xl font-bold text-gray-800">{stats.Interested}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 justify-between py-4">
        <h2 className="text-xl font-bold">Activity</h2>
        <div className="flex gap-4">
                <SourceFilter
                selectedSource={selectedSource}
                setSelectedSource={setSelectedSource}
                />
        
                <QuickFilter
                  value={quickFilterText}
                  onChange={setQuickFilterText}
                />
        
                </div>

        {/* <QuickFilter value={quickFilterText} onChange={setQuickFilterText} className="h-10 w-48 border border-gray-300 rounded-md px-3" /> */}
      </div>

      {/* Table */}
      <div className="ag-theme-alpine" style={{ height: 570 }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={100}
          quickFilterText={quickFilterText}
          masterDetail={true}
          detailCellRendererParams={detailCellRendererParams}
        />
        <StatusModal
          statusModalData={statusModalData}
          setStatusModalData={setStatusModalData}
          statusData={statusData}
          statusFullData={statusFullData}
          commentMap={commentMap}
          setCommentMap={setCommentMap}
          dateTimeMap={dateTimeMap}
          setDateTimeMap={setDateTimeMap}
          setIsChange={setIsChange}
        />
        <NoteModal noteModalData={noteModalData} setNoteModalData={setNoteModalData} />
        {selectedCustomer && (
<LeadHistoryModal
customerId={selectedCustomer}
onClose={() => setSelectedCustomer(null)}
/>
)}
      </div>
    </div>
  );
}