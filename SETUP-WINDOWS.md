# Report Buddy - Windows Setup Guide

## Step-by-Step Installation for Windows

### Prerequisites Check

Before starting, you need:
- Windows 10 or Windows 11
- Internet connection
- Administrator access (for installing Node.js)

### Step 1: Install Node.js

1. **Download Node.js:**
   - Open your web browser
   - Go to: https://nodejs.org/
   - Click the green button "Download for Windows (x64)" - this is the LTS (Long Term Support) version
   - Save the file (it will be named something like `node-v20.x.x-x64.msi`)

2. **Run the Installer:**
   - Find the downloaded file (usually in your Downloads folder)
   - Double-click the `.msi` file
   - Click "Next" on the welcome screen
   - Accept the license agreement and click "Next"
   - Keep the default installation location and click "Next"
   - Keep all default features selected and click "Next"
   - Click "Install" (you may need to click "Yes" when prompted by Windows User Account Control)
   - Wait for installation to complete
   - Click "Finish"

3. **Verify Installation:**
   - Press `Windows Key + R` to open Run dialog
   - Type `cmd` and press Enter (this opens Command Prompt)
   - Type the following and press Enter:
     ```
     node --version
     ```
   - You should see something like `v20.11.0`
   - Then type:
     ```
     npm --version
     ```
   - You should see something like `10.2.4`
   - If you see version numbers, Node.js is installed correctly!

### Step 2: Get Your Claude API Key

1. **Create Anthropic Account:**
   - Open your web browser
   - Go to: https://console.anthropic.com/
   - Click "Sign Up" if you don't have an account
   - Follow the registration process
   - Verify your email address

