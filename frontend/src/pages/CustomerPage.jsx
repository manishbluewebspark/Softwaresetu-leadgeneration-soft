// import React, { useEffect, useState, useMemo, useCallback, forwardRef } from "react";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
// import Modal from "react-modal";
// import { toast, ToastContainer } from "react-toastify";
// import DatePicker from "react-datepicker";
// import { Calendar } from "lucide-react"; 
// import "react-toastify/dist/ReactToastify.css";
// import "react-datepicker/dist/react-datepicker.css";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import "./dealTable.css";


// ModuleRegistry.registerModules([AllCommunityModule]);
// Modal.setAppElement("#root");

// export default function CustomerPage() {
//   const [rowData, setRowData] = useState([]);
//   const [openModalData, setOpenModalData] = useState(null);
//   const [dateTimeMap, setDateTimeMap] = useState({});
//   const [openTextModalData, setOpenTextModalData] = useState(null);
//   const [textInputMap, setTextInputMap] = useState({});
//   const [statusData, setStatusData] = useState([]);

//   const [statusFullData, setStatusFullData] = useState([]);
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [isChange, setIsChange] = useState(false)


//   useEffect(() => {
//     const fetchStatuses = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/status`);
//         const filterStatus = res.data.map((status) => status.name);


//         setStatusData(filterStatus);
//         setStatusFullData(res.data);
//       } catch (err) {
//         console.error("Error fetching statuses:", err);
//         toast.error("Failed to load statuses ❌");
//       }
//     };

//     const fetchData = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         if (!user?.id) return;

//         const url = `${apiUrl}/customers/assigned?assigned_to=${user.id}`;
//         const { data } = await axios.get(url);
//         setRowData(data);
//       } catch (error) {
//         console.error("Error fetching customers:", error);
//         toast.error("Failed to load customers ❌");
//       }
//     };
//     fetchData();
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

//   const columnDefs = useMemo(
//     () => [
//       { headerName: "ID", field: "customer_id", sortable: true, filter: true },
//       { headerName: "Name", field: "name", sortable: true, filter: true },
//       { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
//       { headerName: "Address", field: "address", sortable: true, filter: true },
//       {
//         headerName: "Status",
//         field: "status",
//         sortable: true,
//         filter: true,
//         editable: true,
//         cellEditor: "agSelectCellEditor",
//         cellEditorParams: {
//           values: statusData,
//           popupPosition: "under",
//         },
//       },
//       {
//         headerName: "Follow Up Date/Time",
//         field: "followup_datetime",
//         sortable: true,
//         filter: true,
//       },
//     ],
//     [statusData]
//   );


//   const handleStatusChange = async (params) => {
//     const value = params.newValue?.trim();
//     console.log(value, 'value...');

//     const selectedObj = statusFullData.find(
//       (item) => item.name.trim().toLowerCase() === value?.toLowerCase()
//     );
//     const statusid = selectedObj?.id ?? null;
//     console.log(statusid, 'statusid..');

//     if (params.colDef.field === "status" && statusid) {
//       const { customer_id } = params.data;
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user?.id || !user?.name) return;

//       if (value === "Demo" || value === "Follow Up") {
//         setOpenModalData({ customer_id, status: value });
//         return;
//       }

//       if (value === "Using Another Services" || value === "Language Issue") {
//         setOpenTextModalData({ customer_id, status: value });
//         return;
//       }

//       try {
//         await axios.put(`${apiUrl}/customers/status/${customer_id}`, {
//           customer_id,
//           status: value,               // ✅ always newValue bhejna hai
//           updated_by_id: user.id,
//           updated_by_name: user.name,
//           statusid: statusid,          // ✅ trimmed match ka
//         });

//         setIsChange(!isChange);
//         toast.success("Status updated successfully");
//       } catch (error) {
//         console.error("Error updating status:", error);
//         toast.error("Failed to update status");
//       }
//     }
//   };





//   const handleSaveDateTime = async () => {
//     if (!openModalData) return;
//     const user = JSON.parse(localStorage.getItem("user"));
//     const dateTime = dateTimeMap[openModalData.customer_id] || "";

//     const value = openModalData.status
//     const selectedObj = statusFullData.find(
//       (item) => item.name.trim().toLowerCase() === value?.toLowerCase()
//     );
//     const statusid = selectedObj?.id ?? null;


//     try {
//       await axios.put(
//         `${apiUrl}/customers/status/${openModalData.customer_id}`,
//         {
//           customer_id: openModalData.customer_id,
//           status: openModalData.status,
//           updated_by_id: user.id,
//           updated_by_name: user.name,
//           followup_datetime: dateTime,
//           statusid: statusid

