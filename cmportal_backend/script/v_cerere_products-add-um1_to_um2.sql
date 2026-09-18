-- v_cerere_products: expose nom_products.um1_to_um2.
--
-- The request screen needs the um1 -> um2 conversion factor to decide whether
-- the two units hold the same number; the view joined nom_products already but
-- did not select the column, so CerereController could not return it.
--
-- Recreated from the live definition with only that column added, to SELECT
-- and to GROUP BY. Run as the view owner. Run once per environment.

BEGIN;

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
    np.um1_to_um2
   FROM portal_color.offer_products_from_user opfu
     LEFT JOIN portal_color.nom_products np ON opfu.product_code::text = np.product_code::text
     LEFT JOIN portal_color.nom_category_product ncp ON ncp.pid = ANY (np.pid_category)
  GROUP BY opfu.appid, opfu.id_offer, opfu.product_code, opfu.q_nr_buc, opfu.size_length, opfu.size_width, opfu.size_thickness, opfu.size_diameter, opfu.size_height, opfu.size_alloy, opfu.size_type, opfu.qum1, opfu.um1, opfu.qum2, opfu.um2, opfu.cu_debitare, opfu.size_length_cutting, opfu.size_width_cutting, opfu.observatii, np.pid, np.pid_category, np.product_name_ro, np.product_name_en, np.um_base, np.is_active, opfu.nr_ord, opfu.tip_um, np.um1_to_um2;

COMMIT;
