// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// export default function CustomerDetails() {
//   const { id } = useParams();
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [customerName, setCustomerName] = useState("");
//   const apiUrl = import.meta.env.VITE_API_URL;

//   console.log(history,'history..')

//   const [columnDefs] = useState([
//     { headerName: "Customer ID", field: "customer_id", sortable: true, filter: true },
//     { headerName: "Name", field: "name", sortable: true, filter: true },
//     { headerName: "Email", field: "email", sortable: true, filter: true },
//     { headerName: "Address", field: "address", sortable: true, filter: true },
//     { headerName: "Status", field: "status", sortable: true, filter: true },
//     {
//       headerName: "Created At",
//       field: "created_at",
//       sortable: true,
//       filter: true,
//       valueFormatter: (params) =>
//         new Date(params.value).toLocaleString(),
//     },
//     {
//       headerName: "Updated At",
//       field: "updated_at",
//       sortable: true,
//       filter: true,
//       valueFormatter: (params) =>
//         new Date(params.value).toLocaleString(),
//     },
//   ]);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/customers/lead/${id}`);
//         setHistory(res.data);
//         if (res.data.length > 0) {
//           setCustomerName(res.data[0].name);
//         }
//       } catch (err) {
//         console.error("Error fetching lead history:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [id]);

//   if (loading) return <p className="p-4">Loading...</p>;

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">
//           Lead History for {customerName || `Customer ${id}`}
//         </h2>
//         <Link
//           to="/customers"
//           className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//         >
//           Back
//         </Link>
//       </div>

//       {history.length === 0 ? (
//         <p>No history found for this customer.</p>
//       ) : (
//         <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
//           <AgGridReact
//             rowData={history}
//             columnDefs={columnDefs}
//             pagination={true}
//             paginationPageSize={10}
//           />
//         </div>
//       )}
//     </div>
//   );
// }





// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { Clock, User, Mail, Phone, MapPin, Tag } from "lucide-react";

// export default function CustomerDetails() {
//   const { id } = useParams();
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [customerName, setCustomerName] = useState("");
//   const apiUrl = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/customers/lead/${id}`);
//         setHistory(res.data);
//         if (res.data.length > 0) {
//           setCustomerName(res.data[0].name);
//         }
//       } catch (err) {
//         console.error("Error fetching lead history:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [id]);

//   if (loading) return <p className="p-4">Loading...</p>;

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//           Lead History for <span className="text-blue-600">{customerName || `Customer ${id}`}</span>
//         </h2>
//         <Link
//           to="/customers"
//           className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
//         >
//           Back
//         </Link>
//       </div>

//       {/* If no history */}
//       {history.length === 0 ? (
//         <p className="text-gray-600">No history found for this customer.</p>
//       ) : (
//         <div className="relative border-l-4 border-blue-200 pl-8 space-y-8">
//          {history.map((item, index) => (
//     <div key={item.id || index} className="mb-10 relative">
//       {/* Timeline dot */}
//       {/* <span className="absolute -left-[9px] top-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></span> */}

//       {/* Card */}
//       <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm 
//                       p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-900">{item.status}</h3>
//           <div className="flex items-center text-xs sm:text-sm text-gray-500">
//             <Clock className="w-4 h-4 mr-1" />
//             {new Date(item.updated_at).toLocaleString("en-IN", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               hour12: true,
//             })}
//           </div>
//         </div>

//         {/* Details */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
//           <p className="flex items-center">
//             <User className="w-4 h-4 mr-2 text-blue-500" />
//             <span className="font-medium">Name:</span>&nbsp;{item.name}
//           </p>
//           <p className="flex items-center">
//             <Mail className="w-4 h-4 mr-2 text-green-500" />
//             <span className="font-medium">Email:</span>&nbsp;{item.email}
//           </p>
//           <p className="flex items-center">
//             <Phone className="w-4 h-4 mr-2 text-orange-500" />
//             <span className="font-medium">Mobile:</span>&nbsp;{item.mobile}
//           </p>
//           <p className="flex items-center">
//             <MapPin className="w-4 h-4 mr-2 text-purple-500" />
//             <span className="font-medium">Address:</span>&nbsp;{item.address}
//           </p>
//           <p className="flex items-center col-span-2">
//             <Tag className="w-4 h-4 mr-2 text-pink-500" />
//             <span className="font-medium">Updated By:</span>&nbsp;{item.updated_by}
//           </p>
//         </div>
//       </div>
//     </div>
//   ))}
//         </div>
//       )}
//     </div>
//   );
// }



