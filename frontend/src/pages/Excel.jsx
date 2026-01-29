// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { Eye, Trash } from "lucide-react";
// import { FaTrash } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
// import "./dealTable.css";
// import QuickFilter from "./QuickFilter";

// ModuleRegistry.registerModules([AllCommunityModule]);

// Modal.setAppElement("#root");

// export default function Excel() {
//   const [quickFilterText, setQuickFilterText] = useState("");

//   const [batches, setBatches] = useState([]);
//   const [file, setFile] = useState(null);
//   const [sourceName, setSourceName] = useState("");
//   const [description, setDescription] = useState("");
//   const navigate = useNavigate();
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [loading, setLoading] = useState(false);
//   const [loadingManual, setManualLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false)
//   const [success, setSuccess] = useState(false);
//   const [deleteBatchId, setDeleteBatchId] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedRowId, setSelectedRowId] = useState(null);




//   // Modal States
//   const [showModal, setShowModal] = useState(false);
//   const [manualForm, setManualForm] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     address: "",
//   });
//   const [manualRecords, setManualRecords] = useState([]);


//   const openDeleteModal = (batchId) => {
//     setDeleteBatchId(batchId);
//     setIsDeleteModalOpen(true);
//   };


//   const confirmDelete = async () => {
//     try {
//       setDeleteLoading(true)
//       await axios.delete(`${apiUrl}/customers/batch/${deleteBatchId}`);
//       toast.success("Batch deleted successfully ✅");
//       fetchBatches()
//     } catch (err) {
//       console.error("Delete failed:", err);
//       toast.error("Failed to delete batch ❌");
//     } finally {
//       setIsDeleteModalOpen(false);
//       setDeleteBatchId(null);
//       setDeleteLoading(false)
//     }
//   };




//   const fetchBatches = async () => {
//     try {
//       const { data } = await axios.get(`${apiUrl}/customers/get-batches`);
//       setBatches(data);
//     } catch (err) {
//       toast.error("Error fetching batches!");
//       console.error("Error fetching batches:", err);
//     }
//   };



//   const handleUpload = async () => {
//     if (!file) {
//       toast.warning("Please select a file first!");
//       return;
//     }
//     if (!sourceName.trim()) {
//       toast.warning("Please enter a Source Name!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("source_name", sourceName);
//     formData.append("description", description);
//     try {
//       setLoading(true);
//       await axios.post(`${apiUrl}/customers/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setFile(null);
//       setSourceName("");
//       fetchBatches();
//       toast.success("File uploaded successfully!");
//     } catch (err) {
//       toast.error(`Upload failed: ${err.response?.data?.message || err.message}`);
//       console.error("Upload failed:", err);
//     } finally {
//       setTimeout(() => setLoading(false), 2000);
//     }
//   };

//   const handleimprtexample = () => {
//     const link = document.createElement("a");
//     link.href = "/example.xlsx";
//     link.download = "example.xlsx";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Add record temporarily in list
//   const handleAddRecord = (e) => {
//     e.preventDefault();
//     const { name, email, mobile, address } = manualForm;

//     if (!name || !email || !mobile || !address) {
//       toast.warning("Please fill all fields!");
//       return;
//     }

//     setManualRecords([...manualRecords, manualForm]);
//     setManualForm({ name: "", email: "", mobile: "", address: "" });
//   };

//   // Final submit all manual records
//   const handleSubmitAllManual = async () => {

//     setManualLoading(true)
//     if (!sourceName.trim()) {
//       toast.warning("Please Enter A Source Name First!");
//       return;
//     }

//     if (manualRecords.length === 0) {
//       toast.warning("No records added!");
//       return;
//     }

//     try {
//       // Convert manualRecords to CSV string
//       const csvHeader = "name,email,mobile,address\n";
//       const csvRows = manualRecords
//         .map(
//           (rec) =>
//             `${rec.name},${rec.email},${rec.mobile},${rec.address}`
//         )
//         .join("\n");
//       const csvContent = csvHeader + csvRows;

//       // Blob banake FormData me file append karenge
//       const blob = new Blob([csvContent], { type: "text/csv" });
//       const formData = new FormData();
//       formData.append("file", blob, "manual_upload.csv");
//       formData.append("source_name", sourceName);

//       await axios.post(`${apiUrl}/customers/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Manual batch uploaded successfully!");
//       setManualLoading(false)
//       setManualRecords([]);
//       setShowModal(false);
//       setSourceName("");
//       fetchBatches();
//     } catch (err) {
//       toast.error("Failed to submit records!");
//       console.error("Manual Batch Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const defaultColDef = useMemo(
//     () => ({ sortable: true, filter: true, resizable: true }),
//     []
//   );



//   const columnDefs = useMemo(
//     () => [
//       { headerName: "No", valueGetter: "node.rowIndex + 1", width: 80 },
//       { headerName: "Name", field: "name", sortable: true, filter: true },
//       { headerName: "Email", field: "email", sortable: true, filter: true },
//       { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
//       { headerName: "Address", field: "address", sortable: true, filter: true },
//     ],
//     []
//   );


//   const handleDelete = async (batchId) => {
//     if (!window.confirm("Are you sure you want to delete all customers in this batch?")) {
//       return;
//     }

//     try {
//       await axios.delete(`${apiUrl}/customers/batch/${batchId}`);
//       toast.success("Batch deleted successfully ✅");

//       // Refresh table after delete
//       setIsChange(!isChange);
//     } catch (err) {
//       console.error("Delete failed:", err);
//       toast.error("Failed to delete batch ❌");
//     }
//   };



//   return (
//     <>
//       <div className="p-6 space-y-8 bg-gray-50 rounded-lg shadow-md">
//         <div className="flex items-center gap-2">
//           <img
//             src="/excel.png"
//             alt="Excel"
//             className="h-20 w-auto object-contain"
//           />
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow-md space-y-4">




//  <button
//                 onClick={() => {
//                   if (!sourceName.trim()) {
//                     toast.warning("Please enter a Source Name first!");
//                     return;
//                   }
//                   setShowModal(true);
//                 }}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//               >
//                 Add Manually
//               </button>


//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 items-center">
//             <input
//               type="text"
//               placeholder="Enter Source Name"
//               value={sourceName}
//               onChange={(e) => setSourceName(e.target.value)}
//               className="px-4 py-2 border border-gray-400 w-full focus:ring focus:ring-blue-200"
//             />
//             <input
//               type="text"
//               placeholder="Enter Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="px-4 py-2 border border-gray-400 w-full focus:ring focus:ring-blue-200"
//             />
//             <input
//               type="file"
//               accept=".xlsx, .xls, .csv"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="px-4 py-2 border border-gray-400 w-full"
//             />
//             <div className="flex gap-4 md:col-span-2 flex-wrap">
//               {/* <button
//               onClick={handleUpload}
//               disabled={loading}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md"
//             >
//               {loading ? "Uploading..." : "Upload Excel"}
//             </button> */}
//               <button
//                 onClick={handleUpload}
//                 disabled={loading}
//                 className="relative inline-flex items-center justify-center px-20 py-3 overflow-hidden font-medium transition duration-300 ease-out bg-blue-600 text-white rounded-lg shadow-md"
//               >
//                 <span
//                   className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 transform
//            ${loading ? "translate-x-0 bg-blue-500" : "-translate-x-full"}
//          `}
//                 >
//                   {loading ? (
//                     <svg
//                       className="w-6 h-6 animate-spin"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 4v4m0 8v4m8-8h4M4 12H0m16.24-4.24l2.83-2.83M4.93 19.07l-2.83 2.83M16.24 19.07l2.83 2.83M4.93 4.93L2.1 2.1"
//                       />
//                     </svg>
//                   ) : (
//                     ""
//                   )}
//                 </span>
//                 <span
//                   className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-500 transform
//            ${loading ? "translate-x-full text-white" : "translate-x-0"}
//        `}
//                 >
//                   {loading ? "Uploading..." : success ? "Uploaded" : "Upload Excel"}
//                 </span>
//                 <span className="relative invisible">
//                   {loading ? "Uploading..." : success ? "Uploaded" : "Upload Excel"}
//                 </span>
//               </button>

