import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Activity, Calendar, NotebookPen, NotepadText, SquarePen, User } from "lucide-react";
import { toast } from "react-toastify";
import StatusModal from "../components/StatusModal";
import QuickFilter from "./QuickFilter";
import { useNavigate } from "react-router-dom";
import "./dealTable.css";
import NoteModal from "../components/NoteModal";
import LeadHistoryModal from "../components/LeadHistoryModal";
import { MessageCircle } from "lucide-react";


import SourceFilter from '../components/SourceFilter'



export default function Interested() {
  const [rowData, setRowData] = useState([]);
   const [rowCopyData, setCopyRowData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [statusFullData, setStatusFullData] = useState([]);
  const [statusModalData, setStatusModalData] = useState(null);
  const [dateTimeMap, setDateTimeMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
  const [isChange, setIsChange] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [noteModalData, setNoteModalData] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

const [selectedSource, setSelectedSource] = useState("0");
  
  const navigate = useNavigate()

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



  const gridRef = useRef();
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchDemoData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/customers/get-lead-data`);
      const filteredData = res.data.filter(
        (item) => item.status_id == 16
      );
      console.log(filteredData, 'filteredData..')
      setRowData(filteredData);
      setCopyRowData(filteredData)
    } catch (err) {
      console.error("Error fetching lead history:", err);
      toast.error("Failed to load customer data");
    }
  };

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
    fetchDemoData();
    fetchStatuses();
  }, [isChange]);

  const columns = useMemo(
    () => [
      // { headerName: "ID", field: "id", width: 90 },
      { headerName: "Name", field: "name", },
      { headerName: "Mobile", field: "mobile", },
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
      }
      ,
      // { headerName: "Address", field: "address", flex: 1 },
      { headerName: "Status", field: "status" },
      { headerName: "Updated By", field: "updated_by" },
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
      {
        headerName: "Created At",
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
        headerName: "Updated At",
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

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

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
        <h2 className="text-xl font-bold mb-4">Interested</h2>


        <div className="flex gap-4" >

        <SourceFilter
selectedSource={selectedSource}
setSelectedSource={setSelectedSource}
/>

        <QuickFilter
          value={quickFilterText}
          onChange={setQuickFilterText}
        />

        </div>

        {/* .................................................................................... */}


        {/* ..................................................................................... */}
      </div>
      <div className="ag-theme-alpine" style={{ height: 615, }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={100}
          paginationAutoPageSize={true}
          animateRows={true}
          singleClickEdit={true}
          rowSelection="multiple"
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
