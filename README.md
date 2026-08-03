# Automotive Parts Knowledge Management Platform

An AI-powered, VIN-centric web application for automotive spare parts importers.

## Status

### Phases Completed
- ✅ **Phase 1**: Foundation — Next.js, Supabase, Auth, DB migrations, RLS (130 files)
- ✅ **Phase 2**: VIN & Vehicle Core — VIN decode, workspace, parts CRUD (26 files)
- ✅ **Phase 3**: Suppliers, Customers & Orders — Management and workflow (26 files)
- ✅ **Phase 4**: Conversations & AI Engine — OCR, extraction, vision, embeddings (16 files)
- ✅ **Phase 5**: Search & Intelligence — FTS, trigram, vector, hybrid search (16 files)
- 🔄 **Phase 6**: Polish & Production — In progress

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| AI | Tesseract.js, GPT-4 Vision, Claude, OpenAI Embeddings |
| Search | PostgreSQL FTS + pg_trgm + pgvector |
| Deployment | Vercel (frontend), Supabase (backend) |

## Project Structure

```
automotive-parts-kms/
├── apps/web/                    # Next.js frontend
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utilities and clients
│   ├── types/                   # TypeScript types
│   └── styles/                  # CSS files
├── supabase/
│   ├── migrations/              # SQL migrations (18 files)
│   └── functions/               # Edge functions (6 functions)
├── docker-compose.yml
└── README.md
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
- Drag-and-drop interface
- Bulk editing
- Saved views
- Keyboard shortcuts
- Error boundaries
- Loading skeletons
