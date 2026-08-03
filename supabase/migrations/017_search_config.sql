CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Full-text search configuration for Arabic
CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS arabic (COPY = simple);
CREATE TEXT SEARCH DICTIONARY IF NOT EXISTS arabic_stem (
  TEMPLATE = snowball,
  Language = arabic
);
ALTER TEXT SEARCH CONFIGURATION arabic ALTER MAPPING FOR asciiword, asciihword, nword, hword_numpart, hword_part, word WITH arabic_stem;

-- Create combined search view for VIN records
CREATE OR REPLACE VIEW vin_search_view AS
SELECT
  id,
  vin,
  manufacturer,
  brand,
  model,
  production_year,
  market,
  engine_code,
  engine_size,
  fuel_type,
  transmission,
  drive_type,
  trim_level,
  body_style,
  country_of_origin,
  notes,
  setweight(to_tsvector('english', coalesce(manufacturer, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(brand, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(model, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(engine_code, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(market, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(vin, '')), 'C') AS document
FROM vin_records;

CREATE INDEX idx_vin_search_view_fts ON vin_search_view USING GIN (document);
CREATE INDEX idx_vin_search_view_trgm ON vin_records USING GIN (vin gin_trgm_ops);

-- Create combined search view for parts
CREATE OR REPLACE VIEW parts_search_view AS
SELECT
  id,
  arabic_name,
  english_name,
  oem_number,
  part_category,
  brands,
  alternative_oem_numbers,
  compatible_vehicles,
  notes,
  setweight(to_tsvector('arabic', coalesce(arabic_name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(english_name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(oem_number, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(part_category, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(notes, '')), 'C') AS document
FROM parts;

CREATE INDEX idx_parts_search_view_fts ON parts_search_view USING GIN (document);
CREATE INDEX idx_parts_oem_trgm ON parts USING GIN (oem_number gin_trgm_ops);
CREATE INDEX idx_parts_arabic_name_trgm ON parts USING GIN (arabic_name gin_trgm_ops);
CREATE INDEX idx_parts_english_name_trgm ON parts USING GIN (english_name gin_trgm_ops);
