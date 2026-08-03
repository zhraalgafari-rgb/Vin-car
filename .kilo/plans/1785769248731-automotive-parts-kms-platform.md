# Automotive Parts Knowledge Management Platform

## Overview

An AI-powered, VIN-centric web application for automotive spare parts importers. Every VIN becomes a permanent digital knowledge record that grows continuously. The platform ingests unstructured data (images, PDFs, WhatsApp screenshots, voice, text), extracts structured information via AI, and stores it in a richly connected knowledge graph backed by PostgreSQL.

---

## Architecture

### High-Level

```
Frontend (Next.js) -> Supabase (PostgreSQL + Edge Functions + Storage) -> AI Layer (OCR, Vision, LLM, Embeddings)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Edge Functions | Deno/TypeScript (Supabase Functions) |
| Database | PostgreSQL 16+ with pg_trgm, vector (pgvector), Full-Text Search |
| AI / OCR | Tesseract.js (client-side), EasyOCR (Edge Function), GPT-4 Vision, Claude |
| Embeddings | OpenAI text-embedding-3-large |
| Search | PostgreSQL FTS + pg_trgm + vector cosine similarity |
| Auth | Supabase Auth (email, OAuth, magic link) |
| Deployment | Supabase (backend), Vercel (frontend) |

---

## Database Schema

### Core Tables

#### profiles
- id uuid PK -> auth.users
- email text
- display_name text
- role enum: admin, manager, user
- avatar_url text
- created_at timestamptz
- updated_at timestamptz

#### vin_records (central entity)
- id uuid PK default gen_random_uuid()
- vin text NOT NULL UNIQUE
- manufacturer text
- brand text
- model text
- production_year int
- market text (GCC, USA, Europe, etc.)
- engine_code text
- engine_size text
- fuel_type text
- transmission text
- drive_type text (2WD / AWD / 4WD)
- trim_level text
- body_style text
- country_of_origin text
- additional_specs jsonb
- decoded_data jsonb (raw VIN decode response)
- images text[] (Supabase storage paths)
- notes text
- created_by uuid -> profiles.id
- created_at timestamptz
- updated_at timestamptz

Indexes: vin (unique), GIN on additional_specs, Full-text on concatenated fields

#### vehicles (decoded vehicle data, linked to VIN)
- id uuid PK
- vin_id uuid -> vin_records.id (1:1)
- make text
- model text
- year int
- engine text
- plant text
- body_type text
- market text
- specifications jsonb
- created_at timestamptz

#### parts
- id uuid PK
- vin_id uuid -> vin_records.id (FK, nullable)
- arabic_name text
- english_name text
- part_category text (CV Joint, Brake Disc, etc.)
- oem_number text
- alternative_oem_numbers text[]
- dimensions jsonb {length, width, height, unit}
- weight jsonb {value, unit}
- compatible_vehicles text[] (VINs or model strings)
- equivalent_parts jsonb [{oem, supplier, notes}]
- brands text[]
- notes text
- attachments text[] (storage paths)
- quantity int
- status enum: in_stock, out_of_stock, ordered, discontinued
- images text[] (storage paths)
- created_by uuid -> profiles.id
- created_at timestamptz
- updated_at timestamptz

Indexes: Full-text on arabic_name, english_name, oem_number; GIN on alternative_oem_numbers, brands, compatible_vehicles

#### oem_numbers
- id uuid PK
- part_id uuid -> parts.id (FK)
- oem_number text NOT NULL
- source text (manual, OCR, AI extracted)
- confidence float (0-1)
- created_at timestamptz

Unique on (part_id, oem_number)

#### suppliers
- id uuid PK
- name text NOT NULL
- contact_name text
- email text
- phone text
- whatsapp text
- country text
- city text
- address text
- notes text
- reliability_score float (0-1)
- performance_rating float (0-5)
- created_by uuid -> profiles.id
- created_at timestamptz
- updated_at timestamptz

#### supplier_quotes (per-part supplier quotations)
- id uuid PK
- part_id uuid -> parts.id (FK)
- supplier_id uuid -> suppliers.id (FK)
- quoted_price decimal
- currency text (USD, CNY, etc.)
- moq int
- production_time_days int
- shipping_time_days int
- last_followup timestamptz
- reply_status enum: pending, replied, no_response, overdue
- notes text
- created_at timestamptz
- updated_at timestamptz

#### customers
- id uuid PK
- name text NOT NULL
- company text
- email text
- phone text
- whatsapp text
- country text
- customer_type enum: wholesaler, dealer, retail, other
- notes text
- created_by uuid -> profiles.id
- created_at timestamptz
- updated_at timestamptz

#### orders (request workflow)
- id uuid PK
- order_number text UNIQUE
- vin_id uuid -> vin_records.id (FK)
- part_id uuid -> parts.id (FK)
- customer_id uuid -> customers.id (FK)
- supplier_id uuid -> suppliers.id (FK)
- status enum (configurable):
  new_request, under_review, ai_analysis_completed, sent_to_supplier,
  waiting_for_supplier_response, quotation_received, price_approved,
  purchase_confirmed, production, shipping, arrived, delivered,
  completed, cancelled
- status_history jsonb [{status, timestamp, notes}]
- priority enum: low, normal, high, urgent
- notes text
- created_by uuid -> profiles.id
- created_at timestamptz
- updated_at timestamptz

Indexes: status, vin_id, part_id, customer_id, updated_at

#### documents
- id uuid PK
- vin_id uuid -> vin_records.id (FK, nullable)
- part_id uuid -> parts.id (FK, nullable)
- order_id uuid -> orders.id (FK, nullable)
- file_name text
- file_path text (Supabase storage path)
- file_type enum: pdf, excel, word, image, zip, catalog, invoice, shipping_doc
- file_size bigint
- mime_type text
- ocr_text text (extracted OCR content)
- ocr_confidence float
- metadata jsonb
- uploaded_by uuid -> profiles.id
- created_at timestamptz

#### conversations
- id uuid PK
- vin_id uuid -> vin_records.id (FK, nullable)
- part_id uuid -> parts.id (FK, nullable)
- supplier_id uuid -> suppliers.id (FK, nullable)
- customer_id uuid -> customers.id (FK, nullable)
- channel enum: whatsapp, telegram, email, voice, internal_note
- title text
- participants uuid[] -> profiles.id
- metadata jsonb (e.g., WhatsApp chat ID, email thread ID)
- created_by uuid -> profiles.id
- created_at timestamptz

#### messages
- id uuid PK
- conversation_id uuid -> conversations.id (FK)
- sender text (phone, email, or profile name)
- sender_type enum: customer, supplier, internal, system
- content text (message body)
- content_type enum: text, image, voice, document, location
- media_path text (Supabase storage path for voice/images)
- timestamp timestamptz (message send time)
- ocr_extracted_text text (if media)
- ai_summary text
- ai_entities jsonb (extracted OEM numbers, VINs, part names)
- created_at timestamptz

Indexes: conversation_id, timestamp, GIN on ai_entities

#### knowledge_entries (accumulated business knowledge)
- id uuid PK
- title text
- content text
- source_type enum: ocr, ai_extraction, manual, conversation, document
- source_id uuid (generic reference to originating record)
- source_table text (e.g., messages, documents, parts)
- entities jsonb {vins: [], parts: [], oem_numbers: [], suppliers: [], customers: []}
- embedding vector(1536) (for semantic search)
- confidence float
- created_at timestamptz

Indexes: GIN on entities, HNSW on embedding

#### audit_logs
- id uuid PK
- user_id uuid -> profiles.id
- action text (e.g., vin_created, part_updated, order_status_changed)
- entity_type text
- entity_id uuid
- changes jsonb (old vs new values)
- ip_address text
- created_at timestamptz

#### notifications
- id uuid PK
- user_id uuid -> profiles.id
- type enum: supplier_overdue, quotation_delayed, customer_waiting, followup_due, shipment_arrived, task_required, system
- title text
- message text
- reference_type text (e.g., order, vin, supplier)
- reference_id uuid
- read boolean default false
- created_at timestamptz

#### tags (for categorization)
- id uuid PK
- name text
- color text
- created_by uuid -> profiles.id
- created_at timestamptz

#### entity_tags (many-to-many tagging)
- id uuid PK
- tag_id uuid -> tags.id
- entity_type text (vin, part, supplier, customer, order, document)
- entity_id uuid
- created_at timestamptz

#### knowledge_graph_edges (explicit graph relationships)
- id uuid PK
- from_entity_type text (vin, part, supplier, customer, document, conversation)
- from_entity_id uuid
- to_entity_type text
- to_entity_id uuid
- relationship_type text (contains_part, quoted_by, requested_by, compatible_with, alternative_to, same_vehicle)
- confidence float
- created_at timestamptz

Indexes: (from_entity_type, from_entity_id), (to_entity_type, to_entity_id), relationship_type

#### saved_views (user-customizable filters)
- id uuid PK
- user_id uuid -> profiles.id
- name text
- entity_type text
- filters jsonb
- sort jsonb
- created_at timestamptz

#### settings (configurable platform settings)
- id uuid PK
- key text UNIQUE
- value jsonb
- description text
- updated_at timestamptz

---

## Row Level Security (RLS)

All tables have RLS enabled. Policies:

- profiles: Users can read their own profile; admins can read all.
- vin_records: Users can read VINs they created or that are shared with them. Admins read all.
- parts: Inherited from parent VIN visibility.
- suppliers: Users can read suppliers they created. Admins read all.
- orders: Users can read orders linked to their VINs or customers.
- documents: Inherited from parent entity visibility.
- conversations/messages: Participants only.
- knowledge_entries: All authenticated users can read.
- notifications: Users can only read their own.
- audit_logs: Admins only.

---

## AI Engine Architecture

### Processing Pipeline

```
Upload -> File Type Detection -> Route to Processor -> Extract -> Enrich -> Store -> Index
```

### Edge Functions

1. ai-process-upload — Main entry point for file uploads
   - Detects file type (image, PDF, Excel, ZIP, audio, text)
   - Routes to appropriate processor
   - Stores raw file in Supabase Storage
   - Triggers AI processing chain

2. ai-ocr — OCR processing
   - Uses Tesseract.js or EasyOCR for images
   - Uses pdf-ocr for PDF documents
   - Extracts text with bounding box coordinates
   - Stores OCR text in documents.ocr_text
   - Returns structured text for LLM processing

3. ai-extract — Information extraction via LLM
   - Takes OCR text or raw text
   - Prompts LLM to extract: VIN numbers, OEM numbers, part names (Arabic + English), dimensions, weights, compatible vehicles, supplier quotes (prices, MOQ, lead times), customer info
   - Returns structured JSON
   - Creates/updates parts, oem_numbers, vin_records, suppliers

4. ai-vision — Image understanding via GPT-4 Vision / Claude
   - Analyzes part images
   - Identifies part type, brand, OEM markings
   - Extracts dimensions from images with reference objects
   - Classifies parts into categories
   - Detects damage/condition

5. ai-embed — Embedding generation
   - Generates embeddings for all text content (OCR, notes, descriptions)
   - Stores in knowledge_entries.embedding using pgvector
   - Batch processes for existing records on schedule

6. ai-similarity — Image similarity search
   - Generates image embeddings using CLIP or similar model
   - Stores in vector column for image similarity queries
   - Enables find similar parts functionality

7. ai-link — Knowledge graph linking
   - Links extracted entities to existing records
   - Detects duplicates (same OEM number, same VIN)
   - Creates knowledge_graph_edges
   - Updates knowledge_entries.entities

8. ai-schedule — Periodic AI tasks
   - Re-embeds new content
   - Updates supplier reliability scores
   - Generates knowledge summaries per VIN
   - Prunes stale data

### AI Prompt Templates

Each extraction task uses a structured prompt template:
- VIN decode prompt
- Part extraction prompt (Arabic/English bilingual)
- Quote extraction prompt
- Image classification prompt
- Duplicate detection prompt

---

## Search Infrastructure

### Search Architecture (3 layers)

#### Layer 1: PostgreSQL Full-Text Search
- GIN indexes on vin_records (concatenated fields), parts (arabic_name, english_name, oem_number), suppliers (name), customers (name, phone)
- Uses tsvector with pg_catalog.english and Arabic dictionary
- Configuration: ALTER TABLE ... ALTER COLUMN ... SET STATISTICS 1000;

#### Layer 2: pg_trgm Fuzzy Search
- GIN/GiST indexes on parts.arabic_name, parts.english_name, parts.oem_number, vin_records.vin
- Supports typo-tolerant search: SELECT ... WHERE name % search_term
- Similarity threshold: 0.3 (configurable)

#### Layer 3: Vector Semantic Search
- pgvector HNSW index on knowledge_entries.embedding (1536 dimensions)
- Also on parts for part description embeddings
- Cosine similarity search via embedding <=> query_embedding
- Hybrid search: combine FTS + vector + trigram scores with weighted ranking

### Search Query Flow

```
User Query -> Intent Classification (LLM) -> Route to Search Layer(s)
  -> Merge Results -> Re-rank -> Return
