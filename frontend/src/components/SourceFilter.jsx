import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";

export default function SourceFilter({ selectedSource, setSelectedSource }) {
  const [sources, setSources] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchSources = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}/employee/get-source-data`, {
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
    <div className="relative inline-block" >
    
      <select
        value={selectedSource}
        onChange={(e) => setSelectedSource(e.target.value)}
         className="appearance-none border border-gray-300 px-4 py-2 pr-10 rounded w-full"
      >
        <option value="0">All Source</option>
        {sources.map((src) => (
          <option key={src.batch_id} value={src.batch_id}>
            {src.source_name}
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