//         }
//       );

//       setRowData((prev) =>
//         prev.map((row) =>
//           row.customer_id === openModalData.customer_id
//             ? { ...row, status: openModalData.status, followup_datetime: dateTime }
//             : row
//         )
//       );

//       toast.success("Follow-up date/time saved");
//     } catch (error) {
//       console.error("Error updating status with date/time:", error);
//       toast.error("Failed to save follow-up");
//     } finally {
//       setOpenModalData(null);
//     }
//   };

//   const handleSaveTextInput = async () => {
//     if (!openTextModalData) return;
//     const user = JSON.parse(localStorage.getItem("user"));
//     const textValue = textInputMap[openTextModalData.customer_id] || "";

//     try {
//       await axios.put(
//         `${apiUrl}/customers/status/${openTextModalData.customer_id}`,
//         {
//           customer_id: openTextModalData.customer_id,
//           status: openTextModalData.status,
//           updated_by_id: user.id,
//           updated_by_name: user.name,
//           note: textValue,
//         }
//       );

//       setRowData((prev) =>
//         prev.map((row) =>
//           row.customer_id === openTextModalData.customer_id
//             ? { ...row, status: openTextModalData.status, note: textValue }
//             : row
//         )
//       );

//       toast.success("Note saved successfully");
//     } catch (error) {
//       console.error("Error updating status with text:", error);
//       toast.error("Failed to save note");
//     } finally {
//       setOpenTextModalData(null);
//     }
//   };

//   // Custom Date Input with Calendar Icon
//   const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
//     <div
//       onClick={onClick}
//       ref={ref}
//       className="flex justify-between items-center border border-gray-300 rounded px-3 py-2 w-90 cursor-pointer bg-white"
//     >
//       <span className={value ? "text-black" : "text-gray-400"}>
//         {value || "Select date & time"}
//       </span>
//       <Calendar className="w-5 h-5 text-gray-500 mr-2" />
//     </div>
//   ));


//   console.log(rowData, 'rowData...')


//   return (
//     <div className="p-6 bg-gray-50 rounded-lg shadow-md">
//       <h1 className="text-lg font-semibold mb-5">Customer</h1>
//       <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
//         <AgGridReact
//           rowData={rowData.filter((row) => row.status !== "Deal")}
//           columnDefs={columnDefs}
//           pagination={true}
//           paginationPageSize={20}
//           onCellValueChanged={handleStatusChange}
//           singleClickEdit={true}
//           gridOptions={gridOptions}
//         />
//         <Modal
//           isOpen={!!openModalData}
//           shouldCloseOnOverlayClick={false}
//           shouldCloseOnEsc={false}
//           onRequestClose={() => setOpenModalData(null)}
//           contentLabel="Select Date and Time"
//           className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20 relative z-[9999]"
//           overlayClassName="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[9998]"
//         >
//           <div className="flex justify-between items-center mb-4 gap-10">
//             <h2 className="text-xl font-bold">
//               Select Date & Time for {openModalData?.status}
//             </h2>
//             <button
//               onClick={() => setOpenModalData(null)}
//               className="text-black hover:text-gray-700 text-2xl font-bold"
//             >
//               ×
//             </button>
//           </div>
//           <DatePicker
//             selected={
//               dateTimeMap[openModalData?.customer_id]
//                 ? new Date(dateTimeMap[openModalData?.customer_id])
//                 : null
//             }
//             onChange={(date) =>
//               setDateTimeMap((prev) => ({
//                 ...prev,
//                 [openModalData.customer_id]: date,
//               }))
//             }
//             showTimeSelect
//             showTimeSelectSeconds
//             timeIntervals={1}
//             minDate={new Date()}
//             dateFormat="dd/MM/yyyy HH:mm:ss"
//             timeFormat="HH:mm:ss"
//             customInput={<CustomDateInput />}
//           />

