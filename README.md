# Raju Kumar Paswan — Portfolio

My personal portfolio website, built with Next.js and deployed on Vercel.

**Live site:** [paswanraju.com](https://paswanraju.com)

I'm a Computer Science student at the University of Texas at Arlington, minoring in Data Science. This site showcases my projects, experience, and skills, and gives recruiters and collaborators an easy way to reach me.

---

## Features

- **Clean, responsive design** that works on phones, tablets, and desktops
- **Hero section** with a short introduction and quick links to my projects and resume
- **About** section with education, coursework, organizations, and a downloadable resume
- **Projects** with tech stacks, key points, and expandable engineering details
- **Experience** with expandable details for each role
- **Skills** grouped by category, with tool logos
- **LeetCode** stats card
- **Working contact form** powered by Formspree (no custom backend)
- **Sticky navbar** with active-section highlighting and a mobile menu

## Tech Stack

| Area | Tools |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router), React |
| Language | TypeScript |
| Animation | Framer Motion |
| Icons | Lucide, React Icons |
| Font | Inter (via `next/font`) |
| Contact form | [Formspree](https://formspree.io/) |
| Hosting | [Vercel](https://vercel.com/) |
| DNS & email routing | Cloudflare |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer
- npm

### Run locally

```bash
git clone https://github.com/PaswanRaju/paswanraju-portfolio.git
cd paswanraju-portfolio
npm install
```

Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables)), then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FORMSPREE_ID` | The Formspree form ID used by the contact form (the part after `/f/` in the form endpoint) |

Example `.env.local`:

```
NEXT_PUBLIC_FORMSPREE_ID=your_form_id
```

`.env.local` is ignored by Git. When deploying, add the same variable in your hosting provider's settings (on Vercel: **Settings → Environment Variables**), then redeploy.

## Project Structure

```
paswanraju-portfolio/
├── app/            # Pages, layout, sections, and global styles
├── public/
│   └── images/     # Profile photo, logos, and project images
├── package.json
└── README.md
```

Site content (projects, experience, skills, and contact details) is kept in a content data file inside `app/`, so text can be updated without touching the layout code.

## Deployment

The site deploys automatically with Vercel:

- Pushing to `main` deploys to production at [paswanraju.com](https://paswanraju.com).
- Pushing any other branch creates a preview deployment for testing changes before they go live.

## Contact

- **Email:** [raju@paswanraju.com](mailto:raju@paswanraju.com)
- **Website:** [paswanraju.com](https://paswanraju.com)
- **GitHub:** [@PaswanRaju](https://github.com/PaswanRaju)

---

© 2026 Raju Kumar Paswan
