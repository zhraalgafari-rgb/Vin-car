# Completion Plan: Remaining Requirements

Based on the audit report, the following requirements are partially implemented or missing.
This plan covers all gaps identified.

---

## Phase A: AI Pipeline Wiring (Week 1-2)

### A1. Connect AI Functions to Real APIs
- [ ] Update `ai-ocr` function to use Tesseract.js with proper Arabic+English language packs
- [ ] Update `ai-extract` function to call OpenAI/Claude API for structured extraction
- [ ] Update `ai-vision` function to call GPT-4 Vision API for image analysis
- [ ] Update `ai-embed` function to call OpenAI embeddings API
- [ ] Add API key management via Supabase Vault or environment variables
- [ ] Add rate limiting and retry logic to all AI functions
- [ ] Add error handling and fallback for AI API failures

### A2. Wire AI Pipeline to Upload Flow
- [ ] Update `ai-process-upload` to call OCR → Extract → Vision → Embed in sequence
- [ ] Add job queue pattern for long-running AI tasks
- [ ] Add progress tracking via `knowledge_entries` or a dedicated `ai_jobs` table
- [ ] Add webhook/callback mechanism to notify frontend when AI processing completes
- [ ] Store AI processing results back to the correct tables (parts, oem_numbers, etc.)

### A3. Implement AI Recommendation Engine
- [ ] Create `ai-recommend` edge function
- [ ] Implement supplier recommendation based on:
  - Historical quote accuracy
  - Response time
  - Reliability score
  - Part category match
- [ ] Implement vehicle recommendation based on:
  - Compatible parts overlap
  - Historical order patterns
  - Customer preferences
- [ ] Implement alternative OEM number suggestion based on:
  - Part category similarity
  - Brand equivalence
  - Dimensional matching
- [ ] Create recommendation UI component

---

## Phase B: Voice & Speech (Week 2-3)

### B1. Voice Message Transcription
- [ ] Add Whisper API integration to `ai-ocr` function
- [ ] Create `ai-transcribe` edge function for voice messages
- [ ] Support Arabic and English speech-to-text
- [ ] Add voice message upload handling in `ai-process-upload`
- [ ] Store transcription in `messages.ocr_extracted_text`
- [ ] Add audio player component for voice messages

### B2. Voice Message Processing
- [ ] Extract entities from voice transcriptions (VIN, OEM, part names)
- [ ] Auto-classify voice messages by intent (request, quote, follow-up)
- [ ] Link voice messages to appropriate VIN/part/supplier

---

## Phase C: Email Notifications (Week 3)

### C1. Email Delivery System
- [ ] Set up email service (Resend, SendGrid, or AWS SES)
- [ ] Create `send-notification` edge function
- [ ] Implement email templates for:
  - Supplier overdue reminders
  - Quotation delay alerts
  - Customer waiting notifications
  - Follow-up reminders
  - Shipment arrival notifications
  - AI extraction completion
- [ ] Add email preference management in user settings
- [ ] Add email digest (daily/weekly summary)

### C2. Push Notifications
- [ ] Implement web push notification support
- [ ] Add service worker for push notifications
- [ ] Add notification permission management

---

## Phase D: Pre-populated Parts Database (Week 3-4)

### D1. Parts Seed Data
- [ ] Create seed migration with 500+ pre-populated parts
- [ ] Include all categories from the prompt:
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
- [ ] Add common OEM numbers for each part
- [ ] Add compatible vehicle VINs for popular models
- [ ] Add supplier associations for common parts

### D2. Parts Search Optimization
- [ ] Add full-text search index on seed data
- [ ] Add vector embeddings for all seed parts
- [ ] Verify search works across all seeded parts

---

## Phase E: Configurable Workflow UI (Week 4)

### E1. Workflow Configuration
- [ ] Create workflow settings page in `/dashboard/settings/workflow`
- [ ] Add UI to configure order stages (add/remove/reorder)
- [ ] Add UI to configure auto-transitions (status → status after X time)
- [ ] Add UI to configure notification triggers per stage
- [ ] Store workflow configuration in `settings` table
- [ ] Add validation to prevent invalid stage configurations

### E2. Auto-Transitions
- [ ] Implement background job that checks for pending auto-transitions
- [ ] Update order status automatically when conditions are met
- [ ] Log auto-transitions in `audit_logs`
- [ ] Add toggle to enable/disable auto-transitions per workflow

---

## Phase F: Background Jobs & Scheduler (Week 4-5)

### F1. Job Scheduler
- [ ] Set up cron scheduler (Supabase Cron or external like Cronitor)
- [ ] Schedule `ai-schedule` function to run every hour
- [ ] Implement scheduled tasks:
  - Re-embed new content
  - Update supplier reliability scores
  - Generate knowledge summaries per VIN
  - Prune stale data
  - Check for overdue notifications
  - Send email digests