//               <button
//                 onClick={handleimprtexample}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 Download Example File
//               </button>
             
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-md">
//           {/* <h2 className="text-xl font-semibold mb-3 uppercase">Uploaded Excel List</h2> */}
//           <div className="flex justify-between p-4" >
//             <h2 className="text-xl font-semibold mb-3 uppercase">Uploaded Excel List</h2>
//             <QuickFilter
//               value={quickFilterText}
//               onChange={setQuickFilterText}
//             />
//           </div>
//           <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
//             <AgGridReact
//               rowData={batches}
//               columnDefs={[
//                 { headerName: "Batch ID", field: "batch_id", flex: 0.5 },
//                 { headerName: "Source", field: "source_name", flex: 1 },
//                 { headerName: "Description", field: "description", flex: 1 },
//                  {
//         headerName: "Pending Leads",
//         field: "pending_count",
//         flex: 0.8,
//         cellRenderer: (params) => {
//           const pendingCount = params.value || 0;
//           return (
//             <div className={`inline-flex items-center px-3 py-0.1 rounded-full text-sm font-semibold ${
//               pendingCount > 0 
//                 ? 'bg-red-100 text-red-800 border border-red-300' 
//                 : 'bg-green-100 text-green-800 border border-green-300'
//             }`}>
//               {pendingCount > 0 ? (
//                 <>
                 
//                   {pendingCount} 
//                 </>
//               ) : (
//                 <>
                 
//                   0
//                 </>
//               )}
//             </div>
//           );
//         },
//         comparator: (valueA, valueB) => valueA - valueB,
//       },
//                 {
//                   headerName: "View",
//                   field: "action",
//                   flex: 0.3,
//                   cellRenderer: (params) => (
//                     <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//                       <div className="flex items-center gap-2">
//                         <Eye
//                           size={18}
//                           className="cursor-pointer text-gray-600"
//                           onClick={() => navigate(`/excel/batch/${params.data.batch_id}`)}
//                         />
//                         <Trash
//                           size={18}
//                           className="cursor-pointer text-gray-600"
//                           onClick={() => handleDelete(params.data.batch_id)}
//                         />
//                       </div>
//                     </div>
//                   ),
//                 },
//                 {
//                   headerName: "Date",
//                   field: "created_at",
//                   valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString() : "-"),
//                 },
//               ]}
//               defaultColDef={defaultColDef}
//               pagination={true}
//               paginationPageSize={100}
//               quickFilterText={quickFilterText}
//               onRowClicked={(params) => setSelectedRowId(params.data.batch_id)}
//               getRowStyle={(params) => {
//                 return params.data.batch_id === selectedRowId
//                   ? {
//                     backgroundColor: "#c4c4c4",
//                     borderLeft: "4px solid #22c55e",
//                     transition: "background-color 0.3s ease",
//                   }
//                   : null;
//               }}
//             />

//           </div>
//         </div>

//         {/* Modal for Manual Add */}
//         {/* <Modal
//         isOpen={showModal}
//         onRequestClose={() => setShowModal(false)}
//         className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-20 outline-none"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
//       >
//         <h2 className="text-xl font-bold mb-4">Add Records Manually</h2>
//         <form onSubmit={handleAddRecord} className="space-y-3">
//           <div className="grid grid-cols-2 gap-3">
//             <input
//               type="text"
//               placeholder="Name"
//               value={manualForm.name}
//               onChange={(e) =>
//                 setManualForm({ ...manualForm, name: e.target.value })
//               }
//               className="w-full border p-2 rounded"
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={manualForm.email}
//               onChange={(e) =>
//                 setManualForm({ ...manualForm, email: e.target.value })
//               }
//               className="w-full border p-2 rounded"
//             />
//             <input
//               type="text"
//               placeholder="Mobile"
//               value={manualForm.mobile}
//               onChange={(e) =>
//                 setManualForm({ ...manualForm, mobile: e.target.value })
//               }
//               className="w-full border p-2 rounded"
//             />
//             <input
//               type="text"
//               placeholder="Address"
//               value={manualForm.address}
//               onChange={(e) =>
//                 setManualForm({ ...manualForm, address: e.target.value })
//               }
//               className="w-full border p-2 rounded"
//             />
//           </div>
//           <div className="flex justify-between pt-3">
//             <button
//               type="submit"
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Add Record
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmitAllManual}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Submit All
//             </button>
//           </div>
//         </form>

      
//         {manualRecords.length > 0 && (
//           <div className="mt-6">
//             <h3 className="font-semibold mb-2">Added Records</h3>
//             <ul className="space-y-1">
//               {manualRecords.map((rec, idx) => (
//                 <li key={idx} className="p-2 border rounded bg-gray-50">
//                   {rec.name} - {rec.email} - {rec.mobile} - {rec.address}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </Modal> */}

//         <Modal
//           isOpen={showModal}
//           onRequestClose={() => setShowModal(false)}
//           className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-20 outline-none relative top-1"
//           overlayClassName="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
//         >
//           <h2 className="text-xl font-bold mb-4">Add Records Manually</h2>
//           <form onSubmit={handleAddRecord} className="space-y-3">
//             <div className="grid grid-cols-2 gap-3">
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={manualForm.name}
//                 onChange={(e) =>
//                   setManualForm({ ...manualForm, name: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={manualForm.email}
//                 onChange={(e) =>
//                   setManualForm({ ...manualForm, email: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Mobile"
//                 value={manualForm.mobile}
//                 onChange={(e) =>
//                   setManualForm({ ...manualForm, mobile: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Address"
//                 value={manualForm.address}
//                 onChange={(e) =>
//                   setManualForm({ ...manualForm, address: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//             <div className="flex justify-between pt-3">
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Add Record
//               </button>
//               {/* <button
//               type="button"
//               onClick={handleSubmitAllManual}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Submit All
//             </button> */}
//  {manualRecords.length > 0 && (
//               <button
//                 onClick={handleSubmitAllManual}
//                 disabled={loadingManual}
//                 className="relative inline-flex items-center justify-center px-20 py-3 overflow-hidden font-medium transition duration-300 ease-out bg-blue-600 text-white rounded-lg shadow-md"
//               >
//                 <span
//                   className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 transform
//            ${loadingManual ? "translate-x-0 bg-blue-500" : "-translate-x-full"}
//          `}
//                 >
//                   {loadingManual ? (
//                     <svg
//                       className="w-6 h-6 animate-spin"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 4v4m0 8v4m8-8h4M4 12H0m16.24-4.24l2.83-2.83M4.93 19.07l-2.83 2.83M16.24 19.07l2.83 2.83M4.93 4.93L2.1 2.1"
//                       />
//                     </svg>
//                   ) : (
//                     ""
//                   )}
//                 </span>
//                 <span
//                   className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-500 transform
//            ${loadingManual ? "translate-x-full text-white" : "translate-x-0"}
//        `}
//                 >
//                   {loadingManual ? "Uploading..." : success ? "Uploaded" : "Upload Manually"}
//                 </span>
//                 <span className="relative invisible">
//                   {loadingManual ? "Uploading..." : success ? "Uploaded" : "Upload Manually"}
//                 </span>
//               </button>
//                   )}

//             </div>
//           </form>


//           {manualRecords.length > 0 && (
//             <div className="mt-6">
//               <h3 className="font-semibold mb-2">Added Records</h3>
//               <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
//                 <AgGridReact
//                   rowData={manualRecords}
//                   columnDefs={columnDefs}
//                   pagination={true}
//                   paginationPageSize={5}
//                   defaultColDef={{
//                     resizable: true,
//                     sortable: true,
//                     filter: true,
//                   }}
//                 />
//               </div>
//             </div>
//           )}



