# Report Buddy

A fast, privacy-first AI drafting assistant that helps teachers write personalized report card comments and IPP (Individual Program Plan) documentation in under 30 seconds per comment.

## Features

### 🎯 Core Features
- **Report Card Comment Builder** - Generate 3 unique versions of each comment to avoid repetition
- **IPP Comment Builder** - Create professional IPP paragraphs with suggested goals and accommodations
- **"Write Like Me" Voice Mode** - Train the AI on your writing style (3-8 sample comments)
- **Student Profiles** - Optional lightweight profiles for personalization (pronouns, interests, notes)
- **Export/Import Tools** - Backup and restore your data (all stored locally)

### ✨ Key Benefits
- Human-sounding output (no "AI voice" or corporate fluff)
- Fast generation (under 30 seconds)
- Easy customization per student
- Privacy-first (local storage only)
- Tone adjustment buttons (Shorter, More Specific, Softer, More Direct, Add Encouragement)

## Quick Start

### Windows Setup Instructions

1. **Install Node.js**
   - Download from https://nodejs.org/ (LTS version recommended)
   - Run the installer and follow prompts
   - Verify installation: Open Command Prompt and run:
     ```
     node --version
     npm --version
     ```

2. **Get Claude API Key**
   - Go to https://console.anthropic.com/
   - Sign up or log in
   - Navigate to API Keys
   - Create a new API key and copy it

3. **Download and Extract**
   - Extract the `report-buddy` folder to your desired location (e.g., `C:\Projects\report-buddy`)

4. **Configure Environment**
   - In the `report-buddy` folder, create a file named `.env`
   - Add your API key:
     ```
     ANTHROPIC_API_KEY=your_api_key_here
     ```
   - Save the file

5. **Install Dependencies**
   - Open Command Prompt
   - Navigate to your project folder:
     ```
     cd C:\Projects\report-buddy
     ```
   - Install dependencies:
     ```
     npm install
     ```

6. **Start the App**
   - In the same Command Prompt window:
     ```
     npm run dev
     ```
   - Wait for "Ready" message
   - Open your browser to: http://localhost:3000

7. **Stop the App**
   - Press `Ctrl+C` in the Command Prompt when done

## Usage Guide

### 1. Report Card Comments

**Inputs Required:**
- Grade level (K-9)
- Subject (ELA, Math, Science, Social, Health/Wellness, Learning Skills)
- Achievement level (Below/Approaching/Meeting/Exceeding)
- Effort level (Low/Medium/High)
- Learning behaviors (checkboxes: participation, organization, independence, focus, collaboration)
- Teacher quick notes (free text - your specific observations)

**Optional:**
- Student profile (for pronoun/interest personalization)
- Next steps focus (specific area to emphasize)

**Output:**
- 3 versions (A, B, C) of the comment
- Each with: strengths sentence + progress sentence + next steps sentence
- One-click copy buttons
- Tone adjustment options

**Example Flow:**
1. Select Grade 3, Subject: ELA
2. Choose "Meeting Expectations" and "High" effort
3. Check "participation" and "focus" behaviors
4. Add notes: "Strong comprehension, struggles with spelling"
5. Click "Generate Comment"
6. Review 3 versions, copy your preferred one
7. Optionally adjust tone with "Softer" or "Add Encouragement"

### 2. IPP Comments

**Inputs Required:**
- Area of need (Reading, Writing, Math, Behavior, etc.)
- Current supports (checkboxes)
- What's working (free text)
- What's challenging (free text)
- Current goals (1-3 bullet points)

**Output:**
- Professional IPP paragraph
- 3 suggested SMART-style goals
- 3 suggested accommodations/strategies
- Copy buttons for each section

### 3. Teacher Voice Setup

**How It Works:**
1. Paste 3-8 sample comments you've previously written
2. Click "Analyze My Writing Style"
3. Review your style profile (tone, sentence length, vocabulary, common phrases)
4. Toggle "Use My Voice" on/off

**Benefits:**
- Comments match your natural writing style
- Consistent voice across all generated content
- Reduces editing time

### 4. Student Profiles

**What to Include:**
- Name (or "Student A" for anonymity)
- Pronouns (they/them, he/him, she/her)
- Learning notes (accommodations, needs, context)
- Interests (optional - for engagement)

**Privacy:**
- All data stored locally in browser
- Nothing sent to servers except during comment generation
- Export/import for backup

### 5. Export & Import

**Export Options:**
- JSON backup of all profiles and settings
- Use for backup or transferring between devices

**Import:**
- Restore previously exported data
- Overwrites current data (backup first!)

**Clear Data:**
- Remove all student profiles and settings
- Cannot be undone

## Alberta/CBE Customization

To align generated comments with Alberta curriculum or Calgary Board of Education (CBE) language:

### Method 1: In Teacher Notes
Include curriculum-specific terminology in your "Teacher Quick Notes" field:
- "...demonstrating curricular competencies..."
- "...working towards grade-level outcomes..."
- "...applying knowledge and understanding..."

### Method 2: Teacher Voice Training
Include CBE-style comments in your teacher voice samples so the AI learns your district's preferred phrasing.

