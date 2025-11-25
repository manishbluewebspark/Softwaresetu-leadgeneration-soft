// import React, { useState, useEffect, useRef, useMemo } from "react";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { Eye } from "lucide-react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { PiMicrosoftExcelLogoFill } from "react-icons/pi";


// ModuleRegistry.registerModules([AllCommunityModule]);

// export default function Excel() {
//   const [batches, setBatches] = useState([]);
//   const [file, setFile] = useState(null);
//   const [sourceName, setSourceName] = useState("");
//   const navigate = useNavigate();
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

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
//       setTimeout(() => setLoading(false), 2000)
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


//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const defaultColDef = useMemo(
//     () => ({ sortable: true, filter: true, resizable: true }),
//     []
//   );

//   return (
//     <div className="p-6 space-y-8 bg-gray-50 rounded-lg shadow-md">
//       <div className="flex items-center gap-2">
//         <img
//           src="/excel.png"
//           alt="Excel"
//           className="h-20 w-auto object-contain"
//         />
//       </div>

//       <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
//           <input
//             type="text"
//             placeholder="Enter Source Name"
//             value={sourceName}
//             onChange={(e) => setSourceName(e.target.value)}
//             className="px-4 py-2 border border-gray-400 w-full focus:ring focus:ring-blue-200"
//           />
//           <input
//             type="file"
//             accept=".xlsx, .xls, .csv"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="px-4 py-2 border border-gray-400 w-full"
//           />
//           <div className="flex gap-4 md:col-span-2">
//             <button
//               onClick={handleUpload}
//               disabled={loading}
//               className="relative inline-flex items-center justify-center px-20 py-3 overflow-hidden font-medium transition duration-300 ease-out bg-blue-600 text-white rounded-lg shadow-md"
//             >
//               <span
//                 className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 transform
//           ${loading ? "translate-x-0 bg-blue-500" : "-translate-x-full"}
//         `}
//               >
//                 {loading ? (
//                   <svg
//                     className="w-6 h-6 animate-spin"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 4v4m0 8v4m8-8h4M4 12H0m16.24-4.24l2.83-2.83M4.93 19.07l-2.83 2.83M16.24 19.07l2.83 2.83M4.93 4.93L2.1 2.1"
//                     />
//                   </svg>
//                 ) : (
//                   ""
//                 )}
//               </span>
//               <span
//                 className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-500 transform
//           ${loading ? "translate-x-full text-white" : "translate-x-0"}
//         `}
//               >
//                 {loading ? "Uploading..." : success ? "Uploaded" : "Upload Excel"}
//               </span>
//               <span className="relative invisible">
//                 {loading ? "Uploading..." : success ? "Uploaded" : "Upload Excel"}
//               </span>
//             </button>
//             <button
//               onClick={() => handleimprtexample()}
//               className="w-70 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               Download Example File
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-xl font-semibold mb-3 uppercase">Uploaded Excel List</h2>
//         <div className="ag-theme-quartz w-full" style={{ height: 300 }}>
//           <AgGridReact
//             rowData={batches}
//             columnDefs={[
//               { headerName: "Batch ID", field: "batch_id", flex: 0.5 },
//               { headerName: "Source", field: "source_name", flex: 1 },
//               {
//                 headerName: "View",
//                 field: "action",
//                 flex: 0.3,
//                 cellRenderer: (params) => (
//                   <Eye
//                     size={20}
//                     className="cursor-pointer"
//                     onClick={() =>
//                       navigate(`/excel/batch/${params.data.batch_id}`)
//                     }
//                   />
//                 ),
//               },
//             ]}
//             defaultColDef={defaultColDef}
//             pagination={true}
//             paginationPageSize={20}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }













import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Eye, Trash } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./dealTable.css";
import QuickFilter from "./QuickFilter";

ModuleRegistry.registerModules([AllCommunityModule]);

