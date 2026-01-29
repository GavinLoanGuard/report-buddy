export type Grade = 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type Subject = 'ELA' | 'Math' | 'Science' | 'Social' | 'Health/Wellness' | 'Learning Skills';

export type AchievementLevel = 'Below' | 'Approaching' | 'Meeting' | 'Exceeding';

export type Effort = 'Low' | 'Medium' | 'High';

export type LearningBehavior = 'participation' | 'organization' | 'independence' | 'focus' | 'collaboration';

export type IPPArea = 'Reading' | 'Writing' | 'Math' | 'Behavior/Self-regulation' | 'Attention' | 'Speech/Language' | 'Social';

export type Pronoun = 'they/them' | 'he/him' | 'she/her';

export interface StudentProfile {
  id: string;
  name: string;
  pronouns: Pronoun;
  notes: string;
  interests: string;
}

export interface ReportCardInput {
  grade: Grade;
  subject: Subject;
  achievementLevel: AchievementLevel;
  effort: Effort;
  behaviors: LearningBehavior[];
  teacherNotes: string;
  nextStepsFocus?: string;
  studentProfile?: StudentProfile;
}

export interface IPPInput {
  areaOfNeed: IPPArea;
  currentSupports: string[];
  whatsWorking: string;
  whatsHard: string;
  goals: string[];
  studentProfile?: StudentProfile;
}

export interface TeacherVoice {
  samples: string[];
  tone: 'warm' | 'neutral' | 'direct';
  sentenceLength: 'short' | 'medium' | 'long';
  vocabularyLevel: 'simple' | 'moderate' | 'advanced';
  commonPhrases: string[];
}

export interface GeneratedComment {
  text: string;
  alternateA: string;
  alternateB: string;
}

export interface IPPOutput {
  comment: string;
  suggestedGoals: string[];
  suggestedAccommodations: string[];
}

export type ToneAdjustment = 'shorter' | 'more-specific' | 'softer' | 'more-direct' | 'add-encouragement';