2. **Get API Key:**
   - Once logged in, look for "API Keys" in the left sidebar
   - Click "Create Key"
   - Give it a name like "Report Buddy"
   - Click "Create Key"
   - **IMPORTANT:** Copy the API key and save it somewhere safe (you won't be able to see it again)
   - It will look something like: `sk-ant-api03-...` (long string of letters and numbers)

3. **Add Credits (if needed):**
   - Go to "Billing" in the console
   - Add payment method and credits
   - $5-10 should be plenty to start (each comment costs about $0.01-0.03)

### Step 3: Extract the Report Buddy Files

1. **Choose a Location:**
   - Decide where you want to keep Report Buddy
   - Good locations:
     - `C:\Users\YourName\Documents\report-buddy`
     - `C:\Projects\report-buddy`
     - Desktop is fine for testing

2. **Extract Files:**
   - If you received a .zip file, right-click it
   - Choose "Extract All..."
   - Select your chosen location
   - Click "Extract"

3. **Verify Files:**
   - Open the `report-buddy` folder
   - You should see folders like: `app`, `components`, `lib`, `types`
   - And files like: `package.json`, `README.md`, `.env.example`

### Step 4: Configure Your API Key

1. **Create .env File:**
   - Open the `report-buddy` folder
   - Find the file named `.env.example`
   - Right-click `.env.example` and choose "Open with" > "Notepad"
   - You'll see:
     ```
     ANTHROPIC_API_KEY=your_api_key_here
     ```

2. **Add Your Key:**
   - Replace `your_api_key_here` with your actual API key (the one you copied earlier)
   - It should look like:
     ```
     ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
     ```
   - Go to "File" > "Save As"
   - In "File name" type: `.env` (including the dot)
   - In "Save as type" choose "All Files"
   - Click "Save"

3. **Verify:**
   - You should now see a file named `.env` (not .env.txt or .env.example)
   - If you don't see file extensions, in File Explorer: View > File name extensions (check the box)

### Step 5: Install Dependencies

1. **Open Command Prompt:**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter

2. **Navigate to Your Project:**
   - Type `cd` followed by the path to your folder, for example:
     ```
     cd C:\Users\YourName\Documents\report-buddy
     ```
   - Press Enter
   - You should see your path displayed before the cursor

3. **Install Packages:**
   - Type:
     ```
     npm install
     ```
   - Press Enter
   - This will take 2-5 minutes
   - You'll see a lot of text scrolling - this is normal!
   - Wait until you see something like:
     ```
     added 234 packages in 3m
     ```

### Step 6: Start Report Buddy

1. **Start the Development Server:**
   - In the same Command Prompt window, type:
     ```
     npm run dev
     ```
   - Press Enter
   - Wait a few seconds
   - You should see:
     ```
     > report-buddy@1.0.0 dev
     > next dev
     
     ▲ Next.js 14.1.0
     - Local:        http://localhost:3000
     
     ✓ Ready in 2.5s
     ```

2. **Open in Browser:**
   - Open your web browser (Chrome, Firefox, Edge)
   - Go to: http://localhost:3000
   - You should see Report Buddy!

### Step 7: Using Report Buddy

**First Time:**
1. Click "Students" tab to add student profiles (optional)
2. Click "My Voice" tab to train on your writing style (optional but recommended)
3. Click "Report Cards" tab to start generating comments

**Generate a Comment:**
1. Select grade, subject, achievement level
2. Add your teacher notes
3. Click "Generate Comment"
4. Wait 10-30 seconds
5. Review 3 versions
6. Click "Copy" on your favorite
7. Paste into your report card system

### Step 8: Stopping Report Buddy

When you're done:
1. Go back to the Command Prompt window
2. Press `Ctrl + C`
3. You may see "Terminate batch job (Y/N)?" - type `Y` and press Enter
4. Close the Command Prompt window

### Starting Report Buddy Again Later

1. Open Command Prompt
2. Navigate to your folder:
   ```
   cd C:\Users\YourName\Documents\report-buddy
   ```
3. Start the server:
   ```
   npm run dev
   ```
4. Open browser to http://localhost:3000

## Common Issues & Solutions

### Issue: "node is not recognized"
**Solution:** Node.js is not installed or not in PATH
- Reinstall Node.js from nodejs.org
- Make sure to check "Add to PATH" during installation
- Restart your computer
- Try again

### Issue: "npm install" fails
**Solution:** 
- Make sure you're in the correct folder (`cd` to report-buddy directory)
- Close and reopen Command Prompt
- Try running as Administrator (right-click Command Prompt > Run as administrator)
- Delete `node_modules` folder if it exists, then try again

### Issue: "API Error" when generating
**Solutions:**
- Check your `.env` file has the correct API key
- Make sure there are no spaces around the equals sign
- Verify you have credits in your Anthropic account
- Check your internet connection

### Issue: Can't see .env file
**Solution:**
- In File Explorer, click "View" tab
- Check "File name extensions" box
- Check "Hidden items" box
- Now you should see .env

### Issue: Port 3000 is already in use
**Solution:**
- Another program is using port 3000
- Try a different port:
  ```
  npm run dev -- -p 3001
  ```
- Or find and close the program using port 3000

### Issue: Browser shows "This site can't be reached"
**Solutions:**
- Make sure Command Prompt shows "✓ Ready"
- Try http://127.0.0.1:3000 instead of localhost
- Check your firewall isn't blocking port 3000
- Make sure you didn't close the Command Prompt window

## Tips for Teachers

### Save Time:
- Set up student profiles once, use all year
- Train teacher voice for consistent style
- Use keyboard shortcuts (Ctrl+V to paste, Ctrl+C to copy)

### Workflow:
1. Keep Report Buddy open in one browser tab
2. Keep your report card system in another tab
3. Generate, copy, paste, review, customize
4. Move to next student

### Best Practices:
- Always review generated comments
- Customize with specific examples from your observations
- Use the tone adjustment buttons to fine-tune
- Export your data monthly as backup

### Backup Your Data:
1. Click "Export/Import" tab
2. Click "Export as JSON"
3. Save file to a safe location (OneDrive, Google Drive, USB)
4. Do this monthly or before clearing browser data

## Getting Help

### Quick Checks:
1. Is Node.js installed? (`node --version`)
2. Is your API key correct in `.env`?
3. Are you in the right folder in Command Prompt?
4. Is the dev server running? (should see "✓ Ready")
5. Is your browser pointed to http://localhost:3000?

### If Stuck:
- Restart Command Prompt
- Restart computer
- Re-read this guide carefully
- Check for typos in commands
- Google the exact error message you see

---

**Need More Help?**
- Check the main README.md file
- Review the Troubleshooting section
- Make sure you followed each step exactly
