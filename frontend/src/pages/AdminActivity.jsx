// import { useEffect, useState, useMemo, forwardRef } from "react";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { useNavigate } from "react-router-dom";
// import {
//   Activity,
//   Calendar,
//   NotepadText,
//   SquarePen,
//   User,
// } from "lucide-react";
// import DatePicker from "react-datepicker";
// import QuickFilter from "./QuickFilter";
// import StatusModal from "../components/StatusModal";
// import "./dealTable.css";
// import NoteModal from "../components/NoteModal";

// import LeadHistoryModal from "../components/LeadHistoryModal";
// import { MessageCircle } from "lucide-react";
// import { ChevronDown, ChevronRight } from "lucide-react";

// export default function AdminActivity() {
//   const [rowData, setRowData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const apiUrl = import.meta.env.VITE_API_URL;

//   const userData = JSON.parse(localStorage.getItem("user"));
//   const userId = userData?.id;
//   const [quickFilterText, setQuickFilterText] = useState("");
//   const [updatedByList, setUpdatedByList] = useState([]);
//   const [selectedUpdatedBy, setSelectedUpdatedBy] = useState("All");
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const [statusFullData, setStatusFullData] = useState([]);
//   const [isChange, setIsChange] = useState(false);
//   const [statusData, setStatusData] = useState([]);
//   const [statusModalData, setStatusModalData] = useState(null);
//   const [dateTimeMap, setDateTimeMap] = useState({});
//   const [commentMap, setCommentMap] = useState({});
//   const [noteModalData, setNoteModalData] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     Demo: 0,
//     FollowUp: 0,
//     NotPickedCall: 0,
//     Deal: 0,
//     Interested: 0,
//   });

//   useEffect(() => {
//     axios
//       .get(`${apiUrl}/customers/fetch-customer-status`)
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
//     }
//   };

//   useEffect(() => {
//     fetchStatuses();
//   }, [isChange]);

//   const DetailCellRenderer = (props) => {
//     const historyData = props.data.history || [];
//     const [quickFilter, setQuickFilter] = useState("");

//     const detailColumnDefs = [
//       { headerName: "Name", field: "name", minWidth: 120, sortable: true, filter: true },
//       { headerName: "Mobile", field: "mobile", minWidth: 120, sortable: true, filter: true },
//       { headerName: "Status", field: "status", minWidth: 120, sortable: true, filter: true },
//       { headerName: "Comment", field: "comment", minWidth: 200, sortable: true, filter: true },
//       { headerName: "Updated By", field: "updated_by", minWidth: 120, sortable: true, filter: true },
//       {
//         headerName: "Updated At",
//         field: "updated_at",
//         minWidth: 180,
//         sortable: true,
//         filter: true,
//         valueFormatter: (params) =>
//           params.value ? new Date(params.value).toLocaleString("en-IN") : "",
//       },
//     ];

//     return (
//       <div style={{ padding: "10px", background: "#f9fafb" }}>
//         <div className="ag-theme-alpine collapse-grid" style={{ height: 250, width: "100%" }}>
//           <AgGridReact
//             rowData={historyData}
//             columnDefs={detailColumnDefs}
//             pagination={true}
//             paginationPageSize={5}
//             quickFilterText={quickFilter}
//             defaultColDef={{
//               sortable: true,
//               filter: true,
//               resizable: true,
//               flex: 1,
//             }}
//           />
//         </div>
//       </div>
//     );
//   };

//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "Name",
//         field: "name",
//         sortable: true,
//         filter: true,
//         cellStyle: { color: "black", fontWeight: 500 },
//         cellRenderer: (params) => (
//           <span
//             className="cursor-pointer"
//             onClick={() => {
//               params.api
//                 .getRowNode(params.node.id)
//                 .setExpanded(!params.node.expanded);
//             }}
//           >
//             {params.value}
//           </span>

//         ),
//       },
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
//         width: 140,
//         cellRenderer: (params) => (
//           <div className="flex gap-4 items-center justify-center">
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