//         </Modal>
//       </div>

//       <Modal
//         isOpen={isDeleteModalOpen}
//         onRequestClose={() => setIsDeleteModalOpen(false)}
//         className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-40"
//         overlayClassName="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50"
//       >
//         <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
//         <p className="mb-6">
//           <span className="text-red-500">Are you sure you want to delete all customers in this batch? </span> <br></br>Deleting this batch will also remove all the linked data associated with these customers from every connected module. This action cannot be undone.
//         </p>


//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => setIsDeleteModalOpen(false)}
//             className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           {/* <button
//       onClick={confirmDelete}
//       className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//     >
//       Delete
//     </button> */}
//           <button
//             className={`px-4 py-2 text-white rounded-md flex items-center justify-center gap-2
//         ${deleteLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
//             onClick={confirmDelete}
//             disabled={deleteLoading}
//           >
//             {deleteLoading ? (
//               <>
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 
//               0 0 5.373 0 12h4z"
//                   ></path>
//                 </svg>
//                 Deleting...
//               </>
//             ) : (
//               "Delete"
//             )}
//           </button>
//         </div>
//       </Modal>


//     </>
//   );
// }


// ------------------------------------------------------------------------------- 29-01-2026 day --------------------------


// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { Eye, Trash, Download, AlertCircle, CheckCircle, FileText } from "lucide-react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
// import "./dealTable.css";
// import QuickFilter from "./QuickFilter";

// ModuleRegistry.registerModules([AllCommunityModule]);

// Modal.setAppElement("#root");

// // Duplicate Logs Modal Component
// const DuplicateLogsModal = ({ isOpen, onClose, batchId, sourceName }) => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedType, setSelectedType] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchDuplicateLogs = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/customers/duplicate-logs/${batchId}`
//       );
//       setLogs(response.data);
//     } catch (err) {
//       console.error("Error fetching duplicate logs:", err);
//       toast.error("Failed to fetch duplicate logs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isOpen && batchId) {
//       fetchDuplicateLogs();
//     }
//   }, [isOpen, batchId]);

//   const filteredLogs = logs.filter(log => {
//     const matchesType = !selectedType || log.duplicate_type === selectedType;
//     const matchesSearch = !searchTerm || 
//       log.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       log.mobile?.includes(searchTerm) ||
//       log.source_name?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesType && matchesSearch;
//   });

//   const columnDefs = useMemo(() => [
//     { 
//       headerName: "Type", 
//       field: "duplicate_type", 
//       width: 120,
//       cellRenderer: (params) => {
//         const type = params.value;
//         const color = type === 'in_file' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-orange-100 text-orange-800 border border-orange-300';
//         return (
//           <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
//             {type === 'in_file' ? 'In File' : 'In DB'}
//           </span>
//         );
//       }
//     },
//     { headerName: "Customer Name", field: "customer_name", flex: 1 },
//     { headerName: "Mobile", field: "mobile", width: 130 },
//     { headerName: "Email", field: "email", flex: 1 },
//     { headerName: "Upload Source", field: "source_name", width: 150 },
//     { 
//       headerName: "Existing Batch", 
//       field: "existing_batch_id", 
//       width: 120,
//       cellRenderer: (params) => params.value || '-'
//     },
//     { 
//       headerName: "Existing Source", 
//       field: "existing_source_name", 
//       width: 150,
//       cellRenderer: (params) => params.value || '-'
//     },
//     { 
//       headerName: "Date", 
//       field: "created_at", 
//       width: 180,
//       valueFormatter: (p) => p.value ? new Date(p.value).toLocaleString() : "-"
//     }
//   ], []);

//   const defaultColDef = useMemo(
//     () => ({ sortable: true, filter: true, resizable: true }),
//     []
//   );

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl mx-auto mt-10 outline-none"
//       overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
//     >
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-xl font-bold flex items-center gap-2">
//             <FileText size={24} className="text-blue-600" />
//             Duplicate Logs
//           </h2>
//           <p className="text-gray-600">
//             Batch: <span className="font-semibold">{batchId}</span> | 
//             Source: <span className="font-semibold">{sourceName}</span>
//           </p>
//         </div>
//         <button 
//           onClick={onClose} 
//           className="text-gray-500 hover:text-gray-700 text-2xl"
//         >
//           ✕
//         </button>
//       </div>

//       <div className="flex gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name, mobile, or source..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500"
//         />
//         <select
//           value={selectedType}
//           onChange={(e) => setSelectedType(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">All Types</option>
//           <option value="in_file">In-File Duplicates</option>
//           <option value="in_database">Database Duplicates</option>
//         </select>
//       </div>

//       <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//               <p className="mt-2 text-gray-600">Loading duplicate logs...</p>
//             </div>
//           </div>
//         ) : filteredLogs.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-gray-500">
//             <FileText size={48} className="mb-4" />
//             <p className="text-lg">No duplicate logs found</p>
//           </div>
//         ) : (
//           <AgGridReact
//             rowData={filteredLogs}
//             columnDefs={columnDefs}
//             pagination={true}
//             paginationPageSize={20}
//             defaultColDef={defaultColDef}
//           />
//         )}
//       </div>

//       {filteredLogs.length > 0 && (
//         <div className="mt-6 flex justify-between items-center">
//           <div className="text-gray-600">
//             Total Duplicates: <span className="font-semibold">{filteredLogs.length}</span>
//           </div>
//           <button
//             onClick={() => {
//               const csv = [
//                 ['Type', 'Customer Name', 'Mobile', 'Email', 'Upload Source', 'Existing Batch', 'Existing Source', 'Date'],
//                 ...filteredLogs.map(log => [
//                   log.duplicate_type === 'in_file' ? 'In File' : 'In Database',
//                   log.customer_name,
//                   log.mobile,
//                   log.email,
//                   log.source_name,
//                   log.existing_batch_id || '',
//                   log.existing_source_name || '',
//                   new Date(log.created_at).toLocaleString()
//                 ])
//               ].map(row => row.join(',')).join('\n');
              
//               const blob = new Blob([csv], { type: 'text/csv' });
//               const url = window.URL.createObjectURL(blob);
//               const a = document.createElement('a');
//               a.href = url;
//               a.download = `duplicate_logs_batch_${batchId}.csv`;
//               a.click();
//               window.URL.revokeObjectURL(url);
//               toast.success("Duplicate logs exported successfully!");
//             }}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
//           >
//             <Download size={18} />
//             Export to CSV
//           </button>
//         </div>
//       )}
//     </Modal>
//   );
// };

// // Success Summary Modal
// const SuccessSummaryModal = ({ isOpen, onClose, summaryData, onViewDuplicateLogs }) => {
//   if (!summaryData) return null;

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-20 outline-none"
//       overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
//     >
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold flex items-center gap-2 text-green-600">
//           <CheckCircle size={24} />
//           Upload Successful
//         </h2>
//         <button
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700"
//         >
//           ✕
//         </button>
//       </div>

//       <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//         <p className="font-semibold text-green-700 text-lg mb-2">✓ Excel uploaded successfully!</p>
//         <p className="text-green-600">Batch ID: <strong>{summaryData.batchId}</strong></p>
//       </div>

