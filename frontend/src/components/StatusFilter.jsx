import React from "react";
import { ChevronDown } from "lucide-react";

export default function StatusFilter({ selectedStatus, setSelectedStatus, statusData }) {
  console.log(statusData,'statusData...')
  return (
    <div className="relative inline-block">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="appearance-none border border-gray-300 px-4 py-2 pr-10 rounded w-full"
      >
        <option value="0">All Status</option>
        {statusData.map((status, idx) => (
          <option key={idx} value={status}>
            {status}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
      />
    </div>
  );
}
