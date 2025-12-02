import React, { useState, useEffect, useMemo, useRef, useCallback, forwardRef } from "react";
import * as XLSX from "xlsx";
import RoleGuard from "../components/RoleGuard";
import axios from "axios";
import { FaFileExcel } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { Calendar, SquarePen, Check, NotebookPen, NotepadText } from "lucide-react";
import "./dealTable.css";
import QuickFilter from "./QuickFilter";
import StatusModal from "../components/StatusModal";
import SourceFilter from '../components/SourceFilter'



import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeBalham,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import StatusFilter from '../components/StatusFilter'
import NoteModal from "../components/NoteModal";
import LeadHistoryModal from "../components/LeadHistoryModal";
import { MessageCircle } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function CustomerData() {
  const [noteModalData, setNoteModalData] = useState(null);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [data, setData] = useState([]);
  const [copyData, setCopyData] = useState([]);
  const [copyChekingData, setChekingCopyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef(null);
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('')
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [sources, setSources] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(1000);


  const [isChange, setIsChange] = useState(false)


  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [limit, setLimit] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [statusFullData, setStatusFullData] = useState([]);
  const [openModalData, setOpenModalData] = useState(null);
  const [dateTimeMap, setDateTimeMap] = useState({});
  const [openTextModalData, setOpenTextModalData] = useState(null);
  const [textInputMap, setTextInputMap] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const [statusModalData, setStatusModalData] = useState(null);
  const [commentMap, setCommentMap] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");


  const [selectedRowId, setSelectedRowId] = useState(null);




  const [showSingleAssignModal, setShowSingleAssignModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSource, setSelectedSource] = useState("0");


useEffect(() => {
  const handleClickOutside = (e) => {
    if (!gridRef.current?.eGridDiv.contains(e.target)) {
      setSelectedRowId(null);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className="flex justify-between items-center border border-gray-300 rounded px-3 py-2 w-90 cursor-pointer bg-white"
    >
      <span className={value ? "text-black" : "text-gray-400"}>
        {value || "Select date & time"}
      </span>
      <Calendar className="w-5 h-5 text-gray-500 mr-2" />
    </div>
  ));


  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/customers/get-data`
      );
      setData(Array.isArray(res.data) ? res.data : []);
      setCopyData(Array.isArray(res.data) ? res.data : []);
      setChekingCopyData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setData([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${apiUrl}/employee/single`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };


  useEffect(() => {
    fetchCustomers();
    fetchEmployees();
  }, []);


  useEffect(() => {

    console.log(copyData, 'copyData..')

    if (filterType === 'all' || filterType === '') {
      setData(copyData);

    }
    else if (filterType === 'Assigned') {

      const assigned = copyData.filter((item) => item.assigned_to !== null);
      setData(assigned);

    }

    else if (filterType === 'Not Assigned') {


      const notAssigned = copyData.filter((item) => item.assigned_to === null);
      setData(notAssigned);


    }




  }, [filterType]);





  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        minWidth: 300,
        cellRenderer: (params) => (
          <div className="flex items-center  gap-2">

            {/* View Button */}
            <button
              className="p-1 rounded hover:bg-gray-100 flex"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/customer/${params.data.id}`);
              }}
              title="View Details"
            >
              <Eye size={18} className="text-gray-600 hover:text-blue-600" />
            </button>

            <div className="border-l border-gray-300 h-6"></div>


            {/* Edit Button */}
            <button
              className="p-1 rounded hover:bg-gray-100 flex "
              onClick={(e) => {
                e.stopPropagation();
                setStatusModalData({
                  customer_id: params.data.id,
                  currentStatus: params.value,
                  newStatus: params.value,
                  batch_id: params.data.batch_id,
                });
              }}
              title="Edit Status"
            >
              <SquarePen size={14} className="text-gray-600" />
            </button>




            {/* Customer Name */}
            <span className="ml-4">{params.value}</span>
          </div>
        ),
      },
      // { headerName: "Mobile", field: "mobile", },
      {
  headerName: "Mobile",
  field: "mobile",
  cellRenderer: (params) => (
    <div
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
      onClick={(e) => {
        e.stopPropagation(); // row select event se bachne ke liye
        setStatusModalData({
          customer_id: params.data.id,
          currentStatus: params.value,
          newStatus: params.value,
          batch_id: params.data.batch_id,
        });
      }}
      title="Edit Status"
    >
      <span>{params.value}</span>
    </div>
  ),
},
      { headerName: "Status", field: "status" },
      {
        headerName: "Comment",
        field: "comment",
        minWidth: 700,
        autoHeight: true,
        // cellRenderer: (params) => (
        //   <div className="flex items-center justify-between gap-2">
        //     <span className="truncate max-w-[600px]">{params.data.updated_at}</span>
        //     <span className="truncate max-w-[600px]">{params.data.comment}</span>
        //     <button
        //       className="p-1 text-gray-600 rounded hover:bg-gray-300"
        //       onClick={() => setSelectedCustomer(params.data.id)}
        //       title="View Comments"
        //     >
        //       <MessageCircle size={18} />
        //     </button>
        //   </div>
        // ),
        cellRenderer: (params) => {
          const formattedDate = params.data.updated_at
            ? new Date(params.data.updated_at).toLocaleString()
            : "-";

          return (
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-4 max-w-[600px]">
                <span className="text-sm text-gray-500">{formattedDate}</span>
                <span className="truncate text-gray-800">{params.data.comment}</span>
              </div>

              <button
                className="p-1 text-gray-600 rounded hover:bg-gray-300"
                onClick={() => setSelectedCustomer(params.data.id)}
                title="View Comments"
              >
                <MessageCircle size={18} />
              </button>
            </div>
          );
        },
      },
      {
        headerName: "Last Note",
        field: "customer_notes",
        minWidth: 300,
        valueGetter: (params) => {
          const notesArr = params.data.customer_notes;
          if (!notesArr || notesArr.length === 0) return null;

          const noteObj = notesArr[0];
          if (!noteObj.note || noteObj.note.length === 0) return null;

          const sorted = [...noteObj.note].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          return sorted[0]?.text || null;
        },
        cellRenderer: (params) => (
          <span className="italic font-semibold text-gray-800">
            {params.value || " - "}
          </span>
        ),
      },
      {
        headerName: "Notes",
        field: "status",
        width: 90,
        maxWidth: 90,
        cellRenderer: (params) => (
          <div className="flex gap-6 ">
            <span className=" border-gray-400 h-6"></span>
            <button
              className="p-1 rounded hover:bg-gray-100 flex"
              onClick={(e) => {
                e.stopPropagation();
                setNoteModalData({
                  customer_id: params.data.id,
                });
              }}
              title="Add Note"
            >
              <NotepadText size={14} className="text-gray-600" />
            </button>
          </div>
        ),
      },
      {
        headerName: "Assigned Status",
        field: "assigned_to_name",
        valueFormatter: (p) => (p.value ? "Assigned" : "Not Assigned"),
        filter: true,
      },
      {
        headerName: "Assigned To",
        field: "assigned_to_name",
        cellRenderer: (params) => (
          <div
            className="cursor-pointer flex items-center gap-2 group"
            onClick={() => {
              setSelectedRow(params.data);
              setShowSingleAssignModal(true);
            }}
          >
            <span>{params.value || "Not Assigned"}</span>
            <Check className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ),
      },
      {
        headerName: "Created At",
        field: "created_at",
        sort: "desc",
        minWidth: 300,
        valueFormatter: (p) =>
          p.value ? new Date(p.value).toLocaleString() : "-",
      },
    ],
    [
      navigate,
      setStatusModalData,
      setSelectedCustomer,
      setNoteModalData,
      setSelectedRow,
      setShowSingleAssignModal,
    ]
  );




  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 140,
    }),
    []
  );

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  const handleQuickFilter = (e) => {
    const val = e.target.value;
    if (gridRef.current?.api) {
      gridRef.current.api.setQuickFilter(val);
    }
  };

  const exportToCsv = () => {
    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: "customers.csv",
      });
    }
  };





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


    fetchStatuses();
  }, [isChange]);



  const handleAssignSubmit = async () => {
    if (selectedEmployees.length === 0) {
      toast.warning("Please select at least one employee!");
      return;
    }

    if (!limit || isNaN(limit) || Number(limit) <= 0) {
      toast.warning("Please enter a valid limit!");
      return;
    }

    if (!selectedBatch) {
      toast.warning("Please select a batch!");
      return;
    }

    // ✅ Filter unassigned customers for selected batch
    const notAssigned = copyData?.filter(
      (item) => item.assigned_to === null && item.batch_id === Number(selectedBatch)
    );

    if (!notAssigned || notAssigned.length === 0) {
      toast.warning(`This batch (${selectedBatch}) has no unassigned customers!`);
      return;
    }

    const totalLimit = Number(limit);
    if (totalLimit > notAssigned.length) {
      toast.warning(`You have only ${notAssigned.length} unassigned contacts in this batch`);
      return;
    }

    const distribution = selectedEmployees.map((emp) => {
      return { employeeId: emp.id, limit: totalLimit };
    });

    try {
      setLoadingAssign(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${apiUrl}/employee/assign`,
        {
          batchId: Number(selectedBatch),
          distribution,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Assigned successfully to employees!");
      setShowAssignModal(false);
      setLimit("");
      setSelectedEmployees([]);
      setSelectedBatch("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error assigning batch!");
      console.error("Error assigning batch:", err);
    } finally {
      setTimeout(() => setLoadingAssign(false), 2000);
    }
  };






  const handleSingleAssignSubmit = async (rowData, empId) => {
    try {
      setLoadingAssign(true);
      const token = localStorage.getItem("token");

      // 👇 API call
      const res = await axios.post(
        `${apiUrl}/employee/assign-single`,
        {
          employeeId: empId,
          customerId: rowData.id,
          batchId: rowData.batch_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Customer assigned successfully ✅");

        // 👇 refresh customers
        await fetchCustomers();

        // 👇 close modal
        setShowSingleAssignModal(false);
        setSelectedEmployeeId("");
        setSelectedRow(null);
      }
    } catch (err) {
      console.error("Error assigning customer:", err);
      toast.error("Failed to assign customer ❌");
    } finally {
      setLoadingAssign(false);
    }
  };






  useEffect(() => {

    console.log(selectedSource, 'selectedSource..')
    if (selectedSource != "0") {

      let dataa = selectedStatus == 0
        ? copyData
        : copyData.filter((val) => val.status == selectedStatus)

      let filter = dataa.filter((val) => val.batch_id == selectedSource)
      setData(filter)

    }
    else {
      let dataaa = selectedStatus == 0
        ? copyData
        : copyData.filter((val) => val.status == selectedStatus)
      setData(dataaa)

    }

  }, [selectedSource]);


  const fetchSources = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}/employee/get-assign-source-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSources(data);
    } catch (err) {
      console.error("Error fetching sources:", err);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);




  return (

    <RoleGuard role="admin">
      <div className="p-6 bg-white rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold">Customer Data</h2>

          <div className="flex gap-3">

            <SourceFilter
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
            />

            <StatusFilter
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              statusData={statusData}
            />

            <QuickFilter
              value={quickFilterText}
              onChange={setQuickFilterText}
            />


            <button
              onClick={() => setFilterType('Assigned')}
              className="w-[130px] px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Assigned
            </button>

            <button
              onClick={() => setFilterType('Not Assigned')}
              className="w-[130px] px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Not Assigned
            </button>

            <button
              onClick={() => setFilterType('all')}
              className="w-[130px] px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Clear Fillter
            </button>

            <button
              className="w-[130px] px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center justify-center gap-1"
              onClick={() => {
                if (data.length > 0) {
                  setSelectedBatch(data[0]);
                  setShowAssignModal(true);
                } else {
                  toast.warning("No batches available to assign!");
                }
              }}
            >
              <MdOutlineAssignmentTurnedIn />
              Assign
            </button>
          </div>



        </div>

        <div className="ag-theme-alpine" style={{ height: 718, width: "100%" }}>
          <AgGridReact
  theme={themeBalham}
  ref={gridRef}
  rowData={
    selectedStatus == 0
      ? data
      : data.filter((val) => val.status == selectedStatus)
  }
  columnDefs={columnDefs}
  defaultColDef={defaultColDef}
  pagination={true}
  paginationPageSize={paginationPageSize} 
  paginationPageSizeSelector={[25, 50, 100, 500, 1000]}
  animateRows={true}
  onGridReady={onGridReady}
  onFirstDataRendered={onFirstDataRendered}
  quickFilterText={quickFilterText}
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

        {showAssignModal && selectedBatch && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[600px]">
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Enter Limit"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="mb-4 w-full px-4 py-2 border border-gray-400"
                />

                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="mb-4 w-full px-4 py-2 border border-gray-400"
                >
                  <option value="">Select Batch</option>
                  {sources.map((item) => (
                    <option key={item.batch_id} value={item.batch_id}>
                      {item.source_name}
                    </option>
                  ))}
                </select>


              </div>

              <div
                className="ag-theme-quartz"
                style={{ height: 250, width: "100%" }}
              >
                <AgGridReact
                  rowData={employees}
                  columnDefs={[
                    {
                      headerName: "ID",
                      field: "id",
                      flex: 0.5,
                      checkboxSelection: true,
                      headerCheckboxSelection: true,
                      headerCheckboxSelectionFilteredOnly: true,
                    },
                    { headerName: "Name", field: "name", flex: 1 },
                    { headerName: "Email", field: "email", flex: 1 },
                  ]}
                  rowSelection="multiple"
                  onSelectionChanged={(params) => {
                    const selected = params.api.getSelectedRows();
                    setSelectedEmployees(selected);
                  }}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={20}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-md flex items-center justify-center gap-2
        ${loadingAssign ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  onClick={handleAssignSubmit}
                  disabled={loadingAssign}
                >
                  {loadingAssign ? (
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
                      Assigning...
                    </>
                  ) : (
                    "Assign"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>



      {/* ---------------------------------------------single assign model  */}

      {showSingleAssignModal && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
            <h3 className="text-lg font-bold mb-4">
              Customer <sapn className='text-blue-600'>( {selectedRow.name} )</sapn> Assign To :-
            </h3>

            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                onClick={() => setShowSingleAssignModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => {
                  if (!selectedEmployeeId) {
                    toast.warning("Please select an employee!");
                    return;
                  }
                  if (selectedRow.assigned_to !== null) {
                    toast.warning("Allready assigned!");
                    return
                  }
                  // 👇 Console full data
                  handleSingleAssignSubmit(selectedRow, selectedEmployeeId)
                  setShowSingleAssignModal(false);
                  setSelectedEmployeeId("");
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ---------------------------------------------single assign model  */}

    </RoleGuard>
  );
}
