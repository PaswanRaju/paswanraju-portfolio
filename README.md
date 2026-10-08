# Raju Kumar Paswan — Portfolio

Personal portfolio website for showcasing my projects, experience, skills, and the things I’m currently building as a Computer Science student at The University of Texas at Arlington.

Live site: [paswanraju.com](https://paswanraju.com)

## About

I’m a Computer Science student at UTA with a minor in Data Science.

I learn by building — from low-level systems and AI experiments to web projects.

This portfolio is designed and built by me using Next.js, TypeScript, Three.js, React Three Fiber, Framer Motion, and Tailwind CSS.

## Features

- Responsive portfolio design
- Recruiter Mode
- Interactive System Map
- 3D Resume Explorer
- Accessible 2D Resume Explorer fallback
- “How I Think” engineering section
- Build Notes / development log
- Project case studies
- GitHub and LeetCode sections
- Command palette
- Terminal Easter egg
- Reduced-motion support
- Mobile and keyboard accessibility
- WebGL fallback for mobile and low-power devices
- SEO metadata, sitemap, robots.txt, and Open Graph support

## Projects Featured

### OperatorLoop — Human-in-the-Loop Manufacturing AI

A Python decision-support pipeline for manufacturing sensor data.

Highlights:
- sensor data processing
- anomaly classification
- exact-match guidance retrieval
- TF-IDF fallback retrieval
- safety validation
- operator feedback logging
- evaluation across 160 synthetic runs

Tech:

`Python` `Pandas` `scikit-learn` `Matplotlib` `TF-IDF`

### AArch64 Teaching Kernel Lab

Bare-metal ARM64 systems work using QEMU and GDB.

Highlights:
- Raspberry Pi 3 / AArch64 boot flow
- ARM assembly
- kernel image inspection
- register and execution-state debugging
- QEMU and GDB workflow

Tech:

`C` `ARM Assembly` `QEMU` `GDB` `Make`

### 3D Tic Tac Toe

An interactive Tic Tac Toe project with a futuristic 3D-inspired interface.

Tech:

`HTML` `CSS` `JavaScript`

Live demo:
[paswanraju.github.io/3d-tic-tac-toe](https://paswanraju.github.io/3d-tic-tac-toe/)

### MavRAG Course Assistant

Status: **In Progress**

A planned retrieval-augmented generation system for course materials using document ingestion, embeddings, vector retrieval, and grounded responses.

Tech:

`Python` `FastAPI` `LangChain` `ChromaDB` `Docker` `AWS`

### Cloud-Native Task Platform

Status: **In Progress**

A planned full-stack task platform focused on authentication, caching, deployment, monitoring, and cloud-native architecture.

Tech:

`Java` `Spring Boot` `React` `MySQL` `Redis` `AWS`

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

### 3D / Interactive
- Three.js
- React Three Fiber
- Drei

### Development
- Git
- GitHub
- VS Code
- Claude Code
- GitHub Copilot

### Deployment
- Vercel
- Cloudflare DNS

## Performance

The portfolio includes several performance optimizations:

- lazy-loaded 3D Resume Explorer
- reduced WebGL draw calls
- WebGL disabled on unsupported / low-power devices
- static fallback visuals for mobile
- paused animation loops when content is offscreen
- reduced-motion support
- optimized first paint
- hydration-safe animations
- lightweight SVG-based System Map

## Accessibility

The site includes:

- keyboard navigation
- visible focus states
- accessible dialogs
- focus trapping and focus return
- Escape-to-close behavior
- touch-friendly controls
- skip-to-content support
- semantic headings and landmarks
- reduced-motion support
- mobile-friendly 2D alternatives for 3D experiences

## Running Locally

Clone the repository:

```bash
git clone https://github.com/PaswanRaju/paswanraju-portfolio.git
