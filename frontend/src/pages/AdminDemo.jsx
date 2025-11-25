import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Activity,
  Calendar,
  User,
  NotebookPen,
  NotepadText,
  SquarePen,
  MessageCircle
} from "lucide-react";
import StatusModal from "../components/StatusModal";
import NoteModal from "../components/NoteModal";
import LeadHistoryModal from "../components/LeadHistoryModal";
import { useNavigate } from "react-router-dom";
import SourceFilter from  '../components/SourceFilter'

export default function DemoDone() {
  const [groupedData, setGroupedData] = useState({});
  const [groupedCopyData, setGroupedCopyData] = useState({});
  console.log()
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


  // fetch stats
  useEffect(() => {
    axios
      .get(`${apiUrl}/customers/fetch-customer-status`)
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

  // fetch lead data grouped by date
  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/customers/get-lead-data`);
        const filteredData = res.data.filter(
          (item) => item.status?.toLowerCase() === "demo"
        );

        const grouped = {};
        filteredData.forEach((item) => {
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
        setGroupedCopyData(grouped)
      } catch (err) {
        console.error("Error fetching lead history:", err);
        toast.error("Failed to load customer data");
      }
    };

    fetchDemoData();
  }, [isChange]);

  // fetch statuses
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



useEffect(() => {
  if (selectedSource !== "0") {
    const filtered = {};
    // Loop through each date group
    Object.keys(groupedCopyData).forEach((dateKey) => {
      const matchingRows = groupedCopyData[dateKey].filter(
        (item) => item.batch_id == selectedSource
      );
      if (matchingRows.length > 0) {
        filtered[dateKey] = matchingRows;
      }
    });
    setGroupedData(filtered);
  } else {
    // Reset to original grouped data
    setGroupedData(groupedCopyData);
  }
}, [selectedSource, groupedCopyData]);




  return (
    <div className="p-6 bg-gray-50">
      {/* ===== Top Cards ===== */}
      <div className="flex flex-wrap gap-6 justify-center mb-6">
        {/* Demo */}
        <div
          className="bg-white rounded-2xl shadow-lg w-48 h-20 p-4 flex items-center justify-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          onClick={() => navigate("/admin-demo")}
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
          onClick={() => navigate("/admin-follow")}
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
          onClick={() => navigate("/admin-interested")}
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

      {/* ===== Quick Filter ===== */}
      <div className="mb-6 gap-4 flex justify-end">

        
        
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
    if (a === "No Date") return 1; // "No Date" ko last me bhej do
    if (b === "No Date") return -1;
    return new Date(b) - new Date(a); // dates ko descending order me
  })
  .map((date) => {
    // Filtered rows
    const filteredRows = groupedData[date]
      .filter((item) =>
        Object.values(item).some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(filterText.toLowerCase())
        )
      )
      .sort((a, b) => {
        const timeA = a.followup_datetime ? new Date(a.followup_datetime) : new Date(0);
        const timeB = b.followup_datetime ? new Date(b.followup_datetime) : new Date(0);
        return timeA - timeB; // ascending time
      });

    if (filteredRows.length === 0) return null; // hide empty groups

    return (
      <div key={date} className="mb-8 bg-gray-200 shadow rounded">
        {/* Header */}
        <div className="bg-blue-500 text-white text-center py-2 font-semibold">
          {date} &nbsp; DEMO
        </div>

        {/* Table */}
        <table className="w-full text-sm border-collapse table-fixed">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="border px-3 py-2 text-left w-20">Name</th>
              <th className="border px-3 py-2 text-left w-15">Mobile</th>
              <th className="border px-3 py-2 text-left w-12">Time</th>
              <th className="border px-3 py-2 text-left w-80">Comment / Note</th>
              <th className="border px-3 py-2 text-left w-15">Updated By</th>
              <th className="border px-3 py-2 text-left w-15">Assigned To</th>
              <th className="border px-3 py-2 text-left w-15">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((item, idx) => (
              <tr key={idx} className="border-b bg-white">
                    <td className="border px-3 py-2 w-40 break-words whitespace-normal">
                      {item.name}
                    </td>
                    <td className="border px-3 py-2 w-32 break-words whitespace-normal">
                      {item.mobile}
                    </td>
                    <td className="border px-3 py-2 w-28">
                      {item.followup_datetime
                        ? new Date(item.followup_datetime).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : ""}
                    </td>

                   
                    <td className="border px-3 py-2 w-64 break-words whitespace-normal">
                      <div className="flex justify-between items-center gap-3">
                        <span className="break-words whitespace-normal">{item.comment}</span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            className="hover:bg-gray-200  rounded p-2"
                            onClick={() =>
                              setNoteModalData({ customer_id: item.customer_id })
                            }
                            title="Add Note"
                          >
                            <NotebookPen className="w-5 h-5 text-gray-600" />
                          </button>


                          <button
                            className="hover:bg-gray-200  rounded p-2"
                            onClick={() => setSelectedCustomer(item.customer_id)}
                            title="View History"
                          >
                            <MessageCircle className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="border px-3 py-2 w-40 break-words whitespace-normal">
                      {item.updated_by || "Unassigned"}
                    </td>

                    <td className="border px-3 py-2 w-40 break-words whitespace-normal">
                      {item.employee_name || "Unassigned"}
                    </td>

                  
                    <td className="border px-3 py-2 w-36 break-words whitespace-normal">
                      <div className="flex justify-between items-center">
                        <span>{item.status}</span>
                        <button
                          className="hover:bg-gray-200  rounded p-2"
                          onClick={() =>{
                             
                            setStatusModalData({
                             
                              customer_id: item.customer_id,
                              currentStatus: item.value,
                              newStatus: item.value,
                              batch_id: item.batch_id,
                            })}
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