//             <span className="border-l border-gray-400 h-6 inline-block"></span>
//             <button
//               className="p-1 rounded hover:bg-gray-100 flex"
//               onClick={() =>
//                 setNoteModalData({ customer_id: params.data.customer_id })
//               }
//             >
//               <NotepadText size={14} className="text-gray-600" />
//             </button>
//           </div>
//         ),
//       },
//       {
//         headerName: "Updated By",
//         field: "updated_by",
//         sortable: true,
//         filter: true,
//       },
//       {
//         headerName: "Updated At",
//         field: "updated_at",
//         sortable: true,
//         filter: true,
//         sort: "desc",
//         minWidth: 100,
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

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/activity/history`);
//         const latestMap = {};
//         res.data.forEach((item) => {
//           if (
//             !latestMap[item.customer_id] ||
//             new Date(item.updated_at) >
//             new Date(latestMap[item.customer_id].updated_at)
//           ) {
//             latestMap[item.customer_id] = item;
//           }
//         });

//         const uniqueLatest = Object.values(latestMap);

//         // ✅ master-detail me history attach karna
//         uniqueLatest.forEach((item) => {
//           item.history = res.data.filter(
//             (h) => h.customer_id === item.customer_id
//           );
//         });

//         setRowData(res.data);
//         setFilteredData(uniqueLatest);

//         const uniqueUsers = [...new Set(res.data.map((item) => item.updated_by))];
//         setUpdatedByList(uniqueUsers);
//       } catch (error) {
//         console.error("Error fetching history:", error);
//       }
//     };

//     fetchHistory();
//   }, [apiUrl]);

//   const filterData = () => {
//     let filtered = [...rowData];

//     if (selectedUpdatedBy !== "All") {
//       filtered = filtered.filter(
//         (item) => item.updated_by === selectedUpdatedBy
//       );
//     }

//     filtered = filtered.filter((item) => {
//       const updatedAt = new Date(item.updated_at);

//       const from = new Date(fromDate);
//       from.setHours(0, 0, 0, 0);

//       const to = new Date(toDate);
//       to.setHours(23, 59, 59, 999);

//       return updatedAt >= from && updatedAt <= to;
//     });

//     setFilteredData(filtered);
//   };

//   const CustomDateInput = forwardRef(
//     ({ value, onClick, placeholder }, ref) => (
//       <div
//         onClick={onClick}
//         ref={ref}
//         className="flex items-center justify-between border rounded px-2 py-2 w-40 cursor-pointer bg-white"
//       >
//         <span className="text-sm">{value || placeholder}</span>
//         <Calendar className="w-4 h-4 text-gray-500" />
//       </div>
//     )
//   );

//   return (
//     <div className="p-6 bg-gray-50 rounded-lg shadow-md">
//       {/* ✅ Stats cards */}
//       <div className="flex flex-wrap gap-6 justify-center">
//         {/* Demo */}
//         <div
//           className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
//           onClick={() => {
//             navigate("/admin-demo");
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
//             navigate("/admin-follow");
//           }}
//         >
//           <Calendar className="w-8 h-8 text-green-500 mr-3" />
//           <div className="flex gap-4 items-start">
//             <p className="text-gray-400 text-sm mt-1">Followup</p>
//             <p className="text-xl font-bold text-gray-800">
//               {stats.FollowUp}
//             </p>
//           </div>
//         </div>

//         {/* Interested */}
//         <div
//           className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
//           onClick={() => {
//             navigate("/admin-interested");
//           }}
//         >
//           <User className="w-8 h-8 text-pink-500 mr-3" />
//           <div className="flex gap-4 items-start">
//             <p className="text-gray-400 text-sm mt-1">Interested</p>
//             <p className="text-xl font-bold text-gray-800">
//               {stats.Interested}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex justify-between items-center py-6">
//         <h2 className="text-xl font-bold">User Activity</h2>

//         <div className="flex gap-4 items-center">
//           {/* User Select */}
//           <select
//             value={selectedUpdatedBy}
//             onChange={(e) => setSelectedUpdatedBy(e.target.value)}
//             className="h-10 w-40 border border-gray-300 rounded-md px-3 text-gray-700"
//           >
//             <option value="All">All Users</option>
//             {updatedByList.map((u, idx) => (
//               <option key={idx} value={u}>
//                 {u}
//               </option>
//             ))}
//           </select>

//           {/* From Date */}
//           <div className="flex  item-center gap-4">
//             <label className="text-sm  mt-2 font-medium">From</label>
//             <DatePicker
//               selected={fromDate}
//               onChange={(date) => setFromDate(date)}
//               customInput={
//                 <CustomDateInput placeholder="Select date" />
//               }
//               dateFormat="dd-MM-yyyy"
//               popperPlacement="bottom-start"
//             />
//           </div>

//           {/* To Date */}
//           <div className="flex item-center gap-4">
//             <label className="text-sm mt-2 font-medium">To</label>
//             <DatePicker
//               selected={toDate}
//               onChange={(date) => setToDate(date)}
//               customInput={<CustomDateInput placeholder="Select date" />}
//               dateFormat="dd-MM-yyyy"
//               popperPlacement="bottom-start"
//             />
//           </div>

//           {/* ✅ Submit */}
//           <button
//             onClick={filterData}
//             className="h-10 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
//           >
//             Submit
//           </button>

//           {/* Quick Filter */}
//           <QuickFilter
//             value={quickFilterText}
//             onChange={setQuickFilterText}
//             className="h-10 w-48 border border-gray-300 rounded-md px-3"
//           />
//         </div>
//       </div>

//       <div className="ag-theme-quartz" style={{ height: 610 }}>
//         <AgGridReact
//           rowData={filteredData}
//           columnDefs={columnDefs}
//           pagination={true}
//           paginationPageSize={100}
//           quickFilterText={quickFilterText}
//           masterDetail={true}
//           detailCellRenderer={DetailCellRenderer}
//           detailRowAutoHeight={true}
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
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown } from "lucide-react";

import LeadHistoryModal from "../components/LeadHistoryModal";
import { MessageCircle } from "lucide-react";

import {
  Activity,
  Calendar,
  NotepadText,
  SquarePen,
  User,
} from "lucide-react";
import DatePicker from "react-datepicker";
import QuickFilter from "./QuickFilter";
import StatusModal from "../components/StatusModal";
import "./dealTable.css";
import NoteModal from "../components/NoteModal";
import SourceFilter from  '../components/SourceFilter'


export default function AdminActivity() {
  const [rowData, setRowData] = useState([]);
   const [rowCopyData, setCopyRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;
  const [quickFilterText, setQuickFilterText] = useState("");
  const [updatedByList, setUpdatedByList] = useState([]);
  const [selectedUpdatedBy, setSelectedUpdatedBy] = useState("All");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [statusFullData, setStatusFullData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [statusModalData, setStatusModalData] = useState(null);
  const [dateTimeMap, setDateTimeMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
  const [noteModalData, setNoteModalData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSource, setSelectedSource] = useState("0");
  const [selectedRowId, setSelectedRowId] = useState(null);

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    Demo: 0,
    FollowUp: 0,
    NotPickedCall: 0,
    Deal: 0,
    Interested: 0,
  });

  useEffect(() => {
    axios
      .get(`${apiUrl}/customers/fetch-customer-status`)
      .then((res) => {
        const newStats = {
          Demo: 0,
          FollowUp: 0,
          Deal: 0,
          Interested: 0,
        };

        res.data.data.forEach((item) => {
          if (item.status === "Demo") newStats.Demo++;
          if (item.status === "Follow Up") newStats.FollowUp++;
          if (item.status === "Deal") newStats.Deal++;
          if (item.status === "Interested") newStats.Interested++;
        });

        setStats(newStats);
      })
      .catch((err) => {
        console.error("Error fetching customer status:", err);
      });
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/status`);
      const filterStatus = res.data.map((status) => status.name);
      setStatusData(filterStatus);
      setStatusFullData(res.data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [isChange]);

  const DetailCellRenderer = (props) => {
    const historyData = props.data.history || [];
    const [quickFilter, setQuickFilter] = useState("");

    const detailColumnDefs = [
      { headerName: "Name", field: "name", minWidth: 120, sortable: true, filter: true },
      { headerName: "Mobile", field: "mobile", minWidth: 120, sortable: true, filter: true },
      { headerName: "Status", field: "status", minWidth: 120, sortable: true, filter: true },
      { headerName: "Comment", field: "comment", minWidth: 200, sortable: true, filter: true },
      { headerName: "Updated By", field: "updated_by", minWidth: 120, sortable: true, filter: true },
      {
        headerName: "Updated At",
        field: "updated_at",
        minWidth: 180,
        sortable: true,
        filter: true,
        valueFormatter: (params) =>
          params.value ? new Date(params.value).toLocaleString("en-IN") : "",
      },
    ];

    return (
      <div style={{ padding: "10px", background: "#f9fafb" }}>
        <div className="ag-theme-alpine collapse-grid" style={{ height: 250, width: "100%" }}>
          <AgGridReact
            rowData={historyData}
            columnDefs={detailColumnDefs}
            pagination={true}
            paginationPageSize={5}
            quickFilterText={quickFilter}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
              flex: 1,
            }}
          />
        </div>
      </div>
    );
  };