//       <div className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-blue-50 p-3 rounded border border-blue-200">
//             <p className="text-sm text-blue-600">Total Rows in Excel</p>
//             <p className="text-xl font-bold text-blue-700">{summaryData.totalRowsInExcel}</p>
//           </div>
//           <div className="bg-green-50 p-3 rounded border border-green-200">
//             <p className="text-sm text-green-600">Successfully Inserted</p>
//             <p className="text-xl font-bold text-green-700">{summaryData.inserted}</p>
//           </div>
//           <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
//             <p className="text-sm text-yellow-600">Skipped (Validation)</p>
//             <p className="text-xl font-bold text-yellow-700">{summaryData.skippedValidationErrors || 0}</p>
//           </div>
//           <div className="bg-orange-50 p-3 rounded border border-orange-200">
//             <p className="text-sm text-orange-600">Skipped (Duplicates)</p>
//             <p className="text-xl font-bold text-orange-700">
//               {(summaryData.skippedInFileDuplicates || 0) + (summaryData.skippedDbDuplicates || 0)}
//             </p>
//           </div>
//         </div>

//         {summaryData.columnMapping && (
//           <div className="mt-4">
//             <h3 className="font-semibold mb-2">Column Mapping Detected:</h3>
//             <div className="grid grid-cols-2 gap-2">
//               <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                 <span className="text-gray-600">Name:</span>
//                 <span className="font-medium">{summaryData.columnMapping.name}</span>
//               </div>
//               <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                 <span className="text-gray-600">Mobile:</span>
//                 <span className="font-medium">{summaryData.columnMapping.mobile}</span>
//               </div>
//               <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                 <span className="text-gray-600">Email:</span>
//                 <span className="font-medium">{summaryData.columnMapping.email}</span>
//               </div>
//               <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                 <span className="text-gray-600">Address:</span>
//                 <span className="font-medium">{summaryData.columnMapping.address}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {((summaryData.skippedInFileDuplicates || 0) + (summaryData.skippedDbDuplicates || 0)) > 0 && (
//           <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
//             <div className="flex items-center gap-2 mb-3">
//               <AlertCircle size={20} className="text-orange-600" />
//               <p className="font-semibold text-orange-700">Duplicate Records Skipped</p>
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div className="p-2 bg-orange-100 rounded">
//                 <p className="text-sm text-orange-600">In-File Duplicates</p>
//                 <p className="text-lg font-bold text-orange-800">{summaryData.skippedInFileDuplicates || 0}</p>
//               </div>
//               <div className="p-2 bg-orange-100 rounded">
//                 <p className="text-sm text-orange-600">Database Duplicates</p>
//                 <p className="text-lg font-bold text-orange-800">{summaryData.skippedDbDuplicates || 0}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 onViewDuplicateLogs();
//                 onClose();
//               }}
//               className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
//             >
//               <FileText size={18} />
//               View Duplicate Logs
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end gap-3 mt-6">
//         <button
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition"
//         >
//           Upload Another File
//         </button>
//         <button
//           onClick={onClose}
//           className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
//         >
//           Close
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default function Excel() {
//   const [quickFilterText, setQuickFilterText] = useState("");

//   const [batches, setBatches] = useState([]);
//   const [file, setFile] = useState(null);
//   const [sourceName, setSourceName] = useState("");
//   const [description, setDescription] = useState("");
//   const navigate = useNavigate();
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [loading, setLoading] = useState(false);
//   const [loadingManual, setManualLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false)
//   const [success, setSuccess] = useState(false);
//   const [deleteBatchId, setDeleteBatchId] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedRowId, setSelectedRowId] = useState(null);

//   // Modal States
//   const [showModal, setShowModal] = useState(false);
//   const [manualForm, setManualForm] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     address: "",
//   });
//   const [manualRecords, setManualRecords] = useState([]);

//   // New States for Duplicate Logs and Success Summary
//   const [successModalOpen, setSuccessModalOpen] = useState(false);
//   const [successData, setSuccessData] = useState(null);
//   const [duplicateLogsModalOpen, setDuplicateLogsModalOpen] = useState(false);
//   const [selectedBatchForLogs, setSelectedBatchForLogs] = useState(null);
//   const [selectedSourceForLogs, setSelectedSourceForLogs] = useState("");

//   const openDeleteModal = (batchId) => {
//     setDeleteBatchId(batchId);
//     setIsDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       setDeleteLoading(true)
//       await axios.delete(`${apiUrl}/customers/batch/${deleteBatchId}`);
//       toast.success("Batch deleted successfully ✅");
//       fetchBatches()
//     } catch (err) {
//       console.error("Delete failed:", err);
//       toast.error("Failed to delete batch ❌");
//     } finally {
//       setIsDeleteModalOpen(false);
//       setDeleteBatchId(null);
//       setDeleteLoading(false)
//     }
//   };

//   const fetchBatches = async () => {
//     try {
//       const { data } = await axios.get(`${apiUrl}/customers/get-batches`);
//       setBatches(data);
//     } catch (err) {
//       toast.error("Error fetching batches!");
//       console.error("Error fetching batches:", err);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       toast.warning("Please select a file first!");
//       return;
//     }
//     if (!sourceName.trim()) {
//       toast.warning("Please enter a Source Name!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("source_name", sourceName);
//     formData.append("description", description);
//     try {
//       setLoading(true);
//       const response = await axios.post(`${apiUrl}/customers/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
      
//       // Handle success response with summary
//       if (response.data.summary) {
//         setSuccessData(response.data);
//         setSuccessModalOpen(true);
//         toast.success(response.data.message || "File uploaded successfully!");
//       } else {
//         toast.success("File uploaded successfully!");
//       }
      
//       setFile(null);
//       setDescription("");
//       fetchBatches();
//       setSuccess(true);
      
//     } catch (err) {
//       const errorResponse = err.response?.data;
//       toast.error(`Upload failed: ${errorResponse?.message || err.message}`);
//       console.error("Upload failed:", err);
//     } finally {
//       setTimeout(() => setLoading(false), 2000);
//     }
//   };

//   const handleimprtexample = () => {
//     const link = document.createElement("a");
//     link.href = "/example.xlsx";
//     link.download = "example.xlsx";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleAddRecord = (e) => {
//     e.preventDefault();
//     const { name, email, mobile, address } = manualForm;

//     if (!name || !email || !mobile || !address) {
//       toast.warning("Please fill all fields!");
//       return;
//     }

//     setManualRecords([...manualRecords, manualForm]);
//     setManualForm({ name: "", email: "", mobile: "", address: "" });
//   };

//   const handleSubmitAllManual = async () => {
//     setManualLoading(true)
//     if (!sourceName.trim()) {
//       toast.warning("Please Enter A Source Name First!");
//       setManualLoading(false);
//       return;
//     }

//     if (manualRecords.length === 0) {
//       toast.warning("No records added!");
//       setManualLoading(false);
//       return;
//     }

//     try {
//       const csvHeader = "name,email,mobile,address\n";
//       const csvRows = manualRecords
//         .map(
//           (rec) =>
//             `${rec.name},${rec.email},${rec.mobile},${rec.address}`
//         )
//         .join("\n");
//       const csvContent = csvHeader + csvRows;

//       const blob = new Blob([csvContent], { type: "text/csv" });
//       const formData = new FormData();
//       formData.append("file", blob, "manual_upload.csv");
//       formData.append("source_name", sourceName);

//       const response = await axios.post(`${apiUrl}/customers/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.data.summary) {
//         setSuccessData(response.data);
//         setSuccessModalOpen(true);
//       }
      
//       toast.success("Manual batch uploaded successfully!");
//       setManualLoading(false)
//       setManualRecords([]);
//       setShowModal(false);
//       fetchBatches();
//     } catch (err) {
//       toast.error("Failed to submit records!");
//       console.error("Manual Batch Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const defaultColDef = useMemo(
//     () => ({ sortable: true, filter: true, resizable: true }),
//     []
//   );

//   const columnDefs = useMemo(
//     () => [
//       { headerName: "No", valueGetter: "node.rowIndex + 1", width: 80 },
//       { headerName: "Name", field: "name", sortable: true, filter: true },
//       { headerName: "Email", field: "email", sortable: true, filter: true },
//       { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
//       { headerName: "Address", field: "address", sortable: true, filter: true },
//     ],
//     []
//   );

//   const handleDelete = async (batchId) => {
//     if (!window.confirm("Are you sure you want to delete all customers in this batch?")) {
//       return;
//     }

//     try {
//       await axios.delete(`${apiUrl}/customers/batch/${batchId}`);
//       toast.success("Batch deleted successfully ✅");
//       fetchBatches();
//     } catch (err) {
//       console.error("Delete failed:", err);
//       toast.error("Failed to delete batch ❌");
//     }
//   };

//   return (
//     <>
//       <div className="p-6 space-y-8 bg-gray-50 rounded-lg shadow-md">
//         <div className="flex items-center gap-2">
//           <img
//             src="/excel.png"
//             alt="Excel"
//             className="h-20 w-auto object-contain"
//           />
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
//           <button
//             onClick={() => {
//               if (!sourceName.trim()) {
//                 toast.warning("Please enter a Source Name first!");
//                 return;
//               }
//               setShowModal(true);
//             }}
//             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Add Manually
//           </button>

//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 items-center">
//             <input
//               type="text"
//               placeholder="Enter Source Name"
//               value={sourceName}
//               onChange={(e) => setSourceName(e.target.value)}
//               className="px-4 py-2 border border-gray-400 w-full focus:ring focus:ring-blue-200"
//             />
//             <input
//               type="text"
//               placeholder="Enter Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="px-4 py-2 border border-gray-400 w-full focus:ring focus:ring-blue-200"
//             />
//             <input
//               type="file"
//               accept=".xlsx, .xls, .csv"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="px-4 py-2 border border-gray-400 w-full"
//             />
//             <div className="flex gap-4 md:col-span-2 flex-wrap">
//               <button
//                 onClick={handleUpload}
//                 disabled={loading}
//                 className="relative inline-flex items-center justify-center px-20 py-3 overflow-hidden font-medium transition duration-300 ease-out bg-blue-600 text-white rounded-lg shadow-md"
//               >
//                 <span
//                   className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 transform
//            ${loading ? "translate-x-0 bg-blue-500" : "-translate-x-full"}
//          `}
//                 >
//                   {loading ? (
//                     <svg
//                       className="w-6 h-6 animate-spin"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 4v4m0 8v4m8-8h4M4 12H0m16.24-4.24l2.83-2.83M4.93 19.07l-2.83 2.83M16.24 19.07l2.83 2.83M4.93 4.93L2.1 2.1"
//                       />
//                     </svg>
//                   ) : (
//                     ""
//                   )}
//                 </span>
//                 <span
//                   className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-500 transform
//            ${loading ? "translate-x-full text-white" : "translate-x-0"}
//        `}
//                 >
//                   {loading ? "Uploading..." : success ? "Uploaded" : "Upload Excel"}
//                 </span>
//                 <span className="relative invisible">
//                   {loading ? "Uploading..." : success ? "Uploaded" : "Upload Excel"}
//                 </span>
//               </button>

//               <button
//                 onClick={handleimprtexample}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
//               >
//                 <Download size={18} />
//                 Download Template
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-md">
//           <div className="flex justify-between p-4" >
//             <h2 className="text-xl font-semibold mb-3 uppercase">Uploaded Excel List</h2>
//             <QuickFilter
//               value={quickFilterText}
//               onChange={setQuickFilterText}
//             />
//           </div>
//           <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
//             <AgGridReact
//               rowData={batches}
//               columnDefs={[
//                 { headerName: "Batch ID", field: "batch_id", flex: 0.5 },
//                 { headerName: "Source", field: "source_name", flex: 1 },
//                 { headerName: "Description", field: "description", flex: 1 },
//                 {
//                   headerName: "Pending Leads",
//                   field: "pending_count",
//                   flex: 0.8,
//                   cellRenderer: (params) => {
//                     const pendingCount = params.value || 0;
//                     return (
//                       <div className={`inline-flex items-center px-3 py-0.1 rounded-full text-sm font-semibold ${
//                         pendingCount > 0 
//                           ? 'bg-red-100 text-red-800 border border-red-300' 
//                           : 'bg-green-100 text-green-800 border border-green-300'
//                       }`}>
//                         {pendingCount > 0 ? (
//                           <>
//                             <AlertCircle size={14} className="mr-1" />
//                             {pendingCount} 
//                           </>
//                         ) : (
//                           <>
//                             <CheckCircle size={14} className="mr-1" />
//                             0
//                           </>
//                         )}
//                       </div>
//                     );
//                   },
//                   comparator: (valueA, valueB) => valueA - valueB,
//                 },
               
//                 {
//                   headerName: "Actions",
//                   field: "action",
//                   flex: 0.4,
//                   cellRenderer: (params) => (
//                     <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
//                       <div className="flex items-center gap-2">
//                         <Eye
//                           size={18}
//                           className="cursor-pointer text-gray-600 hover:text-blue-600"
//                           onClick={() => navigate(`/excel/batch/${params.data.batch_id}`)}
//                           title="View Details"
//                         />
//                         {/* <Trash
//                           size={18}
//                           className="cursor-pointer text-gray-600 hover:text-red-600"
//                           onClick={() => openDeleteModal(params.data.batch_id)}
//                           title="Delete Batch"
//                         /> */}
//                       </div>
//                     </div>
//                   ),
//                 },
//                 {
//                   headerName: "Date",
//                   field: "created_at",
//                   flex: 1,
//                   valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString() : "-"),
//                 },
//                  {
//                   headerName: "Duplicates Logs",
//                   field: "duplicates",
//                   flex: 0.5,
//                   cellRenderer: (params) => (
//                     <button
//                       onClick={() => {
//                         setSelectedBatchForLogs(params.data.batch_id);
//                         setSelectedSourceForLogs(params.data.source_name);
//                         setDuplicateLogsModalOpen(true);
//                       }}
//                       className="px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 text-sm flex items-center gap-1"
//                       title="View Duplicate Logs"
//                     >
//                       <FileText size={14} />
//                       Duplicate Logs
//                     </button>
//                   ),
//                 },
//               ]}
//               defaultColDef={defaultColDef}
//               pagination={true}
//               paginationPageSize={100}
//               quickFilterText={quickFilterText}
//               onRowClicked={(params) => setSelectedRowId(params.data.batch_id)}
//               getRowStyle={(params) => {
//                 return params.data.batch_id === selectedRowId
//                   ? {
//                     backgroundColor: "#f0f9ff",
//                     borderLeft: "4px solid #22c55e",
//                     transition: "background-color 0.3s ease",
//                   }
//                   : null;
//               }}
//             />
//           </div>
//         </div>

//         <Modal
//           isOpen={showModal}
//           onRequestClose={() => setShowModal(false)}
//           className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-20 outline-none relative top-1"
//           overlayClassName="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
//         >
//           <h2 className="text-xl font-bold mb-4">Add Records Manually</h2>
//           <form onSubmit={handleAddRecord} className="space-y-3">
//             <div className="grid grid-cols-2 gap-3">
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={manualForm.name}
//                 onChange={(e) =>
//                   setManualForm({ ...manualForm, name: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={manualForm.email}
//                 onChange={(e) =>
//                   setManualForm({ ...manualForm, email: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Mobile"
//                 value={manualForm.mobile}
//                 onChange={(e) =>
//                   setManualForm({ ...manualForm, mobile: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Address"
//                 value={manualForm.address}
//                 onChange={(e) =>
//                   setManualForm({ ...manualForm, address: e.target.value })
//                 }
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//             <div className="flex justify-between pt-3">
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Add Record
//               </button>
//               {manualRecords.length > 0 && (
//                 <button
//                   onClick={handleSubmitAllManual}
//                   disabled={loadingManual}
//                   className="relative inline-flex items-center justify-center px-20 py-3 overflow-hidden font-medium transition duration-300 ease-out bg-blue-600 text-white rounded-lg shadow-md"
//                 >
//                   <span
//                     className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 transform
//            ${loadingManual ? "translate-x-0 bg-blue-500" : "-translate-x-full"}
//          `}
//                   >
//                     {loadingManual ? (
//                       <svg
//                         className="w-6 h-6 animate-spin"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 4v4m0 8v4m8-8h4M4 12H0m16.24-4.24l2.83-2.83M4.93 19.07l-2.83 2.83M16.24 19.07l2.83 2.83M4.93 4.93L2.1 2.1"
//                         />
//                       </svg>
//                     ) : (
//                       ""
//                     )}
//                   </span>
//                   <span
//                     className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-500 transform
//            ${loadingManual ? "translate-x-full text-white" : "translate-x-0"}
//        `}
//                   >
//                     {loadingManual ? "Uploading..." : success ? "Uploaded" : "Upload Manually"}
//                   </span>
//                   <span className="relative invisible">
//                     {loadingManual ? "Uploading..." : success ? "Uploaded" : "Upload Manually"}
//                   </span>
//                 </button>
//               )}
//             </div>
//           </form>

//           {manualRecords.length > 0 && (
//             <div className="mt-6">
//               <h3 className="font-semibold mb-2">Added Records</h3>
//               <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
//                 <AgGridReact
//                   rowData={manualRecords}
//                   columnDefs={columnDefs}
//                   pagination={true}
//                   paginationPageSize={5}
//                   defaultColDef={{
//                     resizable: true,
//                     sortable: true,
//                     filter: true,
//                   }}
//                 />
//               </div>
//             </div>
//           )}
//         </Modal>
//       </div>

//       {/* Success Summary Modal */}
//       <SuccessSummaryModal
//         isOpen={successModalOpen}
//         onClose={() => setSuccessModalOpen(false)}
//         summaryData={successData?.summary}
//         onViewDuplicateLogs={() => {
//           if (successData?.summary?.batchId) {
//             setSelectedBatchForLogs(successData.summary.batchId);
//             setSelectedSourceForLogs(sourceName);
//             setDuplicateLogsModalOpen(true);
//           }
//         }}
//       />

//       {/* Duplicate Logs Modal */}
//       <DuplicateLogsModal
//         isOpen={duplicateLogsModalOpen}
//         onClose={() => {
//           setDuplicateLogsModalOpen(false);
//           setSelectedBatchForLogs(null);
//           setSelectedSourceForLogs("");
//         }}
//         batchId={selectedBatchForLogs}
//         sourceName={selectedSourceForLogs}
//       />

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onRequestClose={() => setIsDeleteModalOpen(false)}
//         className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-40"
//         overlayClassName="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50"
//       >
//         <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
//         <p className="mb-6">
//           <span className="text-red-500">Are you sure you want to delete all customers in this batch? </span> <br></br>Deleting this batch will also remove all the linked data associated with these customers from every connected module. This action cannot be undone.
//         </p>

//         <div className="flex justify-end gap-4">
//           <button
//             onClick={() => setIsDeleteModalOpen(false)}
//             className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
//           >
//             Cancel
//           </button>
//           <button
//             className={`px-4 py-2 text-white rounded-md flex items-center justify-center gap-2
//         ${deleteLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
//             onClick={confirmDelete}
//             disabled={deleteLoading}
//           >
//             {deleteLoading ? (
//               <>
//                 <svg
//                   className="animate-spin h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 
//               0 0 5.373 0 12h4z"
//                   ></path>
//                 </svg>
//                 Deleting...
//               </>
//             ) : (
//               "Delete"
//             )}
//           </button>
//         </div>
//       </Modal>
//     </>
//   );
// }



// ------------------------------------------------------------------------------- 29-01-2026 night --------------------------



import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Eye, Trash, Download, AlertCircle, CheckCircle, FileText, Users } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./dealTable.css";
import QuickFilter from "./QuickFilter";

