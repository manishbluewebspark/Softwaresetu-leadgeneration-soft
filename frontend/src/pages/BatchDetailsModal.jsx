import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Modal from "react-modal";
import { 
  X, Users, UserCheck, UserX, Clock, CheckCircle, 
  AlertCircle, Download, Filter, Search 
} from "lucide-react";
import { toast } from "react-toastify";

ModuleRegistry.registerModules([AllCommunityModule]);

// Set app element for accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

const BatchDetailsModal = ({ isOpen, onClose, batchId, sourceName }) => {
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (isOpen && batchId) {
      fetchBatchDetails();
    }
  }, [isOpen, batchId]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/customers/batch-details/${batchId}`);
      
      if (response.data.success) {
        setCustomers(response.data.customers);
        setSummary(response.data.summary);
      }
    } catch (err) {
      console.error("Error fetching batch details:", err);
      toast.error("Failed to fetch batch details");
    } finally {
      setLoading(false);
    }
  };

  // Filter customers based on selected filters
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Assignment filter (assigned/pending)
      if (assignmentFilter !== "all") {
        if (assignmentFilter === "assigned" && !customer.assigned_to) return false;
        if (assignmentFilter === "pending" && customer.assigned_to) return false;
      }
      
      // Status filter (open/in_progress/closed)
      if (statusFilter !== "all") {
        if (statusFilter === "open" && customer.status_id !== 1) return false;
        if (statusFilter === "in_progress" && customer.status_id !== 2) return false;
        if (statusFilter === "closed" && customer.status_id !== 3) return false;
      }
      
      // Quick filter (search)
      if (quickFilterText) {
        const searchTerm = quickFilterText.toLowerCase();
        return (
          (customer.name?.toLowerCase() || '').includes(searchTerm) ||
          (customer.email?.toLowerCase() || '').includes(searchTerm) ||
          (customer.mobile || '').includes(searchTerm) ||
          (customer.address?.toLowerCase() || '').includes(searchTerm) ||
          (customer.comment?.toLowerCase() || '').includes(searchTerm)
        );
      }
      
      return true;
    });
  }, [customers, assignmentFilter, statusFilter, quickFilterText]);

const columnDefs = useMemo(() => [
    { 
      headerName: "Name", 
      field: "name", 
      flex: 2,  // More flex for name
      minWidth: 200,
      maxWidth: 300,
      sortable: true,
      filter: true 
    },
    { 
      headerName: "Mobile", 
      field: "mobile", 
      width: 130,
      minWidth: 120,
      maxWidth: 150,
      sortable: true,
      filter: true 
    },
    { 
      headerName: "Assignment", 
      field: "assignment_status", 
      width: 120,
      minWidth: 110,
      maxWidth: 140,
      cellRenderer: (params) => {
        const isAssigned = params.value === 'assigned';
        return (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            isAssigned 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
          }`}>
            {isAssigned ? <UserCheck size={12} /> : <UserX size={12} />}
            <span>{isAssigned ? 'Assigned' : 'Pending'}</span>
          </div>
        );
      }
    },
    { 
      headerName: "Status", 
      field: "status", 
      width: 110,
      minWidth: 100,
      maxWidth: 130,
      cellRenderer: (params) => {
        const status = params.value || 'pending';
        const statusConfig = {
          'open': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: AlertCircle },
          'in progress': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: Clock },
          'closed': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: CheckCircle },
          'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: UserX }
        };
        const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.text} ${config.border} border`}>
            <Icon size={12} />
            <span className="capitalize">{status}</span>
          </div>
        );
      }
    },
    { 
      headerName: "Assigned To", 
      field: "assigned_to_name", 
      flex: 1,
      minWidth: 150,
      maxWidth: 220,
      valueFormatter: (params) => params.value || '-'
    },
    { 
      headerName: "Created", 
      field: "created_at", 
      width: 180,
      minWidth: 160,
      maxWidth: 200,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleString() : '-'
    }
  ], []);

  const defaultColDef = useMemo(
    () => ({ 
      sortable: true, 
      filter: true, 
      resizable: true,
      tooltipComponent: 'default'
    }),
    []
  );

  const exportToCSV = () => {
    try {
      const headers = ['ID', 'Name', 'Email', 'Mobile', 'Address', 'Assignment Status', 'Status', 'Assigned To', 'Followup Date', 'Comment', 'Created At'];
      const csvData = filteredCustomers.map(c => [
        c.id,
        c.name || '',
        c.email || '',
        c.mobile || '',
        c.address || '',
        c.assignment_status || 'pending',
        c.status || 'pending',
        c.assigned_to || '',
        c.followup_datetime ? new Date(c.followup_datetime).toLocaleString() : '',
        c.comment || '',
        c.created_at ? new Date(c.created_at).toLocaleString() : ''
      ]);
      
      const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch_${batchId}_details_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-7xl mx-auto mt-10 outline-none"
      overlayClassName="fixed inset-0 bg-white/30 backdrop-blur-md flex justify-center items-start z-50"
      style={{
        content: {
          maxHeight: '90vh',
          overflow: 'auto'
        }
      }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              <Users size={28} className="text-blue-600" />
              Batch Details
            </h2>
            <p className="text-gray-600 mt-1">
              <span className="font-semibold">Batch ID:</span> {batchId} | 
              <span className="font-semibold ml-2">Source:</span> {sourceName}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <>
            {/* First Row - Main Stats */}
            <div className="grid grid-cols-5 gap-4 mt-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
                <p className="text-sm text-blue-700 font-medium">Total Records</p>
                <p className="text-2xl font-bold text-blue-800">{summary.total_records}</p>
                <p className="text-xs text-blue-600 mt-1">100% of batch</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
                <p className="text-sm text-green-700 font-medium">Assigned</p>
                <p className="text-2xl font-bold text-green-800">{summary.assigned_count}</p>
                <p className="text-xs text-green-600 mt-1">
                  {summary.total_records > 0 
                    ? ((summary.assigned_count / summary.total_records) * 100).toFixed(1) 
                    : 0}% of total
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200 shadow-sm">
                <p className="text-sm text-yellow-700 font-medium">Not Assigned</p>
                <p className="text-2xl font-bold text-yellow-800">{summary.pending_count}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  {summary.total_records > 0 
                    ? ((summary.pending_count / summary.total_records) * 100).toFixed(1) 
                    : 0}% of total
                </p>
              </div>
              
                {/*<div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
                <p className="text-sm text-purple-700 font-medium">Assigned + Open</p>
                <p className="text-2xl font-bold text-purple-800">{summary.assigned_open_count || 0}</p>
                <p className="text-xs text-purple-600 mt-1">
                  {summary.assigned_count > 0 
                    ? ((summary.assigned_open_count / summary.assigned_count) * 100).toFixed(1) 
                    : 0}% of assigned
                </p>
              </div>
             
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
                <p className="text-sm text-orange-700 font-medium">Not Assigned + Open</p>
                <p className="text-2xl font-bold text-orange-800">{summary.pending_open_count || 0}</p>
                <p className="text-xs text-orange-600 mt-1">
                  {summary.pending_count > 0 
                    ? ((summary.pending_open_count / summary.pending_count) * 100).toFixed(1) 
                    : 0}% of pending
                </p>
              </div> */}
            </div>

            {/* Second Row - Status Stats */}
            {/* <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 font-medium">Open</p>
                <p className="text-xl font-bold text-blue-800">{summary.open_count}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-700 font-medium">In Progress</p>
                <p className="text-xl font-bold text-purple-800">{summary.in_progress_count}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 font-medium">Closed</p>
                <p className="text-xl font-bold text-green-800">{summary.closed_count}</p>
              </div>
            </div> */}
          </>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, mobile, address..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={assignmentFilter}
            onChange={(e) => setAssignmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[150px]"
          >
            <option value="all">All Assignment</option>
            <option value="assigned">Assigned Only</option>
            <option value="pending">Not Assigned Only</option>
          </select>
          
          {/* <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[150px]"
          >
            <option value="all">All Status</option>
            <option value="open">Open Only</option>
            <option value="in_progress">In Progress Only</option>
            <option value="closed">Closed Only</option>
          </select> */}

          <button
            onClick={() => {
              setQuickFilterText("");
              setAssignmentFilter("all");
              setStatusFilter("all");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            title="Clear all filters"
          >
            <Filter size={18} />
            Clear
          </button>
        </div>
      </div>

      {/* Ag-Grid */}
      <div className="ag-theme-quartz mt-4" style={{ height: 450, width: "100%" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-3 text-gray-600 font-medium">Loading batch details...</p>
            </div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Users size={64} className="mb-4 text-gray-400" />
            <p className="text-lg font-medium">No customers found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <AgGridReact
            rowData={filteredCustomers}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={20}
            defaultColDef={defaultColDef}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            suppressMovableColumns={true}
          />
        )}
      </div>

      {/* Footer */}
      {filteredCustomers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{filteredCustomers.length}</span> records shown 
            {filteredCustomers.length < customers.length && (
              <span> (filtered from {customers.length} total)</span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download size={18} />
              Export to CSV
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BatchDetailsModal;