const columnDefs = useMemo(
  () => [
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: true,
      cellStyle: { color: "black", fontWeight: 500 },
      cellRenderer: (params) => {
        const isExpanded = !!params.node.expanded;
        const Icon = isExpanded ? ChevronDown : ChevronRight;

        return (
          <span
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();

              params.node.setExpanded(!params.node.expanded);
              params.api.refreshCells({
                rowNodes: [params.node],
                columns: [params.colDef.field],
                force: true,
              });
            }}
          >
            <Icon size={14} className="text-gray-600" />
            <span>{params.value}</span>
          </span>
        );
      },
    },
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
      width: 140,
      cellRenderer: (params) => (
        <div className="flex gap-4 items-center justify-center">
          <button
            className="p-1 rounded hover:bg-gray-100 flex"
            onClick={() =>
               setStatusModalData({
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
            onClick={() =>
              setNoteModalData({ customer_id: params.data.customer_id })
            }
          >
            <NotepadText size={14} className="text-gray-600" />
          </button>
        </div>
      ),
    },
    {
      headerName: "Updated By",
      field: "updated_by",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Updated At",
      field: "updated_at",
      sortable: true,
      filter: true,
      sort: "desc",
      minWidth: 100,
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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${apiUrl}/activity/history`);
        const latestMap = {};
        res.data.forEach((item) => {
          if (
            !latestMap[item.customer_id] ||
            new Date(item.updated_at) >
              new Date(latestMap[item.customer_id].updated_at)
          ) {
            latestMap[item.customer_id] = item;
          }
        });

        const uniqueLatest = Object.values(latestMap);

        // ✅ master-detail me history attach karna
        uniqueLatest.forEach((item) => {
          item.history = res.data.filter(
            (h) => h.customer_id === item.customer_id
          );
        });

        setRowData(res.data);
        setCopyRowData(uniqueLatest)
        setFilteredData(uniqueLatest);

        const uniqueUsers = [...new Set(res.data.map((item) => item.updated_by))];
        setUpdatedByList(uniqueUsers);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, [apiUrl]);

  const filterData = () => {
    let filtered = [...rowData];

    if (selectedUpdatedBy !== "All") {
      filtered = filtered.filter(
        (item) => item.updated_by === selectedUpdatedBy
      );
    }

    filtered = filtered.filter((item) => {
      const updatedAt = new Date(item.updated_at);

      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);

      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      return updatedAt >= from && updatedAt <= to;
    });

    setFilteredData(filtered);
  };

  const CustomDateInput = forwardRef(
    ({ value, onClick, placeholder }, ref) => (
      <div
        onClick={onClick}
        ref={ref}
        className="flex items-center justify-between border rounded px-2 py-2 w-40 cursor-pointer bg-white"
      >
        <span className="text-sm">{value || placeholder}</span>
        <Calendar className="w-4 h-4 text-gray-500" />
      </div>
    )
  );

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
      {/* ✅ Stats cards */}
      <div className="flex flex-wrap gap-6 justify-center">
        {/* Demo */}
        <div
          className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          onClick={() => {
            navigate("/admin-demo");
          }}
        >
          <Activity className="w-8 h-8 text-blue-500 mr-3" />
          <div className="flex gap-4 items-start">
            <p className="text-gray-400 text-sm mt-1">Demo</p>
            <p className="text-xl font-bold text-gray-800">{stats.Demo}</p>
          </div>
        </div>

        {/* Follow Up */}
        <div
          className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          onClick={() => {
            navigate("/admin-follow");
          }}
        >
          <Calendar className="w-8 h-8 text-green-500 mr-3" />
          <div className="flex gap-4 items-start">
            <p className="text-gray-400 text-sm mt-1">Followup</p>
            <p className="text-xl font-bold text-gray-800">
              {stats.FollowUp}
            </p>
          </div>
        </div>

        {/* Interested */}
        <div
          className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          onClick={() => {
            navigate("/admin-interested");
          }}
        >
          <User className="w-8 h-8 text-pink-500 mr-3" />
          <div className="flex gap-4 items-start">
            <p className="text-gray-400 text-sm mt-1">Interested</p>
            <p className="text-xl font-bold text-gray-800">
              {stats.Interested}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center py-6">
        <h2 className="text-xl font-bold">User Activity</h2>

        <div className="flex gap-4 items-center">
          {/* User Select */}
          <SourceFilter
selectedSource={selectedSource}
setSelectedSource={setSelectedSource}
/>

          <select
            value={selectedUpdatedBy}
            onChange={(e) => setSelectedUpdatedBy(e.target.value)}
            className="h-10 w-40 border border-gray-300 rounded-md px-3 text-gray-700"
          >
            <option value="All">All Users</option>
            {updatedByList.map((u, idx) => (
              <option key={idx} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* From Date */}
          <div className="flex  item-center gap-4">
            <label className="text-sm  mt-2 font-medium">From</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              customInput={
                <CustomDateInput placeholder="Select date" />
              }
              dateFormat="dd-MM-yyyy"
              popperPlacement="bottom-start"
            />
          </div>

          {/* To Date */}
          <div className="flex item-center gap-4">
            <label className="text-sm mt-2 font-medium">To</label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              customInput={<CustomDateInput placeholder="Select date" />}
              dateFormat="dd-MM-yyyy"
              popperPlacement="bottom-start"
            />
          </div>

          {/* ✅ Submit */}
          <button
            onClick={filterData}
            className="h-10 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
          >
            Submit
          </button>

          {/* Quick Filter */}
          <QuickFilter
            value={quickFilterText}
            onChange={setQuickFilterText}
            className="h-10 w-48 border border-gray-300 rounded-md px-3"
          />
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 610 }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={100}
          quickFilterText={quickFilterText}
          masterDetail={true}
          detailCellRenderer={DetailCellRenderer}
          detailRowAutoHeight={true}
            onRowClicked={(params) => setSelectedRowId(params.data.id)}
  getRowStyle={(params) => {
    if (params.data.id === selectedRowId) {
      return {
        backgroundColor: '#c4c4c4', 
        borderLeft: '4px solid #22c55e',
        transition: 'background-color 0.3s ease',
      };
    }
    return null;
  }}
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

        <NoteModal
          noteModalData={noteModalData}
          setNoteModalData={setNoteModalData}
        />
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