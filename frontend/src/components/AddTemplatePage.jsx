// import React, { useState, useEffect, useRef } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { useNavigate } from "react-router-dom";

// export default function AddTemplatePage() {
//   const [templateName, setTemplateName] = useState("");
//   const [templates, setTemplates] = useState([]);
//   const navigate = useNavigate();
//   const [editingId, setEditingId] = useState(null);
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const [editorContent, setEditorContent] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const editorRef = useRef(null);

//   // Load templates
//   useEffect(() => {
//     const loadTemplates = async () => {
//       try {
//         const res = await fetch(`${apiUrl}/templates/all`);
//         const data = await res.json();
//         setTemplates(data);
//         setIsLoading(false);
//       } catch (error) {
//         console.log("Error fetching templates:", error);
//         setIsLoading(false);
//       }
//     };
//     loadTemplates();
//   }, [apiUrl]);

//   // Handle edit
//   const handleEdit = (tpl) => {
//     setEditingId(tpl.id);
//     setTemplateName(tpl.name);
//     setEditorContent(tpl.content || "");
    
//     // Scroll to top
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Reset form
//   const resetForm = () => {
//     setEditingId(null);
//     setTemplateName("");
//     setEditorContent("");
//   };

//   // Handle submit
//   const handleSubmit = async () => {
//     if (!templateName.trim()) {
//       alert("Template name is required!");
//       return;
//     }

//     const templateData = {
//       templateName: templateName,
//       editorContent: editorContent,
//     };

//     if (editingId) {
//       try {
//         const res = await fetch(`${apiUrl}/templates/update/${editingId}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             templateName,
//             editorContent: editorContent,
//           }),
//         });

//         const data = await res.json();
//         setTemplates(templates.map((t) => (t.id === editingId ? data.template : t)));
//         resetForm();
//         alert("Template updated successfully!");
//       } catch (error) {
//         console.log("Update error:", error);
//         alert("Error updating template");
//       }
//       return;
//     }

//     try {
//       const res = await fetch(`${apiUrl}/templates/add`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(templateData),
//       });

//       const data = await res.json();
//       setTemplates([data.template, ...templates]);
//       resetForm();
//       alert("Template added successfully!");
//     } catch (error) {
//       console.log("Error saving template:", error);
//       alert("Error saving template");
//     }
//   };

//   const deleteTemplate = async (id) => {
//     if (window.confirm("Are you sure you want to delete this template?")) {
//       try {
//         await fetch(`${apiUrl}/templates/delete/${id}`, { method: "DELETE" });
//         setTemplates(templates.filter((tpl) => tpl.id !== id));
//         alert("Template deleted successfully!");
//       } catch (error) {
//         console.log("Delete error:", error);
//         alert("Error deleting template");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-full mx-auto">
//         {/* HEADER */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Template Manager</h1>
//           <p className="text-gray-600">Create and manage your email templates</p>
//         </div>

//         {/* INSTRUCTIONS CARD */}
//         <div className="bg-[#f8f9ff] p-6 md:p-10 rounded-xl font-sans text-[#333] leading-relaxed border border-[#e0e4ff] shadow-md mb-5">
//           <ul className="list-disc list-inside space-y-3 text-[#444] text-base">
//             <li>All remaining text should stay in normal paragraph formatting.</li>
//             <li>
//               The text <strong>‘OFFER LETTER’</strong> should always appear inside an <code>&lt;h1&gt;</code> tag.
//             </li>
//             <li>
//               The text on the bottom-left side should be placed inside an <code>&lt;h2&gt;</code> tag, and the text on the bottom-right side should be placed inside an <code>&lt;h3&gt;</code> tag.
//             </li>
//             <li>
//               Use the <strong>🖼️ Upload</strong> button to add logos and images directly from your computer.
//             </li>
//           </ul>
//         </div>

//         {/* MAIN CARD */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
//           <div className="flex items-center mb-6">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 {editingId ? "Edit Template" : "Create New Template"}
//               </h2>
//               <p className="text-gray-600">Design your perfect email template</p>
//             </div>
//           </div>

//           {/* TEMPLATE NAME */}
//           <div className="mb-6">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Template Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               value={templateName}
//               onChange={(e) => setTemplateName(e.target.value)}
//               placeholder="Enter a descriptive template name"
//             />
//           </div>

