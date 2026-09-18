-- Bulgarian and English names for the browse categories.
--
-- portal_color.nom_category_product.name_bg was empty on 52 of 55 rows and
-- name_en was a verbatim copy of name_ro on 52 of 55, so both the Bulgarian
-- and the English portal were showing the Romanian category tree.
--
-- Wording follows the company's own Bulgarian terminology in the declaration
-- of conformity (offers_pdf/declaratie.pdf) and the Navision product-group
-- list (Nomenclatoare_lang_translate_v2 ... .csv).
--
-- REVIEW BEFORE PRODUCTION: these strings are customer facing. The same
-- values are laid out for review in script/categories-translations.csv.
--
-- Idempotent: re-running sets the same values. Run once per environment.

BEGIN;

UPDATE portal_color.nom_category_product
   SET name_en = 'NEW ARTICLE', name_bg = 'НОВ АРТИКУЛ'
 WHERE pid = 0;   -- NEW ARTICLE

UPDATE portal_color.nom_category_product
   SET name_en = 'TRANSPORT', name_bg = 'Транспорт'
 WHERE pid = 1;   -- TRANSPORT

UPDATE portal_color.nom_category_product
   SET name_en = 'BRONZE', name_bg = 'Бронз'
 WHERE pid = 6;   -- BRONZ

UPDATE portal_color.nom_category_product
   SET name_en = 'BRONZE ROUND BARS', name_bg = 'Кръгли пръти от бронз'
 WHERE pid = 7;   -- BARE ROTUNDE BRONZ

UPDATE portal_color.nom_category_product
   SET name_en = 'COPPER ROUND BARS', name_bg = 'Кръгли пръти от мед'
 WHERE pid = 8;   -- BARE ROTUNDE CUPRU

UPDATE portal_color.nom_category_product
   SET name_en = 'COPPER SQUARE BARS', name_bg = 'Квадратни пръти от мед'
 WHERE pid = 10;   -- BARE PATRATE CUPRU

UPDATE portal_color.nom_category_product
   SET name_en = 'COPPER FLAT BARS', name_bg = 'Плоски пръти от мед'
 WHERE pid = 12;   -- BARE LATE CUPRU

UPDATE portal_color.nom_category_product
   SET name_en = 'BRASS PLATES', name_bg = 'Месингови плочи'
 WHERE pid = 13;   -- PLACI ALAMA

UPDATE portal_color.nom_category_product
   SET name_en = 'COPPER PLATES', name_bg = 'Медни плочи'
 WHERE pid = 15;   -- PLACI CUPRU

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM', name_bg = 'Алуминий'
 WHERE pid = 16;   -- ALUMINIU

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM PERFORATED SHEETS', name_bg = 'Перфорирани ламарини от алуминий'
 WHERE pid = 17;   -- TABLE AL PERFORATE

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM COILS STANDARD', name_bg = 'Ленти от алуминий, стандартни'
 WHERE pid = 18;   -- BENZI ALUMINIU STANDARD

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM PLAIN SHEETS', name_bg = 'Гладки ламарини от алуминий'
 WHERE pid = 19;   -- TABLE LISĂ ALUMINIU

UPDATE portal_color.nom_category_product
   SET name_en = 'STUCCO, TREAD, DIAMOND, PERFORATED', name_bg = 'Стуко, рифеловани, диамант, перфорирани'
 WHERE pid = 20;   -- STUCCO, STRIATE, DIAMOND, PERFORATE

UPDATE portal_color.nom_category_product
   SET name_en = 'STUCCO SHEETS', name_bg = 'Ламарини стуко'
 WHERE pid = 21;   -- TABLE STUCCO

UPDATE portal_color.nom_category_product
   SET name_en = 'TREAD SHEETS', name_bg = 'Рифеловани ламарини'
 WHERE pid = 22;   -- TABLE STRIATE

