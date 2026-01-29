'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { StudentProfile, Pronoun } from '@/types';
import { generateId } from '@/lib/utils';

interface Props {
  students: StudentProfile[];
  onStudentsChange: (students: StudentProfile[]) => void;
}

export default function StudentProfiles({ students, onStudentsChange }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<StudentProfile, 'id'>>({
    name: '',
    pronouns: 'they/them',
    notes: '',
    interests: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      pronouns: 'they/them',
      notes: '',
      interests: '',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formData.name.trim()) return;

    const newStudent: StudentProfile = {
      id: generateId(),
      ...formData,
    };

    onStudentsChange([...students, newStudent]);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name.trim()) return;

    const updatedStudents = students.map(s =>
      s.id === editingId ? { ...s, ...formData } : s
    );

    onStudentsChange(updatedStudents);
    resetForm();
  };

  const handleEdit = (student: StudentProfile) => {
    setFormData({
      name: student.name,
      pronouns: student.pronouns,
      notes: student.notes,
      interests: student.interests,
    });
    setEditingId(student.id);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student profile?')) {
      onStudentsChange(students.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Student Profiles</h2>
            <p className="text-sm text-gray-600 mt-1">
              Optional: Create profiles to personalize comments (stored locally only)
            </p>
          </div>
          {!isAdding && !editingId && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          )}
        </div>

        {(isAdding || editingId) && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">
                {editingId ? 'Edit Student' : 'Add New Student'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Student name or 'Student A'"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="pronouns">Pronouns</Label>
                <Select
                  id="pronouns"
                  value={formData.pronouns}
                  onChange={e => setFormData({ ...formData, pronouns: e.target.value as Pronoun })}
                >
                  <option value="they/them">they/them</option>
                  <option value="he/him">he/him</option>
                  <option value="she/her">she/her</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Learning Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any learning needs, accommodations, or important context..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="interests">Interests (Optional)</Label>
                <Input
                  id="interests"
                  placeholder="e.g., dinosaurs, soccer, drawing..."
                  value={formData.interests}
                  onChange={e => setFormData({ ...formData, interests: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Can be used to make comments more engaging
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={editingId ? handleUpdate : handleAdd}
                  disabled={!formData.name.trim()}
                >
                  {editingId ? 'Update' : 'Add'} Student
                </Button>
                <Button
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {students.length === 0 && !isAdding && !editingId && (
          <div className="text-center py-8 text-gray-500">
            <p>No student profiles yet.</p>
            <p className="text-sm">Click "Add Student" to create your first profile.</p>
          </div>
        )}

        {students.length > 0 && (
          <div className="space-y-3">
            {students.map(student => (
              <div
                key={student.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{student.name}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {student.pronouns}
                    </span>
                  </div>
                  {student.notes && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Notes:</strong> {student.notes}
                    </p>
                  )}
                  {student.interests && (
                    <p className="text-sm text-gray-600">
                      <strong>Interests:</strong> {student.interests}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(student)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Privacy First</h3>
        <p className="text-sm text-blue-800">
          All student data is stored locally in your browser only. Nothing is sent to any server
          except the information you choose to include when generating comments. You can export
          and import your data using the Export Tools section.
        </p>
      </div>
    </div>
  );
}
