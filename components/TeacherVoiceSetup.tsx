'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Check, Loader2, RefreshCw } from 'lucide-react';
import { TeacherVoice } from '@/types';
import { buildStyleExtractionPrompt } from '@/lib/prompts';
import { parseStyleProfile } from '@/lib/utils';
import { 
  saveTeacherVoice, 
  loadTeacherVoice, 
  saveUseTeacherVoice, 
  loadUseTeacherVoice 
} from '@/lib/storage';

export default function TeacherVoiceSetup() {
  const [samples, setSamples] = useState<string[]>(['', '', '']);
  const [voice, setVoice] = useState<TeacherVoice | null>(null);
  const [useVoice, setUseVoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedVoice = loadTeacherVoice();
    const savedUseVoice = loadUseTeacherVoice();
    if (savedVoice) {
      setVoice(savedVoice);
      setSamples(savedVoice.samples);
    }
    setUseVoice(savedUseVoice);
  }, []);

  const handleSampleChange = (index: number, value: string) => {
    const newSamples = [...samples];
    newSamples[index] = value;
    setSamples(newSamples);
  };

  const addSample = () => {
    if (samples.length < 8) {
      setSamples([...samples, '']);
    }
  };

  const removeSample = (index: number) => {
    if (samples.length > 3) {
      setSamples(samples.filter((_, i) => i !== index));
    }
  };

  const handleAnalyze = async () => {
    const filledSamples = samples.filter(s => s.trim());
    
    if (filledSamples.length < 3) {
      setError('Please provide at least 3 sample comments');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = buildStyleExtractionPrompt(filledSamples);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      const profile = parseStyleProfile(data.text);

      const newVoice: TeacherVoice = {
        samples: filledSamples,
        tone: profile.tone,
        sentenceLength: profile.sentenceLength,
        vocabularyLevel: profile.vocabulary,
        commonPhrases: profile.commonPhrases,
      };

      setVoice(newVoice);
      saveTeacherVoice(newVoice);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoice = () => {
    const newValue = !useVoice;
    setUseVoice(newValue);
    saveUseTeacherVoice(newValue);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">"Write Like Me" Voice Setup</h2>
        <p className="text-gray-600 text-sm mb-4">
          Paste 3-8 sample comments you've written to train the AI to match your writing style.
        </p>

        <div className="space-y-4">
          {samples.map((sample, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor={`sample-${index}`}>
                  Sample {index + 1} {index < 3 && <span className="text-red-500">*</span>}
                </Label>
                {samples.length > 3 && index >= 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSample(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Textarea
                id={`sample-${index}`}
                placeholder="Paste a complete comment you've written..."
                value={sample}
                onChange={e => handleSampleChange(index, e.target.value)}
                rows={3}
              />
            </div>
          ))}

          {samples.length < 8 && (
            <Button
              variant="outline"
              onClick={addSample}
            >
              Add Another Sample
            </Button>
          )}
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={loading || samples.filter(s => s.trim()).length < 3}
          className="w-full mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Your Style...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Analyze My Writing Style
            </>
          )}
        </Button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {voice && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Your Writing Style Profile</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Tone:</span>
              <span className="font-medium capitalize">{voice.tone}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Sentence Length:</span>
              <span className="font-medium capitalize">{voice.sentenceLength}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Vocabulary Level:</span>
              <span className="font-medium capitalize">{voice.vocabularyLevel}</span>
            </div>
            <div className="py-2">
              <span className="text-gray-600 block mb-2">Common Phrases:</span>
              <div className="flex flex-wrap gap-2">
                {voice.commonPhrases.map((phrase, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div>
              <h4 className="font-medium">Use My Voice</h4>
              <p className="text-sm text-gray-600">
                Apply your writing style to all generated comments
              </p>
            </div>
            <button
              onClick={handleToggleVoice}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useVoice ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useVoice ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
