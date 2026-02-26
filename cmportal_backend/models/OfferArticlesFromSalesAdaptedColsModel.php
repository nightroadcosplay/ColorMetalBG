<?php
use Phalcon\Mvc\Model;

class OfferArticlesFromSalesAdaptedColsModel extends Model
{
    public $offerSlid;
    public $productCode;
    public $categoryPid;
    public $productNameRO;
    public $productNameEN;
    public $categoryNameRo;
    public $categoryNameEn;
    public $status;
    public $q1;
    public $um1;
    public $q2;
    public $um2;
    public $um1_to_um2;
    public $tip_um;
    public $nrBuc;
    public $qKg;
    public $tvaProc;
    public $cuCheltuieliTransport;
    public $curseur;
    public $l;
    public $w;
    public $t;
    public $d;
    public $h;
    public $a;
    public $k;

    public $withLength;
    public $withWidth;
    public $withThickness;
    public $withDiameter;
    public $withHeight;
    public $withAlloy;
    public $withType;

    public $idDepozit;
    public $termenLivrare;
    public $pretMediuCalculatUM1RON;
    public $pretMediuCalculatUM1EUR;
    public $pretMediuCalculatUM2RON;
    public $pretMediuCalculatUM2EUR;
    public $pretMediuCalculatUM1HUF;
    public $pretMediuCalculatUM2HUF;
    public $valFinalaFaraTvaRON;
    public $valTvaRON;
    public $valFinalaCuTvaRON;
    public $valFinalaFaraTvaEUR;
    public $valTvaEUR;
    public $valFinalaCuTvaEUR;
    public $valFinalaFaraTvaHUF;
    public $valTvaHUF;
    public $valFinalaCuTvaHUF;
    public $costLivrareRON;
    public $costLivrareEUR;
    public $costlivrareHUF;
    public $observatii;
    public $cuDebitare;
    public $sizeLengthFromSales;
    public $sizeWidthFromSales;
    public $productPid;
    public $discount_proc;



    public function initialize()
    {
        $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('v_offer_products_from_cmsales');
    }

    public function afterFetch()
    {
        $this->q1 = 1*$this->q1;
        $this->q2 = 1*$this->q2;
        $this->pretMediuCalculatUM1RON = 1* $this->pretMediuCalculatUM1RON;
        $this->pretMediuCalculatUM2RON = 1* $this->pretMediuCalculatUM2RON;
    }

    public function columnMap()
        {
            // Keys are the real names in the table and
            // the values their names in the application
            return [
                    "appid"=>"appid",
                    "id_offer"=>"offerId",
                    "offer_slid"=>"offerSlid",
                    "pid_product"=>"productPid",
                    "pid_category"=>"categoryPid",
                    "product_code"=>"productCode",
                    "product_name_ro"=>"productNameRO",
                    "product_name_en"=>"productNameEN",
                    "product_name_bg"=>"productNameBG",
                    "category_name_ro"=>"categoryNameRO",
                    "category_name_en"=>"categoryNameEN",
                    "status"=>"status",
                    "q1"=>"q1",
                    "um1"=>"um1",
                    "q2"=>"q2",
                    "um2"=>"um2",
                    "um1_to_um2"=>"um1_to_um2",
                    "tip_um"=>"tip_um",
                    "nr_buc"=>"nrBuc",
                    "q_kg"=>"qKg",
                    "tva_proc"=>"tvaProc",
                    "cu_cheltuieli_transport"=>"cuCheltuieliTransport",
                    "curseur"=>"curseur",

                    "size_length"=>"l",
                    "size_width"=>"w",
                    "size_thickness"=>"t",
                    "size_diameter"=>"d",
                    "size_height"=>"h",
                    "size_alloy"=>"a",
                    "size_type"=>"k",

                    "with_length"=>"withLength",
                    "with_width"=>"withWidth",
                    "with_thickness"=>"withThickness",
                    "with_diameter"=>"withDiameter",
                    "with_height"=>"withHeight",
                    "with_alloy"=>"withAlloy",
                    "with_type"=>"withType",

                    "cu_debitare"=>"cuDebitare",
                    "size_length_from_sales"=>"sizeLengthFromSales",
                    "size_width_from_sales"=>"sizeWidthFromSales",

                    "id_depozit"=>"idDepozit",
                    "termen_livrare"=>"termenLivrare",
                    "pret_mediu_calculat_um1_ron"=>"pretMediuCalculatUM1RON",
                    "pret_mediu_calculat_um1_eur"=>"pretMediuCalculatUM1EUR",
                    "pret_mediu_calculat_um2_ron"=>"pretMediuCalculatUM2RON",
                    "pret_mediu_calculat_um2_eur"=>"pretMediuCalculatUM2EUR",
                    "pret_mediu_calculat_um1_huf"=>"pretMediuCalculatUM1HUF",
                    "pret_mediu_calculat_um2_huf"=>"pretMediuCalculatUM2HUF",
                    "val_finala_fara_tva_ron"=>"valFinalaFaraTvaRON",
                    "val_tva_ron"=>"valTvaRON",
                    "val_finala_cu_tva_ron"=>"valFinalaCuTvaRON",
                    "val_finala_fara_tva_eur"=>"valFinalaFaraTvaEUR",
                    "val_tva_eur"=>"valTvaEUR",
                    "val_finala_cu_tva_eur"=>"valFinalaCuTvaEUR",
                    "val_finala_fara_tva_huf"=>"valFinalaFaraTvaHUF",
                    "val_tva_huf"=>"valTvaHUF",
                    "val_finala_cu_tva_huf"=>"valFinalaCuTvaHUF",
                    "cost_livrare_ron"=>"costLivrareRON",
                    "cost_livrare_eur"=>"costLivrareEUR",
                    "cost_livrare_huf"=>"costlivrareHUF",
                    "observatii"=>"observatii",
                    "discount_proc"=>"discount_proc",
                    "nr_ord"=>"nr_ord",
                    "val_baza_ron"=>"val_baza_ron",
                    "val_baza_eur"=>"val_baza_eur",
                    "val_baza_huf"=>"val_baza_huf",
                    "categories" => "categories"
                ];
        }

}

?>
