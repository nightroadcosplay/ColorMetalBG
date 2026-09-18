-- nom_category_product.kg_from_um2: which categories enter their quantity in
-- um2, with the weight following from it.
--
-- The article shape the backend derives (BrowseArticleController::getArticle)
-- calls anything with a thickness and no diameter a "placa", which also catches
-- flat bars, L/T/U profiles and square/rectangular tubes - 193 active articles
-- that are not plates. The category attribute flags cannot tell them apart:
-- TABLE, BARE LATE and TEVI PATRATE all carry length+width+thickness. So the
-- distinction has to be declared per category, which is what this flag does.
--
-- Seeded for round bars and for plates/sheets/strips. Change it with a plain
-- UPDATE if a category is added or reclassified - no deploy needed.
--
-- Run once per environment (dev, then production).

BEGIN;

ALTER TABLE portal_color.nom_category_product
    ADD COLUMN IF NOT EXISTS kg_from_um2 character varying(1) DEFAULT 'n'::character varying;

UPDATE portal_color.nom_category_product SET kg_from_um2 = 'n' WHERE kg_from_um2 IS NULL;

-- round bars (BARE ROTUNDE) and plates / sheets / strips (PLACI, TABLE, BENZI)
UPDATE portal_color.nom_category_product
   SET kg_from_um2 = 'y'
 WHERE pid IN (7, 8, 36, 56, 13, 15, 25, 26, 27, 17, 19, 21, 22, 23, 54, 66, 67, 71, 18, 64, 70);

-- Deliberately left 'n': BARE LATE, BARE PATRATE/HEXAGONALE, PROFILE L/T/U,
-- PROFILE FATADA VENTILATA, TEVI PATRATE/RECTANGULARE/ROTUNDE.

-- Expose it on the rows the basket, request and offer screens read.
-- Appended as the last column so CREATE OR REPLACE is enough.
CREATE OR REPLACE VIEW portal_color.v_basket AS
SELECT b.appid,
    b.userid,
    np.pid_category,
    b.product_code,
    b.pid_product,
    np.product_name_ro,
    np.product_name_en,
    b.q_nr_buc,
    np.um1,
    np.um2,
    b.qum1,
    b.qum2,
    np.um1_to_um2,
    b.size_length,
    b.size_width,
    b.size_thickness,
    b.size_diameter,
    b.size_height,
    b.size_alloy,
    b.size_type,
    b.cu_debitare,
    b.size_length_cutting,
    b.size_width_cutting,
    b.track_date,
    np.um_base,
    np.is_active,
    u.cif,
    u.company_code,
    b.free_comments,
    b.nr_ord,
    b.tip_um,
    json_agg(json_build_object('pid_parent_category', ncp.parent_pid, 'pid_category', ncp.pid, 'category_name_ro', ncp.name_ro, 'category_name_en', ncp.name_en, 'with_length', ncp.with_length, 'with_width', ncp.with_width, 'with_thickness', ncp.with_thickness, 'with_diameter', ncp.with_diameter, 'with_height', ncp.with_height, 'with_alloy', ncp.with_alloy, 'with_type', ncp.with_type, 'with_roll_weight', ncp.with_roll_weight)) AS categories,
    np.product_name_bg,
    max(ncp.kg_from_um2) AS kg_from_um2
   FROM portal_color.basket b
     LEFT JOIN portal_color.nom_products np ON b.product_code::text = np.product_code::text
     LEFT JOIN portal_color.nom_category_product ncp ON ncp.pid = ANY (np.pid_category)
     LEFT JOIN portal_color.users u ON b.userid::text = u.userid::text
  GROUP BY b.appid, b.userid, np.pid_category, b.product_code, b.pid_product, np.product_name_ro, np.product_name_en, b.q_nr_buc, np.um1, np.um2, b.qum1, b.qum2, np.um1_to_um2, b.size_length, b.size_width, b.size_thickness, b.size_diameter, b.size_height, b.size_alloy, b.size_type, b.cu_debitare, b.size_length_cutting, b.size_width_cutting, b.track_date, np.um_base, np.is_active, u.cif, u.company_code, b.free_comments, b.nr_ord, b.tip_um, np.product_name_bg;

CREATE OR REPLACE VIEW portal_color.v_cerere_products AS
SELECT opfu.appid,
    opfu.id_offer,
    opfu.product_code,
    opfu.q_nr_buc,
    opfu.size_length,
    opfu.size_width,
    opfu.size_thickness,
    opfu.size_diameter,
    opfu.size_height,
    opfu.size_alloy,
    opfu.size_type,
    opfu.qum1,
    opfu.um1,
    opfu.qum2,
    opfu.um2,
    opfu.cu_debitare,
    opfu.size_length_cutting,
    opfu.size_width_cutting,
    opfu.observatii,
    np.pid AS pid_product,
    np.pid_category,
    np.product_name_ro,
    np.product_name_en,
    np.um_base,
    np.is_active,
    opfu.nr_ord,
    opfu.tip_um,
    json_agg(json_build_object('pid_parent_category', ncp.parent_pid, 'pid_category', ncp.pid, 'category_name_ro', ncp.name_ro, 'category_name_en', ncp.name_en, 'category_name_bg', ncp.name_bg, 'with_length', ncp.with_length, 'with_width', ncp.with_width, 'with_thickness', ncp.with_thickness, 'with_diameter', ncp.with_diameter, 'with_height', ncp.with_height, 'with_alloy', ncp.with_alloy, 'with_type', ncp.with_type, 'with_roll_weight', ncp.with_roll_weight)) AS categories,
    np.product_name_bg,
    np.um1_to_um2,
    max(ncp.kg_from_um2) AS kg_from_um2
   FROM portal_color.offer_products_from_user opfu
     LEFT JOIN portal_color.nom_products np ON opfu.product_code::text = np.product_code::text
     LEFT JOIN portal_color.nom_category_product ncp ON ncp.pid = ANY (np.pid_category)
  GROUP BY opfu.appid, opfu.id_offer, opfu.product_code, opfu.q_nr_buc, opfu.size_length, opfu.size_width, opfu.size_thickness, opfu.size_diameter, opfu.size_height, opfu.size_alloy, opfu.size_type, opfu.qum1, opfu.um1, opfu.qum2, opfu.um2, opfu.cu_debitare, opfu.size_length_cutting, opfu.size_width_cutting, opfu.observatii, np.pid, np.pid_category, np.product_name_ro, np.product_name_en, np.um_base, np.is_active, opfu.nr_ord, opfu.tip_um, np.um1_to_um2;

