'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';
import { Copy, RefreshCw, Loader2 } from 'lucide-react';
import { 
  ReportCardInput, 
  StudentProfile, 
  LearningBehavior, 
  ToneAdjustment 
} from '@/types';
import { 
  buildReportCardPrompt, 
  buildToneAdjustmentPrompt 
} from '@/lib/prompts';
import { parseGeneratedVersions, copyToClipboard } from '@/lib/utils';
import { loadUseTeacherVoice, loadTeacherVoice } from '@/lib/storage';

interface Props {
  students: StudentProfile[];
}

export default function ReportCardBuilder({ students }: Props) {
  const [input, setInput] = useState<ReportCardInput>({
    grade: '3',
    subject: 'ELA',
    achievementLevel: 'Meeting',
    effort: 'Medium',
    behaviors: [],
    teacherNotes: '',
    nextStepsFocus: '',
  });

  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [generated, setGenerated] = useState<{
    main: string;
    altA: string;
    altB: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const behaviors: { value: LearningBehavior; label: string }[] = [
    { value: 'participation', label: 'Participation' },
    { value: 'organization', label: 'Organization' },
    { value: 'independence', label: 'Independence' },
    { value: 'focus', label: 'Focus' },
    { value: 'collaboration', label: 'Collaboration' },
  ];

  const handleBehaviorToggle = (behavior: LearningBehavior) => {
    setInput(prev => ({
      ...prev,
      behaviors: prev.behaviors.includes(behavior)
        ? prev.behaviors.filter(b => b !== behavior)
        : [...prev.behaviors, behavior],
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGenerated(null);

    try {
      const studentProfile = selectedStudent 
        ? students.find(s => s.id === selectedStudent)
        : undefined;

      const useVoice = loadUseTeacherVoice();
      const teacherVoice = useVoice ? loadTeacherVoice() : null;

      const prompt = buildReportCardPrompt(
        { ...input, studentProfile },
        teacherVoice || undefined
      );

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      const versions = parseGeneratedVersions(data.text);

      setGenerated({
        main: versions.versionA,
        altA: versions.versionB,
        altB: versions.versionC,
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleToneAdjust = async (adjustment: ToneAdjustment) => {
    if (!generated) return;

    setLoading(true);
    setError(null);

    try {
      const prompt = buildToneAdjustmentPrompt(generated.main, adjustment);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, useCache: false }),
      });

      if (!response.ok) throw new Error('Adjustment failed');

      const data = await response.json();
      setGenerated(prev => prev ? { ...prev, main: data.text } : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    await copyToClipboard(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Report Card Comment Builder</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="grade">Grade</Label>
            <Select
              id="grade"
              value={input.grade}
              onChange={e => setInput({ ...input, grade: e.target.value as any })}
            >
              {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(g => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select
              id="subject"
              value={input.subject}
              onChange={e => setInput({ ...input, subject: e.target.value as any })}
            >
              <option value="ELA">ELA</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Social">Social Studies</option>
              <option value="Health/Wellness">Health/Wellness</option>
              <option value="Learning Skills">Learning Skills</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="achievement">Achievement Level</Label>
            <Select
              id="achievement"
              value={input.achievementLevel}
              onChange={e => setInput({ ...input, achievementLevel: e.target.value as any })}
            >
              <option value="Below">Below Expectations</option>
              <option value="Approaching">Approaching Expectations</option>
              <option value="Meeting">Meeting Expectations</option>
              <option value="Exceeding">Exceeding Expectations</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="effort">Effort</Label>
            <Select
              id="effort"
              value={input.effort}
              onChange={e => setInput({ ...input, effort: e.target.value as any })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </div>
        </div>

        {students.length > 0 && (
          <div className="mb-4">
            <Label htmlFor="student">Student (Optional)</Label>
            <Select
              id="student"
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
            >
              <option value="">No student selected</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
          </div>
        )}

        <div className="mb-4">
          <Label>Learning Behaviors</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {behaviors.map(b => (
              <button
                key={b.value}
                onClick={() => handleBehaviorToggle(b.value)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  input.behaviors.includes(b.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="notes">Teacher Quick Notes</Label>
          <Textarea
            id="notes"
            placeholder="e.g., Strong in comprehension, struggles with writing conventions..."
            value={input.teacherNotes}
            onChange={e => setInput({ ...input, teacherNotes: e.target.value })}
            rows={3}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="nextsteps">Next Steps Focus (Optional)</Label>
          <Input
            id="nextsteps"
            placeholder="e.g., practice multiplication facts, improve paragraph structure..."
            value={input.nextStepsFocus}
            onChange={e => setInput({ ...input, nextStepsFocus: e.target.value })}
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading || !input.teacherNotes}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Comment
            </>
          )}
        </Button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {generated && (
        <div className="space-y-4">
          {[
            { label: 'Version A (Primary)', text: generated.main, index: 0 },
            { label: 'Version B', text: generated.altA, index: 1 },
            { label: 'Version C', text: generated.altB, index: 2 },
          ].map(({ label, text, index }) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">{label}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(text, index)}
                >
                  {copiedIndex === index ? (
                    'Copied!'
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-gray-900 whitespace-pre-wrap">{text}</p>
            </div>
          ))}

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium mb-3">Adjust Tone</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToneAdjust('shorter')}
                disabled={loading}
              >
                Shorter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToneAdjust('more-specific')}
                disabled={loading}
              >
                More Specific
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToneAdjust('softer')}
                disabled={loading}
              >
                Softer Tone
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToneAdjust('more-direct')}
                disabled={loading}
              >
                More Direct
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToneAdjust('add-encouragement')}
                disabled={loading}
              >
                Add Encouragement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
