# 🎨 ColorMind – Design Color Validation System

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Groq AI](https://img.shields.io/badge/Groq-AI-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-cyan)

> From color confusion to confident decisions in seconds.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [Team Members](#team-members)
- [Acknowledgments](#acknowledgments)
- [License](#license)

---

## 🎯 Overview

ColorMind is an AI-powered web application that helps users make confident color decisions for fashion, interior design, and digital design projects. Whether you're picking an outfit, designing a room, or building a brand — ColorMind gives you expert color advice instantly.

### ❗ Original Problem
Choosing the right colors for outfits, interiors, and design projects requires expert knowledge in color theory. Most people struggle with color combinations and end up making poor decisions without professional guidance.

### 💡 Our Solution
- AI-powered chat assistant for instant color advice
- Color validation and harmony checking
- Image-based color extraction
- Wardrobe and outfit suggestions
- Smart color palette generation

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Color Assistant** | Chat with ColorMind AI for personalized color advice using Groq AI |
| 🎨 **Color Validation** | Validate and check color combinations for harmony |
| 🖼️ **Extract Colors** | Extract beautiful color palettes from any image |
| 👗 **Wardrobe Suggestions** | Get outfit color combination advice |
| 💡 **Smart Suggestions** | AI-powered color recommendations based on your needs |
| 🎭 **Color Palettes** | Browse and create beautiful color palettes |
| 📸 **Image Analysis** | Analyze images for color insights and suggestions |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| AI Model | Groq API (llama-3.3-70b-versatile) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## 📁 Project Structure

```bash
colormind/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI chat API route
│   ├── dashboard/                # Dashboard page
│   ├── assistant/                # AI Assistant page
│   ├── extract/                  # Color extraction page
│   ├── validation/               # Color validation page
│   └── layout.tsx                # Root layout
├── components/                   # Reusable UI components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
├── public/                       # Static assets
├── styles/                       # Global styles
├── .env                          # Environment variables
├── next.config.mjs               # Next.js configuration
└── package.json
```

## 📦 Installation Guide

bash
# Clone the repository
git clone https://github.com/sharmavishal-23/Colour-Validation-System_ColorMind.git

# Go to project folder
cd Colour-Validation-System_ColorMind

# Install dependencies
npm install

# Create .env file and add your Groq API key
GROQ_API_KEY=your_groq_api_key_here

# Run development server
npm run dev

# Open in browser
http://localhost:3000


---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com | ✅ Yes |

> ⚠️ Never share your `.env` file or commit it to GitHub!

---
## 👥 Team Members

| Name | GitHub | Role | Key Contributions |
|------|--------|------|-------------------|
| 🎨 Aena Patel | [@aenapatel25](https://github.com/aenapatel25) | Frontend Developer | ✅ UI Components, ✅ Pages & Layout, ✅ Tailwind Styling, ✅ AI Assistant Integration |
| ⚙️ Vishal Sharma | [@sharmavishal-23](https://github.com/sharmavishal-23) | Backend Developer | ✅ API Routes, ✅ Groq AI Integration, ✅ Color Logic, ✅ Project Architecture |

### 🎨 Aena Patel – Frontend Developer
- Built all frontend pages including Dashboard, Assistant, Wardrobe, and Palettes
- Designed and implemented UI components with Tailwind CSS
- Created responsive layouts for all screen sizes
- Integrated AI chat interface with real-time streaming responses
- Implemented color picker and palette display components

### ⚙️ Vishal Sharma – Backend Developer
- Built Next.js API routes for AI chat functionality
- Integrated Groq AI API with llama-3.3-70b-versatile model
- Implemented color validation and extraction logic
- Set up project architecture and folder structure
- Managed database and backend configurations

### Key Achievements

| Achievement | Lead | Impact |
|-------------|------|--------|
| Real-time AI responses | Vishal | Instant color advice |
| Fully responsive UI | Aena | Works on all devices |
| Free AI integration | Vishal | No cost for users |
| Beautiful color UI | Aena | Great user experience |
| Image color extraction | Both | Unique feature |

---

## 🙏 Acknowledgments
- [Groq](https://groq.com) – for the blazing fast free AI API
- [Next.js](https://nextjs.org) – for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com) – for the utility-first CSS framework
- [Vercel](https://vercel.com) – for seamless deployment

---

## 📝 License
This project is for educational purposes.

---

<p align="center">Made with ❤️ by Aena & Vishal</p>
