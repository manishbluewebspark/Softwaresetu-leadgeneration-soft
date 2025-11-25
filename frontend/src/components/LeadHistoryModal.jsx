// components/LeadHistoryModal.js
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function LeadHistoryModal({ customerId, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (customerId) {
      setLoading(true);
      axios
        .get(`${apiUrl}/customers/history/${customerId}`)
        .then((res) => {
          setHistory(res.data.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load history");
          setLoading(false);
        });
    }
  }, [customerId]);

  if (!customerId) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 md:w-3/4 max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4">
          Comments History
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border text-left">Date</th>
                  <th className="p-2 border text-left">Created By</th>
                  <th className="p-2 border text-left">Comment</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => (
                  <tr key={i} className="border">
                    <td className="p-2 border align-top whitespace-nowrap">
                      {new Date(
                        item.created_at || item.createdAt
                      ).toLocaleString()}
                    </td>
                    <td className="p-2 border align-top break-words whitespace-pre-wrap">
                      {item.updated_by}
                    </td>
                    <td className="p-2 border align-top break-words whitespace-pre-wrap">
                      {item.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No history found</p>
        )}
      </div>
    </div>
  );
}
