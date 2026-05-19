# MindMate - Mental Health Chatbot Interface

A calm, trustworthy, and accessible mental health chatbot interface built with Next.js, React, and Tailwind CSS.

## Features

- **Three-Panel Layout**: Sidebar for navigation, central chat area, and emergency resources panel
- **Calm Design**: Soft color palette (pastel blues, mint greens, warm sand) with rounded corners and subtle shadows
- **Crisis Resources**: Always-accessible SOS card with emergency hotlines
- **Quick Actions**: Easy access to breathing exercises, journaling, and saved resources
- **Voice Recognition** 🎤: Speak your messages instead of typing for easier expression
- **Responsive**: Fully responsive design that works on mobile, tablet, and desktop
- **Accessible**: WCAG AA compliant with proper ARIA labels, keyboard navigation, and screen reader support
- **Context-Aware**: Recommended resources update based on conversation topics
- **Smart Bot**: Empathetic, context-aware responses that detect topics and emotional state

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Icons**: lucide-react
- **Testing**: Vitest + React Testing Library + fast-check (for property-based testing)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
mindmate-chatbot/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with custom Tailwind theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ChatContainer.tsx  # Main chat area
│   ├── EmergencyPanel.tsx # Crisis resources panel
│   ├── ErrorMessage.tsx   # Error display component
│   ├── InputBar.tsx       # Message input
│   ├── Message.tsx        # Individual message bubble
│   ├── MindMateLayout.tsx # Main layout orchestrator
│   ├── RecommendedResources.tsx
│   ├── ResourceCard.tsx
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── SOSCard.tsx        # Emergency contacts card
│   └── StartingChips.tsx  # Conversation starters
├── contexts/              # React Context providers
│   ├── SessionContext.tsx # Chat session state
│   └── UIContext.tsx      # UI state (panels, loading)
├── types/                 # TypeScript type definitions
│   └── index.ts
└── utils/                 # Utility functions
    └── colors.ts          # Color palette constants
```

## Design Philosophy

MindMate follows three core principles:

1. **Calm**: Soft colors, gentle animations, and spacious layouts reduce anxiety
2. **Trustworthy**: Clear information hierarchy, consistent design, and always-visible crisis resources
3. **Accessible**: WCAG AA compliant, keyboard navigable, screen reader friendly

## Color Palette

- **Soft Gray**: #F5F5F5 (main background)
- **Soft Cream**: #FAF9F6 (sidebar/panel background)
- **Pastel Blue**: #B4D4E1 (user messages, primary actions)
- **Mint Green**: #D4E8D4 (bot messages)
- **Warm Sand**: #E8DCC4 (accents, borders)
- **Soft Red**: #F4A5A5 (SOS card, alerts)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Accessibility Features

- Semantic HTML5 elements (`<nav>`, `<main>`, `<aside>`)
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators on all focusable elements
- Color contrast ratios meet WCAG AA standards
- Respects `prefers-reduced-motion` for animations
- Screen reader announcements for dynamic content

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is for demonstration purposes.

## Emergency Resources

If you or someone you know is in crisis, please contact:

- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-4357

These services are free, confidential, and available 24/7.
