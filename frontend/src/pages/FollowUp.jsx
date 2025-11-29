// import { useState, useEffect, useMemo, useRef, forwardRef } from "react";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import Modal from "react-modal";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { Activity, Calendar, NotebookPen, NotepadText, SquarePen, User } from "lucide-react";
// import { toast } from "react-toastify";
// import "./dealTable.css";
// import QuickFilter from "./QuickFilter";
// import StatusModal from "../components/StatusModal";
// import { useNavigate } from "react-router-dom";
// import NoteModal from "../components/NoteModal";
// import LeadHistoryModal from "../components/LeadHistoryModal";
// import { MessageCircle } from "lucide-react";
// import SourceFilter from  '../components/SourceFilter'



// export default function FollowUp() {
//   const [quickFilterText, setQuickFilterText] = useState("");
//   const [rowData, setRowData] = useState([]);
//   const [rowCopyData, setCopyRowData] = useState([]);
//   const [statusData, setStatusData] = useState([]);
//   const [openModalData, setOpenModalData] = useState(null);
//   const [dateTimeMap, setDateTimeMap] = useState({});
//   const [openTextModalData, setOpenTextModalData] = useState(null);
//   const [textInputMap, setTextInputMap] = useState({});
//   const [statusFullData, setStatusFullData] = useState([]);
//   const [isChange, setIsChange] = useState(false);
//   const gridRef = useRef();
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [statusModalData, setStatusModalData] = useState(null);
//   const [commentMap, setCommentMap] = useState({});
//   const [noteModalData, setNoteModalData] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//     const [selectedSource, setSelectedSource] = useState("0");


//   const userss = JSON.parse(localStorage.getItem('user'))


//   const navigate = useNavigate()

//   const [stats, setStats] = useState({
//     Demo: 0,
//     FollowUp: 0,
//     NotPickedCall: 0,
//     Deal: 0,
//     Interested: 0,
//   });





//   useEffect(() => {


//     axios
//       .get(`${apiUrl}/customers/fetch-customer-status/${userss?.id}`)
//       .then((res) => {
//         const newStats = {
//           Demo: 0,
//           FollowUp: 0,
//           // NotPickedCall: 0,
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

//         console.log(newStats, 'stats...')
//       })
//       .catch((err) => {
//         console.error("Error fetching customer status:", err);
//       });
//   }, []);





//   const fetchFollowUpData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const user = JSON.parse(localStorage.getItem("user"));
//       const employeeId = user?.id;
//       if (!employeeId) return;

//       const { data } = await axios.get(`${apiUrl}/employee/status/data`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { employeeId, status: "Follow Up" },
//       });

      
//             const filteredData = data.data.filter(
//         (item) =>  item.status_id ==4
//       );



//       setRowData(filteredData || []);
//       setCopyRowData(filteredData || [])
//     } catch (err) {
//       console.error("Error fetching follow_up data:", err);
//       setRowData([]);
//     }
//   };

//   const fetchStatuses = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/status`);
//       const filterStatus = res.data.map((status) => status.name);
//       setStatusData(filterStatus);
//       setStatusFullData(res.data);
//     } catch (err) {
//       console.error("Error fetching statuses:", err);
//       toast.error("Failed to load statuses ❌");
//     }
//   };

//   useEffect(() => {
//     fetchFollowUpData();
//     fetchStatuses();
//   }, [isChange]);

//   const gridOptions = {
//     defaultColDef: {
//       flex: 1,
//       resizable: true,
//       sortable: true,
//       filter: true,
//     },
//     singleClickEdit: true,
//   };

  
//   const columns = useMemo(
//     () => [
//       // { headerName: "ID", field: "id", width: 90 },
//       { headerName: "Name", field: "name", flex: 1 },
//       { headerName: "Mobile", field: "mobile", flex: 1 },
//       // { headerName: "Address", field: "address", flex: 1 },
//       { headerName: "Status", field: "status" },
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
//       },

//       {
//         headerName: "Status Change",
//         field: "status",
//         width: 150,
//         maxWidth: 150,
//         cellRenderer: (params) => (
//           <div className="flex gap-8 items-center justify-center">
//             <button
//               className="p-1 rounded hover:bg-gray-100 flex"
//               // onClick={() =>
//               //   setStatusModalData({
//               //     customer_id: params.data.customer_id,
//               //     newStatus: params.value,
                  
