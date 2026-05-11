# The Brain Atlas

An interactive 3D atlas of the human brain and nervous system — from cortex through brainstem, down the spinal cord, along the vagus nerve, and into the enteric "second brain" in the gut.

Built with Next.js 14, React Three Fiber, Three.js, and Tailwind CSS.

## What's here

- **3D explorer** (`/explore`) — orbit/zoom/highlight 19 anatomical regions positioned in scene space. Hover for labels, click to read.
- **Region essays** (`/regions/[slug]`) — long-form notes on each major structure (frontal lobe, amygdala, hippocampus, thalamus, hypothalamus, insula, ACC, cerebellum, medulla, spinal cord, and more).
- **Systems essays** (`/systems/...`) — deeper essays on the vagus nerve and gut–brain axis, the autonomic nervous system, consciousness, hemispheric lateralization, and how the brain changes over time.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

This is a standard Next.js app — `vercel --prod` from the repo root, or import from GitHub via the Vercel dashboard. No environment variables required.

## Anatomy notes

Region positions in `lib/regions.ts` are approximate. The 3D model is built from procedural ellipsoids rather than a downloaded brain scan; this keeps every region individually pickable and the bundle small. The trade-off is that the model is stylized — the goal is *cognitive map*, not surgical accuracy.

Content is summarized for general readers. None of it is medical advice.