```

1. Intent Classification: LLM classifies query type (VIN lookup, part search, supplier search, customer search, natural language)
2. Multi-Vector Search: Runs FTS + trigram + vector simultaneously
3. Result Merging: Scores normalized and combined with weights:
   - Exact VIN match: weight 1.0
   - Exact OEM match: weight 0.9
   - Vector similarity: weight 0.7
   - Trigram fuzzy: weight 0.5
   - FTS rank: weight 0.6
4. Re-ranking: LLM re-ranks top 50 results for relevance
5. Caching: Search results cached for 5 minutes

### Searchable Fields

| Field | FTS | Trigram | Vector |
|-------|-----|---------|--------|
| VIN | Yes | Yes | - |
| OEM Number | Yes | Yes | - |
| Part Name (EN) | Yes | Yes | Yes |
| Part Name (AR) | Yes | Yes | Yes |
| Supplier Name | Yes | Yes | - |
| Customer Name | Yes | Yes | - |
| Phone | - | Yes | - |
| Document Content | Yes | - | - |
| OCR Text | Yes | - | Yes |
| Notes | Yes | Yes | Yes |
| Dimensions | - | - | Yes |
| Order Number | Yes | Yes | - |

---

## Frontend Architecture

### Project Structure

```
apps/web/
  app/
    layout.tsx                 # Root layout with providers
    page.tsx                   # Dashboard/home
    loading.tsx                # Loading states
    error.tsx                  # Error boundary
    (auth)/
      login/
      register/
    (dashboard)/
      layout.tsx               # Dashboard shell with sidebar
      page.tsx                 # Dashboard home
      vins/
        page.tsx               # VIN list with search/filters
        [vin]/
          page.tsx             # VIN workspace
          parts/
            page.tsx           # Parts list
            [partId]/
              page.tsx         # Part detail
          suppliers/
            page.tsx
            [supplierId]/
              page.tsx
          customers/
            page.tsx
            [customerId]/
              page.tsx
          documents/
            page.tsx
          conversations/
            page.tsx
          orders/
            page.tsx
          notes/
            page.tsx
      parts/
        page.tsx               # Global parts library
        [partId]/
          page.tsx
      suppliers/
        page.tsx
        [supplierId]/
          page.tsx
      customers/
        page.tsx
        [customerId]/
          page.tsx
      orders/
        page.tsx
        [orderId]/
          page.tsx
      search/
        page.tsx               # Global search
      knowledge/
        page.tsx               # Knowledge graph view
      notifications/
        page.tsx
      settings/
        page.tsx
    api/
      search/
        route.ts               # Search API route
      ai/
        route.ts               # AI processing API
      upload/
        route.ts               # File upload API
  components/
    ui/                        # shadcn/ui base components
    layout/
      sidebar.tsx
      header.tsx
      shell.tsx
    vins/
      vin-card.tsx
      vin-workspace.tsx
      vehicle-info.tsx
      parts-list.tsx
      supplier-list.tsx
      customer-list.tsx
      document-list.tsx
      conversation-list.tsx
      order-timeline.tsx
    parts/
      part-card.tsx
      part-form.tsx
      part-detail.tsx
      oem-lookup.tsx
      part-image.tsx
    suppliers/
      supplier-card.tsx
      supplier-form.tsx
      quote-table.tsx
      reliability-score.tsx
    customers/
      customer-card.tsx
      customer-form.tsx
    orders/
      order-card.tsx
      order-workflow.tsx
      status-badge.tsx
    search/
      search-bar.tsx
      search-results.tsx
      search-filters.tsx
    knowledge/
      knowledge-graph.tsx
      entity-link.tsx
    notifications/
      notification-bell.tsx
      notification-list.tsx
    upload/
      upload-zone.tsx
      file-preview.tsx
    tables/
      data-table.tsx
      columns.tsx
      bulk-actions.tsx
    common/
      avatar.tsx
      badge.tsx
      dialog.tsx
      dropdown-menu.tsx
      input.tsx
      select.tsx
      tabs.tsx
      toast.tsx
      skeleton.tsx
  hooks/
    use-vin.ts
    use-parts.ts
    use-suppliers.ts
    use-customers.ts
    use-orders.ts
    use-search.ts
    use-notifications.ts
    use-upload.ts
    use-realtime.ts
    use-i18n.ts
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    ai/
      ocr.ts
      extract.ts
      vision.ts
      embed.ts
      prompts.ts
    search/
      fts.ts
      trigram.ts
      vector.ts
      hybrid.ts
    utils.ts
    constants.ts
    validators.ts
  types/
    database.ts              # Generated from Supabase
    vin.ts
    part.ts
    supplier.ts
    customer.ts
    order.ts
    document.ts
    conversation.ts
    message.ts
    knowledge.ts
    search.ts
  styles/
    globals.css
    rtl.css
    themes.css
  middleware.ts
  next.config.js