//  working code ...................................................................


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { 
//   Clock, 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Tag, 
//   MessageSquare, 
//   Calendar 
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function CustomerDetails() {
//   const { id } = useParams();
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [customerName, setCustomerName] = useState("");
//   const [email, setEmail] = useState("");
//   const [number, setNumber] = useState("");
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await axios.get(`${apiUrl}/customers/lead/${id}`);
//         setHistory(res.data);
//         if (res.data.length > 0) {
//           setCustomerName(res.data[0].name);
//           setEmail(res.data[0].email);
//           setNumber(res.data[0].mobile);
//         }
//       } catch (err) {
//         console.error("Error fetching lead history:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [id]);

//   if (loading) return <p className="p-4">Loading...</p>;

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "-";
//     return new Date(dateStr).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//       timeZone: "Asia/Kolkata", // Indian Time
//     });
//   };

// return (
//   <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
//     {/* Header */}
//     <div className="flex justify-between items-center mb-8">
//       <h2 className="text-gray-300 text-3xl font-extrabold text-gray-900 tracking-tight">
//         Lead History for{" "}
//         <span className="text-black-600">
//           {`${customerName} ( ${number} )` || `Customer ${id}`}
//         </span>
//       </h2>
//       <div
//         onClick={() => navigate("/customer")}
//         className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
//       >
//         Back
//       </div>
//     </div>

//     {/* If no history */}
//     {history.length === 0 ? (
//       <p className="text-gray-600">No history found for this customer.</p>
//     ) : (
//       <div className="relative">
//         {/* Center line */}
//         <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2"></div>

//         <div className="space-y-12">
//           {history.map((item, index) => (
//             <div
//               key={item.id || index}
//               className={`relative flex items-center w-full ${
//                 index % 2 === 0 ? "justify-start" : "justify-end"
//               }`}
//             >
//               {/* Timeline dot */}
//               <span className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow"></span>

//               {/* Card */}
//               <div
//                 className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] ${
//                   index % 2 === 0 ? "mr-auto text-left" : "ml-auto text-left"
//                 }`}
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     {item.status}
//                   </h3>
//                   <div className="flex items-center text-xs sm:text-sm text-gray-500">
//                     <Clock className="w-4 h-4 mr-1" />
//                     {new Date(item.updated_at).toLocaleString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true,
//                     })}
//                   </div>
//                 </div>

//                 {/* Details */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
//                   <p className="flex items-center">
//                     <User className="w-4 h-4 mr-2 text-blue-500" />
//                     <span className="font-medium">Updated By :</span>&nbsp;
//                     {item.updated_by}
//                   </p>

//                   <p className="flex items-center col-span-2">
//                     <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
//                     <span className="font-medium">Comment :</span>&nbsp;
//                     {item.comment}
//                   </p>

//                   {item.status == "Demo" && (
//                     <p className="flex items-center col-span-2">
//                       <Calendar className="w-4 h-4 mr-2 text-blue-500" />
//                       <span className="font-medium">Demo Date :</span>&nbsp;
//                       {formatDate(item.followup_datetime)}
//                     </p>
//                   )}

//                   {item.status == "Follow Up" && (
//                     <p className="flex items-center col-span-2">
//                       <Calendar className="w-4 h-4 mr-2 text-blue-500" />
//                       <span className="font-medium">Follow Up Date :</span>&nbsp;
//                       {formatDate(item.followup_datetime)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     )}
//   </div>
// );
// }

//  working code ...................................................................



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Tag,
  MessageSquare,
  Calendar,
  StickyNote,
} from "lucide-react";

export default function CustomerDetails() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${apiUrl}/customers/lead/${id}`);
        const timeline = res.data.lead_history || [];
        setHistory(timeline);

        if (timeline.length > 0) {
          const firstLead = timeline.find((item) => item.type === "lead");
          console.log(firstLead, 'firstLead')
          if (firstLead) {
            setCustomerName(firstLead.name || "");
            setEmail(firstLead.email || "");
            setNumber(firstLead.mobile || "");
          }
        }
      } catch (err) {
        console.error("Error fetching lead history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Lead History for{" "}
          <span className="text-black-600">
            {`${customerName} (${number})` || `Customer ${id}`}
          </span>
        </h2>
        <div
          onClick={() => navigate("/customer")}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        >
          Back
        </div>
      </div>

      {/* If no history */}
      {history.length === 0 ? (
        <p className="text-gray-600">No history found for this customer.</p>
      ) : (
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2"></div>

          <div className="space-y-12">
            {history.map((item, index) => (
              <div
                key={item.id || item.note_id || index}
                className={`relative flex items-center w-full ${index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
              >
                {/* Timeline dot */}
                <span className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow"></span>

                {/* Card */}
                <div
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] 
  w-full sm:w-[420px] ${index % 2 === 0 ? "mr-auto text-left" : "ml-auto text-left"}`}
                >
                  {item.type === "lead" ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.status}
                        </h3>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(item.created_at)}
                        </div>
                      </div>

                      {/* Lead Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                        {item.updated_by && (
                          <p className="flex items-center col-span-2">
                            <User className="w-4 h-4 mr-2 text-blue-500" />
                            <span >Updated By :</span>&nbsp;
                            {item.updated_by}
                          </p>
                        )}

                        {item.comment && (
                          <p className="flex items-center col-span-2">
                            <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-medium">Comment :</span>&nbsp;
                            {item.comment}
                          </p>
                        )}

                        {item.status === "Demo" && (
                          <p className="flex items-center col-span-2">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-medium">Demo Date :</span>
                            &nbsp;{formatDate(item.followup_datetime)}
                          </p>
                        )}

                        {item.status === "Follow Up" && (
                          <p className="flex items-center col-span-2">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="font-medium">Follow Up Date :</span>
                            &nbsp;{formatDate(item.followup_datetime)}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Note Card */}
                      <div className="flex justify-between  items-center mb-3">
                        <h3 className="text-md font-semibold text-gray-800 flex items-center gap-2">
                          <StickyNote className="w-4 h-4 text-yellow-500" />
                          Customer Note
                        </h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(item.created_at)}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed ">
                        Created By : &nbsp;&nbsp;&nbsp;{item.updatedby_name}
                      </p>

                      <p className="text-sm text-gray-700 leading-relaxed ">
                        Note : &nbsp;&nbsp;&nbsp;{item.note}
                      </p>




                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

}
