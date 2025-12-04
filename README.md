# ZenSpace AI

An AI-powered room decluttering assistant that analyzes photos of your space and provides personalized organization advice.

## Features

- **Visual Analysis** - Upload a photo of any room and get instant AI analysis of clutter hotspots
- **Actionable Steps** - Receive step-by-step decluttering checklists tailored to your space
- **Expert Chat** - Chat with the AI assistant for specific advice on storage and design

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini AI
- Three.js / React Three Fiber
- Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zenspace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT
