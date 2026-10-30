# Maria Stitches
### Style, beautifully stitched.

A modern digital storefront for **Maria Stitches**, a fashion and tailoring atelier based in Sango Ota, Ogun State, Nigeria.

Maria Stitches brings the studio's fashion experience online through an elegant, editorial-inspired website, premium visual storytelling and a consultation experience that makes connecting with the studio effortless.

The experience should feel like exploring a contemporary fashion label: expressive photography, refined typography, fluid transitions and carefully designed interactions.

---

## Overview

Maria Stitches combines a premium fashion-focused frontend with a lightweight backend API for handling customer consultation requests.

The project focuses on creating an elegant digital presence for the brand while establishing a foundation for future e-commerce and business-management functionality.

### Core Technologies

| Technology | Purpose |
|---|---|
| React | Frontend application |
| Vite | Development server and build tooling |
| Express.js | Backend API |
| JavaScript | Application development |
| Unsplash | Editorial fashion photography |

---

## Visual Identity & Design Direction

Maria Stitches should communicate elegance, sophistication, creativity and quality craftsmanship.

The visual experience should combine:

- Editorial fashion photography.
- Elegant typography.
- Beautifully balanced whitespace.
- Sophisticated colour combinations.
- Premium product presentation.
- Smooth, purposeful animations.
- Consistent interactive feedback.

Avoid making the website look like a generic e-commerce template.

The overall experience should resemble a premium independent fashion label.

---

## Motion & Interaction Design

Motion is an important part of the Maria Stitches experience.

The website should feel vibrant, responsive and alive while maintaining an elegant and sophisticated visual identity.

**The objective is purposeful animation, not animation everywhere.**

### 1. Page Entrance Animations

Implement subtle entrance animations when pages load.

Requirements:
- Hero headings should reveal smoothly.
- Supporting text should fade in naturally.
- Primary CTA buttons should appear with a slight delay.
- Hero photographs should use subtle fade and scale transitions.
- Content sections should enter naturally without overwhelming the visitor.

Use staggered animations where multiple elements appear together.

### 2. Scroll-Triggered Animations

Introduce scroll-based reveals for important sections.

Examples:
- Brand introduction.
- Featured collections.
- Product categories.
- Editorial photographs.
- About section.
- Customer enquiry section.

Use subtle fade-up, fade-in and gentle movement effects.

Animations should trigger when elements enter the viewport rather than repeatedly restarting unnecessarily.

### 3. Product Card Interactions

Product cards should feel interactive and polished.

Implement:
- Gentle image zoom on hover.
- Smooth card elevation.
- Subtle shadow transitions.
- Animated button feedback.
- Smooth transitions between product states.
- Clear visual feedback when a product is added to the cart.

Keep product information readable and avoid excessive movement.

### 4. Navigation Animations

Make navigation feel refined.

Implement:
- Smooth navigation-menu opening and closing.
- Animated navigation underline.
- Subtle hover colour transitions.
- Mobile menu slide-in or fade transitions.
- Smooth active-link indicators.

The mobile navigation must remain easy to operate.

### 5. Button Micro-interactions

Interactive elements should respond naturally.

Implement:
- Smooth hover transitions.
- Subtle press-down feedback.
- Appropriate focus states.
- Loading animations when actions are processing.
- Success feedback after completed actions.

Important buttons include:
- Shop Collection.
- Explore Designs.
- Add to Cart.
- Contact Us.
- Book a Consultation.
- WhatsApp Enquiry.

### 6. Page Transitions

Where appropriate, implement smooth transitions when navigating between major pages.

Use restrained fade or opacity transitions.

Avoid unnecessarily delaying navigation or making the interface feel slow.

### 7. Image Animations

Photography is central to the Maria Stitches identity.

Use:
- Gentle image reveals.
- Subtle image zoom on hover.
- Smooth image-gallery transitions.
- Elegant image loading placeholders.
- Consistent image cropping and aspect ratios.

Do not distort photographs or compromise their quality.

### 8. Form Interactions

Consultation forms should feel modern and responsive.

Implement:
- Smooth input focus transitions.
- Clear validation feedback.
- Animated loading states.
- Submission success feedback.
- Friendly error states.

Do not hide important validation messages behind animations.

### 9. Motion Design Guidelines

Use these as initial design targets:

| Interaction | Suggested duration |
|---|---:|
| Button hover | 150–200ms |
| Card hover | 200–300ms |
| Navigation menu | 200–300ms |
| Image reveal | 400–700ms |
| Section entrance | 400–600ms |
| Modal transitions | 200–300ms |

Use smooth easing curves rather than abrupt linear movement.

Maintain consistent timing throughout the application.

### 10. Performance & Accessibility

Animations must never compromise the experience.

Requirements:

- Respect `prefers-reduced-motion`.
- Avoid unnecessary JavaScript animation loops.
- Prefer CSS transitions for simple interactions.
- Use a suitable animation library only where it provides meaningful value.
- Avoid animating expensive layout properties unnecessarily.
- Prefer transform and opacity for smooth motion.
- Avoid large animations on mobile devices.
- Prevent layout shifts.
- Keep interactions accessible by keyboard.
- Ensure animations do not block important actions.

**Important:** Inspect the existing project before installing animation dependencies. Do not add unnecessary libraries simply to animate basic buttons or transitions.

---

## Project Structure

```text
maria-stitches/
│
├── frontend/          # React + Vite application
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/           # Express API
│   └── package.json
│
└── README.md
```

The structure above highlights the main project directories.

---

## Getting Started

Follow these instructions to run Maria Stitches locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate into the project:

```bash
cd maria-stitches
```

### 2. Start the Backend

Open a terminal:

```bash
cd backend
npm install
npm run dev
```

The Express API runs at:

`http://localhost:5000`

API health endpoint:

`http://localhost:5000/api/health`

### 3. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs at:

`http://localhost:5173`

Open the frontend URL in your browser to explore the application.

---

## Backend API

The backend is built with Express.js and currently provides a lightweight API for consultation requests.

| Endpoint | Purpose |
|---|---|
| `/api/health` | API health check |
| Consultation endpoint | Validates and acknowledges customer consultation requests |

**Current implementation:** Consultation requests are validated and acknowledged by the API. They are not yet persisted in a database or delivered through an email notification service.

A database or notification provider must be integrated before the studio can reliably retain and receive customer enquiries.

---

## Photography & Assets

The frontend currently uses editorial fashion photography served by Unsplash.

An active internet connection is required for remotely hosted images to load.

Before production deployment:

- Review applicable image licences.
- Use relevant fashion photography.
- Prefer high-resolution, optimised assets.
- Consider locally managed image storage.
- Avoid representing stock photographs as actual Maria Stitches products.

---

## Development Workflow

The project uses separate development environments for the frontend and backend.

| Application | Local URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:5000` |
| API Health | `http://localhost:5000/api/health` |

Run both development servers simultaneously when testing the complete application.

---

## Roadmap

The following are planned development milestones, not claims about currently implemented functionality.

### Experience & Branding
- [ ] Finalise premium brand identity.
- [ ] Establish a consistent visual design system.
- [ ] Implement the coordinated motion and transition system.
- [ ] Optimise mobile and tablet experiences.

### Storefront
- [ ] Expand the fashion catalogue.
- [ ] Introduce product categories.
- [ ] Implement shopping cart functionality.
- [ ] Build detailed product pages.

### Customer Communication
- [ ] Integrate smart WhatsApp ordering.
- [ ] Introduce persistent consultation records.
- [ ] Improve enquiry management.

### Business Management
- [ ] Add administrator authentication.
- [ ] Develop a business management dashboard.
- [ ] Implement product image uploads.
- [ ] Add order and enquiry management.

### Production
- [ ] Complete performance optimisation.
- [ ] Improve automated testing.
- [ ] Prepare production deployment.

---

## Engineering Principles

Development should prioritise:

1. **Visual consistency:** All pages should follow the same design system.
2. **Performance:** Smooth animations and fast page loading.
3. **Accessibility:** All users should be able to navigate the experience.
4. **Maintainability:** Reusable components and understandable code.
5. **Reliability:** Every interactive element should work as expected.
6. **Responsiveness:** The experience should remain polished across screen sizes.

Avoid unnecessary dependencies, duplicated components, excessive animations and unfinished interactions.

---

## Business Information

**Maria Stitches**

Fashion & Tailoring Atelier

Sango Ota, Ogun State, Nigeria.

*Style, beautifully stitched.*

---

## Project Status

**Development: In Progress**

The frontend and consultation API provide the current foundation.

Database persistence, automated notifications, additional business-management capabilities and the full motion system remain development milestones.

---

*Crafted for Maria Stitches.*