//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => setOpenModalData(null)}
//               className="px-4 py-2 bg-gray-400 text-white rounded"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSaveDateTime}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               Save
//             </button>
//           </div>
//         </Modal>
//         <Modal
//           isOpen={!!openTextModalData}
//           shouldCloseOnOverlayClick={false}
//           shouldCloseOnEsc={false}
//           onRequestClose={() => setOpenTextModalData(null)}
//           contentLabel="Enter Note"
//           className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20 relative z-[9999]"
//           overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]"
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">
//               Enter Note for {openTextModalData?.status}
//             </h2>
//             <button
//               onClick={() => setOpenTextModalData(null)}
//               className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//             >
//               ×
//             </button>
//           </div>
//           <input
//             type="text"
//             value={textInputMap[openTextModalData?.customer_id] || ""}
//             onChange={(e) =>
//               setTextInputMap((prev) => ({
//                 ...prev,
//                 [openTextModalData.customer_id]: e.target.value,
//               }))
//             }
//             className="border p-2 w-full mb-4 rounded"
//           />
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setOpenTextModalData(null)}
//               className="px-4 py-2 bg-gray-400 text-white rounded"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSaveTextInput}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               Save
//             </button>
//           </div>
//         </Modal>

//         <ToastContainer position="top-right" autoClose={2000} />
//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState, useMemo, forwardRef } from "react";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { ModuleRegistry, AllCommunityModule , QuickFilterModule, } from "ag-grid-community";
// import Modal from "react-modal";
// import { toast, ToastContainer } from "react-toastify";
// import DatePicker from "react-datepicker";
// import { Calendar, ChevronDown } from "lucide-react";
// import "react-toastify/dist/ReactToastify.css";
// import "react-datepicker/dist/react-datepicker.css";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

// ModuleRegistry.registerModules([AllCommunityModule]);
// Modal.setAppElement("#root");

// export default function CustomerPage() {
//   const [rowData, setRowData] = useState([]);
//   const [openModalData, setOpenModalData] = useState(null);
//   const [dateTimeMap, setDateTimeMap] = useState({});
//   const [openTextModalData, setOpenTextModalData] = useState(null);
//   const [textInputMap, setTextInputMap] = useState({});
//   const [statusData, setStatusData] = useState([]);
//   const [statusFullData, setStatusFullData] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState(""); 
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [isChange, setIsChange] = useState(false);

//   useEffect(() => {
//     const fetchStatuses = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/status`);
//         const filterStatus = res.data.map((status) => status.name);
//         setStatusData(filterStatus);
//         setStatusFullData(res.data);
//       } catch (err) {
//         console.error("Error fetching statuses:", err);
//         toast.error("Failed to load statuses ❌");
//       }
//     };

//     const fetchData = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user"));
//         if (!user?.id) return;

//         const url = `${apiUrl}/customers/assigned?assigned_to=${user.id}`;
//         const { data } = await axios.get(url);
//         setRowData(data);
//       } catch (error) {
//         console.error("Error fetching customers:", error);
//         toast.error("Failed to load customers ❌");
//       }
//     };
//     fetchData();
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

//   const columnDefs = useMemo(
//     () => [
//       { headerName: "ID", field: "customer_id", sortable: true, filter: true },
//       { headerName: "Name", field: "name", sortable: true, filter: true },
//       { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
//       { headerName: "Address", field: "address", sortable: true, filter: true },
//       {
//         headerName: "Status",
//         field: "status",
//         sortable: true,
//         filter: true,
//         editable: true,
//         cellEditor: "agSelectCellEditor",
//         cellEditorParams: {
//           values: statusData,
//           popupPosition: "under",
//         },
//       },
//       {
//         headerName: "Follow Up Date/Time",
//         field: "followup_datetime",
//         sortable: true,
//         filter: true,
//       },
//     ],
//     [statusData]
//   );

//   // ⬇️ Row filter karna dropdown ke hisaab se
//   const filteredData = useMemo(() => {
//     let data = rowData.filter((row) => row.status !== "Deal");
//     if (selectedStatus) {
//       data = data.filter((row) => row.status === selectedStatus);
//     }
//     return data;
//   }, [rowData, selectedStatus]);

//   // Status update handlers (aapka existing code same rahega)
//   const handleStatusChange = async (params) => {
//     const value = params.newValue?.trim();
//     const selectedObj = statusFullData.find(
//       (item) => item.name.trim().toLowerCase() === value?.toLowerCase()
//     );
//     const statusid = selectedObj?.id ?? null;

//     if (params.colDef.field === "status" && statusid) {
//       const { customer_id } = params.data;
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user?.id || !user?.name) return;

//       if (value === "Demo" || value === "Follow Up") {
//         setOpenModalData({ customer_id, status: value });
//         return;
//       }

//       if (value === "Using Another Services" || value === "Language Issue") {
//         setOpenTextModalData({ customer_id, status: value });
//         return;
//       }

//       try {
//         await axios.put(`${apiUrl}/customers/status/${customer_id}`, {
//           customer_id,
//           status: value,
//           updated_by_id: user.id,
//           updated_by_name: user.name,
//           statusid: statusid,
//         });