//               //   })
                
//               // }
//                onClick={() =>
//                 setStatusModalData({
//                 customer_id: params.data.customer_id,
//                 currentStatus: params.value,
//                 newStatus: params.value,
//                 batch_id: params.data.batch_id,
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
//         headerName: "Follow Up Date",
//         field: "followup_datetime",
//         flex: 1,
//         filter: "agDateColumnFilter",
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
//     [statusData]
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       resizable: true,
//       sortable: true,
//       filter: true,
//     }),
//     []
//   );

 

//     useEffect(() => {


// if(selectedSource!="0")
// {
// let filter = rowCopyData.filter((val)=>val.batch_id==selectedSource)
// setRowData(filter)

// }
// else
// {
// let dataaa = rowCopyData
// setRowData(dataaa)

// }

// }, [selectedSource]);



//   return (
//     <div className="p-6 bg-gray-50 rounded-lg shadow-md">

//       <div className="flex flex-wrap gap-6 justify-center">
//         {/* Demo */}
//         <div
//           className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
//           onClick={() => {
//             navigate('/demo')
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
//             navigate('/follow-up')
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
//             navigate('/user-interested')
//           }}
//         >
//           <User className="w-8 h-8 text-pink-500 mr-3" />
//           <div className="flex gap-4 items-start">
//             <p className="text-gray-400 text-sm mt-1">Interested</p>
//             <p className="text-xl font-bold text-gray-800">{stats.Interested}</p>
//           </div>
//         </div>


//       </div>

//       <div className="flex justify-between p-4">
//         <h2 className="text-xl font-bold mb-4">Follow Up</h2>

// <div className="flex gap-4">
//         <SourceFilter
//         selectedSource={selectedSource}
//         setSelectedSource={setSelectedSource}
//         />

//         <QuickFilter
//           value={quickFilterText}
//           onChange={setQuickFilterText}
//         />

//         </div>

//       </div>
//       <div className="ag-theme-alpine" style={{ height: 723 }}>
//         <AgGridReact
//           ref={gridRef}
//           rowData={rowData}
//           columnDefs={columns}
//           defaultColDef={defaultColDef}
//           pagination={true}
//           paginationPageSize={100}
//           // onCellValueChanged={handleStatusChange}
//           paginationAutoPageSize={true}
//           animateRows={true}
//           singleClickEdit={true}
//           gridOptions={gridOptions}
//           rowSelection="multiple"
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




import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Activity,
  Calendar,
  User,
  NotebookPen,
  SquarePen,
  MessageCircle,
} from "lucide-react";
import StatusModal from "../components/StatusModal";
import NoteModal from "../components/NoteModal";
import LeadHistoryModal from "../components/LeadHistoryModal";
import { useNavigate } from "react-router-dom";
import SourceFilter from "../components/SourceFilter";