UPDATE portal_color.nom_category_product
   SET name_en = 'DIAMOND SHEETS', name_bg = 'Ламарини диамант'
 WHERE pid = 23;   -- TABLE DIAMOND

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM PLATES', name_bg = 'Плочи от алуминий'
 WHERE pid = 24;   -- PLACI ALUMINIU

UPDATE portal_color.nom_category_product
   SET name_en = 'PRECISION PLATES', name_bg = 'Прецизни плочи'
 WHERE pid = 25;   -- PLACI DE PRECIZIE

UPDATE portal_color.nom_category_product
   SET name_en = 'CAST PLATES', name_bg = 'Лети плочи'
 WHERE pid = 26;   -- PLACI TURNATE

UPDATE portal_color.nom_category_product
   SET name_en = 'ROLLED PLATES', name_bg = 'Валцувани плочи'
 WHERE pid = 27;   -- PLACI LAMINATE

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM PROFILES, TUBES', name_bg = 'Профили и тръби от алуминий'
 WHERE pid = 28;   -- PROFILE, TEVI ALUMINIU

UPDATE portal_color.nom_category_product
   SET name_en = 'L PROFILES', name_bg = 'Профили L'
 WHERE pid = 29;   -- PROFILE L

UPDATE portal_color.nom_category_product
   SET name_en = 'T PROFILES', name_bg = 'Профили T'
 WHERE pid = 30;   -- PROFILE T

UPDATE portal_color.nom_category_product
   SET name_en = 'U PROFILES', name_bg = 'Профили U'
 WHERE pid = 31;   -- PROFILE U

UPDATE portal_color.nom_category_product
   SET name_en = 'RECTANGULAR TUBES', name_bg = 'Правоъгълни тръби'
 WHERE pid = 32;   -- TEVI RECTANGULARE

UPDATE portal_color.nom_category_product
   SET name_en = 'SQUARE TUBES', name_bg = 'Квадратни тръби'
 WHERE pid = 33;   -- TEVI PATRATE

UPDATE portal_color.nom_category_product
   SET name_en = 'ROUND TUBES', name_bg = 'Кръгли тръби'
 WHERE pid = 34;   -- TEVI ROTUNDE

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM BARS', name_bg = 'Пръти от алуминий'
 WHERE pid = 35;   -- BARE ALUMINIU

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM ROUND BARS', name_bg = 'Кръгли пръти от алуминий'
 WHERE pid = 36;   -- BARE ROTUNDE ALUMINIU

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM SQUARE BARS', name_bg = 'Квадратни пръти от алуминий'
 WHERE pid = 38;   -- BARE PATRATE ALUMINIU

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM FLAT BARS', name_bg = 'Плоски пръти от алуминий'
 WHERE pid = 39;   -- BARE LATE ALUMINIU

UPDATE portal_color.nom_category_product
   SET name_en = 'BRASS', name_bg = 'Месинг'
 WHERE pid = 53;   -- ALAMA

UPDATE portal_color.nom_category_product
   SET name_en = 'BRASS SHEETS', name_bg = 'Месингови ламарини'
 WHERE pid = 54;   -- TABLE ALAMA

UPDATE portal_color.nom_category_product
   SET name_en = 'BRASS BARS', name_bg = 'Месингови пръти'
 WHERE pid = 55;   -- BARE ALAMA

UPDATE portal_color.nom_category_product
   SET name_en = 'BRASS ROUND BARS', name_bg = 'Кръгли пръти от месинг'
 WHERE pid = 56;   -- BARE ROTUNDE ALAMA

UPDATE portal_color.nom_category_product
   SET name_en = 'BRASS HEXAGONAL BARS', name_bg = 'Шестостенни пръти от месинг'
 WHERE pid = 58;   -- BARE HEXAGONALE ALAMA

UPDATE portal_color.nom_category_product
   SET name_en = 'BRASS SQUARE BARS', name_bg = 'Квадратни пръти от месинг'
 WHERE pid = 59;   -- BARE PATRATE ALAMA

