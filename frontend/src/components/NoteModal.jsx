import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export default function NoteModal({ noteModalData, setNoteModalData }) {
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(20);
    const apiUrl = import.meta.env.VITE_API_URL;
    const userss = JSON.parse(localStorage.getItem('user'))
    console.log(userss?.id,'userss...')
    console.log(userss?.name,'userss...')

    const handleClose = () => {
        setNoteModalData(null);
        setNote("");
        setNotes([]);
        setCurrentPage(1);
    };

    const fetchNotes = async () => {
        if (!noteModalData?.customer_id) return;
        try {
            const res = await axios.get(
                `${apiUrl}/activity/get-customer-notes/${noteModalData.customer_id}`
            );

            // Notes come as objects { text, created_at }
            const data = res.data?.notes || [];
            const formattedNotes = data.map((n, i) => ({
                note: n.text,
                created_at: n.created_at,
                id: i,

            }));

            setNotes(formattedNotes);
        } catch (error) {
            console.error("Error fetching notes:", error);
            setNotes([]);
        }
    };

    const handleSave = async () => {
        if (!noteModalData?.customer_id || !note.trim()) return;

        try {
            await axios.post(
                `${apiUrl}/activity/customer-notes/${noteModalData.customer_id}`,
                { note ,updatedby_name:userss?.name,
                updatedby_id:userss?.id}
            );

            toast.success("Note saved successfully");
            setNote("");
            fetchNotes();
        } catch (error) {
            console.error("Error saving note:", error);
            toast.error("Failed to save note");
        }
    };

    useEffect(() => {
        if (noteModalData) {
            fetchNotes();
        }
    }, [noteModalData]);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = Array.isArray(notes)
        ? notes.slice(indexOfFirstRow, indexOfLastRow)
        : [];
    const totalPages = Array.isArray(notes)
        ? Math.ceil(notes.length / rowsPerPage)
        : 0;

    return (
        <Modal
            isOpen={!!noteModalData}
            onRequestClose={handleClose}
            className="bg-white rounded-md shadow-lg p-6 max-w-5xl w-full h-[80vh] mx-auto outline-none flex flex-col"
            overlayClassName="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-[999]"
        >
            <div className="h-1/2 flex flex-col">
                <h3 className="text-md font-semibold mb-2">Previous Notes</h3>
                <div className="flex-1 overflow-x-auto overflow-y-auto border">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>

                                <th className="border px-3 py-2 text-left w-40">Date</th>

                                <th className="border px-3 py-2 text-left">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.length > 0 ? (
                                currentRows.map((n) => (
                                    <tr key={n.id} className="hover:bg-gray-50">
                                        <td className="border px-3 py-2 w-40">
                                            {new Date(n.created_at).toLocaleString()}
                                        </td>
                                        <td className="border px-3 py-2">{n.note}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center py-4 text-gray-500">
                                        No notes found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 border rounded ${currentPage === i + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-white"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <div className="h-1/2 flex flex-col mt-4">
                <h2 className="text-lg font-bold mb-2">
                    Notes for {noteModalData?.customer_name || "Customer"}
                </h2>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write your note here..."
                    className="flex-1 border rounded-md p-2 mb-4 resize-none"
                />
                <div className="flex justify-end gap-4">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}