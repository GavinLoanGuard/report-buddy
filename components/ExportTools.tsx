'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Download, Upload, FileText } from 'lucide-react';
import { exportData, importData, clearAllData } from '@/lib/storage';
import { downloadFile } from '@/lib/utils';
import Papa from 'papaparse';
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';

export default function ExportTools() {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJSON = () => {
    const data = exportData();
    downloadFile(data, 'report-buddy-data.json', 'application/json');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importData(content);
        
        if (success) {
          setImportStatus('Import successful! Please refresh the page.');
        } else {
          setImportStatus('Import failed. Please check the file format.');
        }
      } catch (error) {
        setImportStatus('Import failed. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllData();
      setImportStatus('All data cleared. Please refresh the page.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Export & Import Tools</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Export Your Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download all your student profiles and teacher voice settings as a backup.
            </p>
            <Button onClick={handleExportJSON} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export as JSON
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Import Your Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Restore previously exported data. This will overwrite current data.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <Button variant="outline" as="span">
                  <Upload className="mr-2 h-4 w-4" />
                  Import from JSON
                </Button>
              </label>
            </div>
            {importStatus && (
              <div className={`mt-2 p-2 rounded text-sm ${
                importStatus.includes('successful') 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {importStatus}
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Clear All Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Remove all student profiles and settings from your browser.
            </p>
            <Button 
              onClick={handleClearData} 
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Export Generated Comments</h2>
        
        <p className="text-sm text-gray-600 mb-4">
          To export generated comments to CSV or DOCX, copy the comments you want to save,
          then paste them into a spreadsheet or word processor. Future versions will include
          batch export functionality.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-medium text-yellow-900 mb-2">Coming Soon</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Batch comment generation mode</li>
            <li>• Direct CSV export with student names</li>
            <li>• DOCX export with formatting</li>
            <li>• Class roster management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