//         setIsChange(!isChange);
//         toast.success("Status updated successfully");
//       } catch (error) {
//         console.error("Error updating status:", error);
//         toast.error("Failed to update status");
//       }
//     }
//   };

//   // Custom Date Input with Calendar Icon
//   const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
//     <div
//       onClick={onClick}
//       ref={ref}
//       className="flex justify-between items-center border border-gray-300 rounded px-3 py-2 w-90 cursor-pointer bg-white"
//     >
//       <span className={value ? "text-black" : "text-gray-400"}>
//         {value || "Select date & time"}
//       </span>
//       <Calendar className="w-5 h-5 text-gray-500 mr-2" />
//     </div>
//   ));

//   return (
//     <div className="p-6 bg-gray-50 rounded-lg shadow-md">
// <div className="flex justify-between">
//         <h1 className="text-lg font-semibold mb-5">Customer</h1>
//     <div className="mb-4 relative w-64">
//       <select
//         value={selectedStatus}
//         onChange={(e) => setSelectedStatus(e.target.value)}
//         className="border px-4 py-2 rounded w-full appearance-none pr-10"
//       >
//         <option value="">All Status</option>
//         {statusData.map((status, idx) => (
//           <option key={idx} value={status}>
//             {status}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         size={20}
//         className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
//       />
//     </div>
// </div>

//       <div className="ag-theme-quartz" style={{ height: 500 }}>
//         <AgGridReact
//           rowData={filteredData}
//           columnDefs={columnDefs}
//           pagination={true}
//           paginationPageSize={20}
//           onCellValueChanged={handleStatusChange}
//           singleClickEdit={true}
//           gridOptions={gridOptions}
//         />
//         <ToastContainer position="top-right" autoClose={2000} />
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState, useMemo, forwardRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import { Calendar, ChevronDown, NotebookPen, NotepadText, SquarePen } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import StatusModal from '../components/StatusModal'
import "./dealTable.css";
import NoteModal from "../components/NoteModal";
import LeadHistoryModal from "../components/LeadHistoryModal";
import { MessageCircle } from "lucide-react";
import SourceFilter from  '../components/SourceFilter'

ModuleRegistry.registerModules([AllCommunityModule]);


