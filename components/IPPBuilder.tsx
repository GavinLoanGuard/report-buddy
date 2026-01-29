'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';
import { Copy, RefreshCw, Loader2 } from 'lucide-react';
import { IPPInput, StudentProfile, IPPArea } from '@/types';
import { buildIPPPrompt } from '@/lib/prompts';
import { parseIPPOutput, copyToClipboard } from '@/lib/utils';

interface Props {
  students: StudentProfile[];
}

export default function IPPBuilder({ students }: Props) {
  const [input, setInput] = useState<IPPInput>({
    areaOfNeed: 'Reading',
    currentSupports: [],
    whatsWorking: '',
    whatsHard: '',
    goals: [''],
  });

  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [generated, setGenerated] = useState<{
    comment: string;
    goals: string[];
    accommodations: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const supportOptions = [
    'Small group instruction',
    'Extra time',
    'Visual supports',
    'Frequent breaks',
    'Preferential seating',
    'Scribe/note-taker',
    'Technology aids',
    'Modified assignments',
    'One-on-one support',
  ];

  const handleSupportToggle = (support: string) => {
    setInput(prev => ({
      ...prev,
      currentSupports: prev.currentSupports.includes(support)
        ? prev.currentSupports.filter(s => s !== support)
        : [...prev.currentSupports, support],
    }));
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...input.goals];
    newGoals[index] = value;
    setInput({ ...input, goals: newGoals });
  };

  const addGoal = () => {
    if (input.goals.length < 3) {
      setInput({ ...input, goals: [...input.goals, ''] });
    }
  };

  const removeGoal = (index: number) => {
    setInput({ ...input, goals: input.goals.filter((_, i) => i !== index) });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGenerated(null);

    try {
      const studentProfile = selectedStudent 
        ? students.find(s => s.id === selectedStudent)
        : undefined;

      const prompt = buildIPPPrompt({ ...input, studentProfile });

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
      const parsed = parseIPPOutput(data.text);

      setGenerated(parsed);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">IPP Comment Builder</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="area">Area of Need</Label>
            <Select
              id="area"
              value={input.areaOfNeed}
              onChange={e => setInput({ ...input, areaOfNeed: e.target.value as IPPArea })}
            >
              <option value="Reading">Reading</option>
              <option value="Writing">Writing</option>
              <option value="Math">Math</option>
              <option value="Behavior/Self-regulation">Behavior/Self-regulation</option>
              <option value="Attention">Attention</option>
              <option value="Speech/Language">Speech/Language</option>
              <option value="Social">Social Skills</option>
            </Select>
          </div>

          {students.length > 0 && (
            <div>
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

          <div>
            <Label>Current Supports in Place</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {supportOptions.map(support => (
                <button
                  key={support}
                  onClick={() => handleSupportToggle(support)}
                  className={`px-3 py-2 rounded text-sm transition-colors text-left ${
                    input.currentSupports.includes(support)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {support}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="working">What's Working</Label>
            <Textarea
              id="working"
              placeholder="Describe what strategies or supports are currently effective..."
              value={input.whatsWorking}
              onChange={e => setInput({ ...input, whatsWorking: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hard">What's Challenging</Label>
            <Textarea
              id="hard"
              placeholder="Describe areas where the student continues to struggle..."
              value={input.whatsHard}
              onChange={e => setInput({ ...input, whatsHard: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label>Current Goals (1-3)</Label>
            {input.goals.map((goal, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Textarea
                  placeholder={`Goal ${index + 1}...`}
                  value={goal}
                  onChange={e => handleGoalChange(index, e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                {input.goals.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeGoal(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            {input.goals.length < 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={addGoal}
                className="mt-2"
              >
                Add Goal
              </Button>
            )}
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading || !input.whatsWorking || !input.whatsHard}
          className="w-full mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate IPP Content
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
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">IPP Comment</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(generated.comment, 'comment')}
              >
                {copied === 'comment' ? (
                  'Copied!'
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-gray-900 whitespace-pre-wrap">{generated.comment}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">Suggested Goals</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(generated.goals.map((g, i) => `${i + 1}. ${g}`).join('\n'), 'goals')}
              >
                {copied === 'goals' ? (
                  'Copied!'
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-gray-900">
              {generated.goals.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ol>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">Suggested Accommodations</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(generated.accommodations.map((a, i) => `${i + 1}. ${a}`).join('\n'), 'accommodations')}
              >
                {copied === 'accommodations' ? (
                  'Copied!'
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-gray-900">
              {generated.accommodations.map((acc, i) => (
                <li key={i}>{acc}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
