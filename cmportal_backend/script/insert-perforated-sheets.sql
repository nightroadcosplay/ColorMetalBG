-- Aluminium perforated sheets (category 17 "TABLE AL PERFORATE") for BG.
-- Source: D:\ColorMetal\CMPortalBG\nom_products_RO_Perforate.csv (RO export, 13 rows).
--
-- Deliberate differences from the CSV:
--   * size_thickness / um1_to_um2: the CSV lost its decimal points
--     (100 = 1.00, 1640000 = 1.640000); restored here.
--   * Units follow the BG sheet convention (TABLE STRIATE / DIAMOND):
--     um1 = um_base = KG, um2 = БРОЙ, um1_to_um2 = kg per sheet.
--     Rows the CSV has no weight for get no um2 and are ordered in KG.
--   * 12310100100RB508054: RO stores 0.5618 sheets/kg, i.e. 1.78 kg per sheet.
--   * 123110100100RV101554: thickness 1.00, not RO's 1.50 - name, code and
--     weight all say 1.0 mm.
--   * additional_info = BG name, as on every other BG product.
--   * appid / pid come from their sequences; the RO ids are not reused.
--
-- size_type is copied byte-for-byte, leading space on " RV8-12" included.
-- Type images are looked up as tipuri_mapare type_id "17_<n>", n = the value's
-- sort position among the category's types; these values sort in the same
-- order as the existing 17_0..17_4 entries, so each type keeps its images.
--
-- Safe to re-run: a product_code that already exists is skipped.

INSERT INTO portal_color.nom_products
       (product_code, product_name_ro, pid_category,
        size_length, size_width, size_thickness, size_type,
        um1, um2, um1_to_um2, um_base,
        product_name_en, product_name_bg, additional_info,
        is_active, cu_debitare)
SELECT v.product_code, v.product_name_ro, '{17}',
       v.size_length, v.size_width, v.size_thickness, v.size_type,
       'KG', v.um2, v.um1_to_um2, 'KG',
       v.product_name_en, v.product_name_bg, v.product_name_bg,
       'y', 'n'
