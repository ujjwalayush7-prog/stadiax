# StadiaX 🏟️

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-success?style=for-the-badge&logo=vercel)](https://stadiax.vercel.app/)

**StadiaX** is a GenAI-enabled stadium operations and fan experience platform designed specifically for the **FIFA World Cup 2026**. 

Built with **Next.js** and powered by **Google Gemini 2.5 Flash**, StadiaX provides real-time, multilingual assistance and operational intelligence for both football fans and stadium staff.

## 🌟 Key Features

### 👤 For Fans
- **Live Match Dashboard**: Real-time score updates and match events.
- **StadiaBot AI**: A multilingual GenAI assistant capable of answering questions about stadium navigation, food options, transport, and accessibility.
- **Quick Actions**: One-tap buttons to instantly locate restrooms, sustainable transport, and wheelchair-accessible routes.

### 🛡️ For Staff & Organizers
- **Operational Intelligence Grid**: Live metrics monitoring stadium capacity, active incidents, and energy usage.
- **Operations AI**: Advanced GenAI decision support to help staff manage crowd congestion, deploy volunteers, and ensure a safe environment.

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules (Glassmorphism & FIFA 2026 Theme)
- **AI Integration**: `@google/genai` (Gemini 2.5 Flash)
- **Icons**: Lucide React

## Problem Statement Alignment
Our platform directly addresses the #PromptWarsVirtual Challenge 4 core requirements:
- **Generative AI Integration**: Powered by Google Gemini 2.5 Flash (`@google/genai` SDK) to act as an intelligent stadium assistant.
- **Navigation & Crowd Management**: Staff Operations view provides active incident reporting and crowd capacity metrics.
- **Accessibility & Transport**: Fan Experience view queries AI specifically for wheelchair routes and sustainable transport.
- **Sustainability**: Dashboard tracks Energy Usage (-12% optimization) and encourages sustainable options.
- **Multilingual Assistance**: Gemini automatically translates and responds in the fan's native language.
- **Real-Time Decision Support**: The Operations AI processes capacity and incident stats to advise on volunteer deployment.

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ujjwalayush7-prog/stadiax.git
   cd stadiax
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment

StadiaX is fully optimized for Vercel deployment. Simply import the repository into your Vercel dashboard and add the `GEMINI_API_KEY` to the environment variables before deploying.

---

### 👨‍💻 Credits
Built with ❤️ by **Ujjwal Ayush**.
