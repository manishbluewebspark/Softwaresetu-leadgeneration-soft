import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  forwardRef,
} from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  User,
  Users,
  Calendar,
  Activity,
  Edit,
  Trash2,
  NotebookPen,
  SquarePen,
  NotepadText,
} from "lucide-react";
import RoleGuard from "../components/RoleGuard.jsx";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FaUserShield } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "./dealTable.css";
import StatusModal from "../components/StatusModal";
import NoteModal from "../components/NoteModal";

import LeadHistoryModal from "../components/LeadHistoryModal";
import { MessageCircle } from "lucide-react";
import QuickFilter from "./QuickFilter";
import { useNavigate } from "react-router-dom";
import SourceFilter from  '../components/SourceFilter'


ModuleRegistry.registerModules([AllCommunityModule]);

export default function Deal() {
  const [quickFilterText, setQuickFilterText] = useState("");
  const { user } = useAuth();
  const [rowData, setRowData] = useState([]);
  const [rowCopyData, setRowCopyData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [openModalData, setOpenModalData] = useState(null);
  const [dateTimeMap, setDateTimeMap] = useState({});
  const [openTextModalData, setOpenTextModalData] = useState(null);
  const [textInputMap, setTextInputMap] = useState({});
  const [statusFullData, setStatusFullData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [statusModalData, setStatusModalData] = useState(null);
  const [commentMap, setCommentMap] = useState({});
  const [noteModalData, setNoteModalData] = useState(null);
  const [selectedSource, setSelectedSource] = useState("0");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL;
  const gridRef = useRef();

  const gridOptions = {
    defaultColDef: {
      flex: 1,
      resizable: true,
      sortable: true,
      filter: true,
    },
    singleClickEdit: true,
  };


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
          // NotPickedCall: 0,
          Deal: 0,
          Interested: 0,
        };

        res.data.data.forEach((item) => {
          if (item.status === "Demo") newStats.Demo++;
          if (item.status === "Follow Up") newStats.FollowUp++;
          // if (item.status === "Not Picked Call") newStats.NotPickedCall++;
          if (item.status === "Deal") newStats.Deal++;
          if (item.status === "Interested") newStats.Interested++;
        });

        setStats(newStats);
      })
      .catch((err) => {
        console.error("Error fetching customer status:", err);
      });
  }, []);


  const columnDefs = useMemo(
    () => [
      //   { headerName: "ID", field: "id", sortable: true, filter: true },
      { headerName: "NAME", field: "name", sortable: true, filter: true },
      // { headerName: "EMAIL", field: "email", sortable: true, filter: true },
      { headerName: "MOBILE", field: "mobile", sortable: true, filter: true },
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
        headerName: "STATUS",
        field: "status",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: statusData,
          popupPosition: "under",
        },
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
        //         newStatus: params.value,
        //         batch_id: params.data.batch_id
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
      // {
      //   headerName: "CREATED AT",
      //   field: "created_at",
      //   sortable: true,
      //   filter: true,
      //    valueFormatter: (params) =>
      //             params.value ? String(params.value).toUpperCase() : "",
      // },
      {
        headerName: "CREATED AT",
        field: "created_at",
        sortable: true,
        filter: true,
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
      {
        headerName: "UPDATED AT",
        field: "updated_at",
        sortable: true,
        filter: true,
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
    [statusData]
  );

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await axios.get(`${apiUrl}/customers/get-lead-data`);
        setRowData(res.data.filter((data) => data.status === "Deal"));
        setRowCopyData(res.data.filter((data) => data.status === "Deal"));
      } catch (err) {
        console.error("Error fetching lead history:", err);
        toast.error("Failed to load leads");
      }
    };

    fetchLead();
  }, [isChange]);

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/status`);
      const filterStatus = res.data.map((status) => status.name);
      setStatusData(filterStatus);
      setStatusFullData(res.data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
      toast.error("Failed to load statuses");
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [isChange]);

  const handleStatusChange = async (params) => {
    const value = params.newValue?.trim();
    const selectedObj = statusFullData.find(
      (item) => item.name.trim().toLowerCase() === value?.toLowerCase()
    );
    const statusid = selectedObj?.id ?? null;

    if (params.colDef.field === "status" && statusid) {
      const { id, customer_id } = params.data;
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id || !user?.name) return;

      if (value === "Demo" || value === "Follow Up") {
        setOpenModalData({ customer_id: customer_id, status: value });
        return;
      }

      if (value === "Using Another Services" || value === "Language Issue") {
        setOpenTextModalData({ customer_id: customer_id, status: value });
        return;
      }

      try {
        await axios.put(`${apiUrl}/customers/status/${customer_id}`, {
          customer_id: customer_id,
          status: value,
          updated_by_id: user.id,
          updated_by_name: user.name,
          statusid,
        });

        setIsChange(!isChange);
        toast.success("Status updated successfully");
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
      }
    }
  };



  const handleSaveDateTime = async () => {
    if (!openModalData) return;
    const user = JSON.parse(localStorage.getItem("user"));
    const dateTime = dateTimeMap[openModalData.customer_id] || "";

    const value = openModalData.status;
    const selectedObj = statusFullData.find(
      (item) => item.name.trim().toLowerCase() === value?.toLowerCase()
    );
    const statusid = selectedObj?.id ?? null;

    try {
      await axios.put(
        `${apiUrl}/customers/status/${openModalData.customer_id}`,
        {
          customer_id: openModalData.customer_id,
          status: openModalData.status,
          updated_by_id: user.id,
          updated_by_name: user.name,
          followup_datetime: dateTime,
          statusid,
        }
      );

      setIsChange(!isChange);
      toast.success("Follow-up date/time saved");
    } catch (error) {
      console.error("Error updating status with date/time:", error);
      toast.error("Failed to save follow-up");
    } finally {
      setOpenModalData(null);
    }
  };


  const handleSaveTextInput = async () => {
    if (!openTextModalData) return;
    const user = JSON.parse(localStorage.getItem("user"));
    const textValue = textInputMap[openTextModalData.customer_id] || "";

    try {
      await axios.put(
        `${apiUrl}/customers/status/${openTextModalData.customer_id}`,
        {
          customer_id: openTextModalData.customer_id,
          status: openTextModalData.status,
          updated_by_id: user.id,
          updated_by_name: user.name,
          note: textValue,
        }
      );

      setIsChange(!isChange);
      toast.success("Note saved successfully");
    } catch (error) {
      console.error("Error updating status with text:", error);
      toast.error("Failed to save note");
    } finally {
      setOpenTextModalData(null);
    }
  };

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
    <RoleGuard role="admin">
      <div className="bg-gray-50 rounded-md shadow-md p-6">

        <div className="flex flex-wrap gap-6 justify-center">
          {/* Demo */}
          <div
            className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={() => {
              navigate('/admin-demo')
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
              navigate('/admin-follow')
            }}
          >
            <Calendar className="w-8 h-8 text-green-500 mr-3" />
            <div className="flex gap-4 items-start">
              <p className="text-gray-400 text-sm mt-1">Followup</p>
              <p className="text-xl font-bold text-gray-800">{stats.FollowUp}</p>
            </div>
          </div>

          {/* Interested */}
          <div
            className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={() => {
              navigate('/admin-interested')
            }}
          >
            <User className="w-8 h-8 text-pink-500 mr-3" />
            <div className="flex gap-4 items-start">
              <p className="text-gray-400 text-sm mt-1">Interested</p>
              <p className="text-xl font-bold text-gray-800">{stats.Interested}</p>
            </div>
          </div>


        </div>


        <div className="flex justify-between p-4" >
          <h2 className="text-xl font-bold mb-4">Deal</h2>
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

        </div>
        <div className="mt-4">
          <div className="ag-theme-alpine" style={{ height: 596 }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={100}
              onCellValueChanged={handleStatusChange}
              gridOptions={gridOptions}

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
          </div>
          {/* <Modal
            isOpen={!!openModalData}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            onRequestClose={() => setOpenModalData(null)}
            contentLabel="Select Date and Time"
            className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20 relative z-[9999]"
            overlayClassName="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[9998]"
          >
            <div className="flex justify-between items-center mb-4 gap-10">
              <h2 className="text-xl font-bold">
                Select Date & Time for {openModalData?.status}
              </h2>
              <button
                onClick={() => setOpenModalData(null)}
                className="text-black hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <DatePicker
              selected={
                openModalData?.customer_id &&
                  dateTimeMap[openModalData.customer_id]
                  ? new Date(dateTimeMap[openModalData.customer_id])
                  : null
              }
              onChange={(date) =>
                setDateTimeMap((prev) => ({
                  ...prev,
                  [openModalData.customer_id]: date,
                }))
              }
              showTimeSelect
              showTimeSelectSeconds
              timeIntervals={1}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy HH:mm:ss"
              timeFormat="HH:mm:ss"
              customInput={<CustomDateInput />}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpenModalData(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDateTime}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </Modal>


          <Modal
            isOpen={!!openTextModalData}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            onRequestClose={() => setOpenTextModalData(null)}
            contentLabel="Enter Note"
            className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20 relative z-[9999]"
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Enter Note for {openTextModalData?.status}
              </h2>
              <button
                onClick={() => setOpenTextModalData(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={textInputMap[openTextModalData?.customer_id] || ""}
              onChange={(e) =>
                setTextInputMap((prev) => ({
                  ...prev,
                  [openTextModalData.customer_id]: e.target.value,
                }))
              }
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenTextModalData(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTextInput}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </Modal> */}

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
    </RoleGuard>
  );
}