UPDATE portal_color.nom_category_product
   SET name_en = 'BRASS FLAT BARS', name_bg = 'Плоски пръти от месинг'
 WHERE pid = 60;   -- BARE LATE ALAMA

UPDATE portal_color.nom_category_product
   SET name_en = 'COPPER', name_bg = 'Мед'
 WHERE pid = 61;   -- CUPRU

UPDATE portal_color.nom_category_product
   SET name_en = 'COPPER SHEETS', name_bg = 'Медни ламарини'
 WHERE pid = 62;   -- TABLE CUPRU

UPDATE portal_color.nom_category_product
   SET name_en = 'ARCHITECTURAL COPPER COILS', name_bg = 'Медни ленти за строителството'
 WHERE pid = 64;   -- BENZI CUPRU ARHITECTURAL

UPDATE portal_color.nom_category_product
   SET name_en = 'ARCHITECTURAL COPPER SHEETS', name_bg = 'Медни ламарини за строителството'
 WHERE pid = 66;   -- TABLE CUPRU ARHITECTURAL

UPDATE portal_color.nom_category_product
   SET name_en = 'INDUSTRIAL COPPER SHEETS', name_bg = 'Медни ламарини за индустриална употреба'
 WHERE pid = 67;   -- TABLE CUPRU INDUSTRIAL

UPDATE portal_color.nom_category_product
   SET name_en = 'COPPER BARS', name_bg = 'Медни пръти'
 WHERE pid = 68;   -- BARE CUPRU

UPDATE portal_color.nom_category_product
   SET name_en = 'TITANIUM ZINC', name_bg = 'Титан цинк'
 WHERE pid = 69;   -- TITAN ZINC

UPDATE portal_color.nom_category_product
   SET name_en = 'TITANIUM ZINC COILS', name_bg = 'Ленти от титан-цинк'
 WHERE pid = 70;   -- BENZI TITAN ZINC

UPDATE portal_color.nom_category_product
   SET name_en = 'TITANIUM ZINC SHEETS', name_bg = 'Ламарини от титан-цинк'
 WHERE pid = 71;   -- TABLE TITAN ZINC

UPDATE portal_color.nom_category_product
   SET name_en = 'VENTILATED FACADE', name_bg = 'Вентилируема фасада'
 WHERE pid = 73;   -- FAȚADĂ VENTILATĂ

UPDATE portal_color.nom_category_product
   SET name_en = 'ALUMINIUM HEXAGONAL BARS', name_bg = 'Шестостенни пръти от алуминий'
 WHERE pid = 74;   -- BARĂ HEXAGON ALUMINIU

UPDATE portal_color.nom_category_product
   SET name_en = 'VENTILATED FACADE PROFILES', name_bg = 'Профили за вентилируема фасада'
 WHERE pid = 75;   -- PROFILE FAȚADĂ VENTILATĂ

UPDATE portal_color.nom_category_product
   SET name_en = 'VENTILATED FACADE ACCESSORIES', name_bg = 'Аксесоари за вентилируема фасада'
 WHERE pid = 76;   -- ACCESORI FAȚADA VENTILATĂ

UPDATE portal_color.nom_category_product
   SET name_en = 'SINGLE BRACKETS', name_bg = 'Единични конзоли'
 WHERE pid = 77;   -- CONSOLE SIMPLE

UPDATE portal_color.nom_category_product
   SET name_en = 'DOUBLE BRACKETS', name_bg = 'Двойни конзоли'
 WHERE pid = 78;   -- CONSOLE DUBLE

UPDATE portal_color.nom_category_product
   SET name_en = '123', name_bg = '123'
 WHERE pid = 81;   -- 123

COMMIT;

-- Verification:
--   select pid, name_ro, name_en, name_bg
--     from portal_color.nom_category_product
--    where name_bg is null or btrim(name_bg) = ''
--    order by pid;
