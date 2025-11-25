import React, { useState, useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import "../A4Editor.css";

export default function AddTemplatePage() {
    const [templateName, setTemplateName] = useState("");
    const [editorContent, setEditorContent] = useState("");
    const [templates, setTemplates] = useState([]);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const navigate = useNavigate();
    const [editingId, setEditingId] = useState(null);
    const editorContainerRef = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    // Quill editor configuration with ALL features enabled
    const { quill, quillRef } = useQuill({
        modules: {
            toolbar: [
                [{ 'font': [] }, { 'size': [] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'align': [] }],
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],
                ['clean']
            ]
        },
        formats: [
            'font', 'size',
            'bold', 'italic', 'underline', 'strike',
            'color', 'background',
            'script',
            'header',
            'list', 'bullet',
            'indent',
            'direction',
            'align',
            'blockquote', 'code-block',
            'link', 'image', 'video'
        ],
        theme: 'snow'
    });

    // Initialize editor
    useEffect(() => {
        if (quill) {
            setIsEditorReady(true);
            console.log("Quill editor loaded successfully!");

            // Fix for black screen issue - ensure proper styling
            const editorElement = quill.root;
            editorElement.style.backgroundColor = 'white';
            editorElement.style.color = 'black';

            // Set A4 dimensions
            if (editorContainerRef.current) {
                editorContainerRef.current.classList.add('a4-container');
            }

            quill.on("text-change", () => {
                setEditorContent(quill.root.innerHTML);
                applyPageBreaks();
            });

            // Apply page breaks initially
            setTimeout(() => {
                applyPageBreaks();
            }, 100);
        }
    }, [quill]);

    // Function to apply page breaks
    const applyPageBreaks = () => {
        if (!quill) return;

        const editor = quill.root;
        const lines = editor.querySelectorAll('.ql-editor > *');
        let currentPageHeight = 0;
        const pageHeight = 1122; // A4 height in pixels at 96 DPI

        lines.forEach(line => {
            const lineHeight = line.offsetHeight;

            if (currentPageHeight + lineHeight > pageHeight) {
                // Add page break before this line
                line.classList.add('page-break-before');
                currentPageHeight = lineHeight;
            } else {
                line.classList.remove('page-break-before');
                currentPageHeight += lineHeight;
            }
        });
    };

    // LOAD TEMPLATES
    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const res = await fetch(`${apiUrl}/templates/all`);
                const data = await res.json();
                setTemplates(data);
            } catch (error) {
                console.log("Error fetching templates:", error);
            }
        };
        loadTemplates();
    }, []);

    // EDIT Template
    const handleEdit = (tpl) => {
        setEditingId(tpl.id);
        setTemplateName(tpl.name);

        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(tpl.content);

            // Apply page breaks after content is loaded
            setTimeout(() => {
                applyPageBreaks();
            }, 100);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // SUBMIT (ADD + UPDATE)
    const handleSubmit = async () => {
        if (!templateName.trim()) {
            alert("Template name is required!");
            return;
        }

        // REMOVE OKLCH COLORS
        const safeHTML = quill.root.innerHTML.replace(/oklch\([^)]*\)/gi, "#000");

        const templateData = {
            templateName: templateName,
            editorContent: safeHTML,
        };

        // UPDATE MODE
        if (editingId) {
            try {
                const res = await fetch(`${apiUrl}/templates/update/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        templateName,
                        editorContent: safeHTML,
                    }),
                });

                const data = await res.json();

                setTemplates(
                    templates.map((t) => (t.id === editingId ? data.template : t))
                );

                setEditingId(null);
                setTemplateName("");
                quill.setContents([]);


                
                window.location.reload();
                navigate("/template");

            } catch (error) {
                console.log("Update error:", error);
            }

            return;
        }

        // ADD MODE
        try {
            const res = await fetch(`${apiUrl}/templates/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(templateData),
            });

            const data = await res.json();

            setTemplates([data.template, ...templates]);
            setTemplateName("");
            quill.setContents([]);


            navigate("/template");

        } catch (error) {
            console.log("Error saving template:", error);
        }
    };

const deleteTemplate = async (id) => {
    try {
        const res = await fetch(`${apiUrl}/templates/delete/${id}`, {
            method: "DELETE",
        });

        const data = await res.json();
        console.log(data);

        setTemplates(templates.filter((tpl) => tpl.id !== id));

    } catch (error) {
        console.log("Delete error:", error);
    }
};


    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-full mx-auto">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Template Manager</h1>
                    <p className="text-gray-600">Create and manage your email templates</p>
                </div>

                <div class="bg-[#f8f9ff] p-6 md:p-10 rounded-xl font-sans text-[#333] leading-relaxed border border-[#e0e4ff] shadow-md mb-5">

                    <ul class="list-disc list-inside space-y-3 text-[#444] text-base">
                        <li>
                            All remaining text should stay in normal paragraph formatting.
                        </li>

                        <li>
                            The text <strong>‘OFFER LETTER’</strong> should always appear inside an <code>&lt;h1&gt;</code> tag.
                        </li>

                        <li>
                            The text on the bottom-left side should be placed inside an <code>&lt;h2&gt;</code> tag, and the text on the bottom-right side should be placed inside an <code>&lt;h3&gt;</code> tag.
                        </li>
                    </ul>
                </div>



                {/* MAIN CARD */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">

                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingId ? "Edit Template" : "Create New Template"}
                            </h2>
                            <p className="text-gray-600">Design your perfect email template</p>
                        </div>
                    </div>

                    {/* TEMPLATE NAME */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Template Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Enter a descriptive template name"
                        />
                    </div>

                    {/* QUILL EDITOR */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Template Content
                        </label>

                        {!isEditorReady && (
                            <div className="border border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                                <div className="animate-pulse">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-500">Loading editor...</p>
                                </div>
                            </div>
                        )}

                        <div
                            ref={editorContainerRef}
                            className={`editor-container ${isEditorReady ? 'opacity-100' : 'opacity-0 h-0'}`}
                        >
                            <div
                                ref={quillRef}
                                className="a4-editor"
                            />
                        </div>

                        {isEditorReady && (
                            <p className="text-sm text-gray-500 mt-2">
                                Use the toolbar above to format your text. Content will automatically flow to the next page when needed.
                            </p>
                        )}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={!isEditorReady}
                            className={`px-8 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-200 flex items-center ${isEditorReady
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-xl hover:-translate-y-0.5'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingId ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                            </svg>
                            {editingId ? "Update Template" : "Add Template"}
                        </button>
                    </div>
                </div>

                {/* TEMPLATE LIST */}
                {templates.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Saved Templates ({templates.length})</h3>
                        </div>

                        <div className="grid gap-6">
                            {templates.map((tpl) => (
                                <div key={tpl.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-800 flex items-center">
                                                {tpl.name}
                                                <span className="ml-3 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    Created: {tpl.createdAt || ""}
                                                </span>
                                            </h4>
                                        </div>

                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => handleEdit(tpl)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                onClick={() => deleteTemplate(tpl.id)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                🗑 Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 border a4-preview">
                                        <div className="ql-snow">
                                            <div
                                                className="ql-editor"
                                                dangerouslySetInnerHTML={{ __html: tpl.content }}
                                            />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* EMPTY STATE */}
                {templates.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Templates Yet</h3>
                        <p className="text-gray-500 mb-4">Create your first template to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}