FROM (VALUES
  ('12310100100QG101554', 'TABLA AL PERFORATA QG10-15 1X1000X1000 MM', 1000, 1000, 1.00, 'QG10-15, perforație pătrată de 10mm, cu pas de 15mm', '', 0.000000, 'PERFORATED SHEETS  AL1050 H24 QG 10-15 1,0X1000X1000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 QG 10-15 1,0X1000X1000MM'),
  ('12310100100RB508054', 'TABLA AL PERFORATA  RV5-8 1X1000X1000 MM', 1000, 1000, 1.00, 'RV5-8, perforație rotundă de 5mm cu pas de 8mm', 'БРОЙ', 1.780000, 'PERFORATED SHEETS  AL1050 H24 RV 5-8  1,0X1000X1000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV 5-8  1,0X1000X1000MM'),
  ('123110100100RV101554', 'TABLA AL PERFORATA RV 10-15 1X1000X1000 MM', 1000, 1000, 1.00, 'RV10-15, perforație rotundă de 10mm cu pas de 15mm', 'БРОЙ', 1.640000, 'PERFORATED SHEETS  AL1050 H24 RV 10-15  1,0X1000X1000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV 10-15  1,0X1000X1000MM'),
  ('123110100100RV305054', 'TABLA AL PERFORATA RV3-5 1X1000X1000 MM', 1000, 1000, 1.00, 'RV3-5, perforație rotundă de 3mm cu pas de 5mm', 'БРОЙ', 1.860000, 'PERFORATED SHEETS  AL1050 H24 RV 3-5  1,0X1000X1000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV 3-5  1,0X1000X1000MM'),
  ('123110100100RV801254', 'TABLA AL PERFORATA RV 8-12 1X1000X1000 MM', 1000, 1000, 1.00, ' RV8-12, perforație rotundă de 8mm cu pas de 12mm', 'БРОЙ', 1.640000, 'PERFORATED SHEETS  AL1050 H24 RV 8-12  1,0X1000X1000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV 8-12  1,0X1000X1000MM'),
  ('123110100200QG101554', 'TABLA AL PERFORATA 1050 H24 QG10-15 1x1000X2000 MM', 2000, 1000, 1.00, 'QG10-15, perforație pătrată de 10mm, cu pas de 15mm', 'БРОЙ', 3.060000, 'PERFORATED SHEETS  AL1050 H24 QG 10-15 1,0X1000X2000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 QG 10-15 1,0X1000X2000MM'),
  ('123110100200RV305054', 'TABLA AL PERFORATA 1050 H24 RV3-5 1X1000X2000 MM', 2000, 1000, 1.00, 'RV3-5, perforație rotundă de 3mm cu pas de 5mm', '', 0.000000, 'PERFORATED SHEETS  AL1050 H24 RV 3-5  1,0X1000X2000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV 3-5  1,0X1000X2000MM'),
  ('123110100200RV508054', 'TABLA AL PERFORATA 1050 H24 RV 5-8 1X1000X2000 MM', 2000, 1000, 1.00, 'RV5-8, perforație rotundă de 5mm cu pas de 8mm', '', 0.000000, 'PERFORATED SHEETS  AL1050 H24 RV 5-8  1,0X1000X2000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV 5-8  1,0X1000X2000MM'),
  ('123110100200RV801254', 'TABLA AL PERFORATA 1050 H24 RV8-12  1x1000X2000 MM', 2000, 1000, 1.00, ' RV8-12, perforație rotundă de 8mm cu pas de 12mm', '', 0.000000, 'PERFORATED SHEETS  AL1050 H24 RV 8-12  1,0X1000X2000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV 8-12  1,0X1000X2000MM'),
  ('123110150200RV305054', 'TABLA AL PERFORATA 1050 H24  RV3-5 1.5X1000X2000MM', 2000, 1000, 1.50, 'RV3-5, perforație rotundă de 3mm cu pas de 5mm', 'БРОЙ', 5.560000, 'PERFORATED SHEETS  AL1050 H24 RV 3-5  1,5X1000X2000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV 3-5  1,5X1000X2000MM'),
  ('123115100200QG101554', 'TABLA AL PERFORATA 1050 H24  QG10-15 1.5x1000X2000MM', 2000, 1000, 1.50, 'QG10-15, perforație pătrată de 10mm, cu pas de 15mm', '', 0.000000, 'PERFORATED SHEETS  AL1050 H24 QG 10-15 1,5X1000X2000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 QG 10-15 1,5X1000X2000MM'),
  ('123115100200RV801254', 'TABLA AL PERFORATA 1050 H24 RV8-12 1.5x1000X2000MM', 2000, 1000, 1.50, ' RV8-12, perforație rotundă de 8mm cu pas de 12mm', '', 0.000000, 'PERFORATED SHEETS AL1050 H24 RV  8-12 1,5X1000X2000MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV  8-12 1,5X1000X2000MM'),
  ('123120100200RV508054', 'TABLA AL PERFORATA 1050 H24 RV5-8 2x1000X2000MM', 2000, 1000, 2.00, 'RV5-8, perforație rotundă de 5mm cu pas de 8mm', '', 0.000000, 'PERFORATED SHEETS  AL1050 H24 RV5-8 2X1000X2000 MM', 'АЛ. ПЕРФОРИРАНА ЛАМАРИНА 1050 H24 RV5-8 2X1000X2000 MM')
) AS v(product_code, product_name_ro, size_length, size_width, size_thickness,
       size_type, um2, um1_to_um2, product_name_en, product_name_bg)
WHERE NOT EXISTS (SELECT 1 FROM portal_color.nom_products np
                  WHERE np.product_code = v.product_code);

-- Check: expect 13 rows.
SELECT pid, product_code, size_length, size_width, size_thickness, size_type,
       um1, um2, um1_to_um2, product_name_bg
  FROM portal_color.nom_products
 WHERE pid_category = '{17}'
 ORDER BY size_thickness, size_length, size_type;
