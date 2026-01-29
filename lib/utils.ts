import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseGeneratedVersions(response: string): { versionA: string; versionB: string; versionC: string } {
  const lines = response.split('\n');
  let versionA = '';
  let versionB = '';
  let versionC = '';
  let currentVersion = '';

  for (const line of lines) {
    if (line.includes('VERSION A:')) {
      currentVersion = 'A';
    } else if (line.includes('VERSION B:')) {
      currentVersion = 'B';
    } else if (line.includes('VERSION C:')) {
      currentVersion = 'C';
    } else if (line.trim() && currentVersion) {
      if (currentVersion === 'A') versionA += line + '\n';
      else if (currentVersion === 'B') versionB += line + '\n';
      else if (currentVersion === 'C') versionC += line + '\n';
    }
  }

  return {
    versionA: versionA.trim(),
    versionB: versionB.trim(),
    versionC: versionC.trim(),
  };
}

export function parseIPPOutput(response: string): {
  comment: string;
  goals: string[];
  accommodations: string[];
} {
  const sections = {
    comment: '',
    goals: [] as string[],
    accommodations: [] as string[],
  };

  const lines = response.split('\n');
  let currentSection = '';

  for (const line of lines) {
    if (line.includes('COMMENT:')) {
      currentSection = 'comment';
    } else if (line.includes('SUGGESTED GOALS:')) {
      currentSection = 'goals';
    } else if (line.includes('SUGGESTED ACCOMMODATIONS:')) {
      currentSection = 'accommodations';
    } else if (line.trim()) {
      if (currentSection === 'comment') {
        sections.comment += line + '\n';
      } else if (currentSection === 'goals' && /^\d+\./.test(line.trim())) {
        sections.goals.push(line.replace(/^\d+\.\s*/, '').trim());
      } else if (currentSection === 'accommodations' && /^\d+\./.test(line.trim())) {
        sections.accommodations.push(line.replace(/^\d+\.\s*/, '').trim());
      }
    }
  }

  return {
    comment: sections.comment.trim(),
    goals: sections.goals,
    accommodations: sections.accommodations,
  };
}

export function parseStyleProfile(response: string): {
  tone: 'warm' | 'neutral' | 'direct';
  sentenceLength: 'short' | 'medium' | 'long';
  vocabulary: 'simple' | 'moderate' | 'advanced';
  commonPhrases: string[];
} {
  const lines = response.split('\n');
  const profile = {
    tone: 'neutral' as 'warm' | 'neutral' | 'direct',
    sentenceLength: 'medium' as 'short' | 'medium' | 'long',
    vocabulary: 'moderate' as 'simple' | 'moderate' | 'advanced',
    commonPhrases: [] as string[],
  };

  for (const line of lines) {
    if (line.includes('TONE:')) {
      const tone = line.split(':')[1]?.trim().toLowerCase();
      if (tone === 'warm' || tone === 'neutral' || tone === 'direct') {
        profile.tone = tone;
      }
    } else if (line.includes('SENTENCE_LENGTH:')) {
      const length = line.split(':')[1]?.trim().toLowerCase();
      if (length === 'short' || length === 'medium' || length === 'long') {
        profile.sentenceLength = length;
      }
    } else if (line.includes('VOCABULARY:')) {
      const vocab = line.split(':')[1]?.trim().toLowerCase();
      if (vocab === 'simple' || vocab === 'moderate' || vocab === 'advanced') {
        profile.vocabulary = vocab;
      }
    } else if (line.includes('COMMON_PHRASES:')) {
      const phrases = line.split(':')[1]?.trim();
      if (phrases) {
        profile.commonPhrases = phrases.split(',').map(p => p.trim()).filter(Boolean);
      }
    }
  }

  return profile;
}