CREATE OR REPLACE VIEW portal_color.v_offer_products_from_cmsales AS
SELECT opfc.appid,
    opfc.id_offer,
    opfc.offer_slid,
    opfc.product_code,
    np.pid AS pid_product,
    np.pid_category,
    np.product_name_ro,
    np.product_name_en,
    np.size_length,
    np.size_width,
    np.size_thickness,
    np.size_diameter,
    np.size_height,
    np.size_alloy,
    np.size_type,
    opfc.status,
    1::numeric * opfc.q1 AS q1,
    opfc.um1,
    1::numeric * opfc.q2 AS q2,
    opfc.um2,
    opfc.um1_to_um2,
    opfc.tip_um,
    opfc.nr_buc,
    opfc.q_kg,
    opfc.tva_proc,
    opfc.cu_cheltuieli_transport,
    opfc.curseur,
    opfc.id_depozit,
    opfc.termen_livrare,
    opfc.cu_debitare,
    opfc.size_length AS size_length_from_sales,
    opfc.size_width AS size_width_from_sales,
    opfc.pret_mediu_calculat_um1_ron,
    opfc.pret_mediu_calculat_um1_eur,
    opfc.pret_mediu_calculat_um2_ron,
    opfc.pret_mediu_calculat_um2_eur,
    opfc.pret_mediu_calculat_um1_huf,
    opfc.pret_mediu_calculat_um2_huf,
    opfc.val_finala_fara_tva_ron,
    opfc.val_tva_ron,
    opfc.val_finala_cu_tva_ron,
    opfc.val_finala_fara_tva_eur,
    opfc.val_tva_eur,
    opfc.val_finala_cu_tva_eur,
    opfc.val_finala_fara_tva_huf,
    opfc.val_tva_huf,
    opfc.val_finala_cu_tva_huf,
    opfc.cost_livrare_ron,
    opfc.cost_livrare_eur,
    opfc.cost_livrare_huf,
    opfc.observatii,
    opfc.discount_proc,
    opfc.nr_ord,
    opfc.val_baza_ron,
    opfc.val_baza_eur,
    opfc.val_baza_huf,
    json_agg(json_build_object('pid_parent_category', ncp.parent_pid, 'pid_category', ncp.pid, 'category_name_ro', ncp.name_ro, 'category_name_en', ncp.name_en, 'with_length', ncp.with_length, 'with_width', ncp.with_width, 'with_thickness', ncp.with_thickness, 'with_diameter', ncp.with_diameter, 'with_height', ncp.with_height, 'with_alloy', ncp.with_alloy, 'with_type', ncp.with_type, 'with_roll_weight', ncp.with_roll_weight)) AS categories,
    np.product_name_bg,
    max(ncp.kg_from_um2) AS kg_from_um2
   FROM portal_color.offer_products_from_cmsales opfc
     LEFT JOIN portal_color.nom_products np ON opfc.product_code::text = np.product_code::text
     LEFT JOIN portal_color.nom_category_product ncp ON ncp.pid = ANY (np.pid_category)
  GROUP BY opfc.appid, opfc.id_offer, opfc.offer_slid, opfc.product_code, np.pid, np.pid_category, np.product_name_ro, np.product_name_en, np.size_length, np.size_width, np.size_thickness, np.size_diameter, np.size_height, np.size_alloy, np.size_type, opfc.status, opfc.q1, opfc.um1, opfc.q2, opfc.um2, opfc.um1_to_um2, opfc.tip_um, opfc.nr_buc, opfc.q_kg, opfc.tva_proc, opfc.cu_cheltuieli_transport, opfc.curseur, opfc.id_depozit, opfc.termen_livrare, opfc.cu_debitare, opfc.size_length, opfc.size_width, opfc.pret_mediu_calculat_um1_ron, opfc.pret_mediu_calculat_um1_eur, opfc.pret_mediu_calculat_um2_ron, opfc.pret_mediu_calculat_um2_eur, opfc.pret_mediu_calculat_um1_huf, opfc.pret_mediu_calculat_um2_huf, opfc.val_finala_fara_tva_ron, opfc.val_tva_ron, opfc.val_finala_cu_tva_ron, opfc.val_finala_fara_tva_eur, opfc.val_tva_eur, opfc.val_finala_cu_tva_eur, opfc.val_finala_fara_tva_huf, opfc.val_tva_huf, opfc.val_finala_cu_tva_huf, opfc.cost_livrare_ron, opfc.cost_livrare_eur, opfc.cost_livrare_huf, opfc.observatii, opfc.discount_proc, opfc.nr_ord, opfc.val_baza_ron, opfc.val_baza_eur, opfc.val_baza_huf;

COMMIT;

-- Verification:
--   select pid, name_ro, kg_from_um2 from portal_color.nom_category_product
--    where is_parent_for_articles = 'y' order by kg_from_um2 desc, name_ro;
