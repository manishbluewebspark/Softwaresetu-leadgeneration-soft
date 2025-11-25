// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FiHome,
//   FiUsers,
//   FiUser,
//   FiFileText,
//   FiBarChart2,
//   FiActivity,
//   FiCalendar,
//   FiDollarSign

// } from "react-icons/fi";
// import { MdCardMembership } from "react-icons/md";

// export default function Sidebar({ open }) {
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   const base = "flex items-center gap-2 px-4 py-2 rounded-lg";
//   const active = ({ isActive }) =>
//     `${base} ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

//   return (
//     <aside
//       className={`
//         fixed top-20 bottom-4 left-0 bg-white border-r rounded-r-2xl border-gray-200 p-4
//         md:translate-x-0 w-64 transition-transform
//         ${open ? "translate-x-0" : "-translate-x-full"}
//         overflow-y-auto
//       `}
//     >
//       <nav className="space-y-1">
//         <NavLink to="/dashboard" className={active}>
//           <FiHome className="mr-2" /> Dashboard
//         </NavLink>

//         {user?.role === "admin" && (
//           <>
//             <NavLink to="/employees" className={active}>
//               <FiUsers className="mr-2" /> Employees
//             </NavLink>
//             <NavLink to="/customer" className={active}>
//               <FiUser className="mr-2" /> Customer
//             </NavLink>
//             <NavLink to="/excel" className={active}>
//               <FiFileText className="mr-2" /> Excel
//             </NavLink>
//             <NavLink to="/earning-form" className={active}>
//               <FiDollarSign className="mr-2" /> Earning
//             </NavLink>
//             <NavLink to="/customer-status" className={active}>
//               <FiActivity className="mr-2" /> Customer Status
//             </NavLink>
//             <NavLink to="/daily" className={active}>
//               <FiCalendar className="mr-2" /> Daily Demo
//             </NavLink>
//             <NavLink to="/daily-activity" className={active}>
//               <FiCalendar className="mr-2" /> Daily Activity Report
//             </NavLink>

//             <NavLink to="/deal" className={active}>
//               <MdCardMembership className="mr-2" /> Deal
//             </NavLink>

//             <NavLink to="/admin-demo" className={active}>
//               <MdCardMembership className="mr-2" /> Demo
//             </NavLink>
//             <NavLink to="/admin-follow" className={active}>
//               <MdCardMembership className="mr-2" /> Follow
//             </NavLink>

//             <NavLink to="/admin-interested" className={active}>
//               <MdCardMembership className="mr-2" /> Interested
//             </NavLink>


//             <NavLink to="/admin-activity" className={active}>
//               <MdCardMembership className="mr-2" /> Users Activity
//             </NavLink>




//           </>
//         )}

//         {user?.role === "employee" && (
//           <>

//             <NavLink to="/assign-customer" className={active}>
//               <FiUsers className="mr-2" /> Contacts
//             </NavLink>
//             <NavLink to="/follow-up" className={active}>
//               <FiActivity className="mr-2" /> Follow Up
//             </NavLink>
//             <NavLink to="/demo" className={active}>
//               <FiFileText className="mr-2" /> Demo
//             </NavLink>

//             <NavLink to="/user-interested" className={active}>
//               <FiFileText className="mr-2" /> Interested
//             </NavLink>


//           </>
//         )}
//       </nav>
//     </aside>
//   );
// }


import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  User,
  FileText,
  BarChart3,
  Activity,
  CalendarDays,
  DollarSign,
  Briefcase,
  ClipboardList,
  FileSpreadsheet,
  CheckSquare,
  TrendingUp,
  UserCheck,
  CircleUserRound,
  BookUser
} from "lucide-react";
import { GiLoveLetter } from "react-icons/gi";