export default function FollowUp() {
  const [groupedData, setGroupedData] = useState({});
  const [groupedCopyData, setGroupedCopyData] = useState({});
  const [stats, setStats] = useState({
    Demo: 0,
    FollowUp: 0,
    Deal: 0,
    Interested: 0,
  });
  const [statusData, setStatusData] = useState([]);
  const [statusFullData, setStatusFullData] = useState([]);
  const [statusModalData, setStatusModalData] = useState(null);
  const [noteModalData, setNoteModalData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [commentMap, setCommentMap] = useState({});
  const [dateTimeMap, setDateTimeMap] = useState({});
  const [isChange, setIsChange] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedSource, setSelectedSource] = useState("0");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const userss = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ Fetch stats
  useEffect(() => {
    axios
      .get(`${apiUrl}/customers/fetch-customer-status/${userss?.id}`)
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
      .catch(() => toast.error("Failed to load stats"));
  }, []);

  // ✅ Fetch FollowUp data grouped by date
  // useEffect(() => {
  //   const fetchFollowUpData = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const employeeId = userss?.id;
  //       if (!employeeId) return;

  //       const { data } = await axios.get(`${apiUrl}/employee/status/data`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //         params: { employeeId, status: "Follow Up" },
  //       });

  //       // Filter by Follow Up (status_id == 4)
  //       const filteredData = data.data.filter((item) => item.status_id == 4 || 1);
  //       const leads = filteredData || [];

  //       // Group by date
  //       const grouped = {};
  //       leads.forEach((item) => {
  //         const dateKey = item.followup_datetime
  //           ? new Date(item.followup_datetime).toLocaleDateString("en-IN", {
  //               day: "2-digit",
  //               month: "long",
  //               year: "numeric",
  //             })
  //           : "No Date";

  //         if (!grouped[dateKey]) grouped[dateKey] = [];
  //         grouped[dateKey].push(item);
  //       });

  //       setGroupedData(grouped);
  //       setGroupedCopyData(grouped);
  //     } catch (err) {
  //       console.error("Error fetching follow-up data:", err);
  //       toast.error("Failed to load customer data");
  //     }
  //   };

  //   fetchFollowUpData();
  // }, [isChange]);



// ✅ Fetch FollowUp data grouped by date
useEffect(() => {
  const fetchFollowUpData = async () => {
    try {
      const token = localStorage.getItem("token");
      const employeeId = userss?.id;
      if (!employeeId) return;

      const { data } = await axios.get(`${apiUrl}/employee/status/data`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { employeeId, status: "Follow Up" },
      });

      // Filter by Follow Up (status_id == 4) and Demo (status_id == 1)
      const filteredData = data.data.filter((item) => 
        item.status_id == 4 || item.status_id == 1
      );
      
      // Mobile number ke basis par group banao aur latest entry rakho
      const mobileMap = {};
      
      filteredData.forEach((item) => {
        let mobile = item.mobile;
        
        // Agar number 12-digit ka hai aur '91' se start hota hai, toh '91' hata do
        if (mobile && mobile.length === 12 && mobile.startsWith('91')) {
          mobile = mobile.substring(2); // Pehle 2 characters hata do
        }
        
        // Agar yeh mobile pehle se nahi hai, ya fir yeh entry latest hai
        if (!mobileMap[mobile] || 
            new Date(item.updated_at) > new Date(mobileMap[mobile].updated_at)) {
          mobileMap[mobile] = item;
        }
      });

      // Sirf unique mobile numbers wali entries lo
      const uniqueData = Object.values(mobileMap);

      // Ab date ke hisaab se group karo
      const grouped = {};
      uniqueData.forEach((item) => {
        const dateKey = item.followup_datetime
          ? new Date(item.followup_datetime).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "No Date";

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(item);
      });

      setGroupedData(grouped);
      setGroupedCopyData(grouped);
    } catch (err) {
      console.error("Error fetching follow-up data:", err);
      toast.error("Failed to load customer data");
    }
  };

  fetchFollowUpData();
}, [isChange]);






  // ✅ Fetch statuses
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/status`);
        const filterStatus = res.data.map((status) => status.name);
        setStatusData(filterStatus);
        setStatusFullData(res.data);
      } catch {
        toast.error("Failed to load statuses");
      }
    };
    fetchStatuses();
  }, []);

  // ✅ Source filter logic
  useEffect(() => {
    if (selectedSource !== "0") {
      const filtered = {};
      Object.keys(groupedCopyData).forEach((dateKey) => {
        const matchingRows = groupedCopyData[dateKey].filter(
          (item) => item.batch_id == selectedSource
        );
        if (matchingRows.length > 0) filtered[dateKey] = matchingRows;
      });
      setGroupedData(filtered);
    } else {
      setGroupedData(groupedCopyData);
    }
  }, [selectedSource, groupedCopyData]);

  return (
    <div className="p-6 bg-gray-50">
      {/* ===== Top Cards ===== */}
      <div className="flex flex-wrap gap-6 justify-center mb-6">
        <div
          className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl cursor-pointer"
          onClick={() => navigate("/demo")}
        >
          <Activity className="w-8 h-8 text-blue-500 mr-3" />
          <div>
            <p className="text-gray-400 text-sm">Demo</p>
            <p className="text-xl font-bold">{stats.Demo}</p>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl cursor-pointer"
          onClick={() => navigate("/follow-up")}
        >
          <Calendar className="w-8 h-8 text-green-500 mr-3" />
          <div>
            <p className="text-gray-400 text-sm">Followup</p>
            <p className="text-xl font-bold">{stats.FollowUp}</p>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl cursor-pointer"
          onClick={() => navigate("/user-interested")}
        >
          <User className="w-8 h-8 text-pink-500 mr-3" />
          <div>
            <p className="text-gray-400 text-sm">Interested</p>
            <p className="text-xl font-bold">{stats.Interested}</p>
          </div>
        </div>
      </div>

      {/* ===== Filters ===== */}
      <div className="mb-6 flex gap-4 justify-end">
        <SourceFilter
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
        />
        <input
          type="text"
          placeholder="Search leads..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border rounded-lg px-3 py-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* ===== Grouped Tables ===== */}
      {Object.keys(groupedData)
        .sort((a, b) => {
          const dateA = a === "No Date" ? new Date(0) : new Date(a);
          const dateB = b === "No Date" ? new Date(0) : new Date(b);
          return dateB - dateA;
        })
        .map((date) => {
          const filteredRows = groupedData[date]
            .filter((item) =>
              Object.values(item).some((val) =>
                String(val || "")
                  .toLowerCase()
                  .includes(filterText.toLowerCase())
              )
            )
            .sort((a, b) => {
              const timeA = a.followup_datetime
                ? new Date(a.followup_datetime)
                : new Date(0);
              const timeB = b.followup_datetime
                ? new Date(b.followup_datetime)
                : new Date(0);
              return timeA - timeB;
            });

          if (filteredRows.length === 0) return null;

          return (
            <div key={date} className="mb-8 bg-gray-200 shadow rounded">
              <div className="bg-blue-500 text-white text-center py-2 font-semibold">
                {date} &nbsp; FOLLOW UP / DEMO
              </div>

              <table className="w-full text-sm border-collapse table-fixed">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="border px-3 py-2 text-left">Name</th>
                    <th className="border px-3 py-2 text-left">Mobile</th>
                    <th className="border px-3 py-2 text-left">Time</th>
                    <th className="border px-3 py-2 text-left w-80">Comment</th>
                    <th className="border px-3 py-2 text-left">Assigned To</th>
                    <th className="border px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((item, idx) => (
                    <tr key={idx} className="border-b bg-white">
                      {/* <td className="border px-3 py-2">{item.name}</td> */}
                      <td className="border px-3 py-2 w-32 ">
  {item.name}
  {item.status?.toLowerCase() === "demo" && (
    <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded ml-2">
      DEMO
    </span>
  )}
</td>
                      <td className="border px-3 py-2">{item.mobile}</td>
                      <td className="border px-3 py-2">
                        {item.followup_datetime
                          ? new Date(item.followup_datetime).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )
                          : ""}
                      </td>

                      <td className="border px-3 py-2">
                        <div className="flex justify-between items-center gap-3">
                          <span>{item.comment}</span>
                          <div className="flex gap-2">
                            {/* <button
                              className="hover:bg-gray-200 rounded p-2"
                              onClick={() =>
                                setNoteModalData({
                                  customer_id: item.customer_id,
                                })
                              }
                              title="Add Note"
                            >
                              <NotebookPen className="w-5 h-5 text-gray-600" />
                            </button> */}
                            <button
                              className="hover:bg-gray-200 rounded p-2"
                              onClick={() =>
                                setSelectedCustomer(item.customer_id)
                              }
                              title="View History"
                            >
                              <MessageCircle className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="border px-3 py-2">
                        {item.employee_name || "Unassigned"}
                      </td>

                      <td className="border px-3 py-2">
                        <div className="flex justify-between items-center">
                          <span>{item.status}</span>
                          <button
                            className="hover:bg-gray-200 rounded p-2"
                            onClick={() =>
                              setStatusModalData({
                                customer_id: item.customer_id,
                                currentStatus: item.value,
                                newStatus: item.value,
                                batch_id: item.batch_id,
                              })
                            }
                            title="Change Status"
                          >
                            <SquarePen className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

      {/* ===== Modals ===== */}
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
  );
}
