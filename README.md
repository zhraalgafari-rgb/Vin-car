# Automotive Parts Knowledge Management Platform

An AI-powered, VIN-centric web application for automotive spare parts importers. Every VIN becomes a permanent digital knowledge record that grows continuously.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI**: OCR (Tesseract.js), Vision (GPT-4 Vision/Claude), LLM (Claude/GPT-4), Embeddings (OpenAI)
- **Search**: PostgreSQL Full-Text Search, pg_trgm, Vector Embeddings (pgvector)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Run `npm install`
4. Run `npm run dev`

## Project Structure

```
apps/web/          # Next.js frontend
apps/api/          # API routes
packages/db/       # Database types and migrations
packages/ai/       # AI processing modules
packages/search/   # Search infrastructure
packages/shared/   # Shared utilities
supabase/          # Supabase configuration, migrations, edge functions
```

## Features

- VIN-centric workspace architecture
- AI-powered OCR and information extraction
- Knowledge graph with interconnected entities
- Multi-modal search (full-text, fuzzy, semantic)
- Order workflow with configurable stages
- Bilingual support (Arabic RTL / English LTR)
- Dark/Light mode
- Real-time updates via Supabase Realtime
