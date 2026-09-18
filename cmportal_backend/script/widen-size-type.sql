-- basket.size_type was varchar(20); the perforated-sheet types are up to 51
-- characters, so adding one to the basket failed with
-- "value too long for type character varying(20)". It becomes plain varchar.
--
-- v_basket selects the column, and Postgres will not change a column's type
-- under a view, so the view is dropped and recreated unchanged around the ALTER.

BEGIN;

DROP VIEW portal_color.v_basket;

ALTER TABLE portal_color.basket ALTER COLUMN size_type TYPE varchar;

CREATE VIEW portal_color.v_basket AS
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
    max(ncp.kg_from_um2::text) AS kg_from_um2
   FROM portal_color.basket b
     LEFT JOIN portal_color.nom_products np ON b.product_code::text = np.product_code::text
     LEFT JOIN portal_color.nom_category_product ncp ON ncp.pid = ANY (np.pid_category)
     LEFT JOIN portal_color.users u ON b.userid::text = u.userid::text
  GROUP BY b.appid, b.userid, np.pid_category, b.product_code, b.pid_product, np.product_name_ro, np.product_name_en, b.q_nr_buc, np.um1, np.um2, b.qum1, b.qum2, np.um1_to_um2, b.size_length, b.size_width, b.size_thickness, b.size_diameter, b.size_height, b.size_alloy, b.size_type, b.cu_debitare, b.size_length_cutting, b.size_width_cutting, b.track_date, np.um_base, np.is_active, u.cif, u.company_code, b.free_comments, b.nr_ord, b.tip_um, np.product_name_bg;

ALTER VIEW portal_color.v_basket OWNER TO sales;

COMMIT;

-- Check: maxlen should be empty for both.
SELECT table_name, character_maximum_length AS maxlen
  FROM information_schema.columns
 WHERE table_schema = 'portal_color'
   AND column_name = 'size_type'
   AND table_name IN ('basket', 'v_basket');