//           {/* CKEDITOR 5 EDITOR */}
//           <div className="mb-6">
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Template Content
//             </label>

//             <div className="editor-container border border-gray-300 rounded-xl overflow-hidden shadow-sm">
//               <div className="a4-container bg-white min-h-[400px]">
//                 {!isLoading && (
//                   <CKEditor
//                     editor={ClassicEditor}
//                     data={editorContent}
//                     onReady={(editor) => {
//                       editorRef.current = editor;
//                       console.log("CKEditor is ready!");
                      
//                       // Set minimum height
//                       editor.ui.view.editable.element.style.minHeight = "350px";
//                     }}
//                     onChange={(event, editor) => {
//                       const data = editor.getData();
//                       setEditorContent(data);
//                     }}
//                     config={{
//                       toolbar: [
//                         'heading',
//                         '|',
//                         'bold',
//                         'italic',
//                         'underline',
//                         'strikethrough',
//                         'subscript',
//                         'superscript',
//                         '|',
//                         'fontFamily',
//                         'fontSize',
//                         'fontColor',
//                         'fontBackgroundColor',
//                         '|',
//                         'alignment',
//                         '|',
//                         'numberedList',
//                         'bulletedList',
//                         '|',
//                         'outdent',
//                         'indent',
//                         '|',
//                         'link',
//                         'imageUpload',
//                         '|',
//                         'blockQuote',
//                         'insertTable',
//                         '|',
//                         'undo',
//                         'redo'
//                       ],
//                       placeholder: 'Start writing your template here...',
//                       heading: {
//                         options: [
//                           { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
//                           { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
//                           { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
//                           { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
//                           { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
//                           { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
//                           { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
//                         ]
//                       }
//                     }}
//                   />
//                 )}
                
//                 {isLoading && (
//                   <div className="flex items-center justify-center h-[400px]">
//                     <div className="text-center">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                       <p className="text-gray-600">Loading editor...</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             <p className="text-sm text-gray-500 mt-2">
//               Use the toolbar to format your text. Click the image icon to add logos and images directly from your computer.
//             </p>
//           </div>

//           {/* ACTION BUTTONS */}
//           <div className="flex justify-end space-x-4">
//             {editingId && (
//               <button
//                 onClick={resetForm}
//                 className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold shadow-sm transition-all duration-200"
//                 type="button"
//               >
//                 Cancel Edit
//               </button>
//             )}
//             <button
//               onClick={handleSubmit}
//               className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transform transition-all duration-200 flex items-center hover:shadow-xl hover:-translate-y-0.5"
//               type="button"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingId ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
//               </svg>
//               {editingId ? "Update Template" : "Add Template"}
//             </button>
//           </div>
//         </div>

//         {/* TEMPLATE LIST */}
//         {templates.length > 0 && (
//           <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//             <div className="flex items-center mb-6">
//               <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold text-gray-800">Saved Templates ({templates.length})</h3>
//             </div>

//             <div className="grid gap-6">
//               {templates.map((tpl) => (
//                 <div key={tpl.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h4 className="font-bold text-lg text-gray-800 flex items-center">
//                         {tpl.name}
//                         <span className="ml-3 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                           {new Date(tpl.createdAt).toLocaleDateString('en-IN', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                           })}
//                         </span>
//                       </h4>
//                     </div>

//                     <div className="flex gap-3">
//                       <button
//                         onClick={() => handleEdit(tpl)}
//                         className="text-blue-500 hover:text-blue-700 px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
//                         type="button"
//                       >
//                         ✏️ Edit
//                       </button>

//                       <button
//                         onClick={() => deleteTemplate(tpl.id)}
//                         className="text-gray-400 hover:text-red-500 px-3 py-1 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
//                         type="button"
//                       >
//                         🗑 Delete
//                       </button>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 rounded-lg p-4 border a4-preview max-h-60 overflow-y-auto">
//                     {tpl.content ? (
//                       <div
//                         className="prose max-w-none"
//                         dangerouslySetInnerHTML={{ __html: tpl.content }}
//                       />
//                     ) : (
//                       <p className="text-gray-500 italic">No content</p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* EMPTY STATE */}
//         {!isLoading && templates.length === 0 && (
//           <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
//             <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No Templates Yet</h3>
//             <p className="text-gray-500 mb-4">Create your first template to get started</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import { 
  FiEdit2, 
  FiTrash2, 
  FiFileText, 
  FiSave, 
  FiX, 
  FiCheckCircle,
  FiFolder,
  FiPlus,
  FiUpload
} from "react-icons/fi";
import { TbTemplate } from "react-icons/tb";
import { GrDocumentUpdate } from "react-icons/gr";

