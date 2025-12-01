# UFO Studios Website

This is the React application for UFO Studios.

## 1. Setup

After downloading and unzipping the project:

1. Open your terminal in the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```

## 2. Development

To run the site locally on your computer:

1. Create a `.env` file in the root directory.
2. Add your Gemini API key:
   ```
   API_KEY=your_actual_api_key_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 3. Deployment (Vercel)

1. **Push to GitHub:**
   - Initialize git: `git init`
   - Add files: `git add .`
   - Commit: `git commit -m "Initial commit"`
   - Create a repo on GitHub and follow the instructions to push.

2. **Connect to Vercel:**
   - Go to Vercel.com and "Add New Project".
   - Import your GitHub repository.
   - **Important:** In "Environment Variables", add:
     - Key: `API_KEY`
     - Value: `[Your Google Gemini API Key]`
   - Click **Deploy**.
