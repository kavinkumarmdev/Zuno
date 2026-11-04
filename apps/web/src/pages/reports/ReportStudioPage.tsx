import React, { useState } from 'react';
import {
  BarChart3,
  Filter,
  Download,
  Calendar,
  Layers,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronDown
} from 'lucide-react';
import { DataGrid } from '../../components/ui/DataGrid';

export const ReportStudioPage: React.FC = () => {
  const [reportType, setReportType] = useState('sales_summary');
  const [dateRange, setDateRange] = useState('current_quarter');

  const reportPresets = [
    { id: 'sales_summary', name: 'General Sales & Tax Ledger', module: 'Sales' },
    { id: 'purchase_register', name: 'Procurement & GST ITC Register', module: 'Purchase' },
    { id: 'inventory_valuation', name: 'Stock Movement & Valuation', module: 'Inventory' },
    { id: 'payroll_summary', name: 'Monthly PF & ESI Statutory Wages', module: 'Payroll' },
    { id: 'trial_balance', name: 'Double-Entry Trial Balance', module: 'Accounting' }
  ];

  const sampleReportData = [
    { id: '1', date: '2026-11-01', doc_no: 'INV-2026-1001', entity: 'Zenith Logistics Ltd', gross: '145,000.00', tax: '26,100.00', net: '171,100.00', status: 'ACTIVE' },
    { id: '2', date: '2026-11-02', doc_no: 'INV-2026-1002', entity: 'Apex Precision Metals', gross: '89,500.00', tax: '16,110.00', net: '105,610.00', status: 'ACTIVE' },
    { id: '3', date: '2026-11-03', doc_no: 'INV-2026-1003', entity: 'Omega Global Sourcing', gross: '210,000.00', tax: '37,800.00', net: '247,800.00', status: 'ACTIVE' },
    { id: '4', date: '2026-11-04', doc_no: 'INV-2026-1004', entity: 'Vanguard Industrial Corp', gross: '64,200.00', tax: '11,556.00', net: '75,756.00', status: 'ACTIVE' },
  ];

  const columns = [
    { key: 'date', header: 'Document Date', sortable: true },
    { key: 'doc_no', header: 'Voucher / Doc #', sortable: true },
    { key: 'entity', header: 'Customer / Counterparty', sortable: true },
    { key: 'gross', header: 'Taxable Value (INR)', sortable: true, align: 'right' as const },
    { key: 'tax', header: 'GST / Tax (INR)', sortable: true, align: 'right' as const },
    { key: 'net', header: 'Total Settled (INR)', sortable: true, align: 'right' as const },
    { key: 'status', header: 'Status', align: 'center' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Executive Report Studio & MIS</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic column filtering, statutory compliance ledger generation, and multi-format export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors">
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Report Selection & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-4 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Preset Report</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
          >
            {reportPresets.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.module})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-500 mb-1">Accounting Period</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="current_month">Current Month (November 2026)</option>
            <option value="current_quarter">Q3 FY 2026-27</option>
            <option value="ytd">Full Financial Year (FY 2026-27)</option>
            <option value="custom">Custom Date Range...</option>
          </select>
        </div>
      </div>

      {/* Data Grid */}
      <DataGrid
        title={reportPresets.find((r) => r.id === reportType)?.name || 'Custom Report'}
        subtitle="Server-generated statutory audit summary with double-entry balance validation"
        columns={columns}
        data={sampleReportData}
        total={sampleReportData.length}
        page={1}
        limit={20}
        onPageChange={() => {}}
        onLimitChange={() => {}}
      />
    </div>
  );
};

