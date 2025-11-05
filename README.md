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

Below is a complete list of all button functions in the application that need N8N webhook integration:

#### 1. **Generate Post** Button
- **Location**: `src/components/views/CreatePostView.tsx` (line 33-48)
- **Function**: `handleGenerate()`
- **Description**: Generates AI-powered social media post content based on user prompt and selected platform
- **Required Payload**:
  ```typescript
  {
    prompt: string,           // User's content topic/description
    platform: Platform,       // Selected social media platform
    brandVoice: string        // Brand voice from settings
  }
  ```
- **Expected Response**:
  ```typescript
  {
    caption: string,          // AI-generated post caption
    hashtags?: string[]       // Suggested hashtags (optional)
  }
  ```
- **Webhook Integration Point**: Replace line 39-41 with:
  ```typescript
  const response = await fetch('YOUR_N8N_CONTENT_GENERATOR_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: generatePrompt,
      platform: generatePlatform,
      brandVoice: selectedBrand?.brand_voice
    })
  });
  const data = await response.json();
  const aiGeneratedCaption = data.caption;
  ```

#### 2. **Schedule & Auto-Post** / **Save as Draft** Button
- **Location**: `src/components/views/CreatePostView.tsx` (line 50-83)
- **Function**: `handleSubmit()`
- **Description**: Submits the post to the database with scheduled time (if provided)
- **Note**: This function saves to Supabase. Actual posting is handled by N8N's Auto-Post Scheduler workflow

#### 3. **Generate Posts** Button (Multi-Platform)
- **Location**: `src/components/modals/GeneratePlanModal.tsx` (line 37-66)
- **Function**: `handleSubmit()`
- **Description**: Generates multiple posts for different platforms based on a content goal
- **Required Payload**:
  ```typescript
  {
    contentGoal: string,      // User's content objective
    platforms: Platform[],    // Array of selected platforms
    brandVoice: string,       // Brand voice from settings
    imageUrl?: string         // Optional image URL
  }
  ```
- **Expected Response**:
  ```typescript
  {
    posts: Array<{
      platform: Platform,
      caption: string,
      hashtags?: string[]
    }>
  }
  ```
- **Webhook Integration Point**: Replace line 43-62 with:
  ```typescript
  const response = await fetch('YOUR_N8N_MULTI_PLATFORM_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contentGoal: prompt,
      platforms: platforms,
      brandVoice: selectedBrand?.brand_voice,
      imageUrl: imageFile ? await uploadImage(imageFile) : undefined
    })
  });
  const data = await response.json();

  data.posts.forEach((generatedPost, index) => {
    const newPost: Post = {
      id: `post_${Date.now()}_${index}`,
      user_id: user.id,
      brand_id: selectedBrandId,
      caption: generatedPost.caption,
      platform: generatedPost.platform,
      status: 'draft',
      created_at: new Date().toISOString(),
    };
    addPost(newPost);
  });
  ```

#### 4. **Generate Timeline** Button
- **Location**: `src/components/views/CalendarView.tsx` (line 29-32)
- **Function**: `handleGeneratePlan()`
- **Description**: Generates an optimized content posting timeline using AI
- **Required Payload**:
  ```typescript
  {
    brandId: string,
    existingPosts: Post[],    // Current scheduled posts
    brandVoice: string,
    timeframe: string         // e.g., "next_30_days"
  }
  ```
- **Expected Response**:
  ```typescript
  {
    timeline: Array<{
      date: string,           // ISO date string
      platform: Platform,
      caption: string,
      suggestedTime: string   // e.g., "14:00"
    }>
  }
  ```
- **Webhook Integration Point**: Replace line 29-32 with:
  ```typescript
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('YOUR_N8N_TIMELINE_GENERATOR_WEBHOOK_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: selectedBrandId,
          existingPosts: brandPosts,
          brandVoice: brands.find(b => b.id === selectedBrandId)?.brand_voice,
          timeframe: 'next_30_days'
        })
      });
      const data = await response.json();

      // Process timeline and add posts
      data.timeline.forEach((item, index) => {
        const newPost: Post = {
          id: `post_${Date.now()}_${index}`,
          user_id: user.id,
          brand_id: selectedBrandId,
          caption: item.caption,
          platform: item.platform,
          status: 'draft',
          scheduled_at: new Date(`${item.date}T${item.suggestedTime}`).toISOString(),
          created_at: new Date().toISOString(),
        };
        addPost(newPost);
      });
    } catch (error) {
      console.error('Error generating timeline:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  ```

#### 5. **Approve** Button
- **Location**: `src/components/views/QueueView.tsx` (line 33-37)
- **Function**: `handleApprove()`
- **Description**: Approves a draft post and schedules it for posting
- **Note**: This updates the post status in Supabase. The N8N Auto-Post Scheduler will pick it up automatically

#### 6. **Decline** Button
- **Location**: `src/components/views/QueueView.tsx` (line 98)
- **Function**: `declinePost()`
- **Description**: Marks a post as declined
- **Note**: No N8N webhook needed - handled locally

#### 7. **Schedule Post** / **Save as Draft** Button (Manual Post Modal)
- **Location**: `src/components/modals/AddManualPostModal.tsx` (line 28-49)
- **Function**: `handleSubmit()`
- **Description**: Creates a manual post with optional scheduling
- **Note**: Saves directly to Supabase. Auto-posting handled by N8N Auto-Post Scheduler

---

### Summary of Required N8N Webhooks

You need to create **3 main webhook endpoints** in N8N:

1. **Content Generator Webhook** - For single post AI generation
   - Used by: "Generate Post" button

2. **Multi-Platform Generator Webhook** - For generating multiple posts across platforms
   - Used by: "Generate Posts" button (in Generate Plan modal)

3. **Timeline Generator Webhook** - For creating optimized posting schedules
   - Used by: "Generate Timeline" button

The **Auto-Post Scheduler** runs as a scheduled workflow (no webhook needed from frontend) and automatically posts content when `scheduled_at` time arrives.

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