export default function Sidebar({ open }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const base = "flex items-center gap-2 px-4 py-2 rounded-lg";
  const active = ({ isActive }) =>
    `${base} ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`;

  return (
    <aside
      className={`
        fixed top-20 bottom-4 left-0 bg-white border-r rounded-r-2xl border-gray-200 p-4
        md:translate-x-0 w-64 transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"}
        overflow-y-auto
      `}
    >
      <nav className="mt-2 space-y-1">
        <NavLink to="/dashboard" className={active}>
          <Home className="mr-2 h-5 w-5" /> Dashboard
        </NavLink>

        {user?.role === "admin" && (
          <>
            <NavLink to="/employees" className={active}>
              <Users className="mr-2 h-5 w-5" /> Employees
            </NavLink>
            <NavLink to="/customer" className={active}>
              <User className="mr-2 h-5 w-5" /> Customer
            </NavLink>
            <NavLink to="/excel" className={active}>
              <FileSpreadsheet className="mr-2 h-5 w-5" /> Excel
            </NavLink>
            <NavLink to="/earning-form" className={active}>
              <DollarSign className="mr-2 h-5 w-5" /> Earning
            </NavLink>
            {/* <NavLink to="/customer-status" className={active}>
              <Activity className="mr-2 h-5 w-5" /> Customer Status
            </NavLink> */}
            <NavLink to="/source-status" className={active}>
              <Activity className="mr-2 h-5 w-5" /> Customer Status
            </NavLink>
            <NavLink to="/daily" className={active}>
              <CalendarDays className="mr-2 h-5 w-5" /> Daily Demo
            </NavLink>

            <NavLink to="/admin-demo-done" className={active}>
              <CalendarDays className="mr-2 h-5 w-5" /> Demo Done
            </NavLink>
            


            <NavLink to="/daily-activity" className={active}>
              <ClipboardList className="mr-2 h-5 w-5" /> Daily Activity Report
            </NavLink>
            <NavLink to="/new-daily-activity" className={active}>
              <ClipboardList className="mr-2 h-5 w-5" /> New Daily Activity Report
            </NavLink>

            

            <NavLink to="/deal" className={active}>
              <Briefcase className="mr-2 h-5 w-5" /> Deal
            </NavLink>

            {/* <NavLink to="/admin-demo" className={active}>
              <CheckSquare className="mr-2 h-5 w-5" /> Demo
            </NavLink> */}

         
            <NavLink to="/admin-follow" className={active}>
              <TrendingUp className="mr-2 h-5 w-5" /> Follow / Demo
            </NavLink>
            <NavLink to="/admin-interested" className={active}>
              <BarChart3 className="mr-2 h-5 w-5" /> Interested
            </NavLink>

            <NavLink to="/admin-activity" className={active}>
              <BookUser className="mr-2 h-5 w-5" /> Users Activity
            </NavLink>

            <NavLink to="/dfi" className={active}>
              <UserCheck className="mr-2 h-5 w-5" /> DFI
            </NavLink>


             <NavLink to="/user-track" className={active}>
              <CircleUserRound className="mr-2 h-5 w-5" /> User Report
            </NavLink>


   <NavLink to="/deal-status-monthly" className={active}>
              <User className="mr-2 h-5 w-5" /> New Clients
            </NavLink>


            <NavLink to="/hr" className={active}>
              <GiLoveLetter className="mr-2 h-5 w-5" /> HR
            </NavLink>




          

          </>
        )}

        {user?.role === "employee" && (
          <>
            <NavLink to="/assign-customer" className={active}>
              <Users className="mr-2 h-5 w-5" /> Contacts
            </NavLink>
            <NavLink to="/daily-activity" className={active}>
              <ClipboardList className="mr-2 h-5 w-5" /> Daily Activity Report
            </NavLink>
            <NavLink to="/follow-up" className={active}>
              <Activity className="mr-2 h-5 w-5" /> Follow Up / Demo
            </NavLink>


            {/* <NavLink to="/demo" className={active}>
              <FileText className="mr-2 h-5 w-5" /> Demo
            </NavLink> */}


            <NavLink to="/user-interested" className={active}>
              <BarChart3 className="mr-2 h-5 w-5" /> Interested
            </NavLink>

            <NavLink to="/activity" className={active}>
              <UserCheck className="mr-2 h-5 w-5" /> Activity
            </NavLink>

            <NavLink to="/user-dfi" className={active}>
              <UserCheck className="mr-2 h-5 w-5" /> DFI
            </NavLink>

            
           <NavLink to="/deal-status-monthly" className={active}>
              <User className="mr-2 h-5 w-5" /> New Clients
            </NavLink>


          </>
        )}
      </nav>
    </aside>
  );
}
