import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Users, Calendar, Activity, Edit, Trash2 ,BarChart3} from "lucide-react";
import RoleGuard from "../components/RoleGuard.jsx";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FaUserShield } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";
import { toast } from "react-toastify";
import QuickFilter from "./QuickFilter";
import { useNavigate } from "react-router-dom";
import LeadChart from "./LeadChart.jsx";


ModuleRegistry.registerModules([AllCommunityModule]);

export default function Dashboard() {
  const [quickFilterText, setQuickFilterText] = useState("");
  const { user } = useAuth();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stats, setStats] = useState({
    Demo: 0,
    FollowUp: 0,
    NotPickedCall: 0,
    Deal: 0,
    Interested:0,
  });
  const [filteblueData, setFilteblueData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [statusModal, setStatusModal] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [filterstatus, setFilterStatus] = useState("Follow Up")
  const [showChart, setShowChart] = useState(false);
  const navigate=useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL;







  // const columnDefs = useMemo(
  //   () => [
  //     { headerName: "ID", field: "id", sortable: true, filter: true },
  //     { headerName: "Name", field: "name", sortable: true, filter: true },
  //     { headerName: "Email", field: "email", sortable: true, filter: true },
  //     { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
  //     // { headerName: "Address", field: "address", sortable: true, filter: true },
  //     { headerName: "Status", field: "status", sortable: true, filter: true },
  //     { headerName: "Created At", field: "created_at", sortable: true, filter: true },
  //     { headerName: "Updated At", field: "updated_at", sortable: true, filter: true },
  //     { headerName: "Followup Date", field: "followup_datetime", sortable: true, filter: true },
  //     { headerName: "Demo Date", field: "followup_datetime", sortable: true, filter: true },
  //     { headerName: "Updated By", field: "updated_by", sortable: true, filter: true },
  //   ],
  //   []
  // );

  const columnDefs = useMemo(() => {
    const baseCols = [
      // { headerName: "ID", field: "id", sortable: true, filter: true },
      { headerName: "Name", field: "name", sortable: true, filter: true },
      // { headerName: "Email", field: "email", sortable: true, filter: true },
      { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
      { headerName: "Status", field: "status", sortable: true, filter: true },


      {
        headerName: "Created At", field: "created_at", sortable: true, filter: true, valueFormatter: (p) =>
          p.value ? new Date(p.value).toLocaleString() : "-"
      },
      {
        headerName: "Updated At", field: "updated_at", sortable: true, filter: true, valueFormatter: (p) =>
          p.value ? new Date(p.value).toLocaleString() : "-"
      },
      { headerName: "Updated By", field: "updated_by", sortable: true, filter: true, },
    ];

    // conditional column add karna
    if (filterstatus === "Demo") {
      baseCols.push({
        headerName: "Demo Date",
        field: "followup_datetime",
        sortable: true,
        filter: true,
        valueFormatter: (p) =>
          p.value ? new Date(p.value).toLocaleString() : "-"
      });
    } else if (filterstatus === "Follow Up") {
      baseCols.push({
        headerName: "FollowUp Date",
        field: "followup_datetime",
        sortable: true,
        filter: true, 
        valueFormatter: (p) =>
          p.value ? new Date(p.value).toLocaleString() : "-"
      });
    }

    return baseCols;
  }, [filterstatus]);



  useEffect(() => {
    axios
      .get(`${apiUrl}/customers/get-lead-data`)
      .then((res) => {
        setRowData(res.data);
        setFilteblueData(res.data.filter((val)=>val.status==filterstatus));
      })
      .catch((err) => {
        console.error("Error fetching lead history:", err);
      });

    axios
      .get(`${apiUrl}/customers/fetch-customer-status`)
      .then((res) => {
        const newStats = {
          Demo: 0,
          FollowUp: 0,
          // NotPickedCall: 0,
          Deal: 0,
          Interested:0,
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

  const handleFilterClick = (statusType) => {

    setActiveFilter(statusType);
    if (statusType === "All") {
      setFilteblueData(rowData);
    } else {
      setFilteblueData(rowData.filter((item) => item.status === statusType));
    }
  };

  useEffect(()=>{
handleFilterClick(filterstatus)

  },[filterstatus])


  const statusColumns = [
    { headerName: "ID", field: "id", width: 80 },
    { headerName: "Status", field: "name", flex: 1 },
    // {
    //   headerName: "Actions",
    //   cellRenderer: (params) => {
    //     // agar id 5 hai to kuch bhi return mat karo
    //     if (params.data.id === 5) {
    //       return null;
    //     }

    //     return (
    //       <div className="flex gap-2">
    //         <button
    //           onClick={() => {
    //             setEditRow(params.data);
    //             setNewStatus(params.data.name);
    //           }}
    //           className="flex items-center gap-1 text-black rounded-md"
    //         >
    //           <Edit size={16} />
    //         </button>
    //         <button
    //           onClick={() => {
    //             setDeleteId(params.data.id);
    //             setShowConfirm(true);
    //           }}
    //           className="flex items-center gap-1 text-black rounded-md"
    //         >
    //           <Trash2 size={16} />
    //         </button>
    //       </div>
    //     );
    //   },
    // },
  ];

  const confirmDelete = () => {
    if (deleteId) {
      handleDeleteStatus(deleteId);
      setDeleteId(null);
      setShowConfirm(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/status`);
      setStatusData(res.data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };

  const handleSaveStatus = async () => {

    console.log(newStatus, 'newStatus...')
    if (newStatus !== "") {
      try {
        setLoading(true);
        if (editRow) {
          await axios.put(`${apiUrl}/status/${editRow.id}`, { name: newStatus });
        } else {
          await axios.post(`${apiUrl}/status`, { name: newStatus });
        }
        setNewStatus("");
        setEditRow(null);
        fetchStatuses();
      } catch (err) {
        console.error("Error saving status:", err);
      } finally {
        setLoading(false);
      }

    }
    else {


      toast.warning("Please enter valid status name");
    }

  };

  const handleDeleteStatus = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/status/${id}`);
      fetchStatuses();
    } catch (err) {
      console.error("Error deleting status:", err);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = () => {
    setStatusModal(true);
    fetchStatuses();
  };

  return (
    <>
      <RoleGuard role="admin">
        <div className=" bg-gray-50 rounded-md shadow-md p-6">
          {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1> */}

          {/* <div className="flex justify-between items-center mb-8 px-10">
            {user && (
              <div className="mb-8 flex items-center gap-5">
                <FaUserShield className="text-blue-600 text-4xl" />
                <span className="font-semibold">{user.name}</span>
              </div>
            )}
            
          </div> */}

           <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              {showChart ? 'Hide Analytics' : 'Show Analytics'}
            </button>
          </div>


           {showChart && (
            <div className="mb-8">
              <LeadChart />
            </div>
          )}

         


          {/* Stats Boxes */}
         <div className="flex flex-wrap gap-6 justify-center">
  {/* Demo */}
  <div
    className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
    onClick={() => {setFilterStatus("Demo")
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
    onClick={() => {setFilterStatus("Follow Up")
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
    onClick={() => {setFilterStatus("Interested")
       navigate('/admin-interested')
    }}
  >
    <User className="w-8 h-8 text-pink-500 mr-3" />
    <div className="flex gap-4 items-start">
      <p className="text-gray-400 text-sm mt-1">Interested</p>
      <p className="text-xl font-bold text-gray-800">{stats.Interested}</p>
    </div>
  </div>

  {/* Deal */}
  {/* <div
    className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
    onClick={() => {setFilterStatus("Deal")
     navigate('/deal')

    }}
  >
    <User className="w-8 h-8 text-yellow-500 mr-3" />
    <div className="flex gap-4 items-start">
      <p className="text-gray-400 text-sm mt-1">Deal</p>
      <p className="text-xl font-bold text-gray-800">{stats.Deal}</p>
    </div>
  </div> */}
</div>




             <div className="mt-5" >
              <button
                className="bg-blue-500 flex items-center p-2 rounded-md gap-2 hover:bg-blue-600"
                onClick={openStatusModal}
              >
                <FaClipboardList className="text-white text-xl" />
                <h1 className="text-md text-white">Add Status</h1>
              </button>
            </div>

          

          {/* Table */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              {/* <h2 className="text-2xl font-semibold">
                {activeFilter ? `${activeFilter} Leads` : "History"}
              </h2> */}


              <h2 className="text-xl font-bold mb-4">{activeFilter ? `${activeFilter} Leads` : "History"}</h2>


              <div className="flex gap-5">

                <QuickFilter
                  value={quickFilterText}
                  onChange={setQuickFilterText}
                />

                {activeFilter && (
                  <button
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                    onClick={() => setFilterStatus("All")}
                  >
                    Show All
                  </button>
                )}



              </div>


            </div>
            <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }} >
              <AgGridReact
                rowData={filteblueData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={100}
                quickFilterText={quickFilterText}
              />
            </div>
          </div>
        </div>
      </RoleGuard>

      {statusModal && (
        <div className="fixed inset-0  backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[700px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">STATUS</h2>
              <button
                onClick={() => setStatusModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-black text-lg font-bold hover:bg-gray-400 transition"
              >
                X
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                placeholder="Enter status name"
                className="flex-1 border border-gray-300 p-2 rounded-md"
              />
              <button
                onClick={handleSaveStatus}
                disabled={loading}
                className={`px-4 py-2 flex items-center justify-center gap-2 rounded-md text-white ${loading ? "bg-blue-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                {loading ? (
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
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    {editRow ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editRow ? "Update" : "Add"
                )}
              </button>
            </div>

            <div className="ag-theme-alpine" style={{ height: 750 }}>
              <AgGridReact rowData={statusData} columnDefs={statusColumns} pagination={true} />
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className={`px-4 py-2 flex items-center justify-center gap-2 rounded-md text-white ${loading
                  ? "bg-blue-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                {loading ? (
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
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