export default function CustomerPage() {
  const [rowData, setRowData] = useState([]);
    const [rowCopyData, setCopyRowData] = useState([]);
  const [openModalData, setOpenModalData] = useState(null);
  const [dateTimeMap, setDateTimeMap] = useState({});
  const [openTextModalData, setOpenTextModalData] = useState(null);
  const [textInputMap, setTextInputMap] = useState({});
  const [statusData, setStatusData] = useState([]);
  const [statusFullData, setStatusFullData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [quickFilterText, setQuickFilterText] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const [isChange, setIsChange] = useState(false);
  const [statusModalData, setStatusModalData] = useState(null);
  const [commentMap, setCommentMap] = useState({});
  const [noteModalData, setNoteModalData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
   const [selectedSource, setSelectedSource] = useState("0");

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/status`);
        const filterStatus = res.data.map((status) => status.name);
        setStatusData(filterStatus);
        setStatusFullData(res.data);
      } catch (err) {
        console.error("Error fetching statuses:", err);
        toast.error("Failed to load statuses ❌");
      }
    };

    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;

        const url = `${apiUrl}/customers/assigned?assigned_to=${user.id}`;
        const { data } = await axios.get(url);
        setRowData(data);
        setCopyRowData(data)
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers ❌");
      }
    };
    fetchData();
    fetchStatuses();
  }, [isChange]);

  const gridOptions = {
    defaultColDef: {
      flex: 1,
      resizable: true,
      sortable: true,
      filter: true,
    },
    // singleClickEdit: true,
  };

  // const columnDefs = useMemo(
  //   () => [
  //     { headerName: "ID", field: "customer_id", sortable: true, filter: true },
  //     { headerName: "Name", field: "name", sortable: true, filter: true },
  //     { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
  //     { headerName: "Address", field: "address", sortable: true, filter: true },
  //     {
  //       headerName: "Status",
  //       field: "status",
  //       sortable: true,
  //       filter: true,
  //       editable: true,
  //       cellEditor: "agSelectCellEditor",
  //       cellEditorParams: {
  //         values: statusData,
  //         popupPosition: "under",
  //       },
  //     },
  //     {
  //       headerName: "Follow Up Date/Time",
  //       field: "followup_datetime",
  //       sortable: true,
  //       filter: true,
  //     },
  //   ],
  //   [statusData]
  // );


  const columnDefs = useMemo(
    () => [
      // { headerName: "ID", field: "customer_id" },
      { headerName: "Name", field: "name" },
      { headerName: "Mobile", field: "mobile" },
      // { headerName: "Address", field: "address" },
      { headerName: "Status", field: "status" },
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
      {
        headerName: "Status Change",
        field: "status",
        width: 150,
        maxWidth: 150,
        // cellRenderer: (params) => (
        //   <button
        //     className="p-1 rounded hover:bg-gray-100 flex w-full"
        //     onClick={() =>
        //       setStatusModalData({
        //         customer_id: params.data.customer_id,
        //         currentStatus: params.value,
        //         newStatus: params.value,
        //         batch_id:params.data.batch_id
        //       })
        //     }
        //   >
        //     <SquarePen size={14} className="text-gray-600" />
        //   </button>
        // ),
        cellRenderer: (params) => (
          <div className="flex gap-8 items-center justify-center">
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

            <span class="border-l border-gray-400 h-6 inline-block"></span>

            <button
              className="p-1 rounded hover:bg-gray-100 flex"
              onClick={() => {
                console.log("Customer ID:", params.data.customer_id);
                setNoteModalData({
                  customer_id: params.data.customer_id,
                });
              }}
            >
              <NotepadText size={14} className="text-gray-600" />
            </button>
          </div>
        ),
      },
      { headerName: "Follow Up Date/Time", field: "followup_datetime" },
    ],
    []
  );


  console.log(statusModalData, 'statusModalData..')

  // ⬇️ Row filter karna dropdown ke hisaab se
  const filteredData = useMemo(() => {
    let data = rowData.filter((row) => row.status !== "Deal");
    if (selectedStatus) {
      data = data.filter((row) => row.status === selectedStatus);
    }
    return data;
  }, [rowData, selectedStatus]);

  // const handleStatusChange = async (params) => {
  //   const value = params.newValue?.trim();
  //   const selectedObj = statusFullData.find(
  //     (item) => item.name.trim().toLowerCase() === value?.toLowerCase()
  //   );
  //   const statusid = selectedObj?.id ?? null;

  //   if (params.colDef.field === "status" && statusid) {
  //     const { customer_id } = params.data;
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     if (!user?.id || !user?.name) return;

  //     if (value === "Demo" || value === "Follow Up") {
  //       setOpenModalData({ customer_id, status: value });
  //       return;
  //     }

  //     if (value === "Using Another Services" || value === "Language Issue") {
  //       setOpenTextModalData({ customer_id, status: value });
  //       return;
  //     }

  //     try {
  //       await axios.put(`${apiUrl}/customers/status/${customer_id}`, {
  //         customer_id,
  //         status: value,
  //         updated_by_id: user.id,
  //         updated_by_name: user.name,
  //         statusid: statusid,
  //       });

  //       setIsChange(!isChange);
  //       toast.success("Status updated successfully");
  //     } catch (error) {
  //       console.error("Error updating status:", error);
  //       toast.error("Failed to update status");
  //     }
  //   }
  // };

  // const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  //   <div
  //     onClick={onClick}
  //     ref={ref}
  //     className="flex justify-between items-center border border-gray-300 rounded px-3 py-2 w-90 cursor-pointer bg-white"
  //   >
  //     <span className={value ? "text-black" : "text-gray-400"}>
  //       {value || "Select date & time"}
  //     </span>
  //     <Calendar className="w-5 h-5 text-gray-500 mr-2" />
  //   </div>
  // ));


    useEffect(() => {


if(selectedSource!="0")
{
let filter = rowCopyData.filter((val)=>val.batch_id==selectedSource)
setRowData(filter)

}
else
{
let dataaa = rowCopyData
setRowData(dataaa)

}

}, [selectedSource]);


  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-lg font-semibold">Customer</h1>


        <div className="flex gap-4">

<SourceFilter
selectedSource={selectedSource}
setSelectedSource={setSelectedSource}
/>

          <div className="relative w-64">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border px-4 py-2 rounded w-full appearance-none pr-10"
            >
              <option value="">All Status</option>
              {statusData.map((status, idx) => (
                <option key={idx} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
            />
          </div>



          <input
            type="text"
            placeholder="Search..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            className="border px-4 py-2 rounded w-64"
          />
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 710 }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={100}
          // onCellValueChanged={handleStatusChange}
          singleClickEdit={true}
          gridOptions={gridOptions}
          quickFilterText={quickFilterText}
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


        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
}