Modal.setAppElement("#root");

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
      setBatches(data);
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
      await axios.post(`${apiUrl}/customers/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setSourceName("");
      fetchBatches();
      toast.success("File uploaded successfully!");
    } catch (err) {
      toast.error(`Upload failed: ${err.response?.data?.message || err.message}`);
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

  // Add record temporarily in list
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

  // Final submit all manual records
  const handleSubmitAllManual = async () => {

    setManualLoading(true)
    if (!sourceName.trim()) {
      toast.warning("Please Enter A Source Name First!");
      return;
    }

    if (manualRecords.length === 0) {
      toast.warning("No records added!");
      return;
    }

    try {
      // Convert manualRecords to CSV string
      const csvHeader = "name,email,mobile,address\n";
      const csvRows = manualRecords
        .map(
          (rec) =>
            `${rec.name},${rec.email},${rec.mobile},${rec.address}`
        )
        .join("\n");
      const csvContent = csvHeader + csvRows;

      // Blob banake FormData me file append karenge
      const blob = new Blob([csvContent], { type: "text/csv" });
      const formData = new FormData();
      formData.append("file", blob, "manual_upload.csv");
      formData.append("source_name", sourceName);

      await axios.post(`${apiUrl}/customers/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Manual batch uploaded successfully!");
      setManualLoading(false)
      setManualRecords([]);
      setShowModal(false);
      setSourceName("");
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

      // Refresh table after delete
      setIsChange(!isChange);
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
              {/* <button
              onClick={handleUpload}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md"
            >
              {loading ? "Uploading..." : "Upload Excel"}
            </button> */}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Download Example File
              </button>
             
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          {/* <h2 className="text-xl font-semibold mb-3 uppercase">Uploaded Excel List</h2> */}
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
                 
                  {pendingCount} 
                </>
              ) : (
                <>
                 
                  0
                </>
              )}
            </div>
          );
        },
        comparator: (valueA, valueB) => valueA - valueB,
      },
                {
                  headerName: "View",
                  field: "action",
                  flex: 0.3,
                  cellRenderer: (params) => (
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div className="flex items-center gap-2">
                        <Eye
                          size={18}
                          className="cursor-pointer text-gray-600"
                          onClick={() => navigate(`/excel/batch/${params.data.batch_id}`)}
                        />
                        {/* <Trash
                          size={18}
                          className="cursor-pointer text-gray-600"
                          onClick={() => handleDelete(params.data.batch_id)}
                        /> */}
                      </div>
                    </div>
                  ),
                },
                {
                  headerName: "Date",
                  field: "created_at",
                  valueFormatter: (p) => (p.value ? new Date(p.value).toLocaleString() : "-"),
                },
              ]}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={100}
              quickFilterText={quickFilterText}
              onRowClicked={(params) => setSelectedRowId(params.data.batch_id)}
              getRowStyle={(params) => {
                return params.data.batch_id === selectedRowId
                  ? {
                    backgroundColor: "#c4c4c4",
                    borderLeft: "4px solid #22c55e",
                    transition: "background-color 0.3s ease",
                  }
                  : null;
              }}
            />

          </div>
        </div>

        {/* Modal for Manual Add */}
        {/* <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
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
            <button
              type="button"
              onClick={handleSubmitAllManual}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit All
            </button>
          </div>
        </form>

      
        {manualRecords.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Added Records</h3>
            <ul className="space-y-1">
              {manualRecords.map((rec, idx) => (
                <li key={idx} className="p-2 border rounded bg-gray-50">
                  {rec.name} - {rec.email} - {rec.mobile} - {rec.address}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal> */}

        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-auto mt-20 outline-none relative top-1"
          overlayClassName="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex justify-center items-start z-50"
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
              {/* <button
              type="button"
              onClick={handleSubmitAllManual}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit All
            </button> */}
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
          {/* <button
      onClick={confirmDelete}
      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
    >
      Delete
    </button> */}
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