```

### UI Design System

- shadcn/ui components as base
- Tailwind CSS for styling with CSS custom properties for theming
- Dark Mode: CSS class-based toggle, persisted in localStorage
- RTL Support: dir=rtl on HTML element, mirrored layout, Arabic font (Noto Sans Arabic)
- Responsive: Mobile-first with breakpoints for sm, md, lg, xl
- Keyboard Shortcuts: Global shortcuts (Ctrl+K for search, Ctrl+N for new, etc.)
- Drag-and-Drop: dnd-kit for reordering, file uploads
- Advanced Tables: Sortable, filterable, groupable, with column visibility toggle
- Bulk Editing: Multi-select with batch actions
- Saved Views: Custom filter/sort configurations per user

### Key Pages

1. Dashboard — Overview of recent VINs, pending orders, overdue follow-ups, stats
2. VIN Workspace — Central hub for a single VIN with tabbed modules
3. Global Search — Unified search across all entities
4. Parts Library — Browse and manage all parts with filters
5. Supplier Directory — Supplier list with reliability scores
6. Orders Board — Kanban-style workflow view
7. Knowledge Graph — Visual entity relationship graph
8. Notifications Center — All alerts and reminders

---

## Order Workflow

### Configurable Stages

```
new_request -> under_review -> ai_analysis_completed -> sent_to_supplier ->
waiting_for_supplier_response -> quotation_received -> price_approved ->
purchase_confirmed -> production -> shipping -> arrived -> delivered -> completed
```

cancelled can be reached from any stage.

### Status Tracking

Each status transition creates an entry in orders.status_history:
```json
[
  {"status": "new_request", "timestamp": "2026-01-15T10:00:00Z", "notes": "Customer requested via WhatsApp"},
  {"status": "under_review", "timestamp": "2026-01-15T10:05:00Z", "notes": "AI analysis started"},
  {"status": "ai_analysis_completed", "timestamp": "2026-01-15T10:30:00Z", "notes": "VIN decoded, parts identified"}
]
```

### Workflow Configuration

Stored in settings table as JSON:
```json
{
  "order_workflow": {
    "stages": ["new_request", "under_review", "..."],
    "transitions": {
      "new_request": ["under_review", "cancelled"],
      "under_review": ["ai_analysis_completed", "cancelled"],
      "..."
    },
    "auto_transitions": {
      "new_request": {"after_minutes": 5, "target": "under_review"},
      "ai_analysis_completed": {"after_hours": 1, "target": "sent_to_supplier"}
    }
  }
}
```

---

## Notification System

### Notification Triggers

| Trigger | Condition | Channel |
|---------|-----------|---------|
| Supplier overdue | No reply after 48h | In-app, Email |
| Quotation delayed | No quote after 7 days | In-app, Email |
| Customer waiting | No follow-up after 3 days | In-app |
| Follow-up due | Scheduled follow-up time reached | In-app, Email |
| Shipment arrived | Status changed to arrived | In-app, Email |
| Task required | Manual assignment | In-app |
| Duplicate VIN detected | Same VIN uploaded again | In-app |
| AI extraction completed | New parts found from upload | In-app |

### Notification Delivery

- In-app: Stored in notifications table, real-time via Supabase Realtime
- Email: Via Supabase Edge Function using Resend or SendGrid
- Push: Optional, via web push API

### Notification Preferences

Stored per user in profiles.settings JSONB:
```json
{
  "notifications": {
    "email": true,
    "in_app": true,
    "supplier_overdue": true,
    "quotation_delayed": true,
    "customer_waiting": true
  }
}
```

---

## Parts Knowledge Base

### Pre-populated Categories

The system includes a built-in parts taxonomy:

- Drivetrain: CV Joint, CV Boot, Wheel Hub, Hub Bearing, Differential
- Braking: Brake Disc, Brake Drum, Brake Pads, Brake Shoes, Brake Master Cylinder, Wheel Cylinder, Brake Booster
- Suspension: Control Arm, Control Arm Bushing, Ball Joint, Tie Rod End, Rack End, Stabilizer Link, Shock Absorber, Shock Mount
- Engine: Engine Mount, Transmission Mount, Alternator, Starter Motor, Water Pump, Fuel Pump, Oil Pump
- Cooling: Radiator, Condenser, Compressor
- Filtration: Air Filter, Oil Filter, Cabin Filter, Fuel Filter
- Sensors: Wheel Speed Sensor, MAF Sensor, Oxygen Sensor
- Clutch: Clutch Disc, Pressure Plate, Release Bearing
- Drive Train: Timing Belt, Serpentine Belt, Pulley
- Exterior: Mirror, Lighting Components
- And thousands more

### Knowledge Growth

- Every uploaded part becomes a searchable record
- OEM numbers are never forgotten (stored in oem_numbers with source tracking)
- Supplier relationships are preserved permanently
- Images become searchable via vector embeddings
- Customer requests for the same VIN auto-retrieve all history
- Duplicate detection prevents redundant entries

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-3)

- Initialize Next.js project with TypeScript, Tailwind CSS, shadcn/ui
- Set up Supabase project with Auth
- Create database migrations (all tables, indexes, RLS policies)
- Set up Supabase Storage buckets
- Implement authentication (login, register, logout)
- Create basic layout with sidebar, header, theme toggle
- Implement RTL support for Arabic
- Set up TypeScript types from Supabase schema

### Phase 2: VIN & Vehicle Core (Weeks 4-6)

- VIN input component with auto-decode (via external API like vinapi.io or vpic.nhtsa.dot.gov)
- VIN workspace page with all vehicle info modules
- Vehicle information display (tech specs, images, documents)
- Parts library CRUD for VIN workspace
- Part form with Arabic/English names, OEM numbers, dimensions, images
- Document upload and storage
- Basic search (VIN lookup, part name search)

### Phase 3: Suppliers, Customers & Orders (Weeks 7-9)

- Supplier management (CRUD, quotes, reliability scoring)
- Customer management (CRUD, history)
- Order workflow with configurable stages
- Order status timeline with timestamps
- Quote management (price, MOQ, production/shipping time)
- Basic notification system (in-app)

### Phase 4: Conversations & AI Engine (Weeks 10-13)

- Conversation module (WhatsApp, Telegram, Email, Voice, Internal Notes)
- Message CRUD with media attachments
- AI OCR pipeline (Tesseract.js for images, pdf-ocr for documents)
- AI extraction pipeline (LLM-based structured extraction)
- AI vision pipeline (part image classification)
- AI embedding pipeline (text and image embeddings)
- Knowledge graph edge creation

### Phase 5: Search & Intelligence (Weeks 14-16)

- PostgreSQL Full-Text Search implementation
- pg_trigram fuzzy search
- Vector semantic search with pgvector
- Hybrid search with weighted ranking
- Global search page
- AI-assisted natural language search
- Image similarity search
- Duplicate detection
- Knowledge graph visualization

### Phase 6: Polish & Production (Weeks 17-20)

- Notification system (email, in-app, preferences)
- Audit logging
- Saved views and bulk editing
- Advanced filters and saved searches
- Keyboard shortcuts
- Drag-and-drop interface
- Dark mode polish
- Performance optimization (lazy loading, code splitting)
- Background jobs for AI processing
- Error handling and edge cases
- Documentation and deployment

---

## Key Design Decisions

### 1. VIN as Central Entity
Every piece of data links back to a VIN. Even parts without a VIN can be linked to one later. The VIN workspace is the primary navigation entry point.

### 2. Supabase for Everything
Auth, database, storage, real-time, and edge functions all on one platform. Reduces operational complexity. RLS handles multi-tenancy.

### 3. PostgreSQL as Graph Database
Instead of using a separate graph database, we model relationships as foreign keys and a knowledge_graph_edges table. This keeps the stack simple while supporting graph-like queries.

### 4. AI as Edge Functions
All AI processing runs in Supabase Edge Functions (Deno/TypeScript). This keeps the frontend fast and the processing scalable. Long-running tasks use a job queue pattern with status polling.

### 5. Bilingual from Day One
Arabic (RTL) and English (LTR) are first-class citizens. All UI components support both directions. Part names are stored in both languages.

### 6. Knowledge Never Dies
Every piece of data is preserved. OCR text is stored even if the original document is deleted. Supplier quotes are never removed, only marked as inactive. The system accumulates value over time.

---

## Open Questions

1. VIN Decode API: Which external API to use? Options: vinapi.io, vpic.nhtsa.dot.gov (free but US-only), or self-hosted decoder.
2. LLM Provider: OpenAI GPT-4 or Anthropic Claude? Cost and quality tradeoffs.
3. Image Embeddings: Which model for CLIP-based image similarity? OpenAI CLIP or a self-hosted model?
4. Voice Message Transcription: Whisper API or self-hosted?
5. Real-time Updates: How much real-time functionality is needed? Supabase Realtime for all tables, or selective?
6. Multi-tenancy: Single Supabase project with RLS, or separate projects per tenant?
7. Deployment: Vercel for frontend, Supabase for backend — any additional infrastructure (Redis, Celery, etc.)?

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| AI processing costs | High | Implement usage quotas, batch processing, caching |
| OCR accuracy for Arabic | Medium | Use bilingual OCR models, human review workflow |
| VIN decode API rate limits | Medium | Cache decode results, use multiple APIs |
| Supabase RLS complexity | Medium | Start simple, add policies incrementally |
| Vector search performance | Medium | Use HNSW index, limit dimensions, batch queries |
| Data migration from existing systems | Low | CSV import tooling, idempotent ingestion |


---

## Repository Merge Status

The automotive-parts-kms project has been successfully merged into the main repository.

- **Merge commit**: `a512a2d` (Merge automotive-parts-kms project into main repository)
- **Remote**: `origin` → `https://github.com/zhraalgafari-rgb/Vin-car.git`
- **Branch**: `session/agent_4f73fe38-9d58-48dc-834f-73c939952a17`
- **Total files**: 421
- **All 6 phases**: Complete

The project is now part of the main repository and ready for deployment.