ModuleRegistry.registerModules([AllCommunityModule]);

Modal.setAppElement("#root");

// Duplicate Logs Modal Component
const DuplicateLogsModal = ({ isOpen, onClose, batchId, sourceName }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDuplicateLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/customers/duplicate-logs/${batchId}`
      );
      setLogs(response.data);
    } catch (err) {
      console.error("Error fetching duplicate logs:", err);
      toast.error("Failed to fetch duplicate logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && batchId) {
      fetchDuplicateLogs();
    }
  }, [isOpen, batchId]);

  const filteredLogs = logs.filter(log => {
    const matchesType = !selectedType || log.duplicate_type === selectedType;
    const matchesSearch = !searchTerm || 
      log.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.mobile?.includes(searchTerm) ||
      log.source_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const columnDefs = useMemo(() => [
    { 
      headerName: "Type", 
      field: "duplicate_type", 
      width: 120,
      cellRenderer: (params) => {
        const type = params.value;
        const color = type === 'in_file' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-orange-100 text-orange-800 border border-orange-300';
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
            {type === 'in_file' ? 'In File' : 'In DB'}
          </span>
        );
      }
    },
    { headerName: "Customer Name", field: "customer_name", flex: 1 },
    { headerName: "Mobile", field: "mobile", width: 130 },
    { headerName: "Email", field: "email", flex: 1 },
    { headerName: "Upload Source", field: "source_name", width: 150 },
    { 
      headerName: "Existing Batch", 
      field: "existing_batch_id", 
      width: 120,
      cellRenderer: (params) => params.value || '-'
    },
    { 
      headerName: "Existing Source", 
      field: "existing_source_name", 
      width: 150,
      cellRenderer: (params) => params.value || '-'
    },
    { 
      headerName: "Date", 
      field: "created_at", 
      width: 180,
      valueFormatter: (p) => p.value ? new Date(p.value).toLocaleString() : "-"
    }
  ], []);

  const defaultColDef = useMemo(
    () => ({ sortable: true, filter: true, resizable: true }),
    []
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl mx-auto mt-10 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={24} className="text-blue-600" />
            Duplicate Logs
          </h2>
          <p className="text-gray-600">
            Batch: <span className="font-semibold">{batchId}</span> | 
            Source: <span className="font-semibold">{sourceName}</span>
          </p>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, mobile, or source..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="in_file">In-File Duplicates</option>
          <option value="in_database">Database Duplicates</option>
        </select>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading duplicate logs...</p>
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText size={48} className="mb-4" />
            <p className="text-lg">No duplicate logs found</p>
          </div>
        ) : (
          <AgGridReact
            rowData={filteredLogs}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={20}
            defaultColDef={defaultColDef}
          />
        )}
      </div>

      {filteredLogs.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-gray-600">
            Total Duplicates: <span className="font-semibold">{filteredLogs.length}</span>
          </div>
          <button
            onClick={() => {
              const csv = [
                ['Type', 'Customer Name', 'Mobile', 'Email', 'Upload Source', 'Existing Batch', 'Existing Source', 'Date'],
                ...filteredLogs.map(log => [
                  log.duplicate_type === 'in_file' ? 'In File' : 'In Database',
                  log.customer_name,
                  log.mobile,
                  log.email,
                  log.source_name,
                  log.existing_batch_id || '',
                  log.existing_source_name || '',
                  new Date(log.created_at).toLocaleString()
                ])
              ].map(row => row.join(',')).join('\n');
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `duplicate_logs_batch_${batchId}.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
              toast.success("Duplicate logs exported successfully!");
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download size={18} />
            Export to CSV
          </button>
        </div>
      )}
    </Modal>
  );
};

