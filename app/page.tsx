'use client';

import React, { useState, useEffect } from 'react';
import ReportCardBuilder from '@/components/ReportCardBuilder';
import IPPBuilder from '@/components/IPPBuilder';
import TeacherVoiceSetup from '@/components/TeacherVoiceSetup';
import StudentProfiles from '@/components/StudentProfiles';
import ExportTools from '@/components/ExportTools';
import { StudentProfile } from '@/types';
import { loadStudents, saveStudents } from '@/lib/storage';
import { FileText, Users, Mic, Download, BookOpen } from 'lucide-react';

type Tab = 'report' | 'ipp' | 'voice' | 'students' | 'export';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('report');
  const [students, setStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    setStudents(loadStudents());
  }, []);

  const handleStudentsChange = (newStudents: StudentProfile[]) => {
    setStudents(newStudents);
    saveStudents(newStudents);
  };

  const tabs = [
    { id: 'report' as Tab, label: 'Report Cards', icon: FileText },
    { id: 'ipp' as Tab, label: 'IPP Comments', icon: BookOpen },
    { id: 'voice' as Tab, label: 'My Voice', icon: Mic },
    { id: 'students' as Tab, label: 'Students', icon: Users },
    { id: 'export' as Tab, label: 'Export/Import', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report Buddy</h1>
            <p className="mt-1 text-sm text-gray-600">
              Your AI drafting assistant for faster, personalized report card comments
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 overflow-x-auto">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mb-6">
          {activeTab === 'report' && <ReportCardBuilder students={students} />}
          {activeTab === 'ipp' && <IPPBuilder students={students} />}
          {activeTab === 'voice' && <TeacherVoiceSetup />}
          {activeTab === 'students' && (
            <StudentProfiles 
              students={students} 
              onStudentsChange={handleStudentsChange}
            />
          )}
          {activeTab === 'export' && <ExportTools />}
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <strong>Privacy:</strong> All student data is stored locally in your browser.
                Comments are generated using Claude AI, but we don't store any personal information.
              </p>
              <p>
                <strong>Drafting Assistant:</strong> This tool generates draft comments to save you time.
                Always review and customize the output to ensure accuracy and appropriateness.
              </p>
              <p>
                <strong>Professional Responsibility:</strong> You are responsible for all final
                report card content. Use this tool as a starting point, not a replacement for
                professional judgment.
              </p>
              <p>
                <strong>Alberta/CBE Customization:</strong> To align with Alberta curriculum or
                CBE-specific language, add relevant terminology to your "Teacher Quick Notes" or
                customize generated comments before use.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
