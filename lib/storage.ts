import { StudentProfile, TeacherVoice } from '@/types';

const STORAGE_KEYS = {
  STUDENTS: 'reportbuddy_students',
  TEACHER_VOICE: 'reportbuddy_teacher_voice',
  USE_TEACHER_VOICE: 'reportbuddy_use_voice',
} as const;

// Student Profile Management
export function saveStudents(students: StudentProfile[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }
}

export function loadStudents(): StudentProfile[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return data ? JSON.parse(data) : [];
}

export function addStudent(student: StudentProfile): void {
  const students = loadStudents();
  students.push(student);
  saveStudents(students);
}

export function updateStudent(id: string, updates: Partial<StudentProfile>): void {
  const students = loadStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updates };
    saveStudents(students);
  }
}

export function deleteStudent(id: string): void {
  const students = loadStudents();
  saveStudents(students.filter(s => s.id !== id));
}

// Teacher Voice Management
export function saveTeacherVoice(voice: TeacherVoice): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TEACHER_VOICE, JSON.stringify(voice));
  }
}

export function loadTeacherVoice(): TeacherVoice | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.TEACHER_VOICE);
  return data ? JSON.parse(data) : null;
}

export function saveUseTeacherVoice(useVoice: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USE_TEACHER_VOICE, JSON.stringify(useVoice));
  }
}

export function loadUseTeacherVoice(): boolean {
  if (typeof window === 'undefined') return false;
  const data = localStorage.getItem(STORAGE_KEYS.USE_TEACHER_VOICE);
  return data ? JSON.parse(data) : false;
}

// Export/Import
export function exportData(): string {
  return JSON.stringify({
    students: loadStudents(),
    teacherVoice: loadTeacherVoice(),
    useTeacherVoice: loadUseTeacherVoice(),
    exportDate: new Date().toISOString(),
  }, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.students) saveStudents(data.students);
    if (data.teacherVoice) saveTeacherVoice(data.teacherVoice);
    if (typeof data.useTeacherVoice === 'boolean') saveUseTeacherVoice(data.useTeacherVoice);
    return true;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
}

export function clearAllData(): void {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
}