export default function AddTemplatePage() {
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [editorContent, setEditorContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  // Load templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetch(`${apiUrl}/templates/all`);
        const data = await res.json();
        // Ensure data is an array
        setTemplates(Array.isArray(data) ? data : []);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching templates:", error);
        setTemplates([]);
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, [apiUrl]);

  // Handle edit
  const handleEdit = (tpl) => {
    if (!tpl) return;
    
    setEditingId(tpl.id || tpl._id);
    setTemplateName(tpl.name || tpl.templateName || "");
    setEditorContent(tpl.content || tpl.editorContent || "");
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setTemplateName("");
    setEditorContent("");
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!templateName.trim()) {
      alert("Template name is required!");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        // Update existing template
        const res = await fetch(`${apiUrl}/templates/update/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateName,
            editorContent: editorContent,
          }),
        });

        if (!res.ok) throw new Error("Update failed");
        
        const data = await res.json();
        
        // Handle different response structures
        const updatedTemplate = data.template || data.updatedTemplate || data;
        
        if (updatedTemplate && updatedTemplate.id) {
          setTemplates(templates.map((t) => {
            // Handle both id and _id properties
            const tId = t.id || t._id;
            const updatedId = updatedTemplate.id || updatedTemplate._id;
            return tId === updatedId ? updatedTemplate : t;
          }));
        }
        
        resetForm();
        alert("Template updated successfully!");
      } else {
        // Add new template
        const res = await fetch(`${apiUrl}/templates/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateName,
            editorContent: editorContent,
          }),
        });

        if (!res.ok) throw new Error("Save failed");
        
        const data = await res.json();
        
        // Handle different response structures
        const newTemplate = data.template || data.newTemplate || data;
        
        if (newTemplate) {
          setTemplates([newTemplate, ...templates]);
        }
        
        resetForm();
        alert("Template added successfully!");
      }
    } catch (error) {
      console.log("Error saving template:", error);
      alert("Error saving template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTemplate = async (id) => {
    if (!id) return;
    
    if (window.confirm("Are you sure you want to delete this template?")) {
      try {
        await fetch(`${apiUrl}/templates/delete/${id}`, { method: "DELETE" });
        
        // Filter out the deleted template
        setTemplates(templates.filter((tpl) => {
          const tplId = tpl.id || tpl._id;
          return tplId !== id;
        }));
        
        // If deleting the template being edited, reset form
        if (editingId === id) {
          resetForm();
        }
        
        alert("Template deleted successfully!");
      } catch (error) {
        console.log("Delete error:", error);
        alert("Error deleting template");
      }
    }
  };

  // Safe template rendering helper
  const renderTemplateItem = (tpl) => {
    if (!tpl) return null;
    
    const templateId = tpl.id || tpl._id;
    const templateName = tpl.name || tpl.templateName || "Unnamed Template";
    const templateContent = tpl.content || tpl.editorContent || "";
    const createdAt = tpl.createdAt || tpl.updatedAt || new Date().toISOString();
    
    return (
      <div key={templateId} className="border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex-1">
            <h4 className="font-bold text-base md:text-lg text-gray-800 flex flex-wrap items-center gap-2">
              {templateName}
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {new Date(createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              {editingId === templateId && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center">
                  <FiEdit2 className="mr-1" /> Editing
                </span>
              )}
            </h4>
          </div>

          <div className="flex gap-2 self-end sm:self-auto">
            <button
              onClick={() => handleEdit(tpl)}
              disabled={isSubmitting}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 border border-blue-200 rounded-lg transition-colors flex items-center text-sm"
              type="button"
            >
              <FiEdit2 className="mr-1.5" />
              Edit
            </button>

            <button
              onClick={() => deleteTemplate(templateId)}
              disabled={isSubmitting}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 border border-gray-200 rounded-lg transition-colors flex items-center text-sm"
              type="button"
            >
              <FiTrash2 className="mr-1.5" />
              Delete
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 md:p-4 border a4-preview max-h-48 md:max-h-60 overflow-y-auto">
          {templateContent ? (
            <div
              className="prose max-w-none text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: templateContent }}
            />
          ) : (
            <p className="text-gray-500 italic text-sm md:text-base">No content</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <TbTemplate className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Template Manager</h1>
          <p className="text-gray-600">Create and manage your email templates</p>
        </div>

        {/* INSTRUCTIONS CARD */}
        <div className="bg-[#f8f9ff] p-5 md:p-8 rounded-xl font-sans text-[#333] leading-relaxed border border-[#e0e4ff] shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiFileText className="mr-2 text-blue-500" />
            Formatting Guidelines
          </h3>
          <ul className="list-disc list-inside space-y-2.5 text-[#444] text-sm md:text-base">
            <li>All remaining text should stay in normal paragraph formatting.</li>
            <li>
              The text <strong>‘OFFER LETTER’</strong> should always appear inside an <code className="bg-gray-100 px-1.5 py-0.5 rounded">&lt;h1&gt;</code> tag.
            </li>
            <li>
              The text on the bottom-left side should be placed inside an <code className="bg-gray-100 px-1.5 py-0.5 rounded">&lt;h2&gt;</code> tag, and the text on the bottom-right side should be placed inside an <code className="bg-gray-100 px-1.5 py-0.5 rounded">&lt;h3&gt;</code> tag.
            </li>
            <li className="flex items-start">
              <FiUpload className="mr-2 mt-1 text-blue-500 flex-shrink-0" />
              Use the upload button to add logos and images directly from your computer.
            </li>
          </ul>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 md:mr-4">
              <FiPlus className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {editingId ? "Edit Template" : "Create New Template"}
              </h2>
              <p className="text-gray-600 text-sm md:text-base">Design your perfect email template</p>
            </div>
          </div>

          {/* TEMPLATE NAME */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter a descriptive template name"
              disabled={isSubmitting}
            />
          </div>

          {/* CKEDITOR 5 EDITOR */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Template Content
            </label>

            <div className="editor-container border border-gray-300 rounded-lg md:rounded-xl overflow-hidden shadow-sm">
              <div className="a4-container bg-white min-h-[300px] md:min-h-[400px]">
                {!isLoading && (
                  <CKEditor
                    editor={ClassicEditor}
                    data={editorContent}
                    onReady={(editor) => {
                      editorRef.current = editor;
                      console.log("CKEditor is ready!");
                      
                      // Set minimum height
                      editor.ui.view.editable.element.style.minHeight = "300px";
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setEditorContent(data);
                    }}
                    config={{
                      toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'subscript',
                        'superscript',
                        '|',
                        'fontFamily',
                        'fontSize',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'alignment',
                        '|',
                        'numberedList',
                        'bulletedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'link',
                        'imageUpload',
                        '|',
                        'blockQuote',
                        'insertTable',
                        '|',
                        'undo',
                        'redo'
                      ],
                      placeholder: 'Start writing your template here...',
                      heading: {
                        options: [
                          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                          { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                          { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                          { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
                        ]
                      }
                    }}
                    disabled={isSubmitting}
                  />
                )}
                
                {isLoading && (
                  <div className="flex items-center justify-center h-[300px] md:h-[400px]">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-500 mx-auto mb-3 md:mb-4"></div>
                      <p className="text-gray-600 text-sm md:text-base">Loading editor...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              Use the toolbar to format your text. Click the image icon to add logos and images directly from your computer.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
            {editingId && (
              <button
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg md:rounded-xl font-medium shadow-sm transition-all duration-200 flex items-center justify-center"
                type="button"
              >
                <FiX className="mr-2" />
                Cancel Edit
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg md:rounded-xl font-semibold shadow-md transform transition-all duration-200 flex items-center justify-center hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              type="button"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                  {editingId ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  {editingId ? (
                    <>
                      <GrDocumentUpdate className="mr-2" />
                      Update Template
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Add Template
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* TEMPLATE LIST */}
        {templates.length > 0 && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                <FiFolder className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Saved Templates ({templates.length})</h3>
            </div>

            <div className="grid gap-4 md:gap-6">
              {templates.map((tpl) => renderTemplateItem(tpl))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && templates.length === 0 && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-8 md:p-12 text-center border border-gray-200">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <TbTemplate className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No Templates Yet</h3>
            <p className="text-gray-500 mb-4 text-sm md:text-base">Create your first template to get started</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <FiPlus className="mr-2" />
              Create Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}