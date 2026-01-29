import { ReportCardInput, IPPInput, TeacherVoice, ToneAdjustment } from '@/types';

export function buildReportCardPrompt(input: ReportCardInput, teacherVoice?: TeacherVoice): string {
  const pronouns = input.studentProfile?.pronouns || 'they/them';
  const subject = pronouns.split('/')[0];
  const object = pronouns.split('/')[1] === 'them' ? 'them' : pronouns.split('/')[1] === 'him' ? 'him' : 'her';
  const possessive = pronouns.split('/')[1] === 'them' ? 'their' : pronouns.split('/')[1] === 'him' ? 'his' : 'her';

  let voiceGuidance = '';
  if (teacherVoice) {
    voiceGuidance = `
TEACHER VOICE PROFILE:
- Tone: ${teacherVoice.tone}
- Sentence length: ${teacherVoice.sentenceLength}
- Common phrases: ${teacherVoice.commonPhrases.join(', ')}
Match this teacher's natural writing style closely.`;
  }

  return `You are helping a Grade ${input.grade} teacher write a report card comment for ${input.subject}.

CONTEXT:
- Achievement level: ${input.achievementLevel}
- Effort: ${input.effort}
- Learning behaviors: ${input.behaviors.join(', ')}
- Teacher notes: ${input.teacherNotes}
${input.nextStepsFocus ? `- Next steps focus: ${input.nextStepsFocus}` : ''}
- Student pronouns: ${pronouns}
${input.studentProfile?.interests ? `- Student interests: ${input.studentProfile.interests}` : ''}
${voiceGuidance}

REQUIREMENTS:
- Write ONE paragraph (3-5 sentences) suitable for a Grade ${input.grade} report card
- Structure: 1 strength sentence, 1 progress/needs sentence, 1 actionable next step
- Sound human and natural, like a real teacher wrote it
- Be specific but professional
- Use ${subject}/${object}/${possessive} pronouns correctly
- NO em dashes (—)
- NO corporate or AI-sounding language
- Avoid "always" or "never"
- Age-appropriate language for Grade ${input.grade}
- Keep it constructive and forward-looking

Generate 3 versions (A, B, C) with slight variations to avoid repetition.

Format your response as:
VERSION A:
[comment text]

VERSION B:
[comment text]

VERSION C:
[comment text]`;
}

export function buildIPPPrompt(input: IPPInput): string {
  const pronouns = input.studentProfile?.pronouns || 'they/them';
  const subject = pronouns.split('/')[0];
  const object = pronouns.split('/')[1] === 'them' ? 'them' : pronouns.split('/')[1] === 'him' ? 'him' : 'her';
  const possessive = pronouns.split('/')[1] === 'them' ? 'their' : pronouns.split('/')[1] === 'him' ? 'his' : 'her';

  return `You are helping a teacher write an Individual Program Plan (IPP) comment.

CONTEXT:
- Area of need: ${input.areaOfNeed}
- Current supports: ${input.currentSupports.join(', ')}
- What's working: ${input.whatsWorking}
- What's challenging: ${input.whatsHard}
- Teacher goals: ${input.goals.join('; ')}
- Student pronouns: ${pronouns}

REQUIREMENTS FOR COMMENT:
- Write ONE professional paragraph (4-6 sentences) for an IPP document
- Describe current performance, supports in place, and progress
- Be factual, specific, and school-appropriate
- NO medical or diagnostic language
- NO absolute claims
- Use ${subject}/${object}/${possessive} pronouns
- Sound supportive but professional

REQUIREMENTS FOR GOALS:
- Suggest 3 measurable, achievable goals (SMART-style but teacher-friendly)
- Goals should be specific and observable
- Appropriate for school setting

REQUIREMENTS FOR ACCOMMODATIONS:
- Suggest 3 practical support strategies or accommodations
- School-appropriate and implementable by teachers/staff
- Evidence-based when possible

Format your response as:
COMMENT:
[IPP comment paragraph]

SUGGESTED GOALS:
1. [goal 1]
2. [goal 2]
3. [goal 3]

SUGGESTED ACCOMMODATIONS:
1. [accommodation 1]
2. [accommodation 2]
3. [accommodation 3]`;
}

export function buildToneAdjustmentPrompt(originalComment: string, adjustment: ToneAdjustment): string {
  const instructions: Record<ToneAdjustment, string> = {
    'shorter': 'Rewrite this comment to be more concise (2-3 sentences max) while keeping the key points.',
    'more-specific': 'Rewrite this comment with more specific examples and concrete details.',
    'softer': 'Rewrite this comment with a warmer, more encouraging tone while keeping the same content.',
    'more-direct': 'Rewrite this comment to be more direct and clear, reducing flowery language.',
    'add-encouragement': 'Add more encouraging and positive language while maintaining honesty about areas for growth.'
  };

  return `Original comment:
${originalComment}

Task: ${instructions[adjustment]}

REQUIREMENTS:
- Keep the same basic structure and information
- Sound human and natural
- NO em dashes (—)
- Maintain appropriate grade-level language

Provide the revised comment:`;
}

export function buildStyleExtractionPrompt(samples: string[]): string {
  return `Analyze these sample report card comments written by a teacher:

${samples.map((s, i) => `SAMPLE ${i + 1}:\n${s}`).join('\n\n')}

Identify this teacher's writing style:
1. Tone (warm/neutral/direct)
2. Sentence length preference (short/medium/long)
3. Vocabulary level (simple/moderate/advanced)
4. Common phrases or sentence starters they use
5. Any distinctive patterns

Format your response as:
TONE: [warm/neutral/direct]
SENTENCE_LENGTH: [short/medium/long]
VOCABULARY: [simple/moderate/advanced]
COMMON_PHRASES: [comma-separated list of 3-5 phrases]
PATTERN_NOTES: [brief description of any distinctive style elements]`;
}

export function buildRewritePrompt(originalComment: string, instruction: string): string {
  return `Original comment:
${originalComment}

Rewrite instruction: ${instruction}

Provide the revised comment. Keep it natural and teacher-appropriate. NO em dashes.`;
}
