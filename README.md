# Social Hub - AI-Powered Social Media Management

A comprehensive social media management dashboard with AI-powered content creation, scheduling, and analytics.

## Features

- **AI Content Generation**: Create engaging social media posts with AI assistance
- **Multi-Brand Management**: Manage multiple brands from a single dashboard
- **Content Calendar**: Visual calendar for scheduling and managing posts
- **Content Queue**: Review and approve posts before publishing
- **Analytics Dashboard**: Track performance metrics across platforms
- **Trending Topics**: Stay updated with real-time social media trends
- **Dark Mode**: Built-in dark mode support
- **Supabase Authentication**: Secure email/password authentication

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons, FullCalendar
- **Backend**: Supabase (Database + Authentication)
- **Automation**: N8N (for AI workflows and trend tracking)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- N8N instance (self-hosted or cloud)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd social-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## N8N Integration Setup

This application uses N8N for AI-powered workflows. Follow these steps to set up N8N integration:

### Step 1: Set Up N8N Instance

**Option A: Cloud (Recommended for Beginners)**
1. Go to [n8n.cloud](https://n8n.cloud) and create an account
2. Create a new workflow instance
3. Note your N8N instance URL

**Option B: Self-Hosted**
1. Install N8N using Docker:
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```
2. Access N8N at `http://localhost:5678`

### Step 2: Import Workflows

Import the following workflows into your N8N instance:

#### Workflow 1: AI Content Generator
1. In N8N, click "New Workflow"
2. Name it "Social Hub - Content Generator"
3. Add these nodes:
   - **Webhook** (trigger): Set to respond to POST requests
   - **OpenAI/Claude Node**: Configure with your AI API key
     - Prompt: Use the post topic and brand voice from the webhook data
   - **Respond to Webhook**: Return the generated content

4. Activate the workflow and copy the webhook URL

#### Workflow 2: Trend Hunter
1. Create a new workflow named "Social Hub - Trend Hunter"
2. Add these nodes:
   - **Schedule Trigger**: Set to run every 6 hours
   - **HTTP Request**: Call social media APIs (Twitter, Reddit, etc.)
   - **AI Node**: Analyze and categorize trends
   - **Supabase Node**: Store trends in your database

3. Activate the workflow

#### Workflow 3: Auto-Post Scheduler
1. Create a new workflow named "Social Hub - Auto Post"
2. Add these nodes:
   - **Schedule Trigger**: Check every 5 minutes
   - **Supabase Node**: Query posts with `status = 'scheduled'` and `scheduled_at <= now()`
   - **Switch Node**: Route based on platform
   - **Platform API Nodes**:
     - LinkedIn API
     - Facebook Graph API
     - Instagram Graph API
     - TikTok API
   - **Supabase Node**: Update post status to 'posted'

3. Activate the workflow

### Step 3: Configure API Keys in N8N

Add credentials in N8N for:
- OpenAI or Anthropic (Claude) API key
- Supabase credentials (URL + Service Role Key)
- Social media platform credentials:
  - LinkedIn: Create app at [LinkedIn Developers](https://www.linkedin.com/developers/)
  - Facebook/Instagram: Create app at [Meta for Developers](https://developers.facebook.com/)
  - TikTok: Create app at [TikTok Developers](https://developers.tiktok.com/)

### Step 4: Connect Application to N8N

1. Update your webhook URLs in the application:

In `src/components/views/CreatePostView.tsx`, update the AI generation endpoint:
```typescript
const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: generatePrompt,
    platform: generatePlatform,
    brandVoice: selectedBrand?.brand_voice
  })
});
```

2. For the calendar "Generate Smart Timeline" feature, update the webhook URL in `src/components/views/CalendarView.tsx`

### Step 5: Test the Integration

1. **Test Content Generation**:
   - Go to "Create Post" in the app
   - Enter a topic and click "Generate with AI"
   - Verify the AI-generated content appears

2. **Test Trend Tracking**:
   - Check the "Trends" page
   - Verify trends are being updated from N8N

3. **Test Auto-Posting**:
   - Schedule a post for 5 minutes in the future
   - Wait for N8N to process it
   - Verify it posts to the selected platform

## Database Schema

The application uses Supabase with the following main tables:
- `users` - User authentication data
- `brands` - Brand profiles and voice settings
- `posts` - Social media posts and scheduling
- `trends` - Trending topics data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
