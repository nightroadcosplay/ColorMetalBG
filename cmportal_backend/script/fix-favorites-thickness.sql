-- Fix: favorites.size_thickness lost its decimals.
--
-- FavoritesController::insert() sanitized the thickness with Phalcon's 'int'
-- filter, which strips the decimal point ("1.00" -> "100", "50.80" -> "5080"),
-- and portal_color.favorites.size_thickness was an integer column so it could
-- not hold a fractional value anyway. Both basket.size_thickness and
-- nom_products.size_thickness are numeric(7,2); this brings favorites in line
-- and repairs the rows already stored.
--
-- portal_color.v_favorites selects f.size_thickness, so the view has to be
-- dropped and recreated around the ALTER. It is recreated verbatim from the
-- live definition; run this as the view owner so ownership is preserved.
--
-- Run once per environment (dev, then production).

BEGIN;

DROP VIEW portal_color.v_favorites;

-- 1. Match the column type used by basket and nom_products.
ALTER TABLE portal_color.favorites
    ALTER COLUMN size_thickness TYPE numeric(7,2)
    USING size_thickness::numeric(7,2);

-- 2. Repair existing rows from the product catalogue, which holds the true
--    value. Joined on product_code, the same key the view uses.
UPDATE portal_color.favorites f
   SET size_thickness = np.size_thickness
  FROM portal_color.nom_products np
 WHERE f.product_code = np.product_code
   AND np.size_thickness IS NOT NULL
   AND f.size_thickness IS DISTINCT FROM np.size_thickness;

-- 3. Recreate the view unchanged.
CREATE VIEW portal_color.v_favorites AS
    SELECT f.appid,
    f.userid,
    np.pid_category,
    f.product_code,
    f.pid_product,
    np.product_name_ro,
    np.product_name_en,
    f.q_nr_buc,
    np.um1,
    np.um2,
    f.qum1,
    f.qum2,
    np.um1_to_um2,
    f.size_length,
    f.size_width,
    f.size_thickness,
    f.size_diameter,
    f.size_height,
    f.size_alloy,
    f.size_type,
    f.track_date,
    np.um_base,
    np.is_active,
    u.cif,
    u.company_code,
    json_agg(json_build_object('pid_parent_category', ncp.parent_pid, 'pid_category', ncp.pid, 'category_name_ro', ncp.name_ro, 'category_name_en', ncp.name_en, 'with_length', ncp.with_length, 'with_width', ncp.with_width, 'with_thickness', ncp.with_thickness, 'with_diameter', ncp.with_diameter, 'with_height', ncp.with_height, 'with_alloy', ncp.with_alloy, 'with_type', ncp.with_type, 'with_roll_weight', ncp.with_roll_weight)) AS categories,
    np.product_name_bg
    FROM portal_color.favorites f
    LEFT JOIN portal_color.nom_products np ON f.product_code::text = np.product_code::text
    LEFT JOIN portal_color.nom_category_product ncp ON ncp.pid = ANY (np.pid_category)
    LEFT JOIN portal_color.users u ON f.userid::text = u.userid::text
    GROUP BY f.appid, f.userid, np.pid_category, f.product_code, f.pid_product, np.product_name_ro, np.product_name_en, f.q_nr_buc, np.um1, np.um2, f.qum1, f.qum2, np.um1_to_um2, f.size_length, f.size_width, f.size_thickness, f.size_diameter, f.size_height, f.size_alloy, f.size_type, f.track_date, np.um_base, np.is_active, u.cif, u.company_code, np.product_name_bg;

COMMIT;
