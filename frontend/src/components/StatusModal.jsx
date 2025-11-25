import React, { forwardRef ,useState} from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import axios from "axios";
import { Calendar } from "lucide-react";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    className="border border-gray-300 rounded px-4 py-2 cursor-pointer bg-white w-100"
  >
    <div className="flex items-center justify-between">
      <span className={value ? "text-black" : "text-gray-400"}>
        {value || "Select date & time"}
      </span>
      <Calendar className="w-5 h-5 text-gray-500 ml-2" />
    </div>
  </div>
));

export default function StatusModal({
  statusModalData,
  setStatusModalData,
  statusData,
  statusFullData,
  commentMap,
  setCommentMap,
  dateTimeMap,
  setDateTimeMap,
  setIsChange,
}) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading,setLoading]=useState(false)



  console.log(statusModalData,'statusModalData..')



  const handleSave = async () => {
  
    if (!statusModalData) return;
    const { customer_id, newStatus ,batch_id} = statusModalData;
 console.log(batch_id,'batch_id...')
  console.log(customer_id,'customer_id...')
    const user = JSON.parse(localStorage.getItem("user"));
    const selectedObj = statusFullData.find(
      (item) => item.name.trim().toLowerCase() === newStatus?.trim().toLowerCase()
    );
    const statusid = selectedObj?.id ?? null;
   

    try {
      setLoading(true)
      const payload = {
        customer_id,
        status: newStatus,
        updated_by_id: user.id,
        updated_by_name: user.name,
        statusid,
        comment: commentMap[customer_id] || "",
        batch_id,
      };


      // console.log(batch_id,'batch_id...')

      if (newStatus === "Demo" || newStatus === "Follow Up") {
        payload.followup_datetime = dateTimeMap[customer_id] || "";
      }

      await axios.put(`${apiUrl}/customers/status/${customer_id}`, payload);

      toast.success("Status updated successfully");
      setIsChange((prev) => !prev);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
      setLoading(false)
    } finally {
      setStatusModalData(null);
      setLoading(false)
    }
  };



  return (
    <Modal
      isOpen={!!statusModalData}
      onRequestClose={() => setStatusModalData(null)}
      className="bg-white p-6 rounded shadow-lg max-w-md w-full relative z-50"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-bold mb-4">Update Status</h2>

      <select
        value={statusModalData?.newStatus || ""}
        onChange={(e) => {
          const newStatus = e.target.value;
          const customer_id = statusModalData.customer_id;

          setStatusModalData((prev) => ({ ...prev, newStatus }));
          if (newStatus === "Demo" || newStatus === "Follow Up") {
            setDateTimeMap((prev) => ({ ...prev, [customer_id]: null }));
          }
        }}
        className="border p-2 w-full mb-4 rounded"
      >
        <option value="">Select Status</option>
        {statusData.map((status, idx) => (
          <option key={idx} value={status}>
            {status}
          </option>
        ))}
      </select>

      {(statusModalData?.newStatus === "Demo" ||
        statusModalData?.newStatus === "Follow Up") && (
          <div className="mb-4">
            {/* <DatePicker
              selected={
                dateTimeMap[statusModalData?.customer_id]
                  ? new Date(dateTimeMap[statusModalData?.customer_id])
                  : null
              }
              onChange={(date) =>
                setDateTimeMap((prev) => ({
                  ...prev,
                  [statusModalData.customer_id]: date,
                }))
              }
              showTimeSelect
              showTimeSelectSeconds
              timeIntervals={1}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy HH:mm:ss"
              timeFormat="HH:mm:ss"
              customInput={<CustomDateInput />}
            /> */}
            <DatePicker
              selected={
                dateTimeMap[statusModalData?.customer_id]
                  ? new Date(dateTimeMap[statusModalData?.customer_id])
                  : null
              }
              onChange={(date) =>
                setDateTimeMap((prev) => ({
                  ...prev,
                  [statusModalData.customer_id]: date,
                }))
              }
              showTimeSelect
              showTimeSelectSeconds
              timeIntervals={30}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy hh:mm:ss aa"
              timeFormat="hh:mm aa"
              customInput={<CustomDateInput />}
            />
          </div>
        )}

      {/* <input
        type="text"
        placeholder="Enter comment"
        value={commentMap[statusModalData?.customer_id] || ""}
        onChange={(e) =>
          setCommentMap((prev) => ({
            ...prev,
            [statusModalData.customer_id]: e.target.value,
          }))
        }
        className="border p-2 w-full mb-4 rounded"
      /> */}

      <textarea
  placeholder="Enter comment"
  value={commentMap[statusModalData?.customer_id] || ""}
  onChange={(e) =>
    setCommentMap((prev) => ({
      ...prev,
      [statusModalData.customer_id]: e.target.value,
    }))
  }
  maxLength={1000}
  className="border p-2 w-full mb-4 rounded resize-y h-28"
/>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setStatusModalData(null)}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
        {/* <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button> */}
           <button
                  className={`px-4 py-2 text-white rounded-md flex items-center justify-center gap-2
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  onClick={handleSave}
                  disabled={loading}
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
                          d="M4 12a8 8 0 018-8V0C5.373 
              0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
      </div>
    </Modal>
  );
}
