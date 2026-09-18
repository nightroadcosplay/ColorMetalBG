-- tipuri_mapare: a name per language for each type.
--
-- size_type becomes size_type_ro, plus size_type_en / size_type_bg. The portal
-- keeps storing and matching on the RO text (nom_products.size_type, and "k" on
-- basket / favorites / offer rows); only the label on screen is translated,
-- looked up by that RO text. Deploy together with the matching backend and
-- frontend: the old TipuriController reads tipuri_mapare.size_type.
--
-- Run after insert-perforated-sheets.sql. If the category 17 UPDATE below
-- touches 0 rows (no perforated types in tipuri_mapare yet), press "sync" in
-- Admin > Tipuri and run this script again.
--
-- Safe to re-run; a re-run resets the category 17 names to the ones below.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'portal_color'
                  AND table_name = 'tipuri_mapare'
                  AND column_name = 'size_type') THEN
        ALTER TABLE portal_color.tipuri_mapare RENAME COLUMN size_type TO size_type_ro;
    END IF;
END $$;

ALTER TABLE portal_color.tipuri_mapare
    ADD COLUMN IF NOT EXISTS size_type_en varchar,
    ADD COLUMN IF NOT EXISTS size_type_bg varchar;

-- Perforated sheets (category 17). size_type_ro takes the products' wording
-- ("perforație"; tipuri_mapare had "gaură") so the lookup by RO text finds
-- them. The leading space on " RV8-12" is the products' own, and it keeps that
-- type in sort position 0, where its images are.
UPDATE portal_color.tipuri_mapare t
   SET size_type_ro = v.ro,
       size_type_en = v.en,
       size_type_bg = v.bg
  FROM (VALUES
    ('RV8-12,',  ' RV8-12, perforație rotundă de 8mm cu pas de 12mm',   'RV8-12, round perforation 8mm with 12mm pitch',    'RV8-12, кръгла перфорация 8 мм със стъпка 12 мм'),
    ('QG10-15,', 'QG10-15, perforație pătrată de 10mm, cu pas de 15mm', 'QG10-15, square perforation 10mm with 15mm pitch', 'QG10-15, квадратна перфорация 10 мм със стъпка 15 мм'),
    ('RV10-15,', 'RV10-15, perforație rotundă de 10mm cu pas de 15mm',  'RV10-15, round perforation 10mm with 15mm pitch',  'RV10-15, кръгла перфорация 10 мм със стъпка 15 мм'),
    ('RV3-5,',   'RV3-5, perforație rotundă de 3mm cu pas de 5mm',      'RV3-5, round perforation 3mm with 5mm pitch',      'RV3-5, кръгла перфорация 3 мм със стъпка 5 мм'),
    ('RV5-8,',   'RV5-8, perforație rotundă de 5mm cu pas de 8mm',      'RV5-8, round perforation 5mm with 8mm pitch',      'RV5-8, кръгла перфорация 5 мм със стъпка 8 мм')
  ) AS v(code, ro, en, bg)
 WHERE t.pid_category = 17
   AND btrim(t.size_type_ro) LIKE v.code || '%';

-- Titanium-zinc colours (categories 70, 71) are Elzinc trade names; the BG
-- product names keep them in English ("ЦВЯТ ELZINC SLATE"), so every language
-- shows the same name. Only fills rows nobody has named yet.
UPDATE portal_color.tipuri_mapare
   SET size_type_en = btrim(size_type_ro),
       size_type_bg = btrim(size_type_ro)
 WHERE pid_category IN (70, 71)
   AND size_type_en IS NULL
   AND size_type_bg IS NULL;

-- Check
SELECT type_id, '[' || size_type_ro || ']' AS size_type_ro, size_type_en, size_type_bg
  FROM portal_color.tipuri_mapare
 ORDER BY pid_category, type_id;