### Method 3: Post-Generation Editing
Common Alberta/CBE terminology to add:
- "curricular competencies"
- "learning outcomes"
- "program of studies"
- "First Nations, Métis, and Inuit perspectives"
- "inquiry-based learning"

### Example CBE-Aligned Output:
Before: "Sarah is developing her math skills."
After: "Sarah is progressing toward grade-level outcomes in numeracy and is demonstrating increasing confidence with curricular competencies."

## Technical Details

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Claude Sonnet 4 (Anthropic API)
- **Storage:** Browser localStorage

### File Structure
```
report-buddy/
├── app/
│   ├── api/generate/route.ts    # Claude API integration
│   ├── page.tsx                  # Main application page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── ReportCardBuilder.tsx
│   ├── IPPBuilder.tsx
│   ├── TeacherVoiceSetup.tsx
│   ├── StudentProfiles.tsx
│   ├── ExportTools.tsx
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── prompts.ts                # LLM prompt templates
│   ├── storage.ts                # localStorage helpers
│   └── utils.ts                  # Utility functions
├── types/
│   └── index.ts                  # TypeScript types
└── public/                       # Static assets
```

### API Rate Limiting
- 20 requests per minute per IP
- 5-minute cache for identical prompts
- Automatic retry handling

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variable:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add: `ANTHROPIC_API_KEY` with your API key
   - Redeploy

### Other Platforms
- **Netlify:** Connect GitHub repo, add env var in dashboard
- **Railway:** Import from GitHub, configure env var
- **Custom Server:** `npm run build` then `npm start`

## Sample Prompts & Outputs

### Example 1: Grade 3 ELA - Meeting Expectations

**Input:**
- Grade: 3
- Subject: ELA
- Achievement: Meeting Expectations
- Effort: High
- Behaviors: participation, focus
- Notes: "Strong reading comprehension, working on writing conventions"

**Generated Output (Version A):**
"[Student name] demonstrates strong reading comprehension skills and actively participates in class discussions. They are making steady progress with writing conventions, particularly punctuation and capitalization. To continue building confidence, [student] will benefit from practicing sentence editing in daily journals and during guided writing time."

### Example 2: IPP - Reading Support

**Input:**
- Area: Reading
- Supports: Small group instruction, Visual supports, Extra time
- Working: "Responds well to phonics games, recognizes sight words"
- Hard: "Blending sounds into words, reading fluency"
- Goals: "Decode CVC words, read grade-level sentences"

**Generated Output:**

**Comment:**
"[Student name] is making progress in reading development with support from small group instruction and visual aids. They demonstrate success with phonics games and sight word recognition. Decoding continues to be challenging, particularly when blending sounds to form words. With continued practice using multi-sensory phonics activities and decodable texts at their level, [student] is working toward building fluency in reading CVC words and simple sentences."

**Suggested Goals:**
1. Decode 20 CVC words per minute with 80% accuracy by [date]
2. Read 10 high-frequency words automatically on sight by [date]
3. Read grade-appropriate decodable texts with improving accuracy and expression

**Suggested Accommodations:**
1. Provide extra processing time for reading tasks
2. Use color-coded phonics materials and sound-symbol charts
3. Break reading tasks into smaller segments with frequent breaks

## Important Notes

### This is a Drafting Assistant
- **Always review and customize generated content**
- You are responsible for all final report card content
- Use professional judgment to ensure accuracy
- Verify comments align with your observations

### Privacy & Data
- Student data never leaves your browser (except info in prompts during generation)
- No permanent storage on external servers
- Export data regularly for backup
- Clear data when sharing devices

### Professional Use
- Not diagnostic - avoid medical/clinical language
- School-appropriate content only
- Constructive and forward-looking
- Age-appropriate for grade level

### Limitations
- Requires internet connection for comment generation
- API costs apply (approximately $0.01-0.03 per comment)
- Cannot integrate with SIS (PowerSchool, etc.) in v1
- English language only

## Troubleshooting

### "API Error" or "Generation Failed"
- Check your internet connection
- Verify API key is correct in `.env` file
- Ensure you have API credits in your Anthropic account
- Try again (may be temporary rate limiting)

### Comments Don't Match My Style
- Use "Write Like Me" feature with more samples
- Toggle "Use My Voice" on
- Provide more detailed teacher notes
- Use tone adjustment buttons

### Student Profiles Not Saving
- Check browser localStorage is enabled
- Try a different browser
- Export data as backup
- Clear browser cache and re-import

### App Won't Start
- Ensure Node.js is installed: `node --version`
- Delete `node_modules` folder
- Run `npm install` again
- Check for error messages in Command Prompt

## Support & Feedback

This is an independent tool designed for educators. For issues:
1. Check this README for troubleshooting
2. Review error messages in browser console (F12)
3. Verify API key and environment setup

## License & Disclaimer

**Educational Use Only**

This tool is provided as-is for educational purposes. Teachers are responsible for:
- Reviewing all generated content
- Ensuring accuracy and appropriateness
- Complying with school/district policies
- Protecting student privacy

Generated content should be used as a starting point, not a final product.

---

**Version:** 1.0.0  
**Last Updated:** January 2026