// Success Summary Modal
const SuccessSummaryModal = ({ isOpen, onClose, summaryData, onViewDuplicateLogs }) => {
  if (!summaryData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-20 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-green-600">
          <CheckCircle size={24} />
          Upload Successful
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="font-semibold text-green-700 text-lg mb-2">✓ Excel uploaded successfully!</p>
        <p className="text-green-600">Batch ID: <strong>{summaryData.batchId}</strong></p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-600">Total Rows in Excel</p>
            <p className="text-xl font-bold text-blue-700">{summaryData.totalRowsInExcel}</p>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-sm text-green-600">Successfully Inserted</p>
            <p className="text-xl font-bold text-green-700">{summaryData.inserted}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <p className="text-sm text-yellow-600">Skipped (Validation)</p>
            <p className="text-xl font-bold text-yellow-700">{summaryData.skippedValidationErrors || 0}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded border border-orange-200">
            <p className="text-sm text-orange-600">Skipped (Duplicates)</p>
            <p className="text-xl font-bold text-orange-700">
              {(summaryData.skippedInFileDuplicates || 0) + (summaryData.skippedDbDuplicates || 0)}
            </p>
          </div>
        </div>

        {summaryData.columnMapping && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Column Mapping Detected:</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{summaryData.columnMapping.name}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium">{summaryData.columnMapping.mobile}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{summaryData.columnMapping.email}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium">{summaryData.columnMapping.address}</span>
              </div>
            </div>
          </div>
        )}

        {((summaryData.skippedInFileDuplicates || 0) + (summaryData.skippedDbDuplicates || 0)) > 0 && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} className="text-orange-600" />
              <p className="font-semibold text-orange-700">Duplicate Records Skipped</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-2 bg-orange-100 rounded">
                <p className="text-sm text-orange-600">In-File Duplicates</p>
                <p className="text-lg font-bold text-orange-800">{summaryData.skippedInFileDuplicates || 0}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded">
                <p className="text-sm text-orange-600">Database Duplicates</p>
                <p className="text-lg font-bold text-orange-800">{summaryData.skippedDbDuplicates || 0}</p>
              </div>
            </div>
            <button
              onClick={() => {
                onViewDuplicateLogs();
                onClose();
              }}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              View Duplicate Logs
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition"
        >
          Upload Another File
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default function Excel() {
  const [quickFilterText, setQuickFilterText] = useState("");

  const [batches, setBatches] = useState([]);
  const [file, setFile] = useState(null);
  const [sourceName, setSourceName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [loadingManual, setManualLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [success, setSuccess] = useState(false);
  const [deleteBatchId, setDeleteBatchId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [manualRecords, setManualRecords] = useState([]);

  // New States for Duplicate Logs and Success Summary
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [duplicateLogsModalOpen, setDuplicateLogsModalOpen] = useState(false);
  const [selectedBatchForLogs, setSelectedBatchForLogs] = useState(null);
  const [selectedSourceForLogs, setSelectedSourceForLogs] = useState("");

  const openDeleteModal = (batchId) => {
    setDeleteBatchId(batchId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      await axios.delete(`${apiUrl}/customers/batch/${deleteBatchId}`);
      toast.success("Batch deleted successfully ✅");
      fetchBatches()
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete batch ❌");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteBatchId(null);
      setDeleteLoading(false)
    }
  };

  const fetchBatches = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/customers/get-batches`);
      // Fetch duplicate count for each batch
      const batchesWithDuplicates = await Promise.all(
        data.map(async (batch) => {
          try {
            const duplicateResponse = await axios.get(
              `${apiUrl}/customers/duplicate-count/${batch.batch_id}`
            );
            return {
              ...batch,
              duplicate_count: duplicateResponse.data.count || 0
            };
          } catch (err) {
            console.error(`Error fetching duplicate count for batch ${batch.batch_id}:`, err);
            return {
              ...batch,
              duplicate_count: 0
            };
          }
        })
      );
      setBatches(batchesWithDuplicates);
    } catch (err) {
      toast.error("Error fetching batches!");
      console.error("Error fetching batches:", err);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file first!");
      return;
    }
    if (!sourceName.trim()) {
      toast.warning("Please enter a Source Name!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source_name", sourceName);
    formData.append("description", description);
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/customers/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Handle success response with summary
      if (response.data.summary) {
        setSuccessData(response.data);
        setSuccessModalOpen(true);
        toast.success(response.data.message || "File uploaded successfully!");
      } else {
        toast.success("File uploaded successfully!");
      }
      
      setFile(null);
      setDescription("");
      fetchBatches();
      setSuccess(true);
      
    } catch (err) {
      const errorResponse = err.response?.data;
      toast.error(`Upload failed: ${errorResponse?.message || err.message}`);
      console.error("Upload failed:", err);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const handleimprtexample = () => {
    const link = document.createElement("a");
    link.href = "/example.xlsx";
    link.download = "example.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    const { name, email, mobile, address } = manualForm;

    if (!name || !email || !mobile || !address) {
      toast.warning("Please fill all fields!");
      return;
    }

    setManualRecords([...manualRecords, manualForm]);
    setManualForm({ name: "", email: "", mobile: "", address: "" });
  };

  const handleSubmitAllManual = async () => {
    setManualLoading(true)
    if (!sourceName.trim()) {
      toast.warning("Please Enter A Source Name First!");
      setManualLoading(false);
      return;
    }

    if (manualRecords.length === 0) {
      toast.warning("No records added!");
      setManualLoading(false);
      return;
    }

    try {
      const csvHeader = "name,email,mobile,address\n";
      const csvRows = manualRecords
        .map(
          (rec) =>
            `${rec.name},${rec.email},${rec.mobile},${rec.address}`
        )
        .join("\n");
      const csvContent = csvHeader + csvRows;

      const blob = new Blob([csvContent], { type: "text/csv" });
      const formData = new FormData();
      formData.append("file", blob, "manual_upload.csv");
      formData.append("source_name", sourceName);

      const response = await axios.post(`${apiUrl}/customers/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.summary) {
        setSuccessData(response.data);
        setSuccessModalOpen(true);
      }
      
      toast.success("Manual batch uploaded successfully!");
      setManualLoading(false)
      setManualRecords([]);
      setShowModal(false);
      fetchBatches();
    } catch (err) {
      toast.error("Failed to submit records!");
      console.error("Manual Batch Error:", err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const defaultColDef = useMemo(
    () => ({ sortable: true, filter: true, resizable: true }),
    []
  );

  const columnDefs = useMemo(
    () => [
      { headerName: "No", valueGetter: "node.rowIndex + 1", width: 80 },
      { headerName: "Name", field: "name", sortable: true, filter: true },
      { headerName: "Email", field: "email", sortable: true, filter: true },
      { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
      { headerName: "Address", field: "address", sortable: true, filter: true },
    ],
    []
  );

  const handleDelete = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete all customers in this batch?")) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/customers/batch/${batchId}`);
      toast.success("Batch deleted successfully ✅");
      fetchBatches();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete batch ❌");
    }
  };

  return (
    <>
      <div className="p-6 space-y-8 bg-gray-50 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <img
            src="/excel.png"
            alt="Excel"
            className="h-20 w-auto object-contain"
          />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
          <button
            onClick={() => {
              if (!sourceName.trim()) {
                toast.warning("Please enter a Source Name first!");
                return;
              }
              setShowModal(true);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Add Manually
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 items-center">
            <input
              type="text"
              placeholder="Enter Source Name"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              className="px-4 py-2 border border-gray-400 w-full focus:ring focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2 border border-gray-400 w-full focus:ring focus:ring-blue-200"
            />
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="px-4 py-2 border border-gray-400 w-full"
            />
            <div className="flex gap-4 md:col-span-2 flex-wrap">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="relative inline-flex items-center justify-center px-20 py-3 overflow-hidden font-medium transition duration-300 ease-out bg-blue-600 text-white rounded-lg shadow-md"
              >
                <span
                  className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 transform
           ${loading ? "translate-x-0 bg-blue-500" : "-translate-x-full"}
         `}
                >
                  {loading ? (
                    <svg
                      className="w-6 h-6 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v4m0 8v4m8-8h4M4 12H0m16.24-4.24l2.83-2.83M4.93 19.07l-2.83 2.83M16.24 19.07l2.83 2.83M4.93 4.93L2.1 2.1"
                      />
                    </svg>
                  ) : (
                    ""
                  )}
                </span>
                <span
                  className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-500 transform
           ${loading ? "translate-x-full text-white" : "translate-x-0"}
       `}
                >
                  {loading ? "Uploading..." : success ? "Uploaded" : "Upload Excel"}
                </span>
                <span className="relative invisible">
                  {loading ? "Uploading..." : success ? "Uploaded" : "Upload Excel"}
                </span>
              </button>

              <button
                onClick={handleimprtexample}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Download size={18} />
                Download Template
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between p-4" >
            <h2 className="text-xl font-semibold mb-3 uppercase">Uploaded Excel List</h2>
            <QuickFilter
              value={quickFilterText}
              onChange={setQuickFilterText}
            />
          </div>
          <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
            <AgGridReact
              rowData={batches}
              columnDefs={[
                { headerName: "Batch ID", field: "batch_id", flex: 0.5 },
                { headerName: "Source", field: "source_name", flex: 1 },
                { headerName: "Description", field: "description", flex: 1 },
                {
                  headerName: "Pending Leads",
                  field: "pending_count",
                  flex: 0.8,
                  cellRenderer: (params) => {
                    const pendingCount = params.value || 0;
                    return (
                      <div className={`inline-flex items-center px-3 py-0.1 rounded-full text-sm font-semibold ${
                        pendingCount > 0 
                          ? 'bg-red-100 text-red-800 border border-red-300' 
                          : 'bg-green-100 text-green-800 border border-green-300'
                      }`}>
                        {pendingCount > 0 ? (
                          <>
                            <AlertCircle size={14} className="mr-1" />
                            {pendingCount} 
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} className="mr-1" />
                            0
                          </>
                        )}
                      </div>
                    );
                  },
                  comparator: (valueA, valueB) => valueA - valueB,
                },
                {
                  headerName: "Duplicate Count",
                  field: "duplicate_count",
                  flex: 0.6,
                  cellRenderer: (params) => {
                    const duplicateCount = params.value || 0;
                    return (
                      <div className={`inline-flex items-center gap-2 px-3 py-0.1 rounded-full text-sm font-semibold ${
                        duplicateCount > 0 
                          ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}>
                        <Users size={14} className="mr-1" />
                        {duplicateCount}
                      </div>
                    );
                  },
                  comparator: (valueA, valueB) => valueA - valueB,
                },
                {
                  headerName: "Actions",
                  field: "action",
                  flex: 0.5,
                  cellRenderer: (params) => (
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div className="flex items-center gap-2">
                        <Eye
                          size={18}
                          className="cursor-pointer text-gray-600 hover:text-blue-600"
                          onClick={() => navigate(`/excel/batch/${params.data.batch_id}`)}
                          title="View Details"
                        />
                      </div>
                    </div>
                  ),
                },
                {
                  headerName: "Date",
                  field: "created_at",
                  flex: 1,
                  valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString() : "-"),
                },
                // {
                //   headerName: "Duplicate Logs",
                //   field: "duplicates",
                //   flex: 0.6,
                //   cellRenderer: (params) => {
                //     const duplicateCount = params.data.duplicate_count || 0;
                //     return (
                //       <div className="flex items-center gap-2">
                //         <button
                //           onClick={() => {
                //             setSelectedBatchForLogs(params.data.batch_id);
                //             setSelectedSourceForLogs(params.data.source_name);
                //             setDuplicateLogsModalOpen(true);
                //           }}
                //           disabled={duplicateCount === 0}
                //           className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-all ${
                //             duplicateCount === 0 
                //               ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                //               : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                //           }`}
                //           title={duplicateCount === 0 ? "No duplicate logs" : "View Duplicate Logs"}
                //         >
                //           <FileText size={14} />
                //           {duplicateCount === 0 ? "No Logs" : "View Logs"}
                //         </button>
                //       </div>
                //     );
                //   },
                // },
              ]}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={100}
              quickFilterText={quickFilterText}
              onRowClicked={(params) => setSelectedRowId(params.data.batch_id)}
              getRowStyle={(params) => {
                return params.data.batch_id === selectedRowId
                  ? {
                    backgroundColor: "#f0f9ff",
                    borderLeft: "4px solid #22c55e",
                    transition: "background-color 0.3s ease",
                  }
                  : null;
              }}
            />
          </div>
        </div>

        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-20 outline-none relative top-1"
          overlayClassName="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
        >
          <h2 className="text-xl font-bold mb-4">Add Records Manually</h2>
          <form onSubmit={handleAddRecord} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Name"
                value={manualForm.name}
                onChange={(e) =>
                  setManualForm({ ...manualForm, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={manualForm.email}
                onChange={(e) =>
                  setManualForm({ ...manualForm, email: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Mobile"
                value={manualForm.mobile}
                onChange={(e) =>
                  setManualForm({ ...manualForm, mobile: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Address"
                value={manualForm.address}
                onChange={(e) =>
                  setManualForm({ ...manualForm, address: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-between pt-3">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Record
              </button>
              {manualRecords.length > 0 && (
                <button
                  onClick={handleSubmitAllManual}
                  disabled={loadingManual}
                  className="relative inline-flex items-center justify-center px-20 py-3 overflow-hidden font-medium transition duration-300 ease-out bg-blue-600 text-white rounded-lg shadow-md"
                >
                  <span
                    className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 transform
           ${loadingManual ? "translate-x-0 bg-blue-500" : "-translate-x-full"}
         `}
                  >
                    {loadingManual ? (
                      <svg
                        className="w-6 h-6 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v4m0 8v4m8-8h4M4 12H0m16.24-4.24l2.83-2.83M4.93 19.07l-2.83 2.83M16.24 19.07l2.83 2.83M4.93 4.93L2.1 2.1"
                        />
                      </svg>
                    ) : (
                      ""
                    )}
                  </span>
                  <span
                    className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-500 transform
           ${loadingManual ? "translate-x-full text-white" : "translate-x-0"}
       `}
                  >
                    {loadingManual ? "Uploading..." : success ? "Uploaded" : "Upload Manually"}
                  </span>
                  <span className="relative invisible">
                    {loadingManual ? "Uploading..." : success ? "Uploaded" : "Upload Manually"}
                  </span>
                </button>
              )}
            </div>
          </form>

          {manualRecords.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Added Records</h3>
              <div className="ag-theme-alpine" style={{ height: 300, width: "100%" }}>
                <AgGridReact
                  rowData={manualRecords}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSize={5}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true,
                  }}
                />
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Success Summary Modal */}
      <SuccessSummaryModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        summaryData={successData?.summary}
        onViewDuplicateLogs={() => {
          if (successData?.summary?.batchId) {
            setSelectedBatchForLogs(successData.summary.batchId);
            setSelectedSourceForLogs(sourceName);
            setDuplicateLogsModalOpen(true);
          }
        }}
      />

      {/* Duplicate Logs Modal */}
      <DuplicateLogsModal
        isOpen={duplicateLogsModalOpen}
        onClose={() => {
          setDuplicateLogsModalOpen(false);
          setSelectedBatchForLogs(null);
          setSelectedSourceForLogs("");
        }}
        batchId={selectedBatchForLogs}
        sourceName={selectedSourceForLogs}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-40"
        overlayClassName="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50"
      >
        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p className="mb-6">
          <span className="text-red-500">Are you sure you want to delete all customers in this batch? </span> <br></br>Deleting this batch will also remove all the linked data associated with these customers from every connected module. This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white rounded-md flex items-center justify-center gap-2
        ${deleteLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 
              0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}