### F2. Background Processing
- [ ] Implement job queue for AI processing
- [ ] Add `ai_jobs` table to track processing status
- [ ] Add retry logic for failed AI tasks
- [ ] Add job priority system

---

## Phase G: Image Similarity Integration (Week 5)

### G1. Full Image Search Pipeline
- [ ] Generate CLIP embeddings for all uploaded part images
- [ ] Store image embeddings in `knowledge_entries` or dedicated table
- [ ] Implement image similarity search API
- [ ] Connect `image-similarity.tsx` component to real search API
- [ ] Add "Find Similar Parts" button in parts detail view
- [ ] Display similarity results with confidence scores

### G2. Visual Search UI
- [ ] Add drag-and-drop image search to global search page
- [ ] Add image preview in search results
- [ ] Add visual similarity score visualization

---

## Phase H: Performance Optimization (Week 5-6)

### H1. Lazy Loading & Code Splitting
- [ ] Implement dynamic imports for heavy components (VIN workspace, knowledge graph)
- [ ] Add Suspense boundaries for async data loading
- [ ] Implement virtual scrolling for large tables (1000+ rows)
- [ ] Add pagination to all data tables
- [ ] Implement infinite scroll for conversation messages

### H2. Caching
- [ ] Add Redis caching for frequent queries (VIN lookups, part searches)
- [ ] Implement client-side caching with React Query stale-while-revalidate
- [ ] Add CDN caching for static assets
- [ ] Add API response caching for search results

### H3. Database Optimization
- [ ] Add composite indexes for common query patterns
- [ ] Implement connection pooling
- [ ] Add query result caching
- [ ] Optimize RLS policies for performance

---

## Phase I: Additional Missing Features (Week 6-7)

### I1. Configurable Workflow UI
- [ ] Workflow settings page (covered in Phase E)

### I2. Advanced Analytics Dashboard
- [ ] Add analytics page showing:
  - Orders by status (pie chart)
  - Supplier performance over time (line chart)
  - Parts by category (bar chart)
  - VINs by market (map visualization)
  - Response time metrics
  - AI processing accuracy metrics

### I3. Export & Import
- [ ] CSV/Excel export for all entities
- [ ] CSV/Excel import for bulk data loading
- [ ] JSON export for knowledge base backup
- [ ] Import from existing systems (CSV mapping)

### I4. Multi-language Support Enhancement
- [ ] Add more Arabic translations
- [ ] Add RTL support for all new components
- [ ] Add language switcher in header
- [ ] Add date/time localization

### I5. Advanced Permissions
- [ ] Role-based access control (Admin, Manager, User, Viewer)
- [ ] Per-VIN sharing permissions
- [ ] Per-part visibility controls
- [ ] Audit trail for permission changes

### I6. Integration Webhooks
- [ ] Add webhook configuration for external systems
- [ ] Trigger webhooks on order status changes
- [ ] Trigger webhooks on new VIN created
- [ ] Trigger webhooks on AI extraction completed

---

## Implementation Priority Order

### High Priority (Weeks 1-3)
1. AI Pipeline Wiring (A1, A2) — Core functionality
2. Pre-populated Parts Database (D1, D2) — Immediate value
3. Email Notifications (C1) — Critical for operations

### Medium Priority (Weeks 3-5)
4. Voice-to-Text (B1, B2) — Enhances input methods
5. Configurable Workflow UI (E1, E2) — Operational flexibility
6. Background Jobs (F1, F2) — Automation
7. Image Similarity Integration (G1, G2) — Search enhancement

### Lower Priority (Weeks 5-7)
8. AI Recommendation Engine (A3) — Intelligence layer
9. Performance Optimization (H1, H2, H3) — Scale preparation
10. Advanced Analytics (I2) — Business intelligence
11. Export/Import (I3) — Data portability
12. Multi-language Enhancement (I4) — UX polish
13. Advanced Permissions (I5) — Security
14. Integration Webhooks (I6) — Ecosystem

---

## Estimated Effort

| Phase | Weeks | Complexity |
|-------|-------|-----------|
| A: AI Pipeline Wiring | 2 | High |
| B: Voice & Speech | 1 | Medium |
| C: Email Notifications | 1 | Medium |
| D: Pre-populated Parts DB | 1 | Medium |
| E: Configurable Workflow UI | 1 | Medium |
| F: Background Jobs | 1 | High |
| G: Image Similarity | 1 | High |
| H: Performance Optimization | 1 | Medium |
| I: Additional Features | 2 | Low-Medium |
| **Total** | **~11 weeks** | |

