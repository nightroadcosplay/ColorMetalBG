<?php
use Phalcon\Mvc\Model;

class VOfferFromUser extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('v_offers_from_user');
    }

    // public function columnMap()
    //     {
    //         // Keys are the real names in the table and
    //         // the values their names in the application
    //         return [
    //                 "appid"=>"appid",
    //                 "id_offer"=>"offerId",
    //                 "track_user_id"=>"trackUserId",
    //                 "track_creation_date"=>"trackCreationDate",
    //                 "status"=>"status",
    //                 "track_cancelation_date"=>"trackCancelationDate",
    //                 "cif"=>"cif",
    //                 "track_date_ofertare"=>"trackDateOfertare",
    //                 "date_when_offer_expire"=>"dateWhenOfferExpire",
    //                 "offer_slid"=>"offerSlid",
	// 				"val_finala_fara_tva_ron"=>"valFinalaFaraTvaRON",
	// 				"val_tva_ron"=>"valTvaRON",
	// 				"val_finala_cu_tva_ron"=>"valFinalaCuTvaRON",
	// 				"val_finala_fara_tva_eur"=>"valFinalaFaraTvaEUR",
	// 				"val_tva_eur"=>"valTvaEUR",
	// 				"val_finala_cu_tva_eur"=>"valFinalaCuTvaEUR",
	// 				"val_finala_fara_tva_huf"=>"valFinalaFaraTvaHUF",
	// 				"val_tva_huf"=>"valTvaHUF",
	// 				"val_finala_cu_tva_huf"=>"valFinalaCuTvaHUF",
	// 				"id_valuta"=>"idValuta",
	// 				"q_kg"=>"qKg",
    //                 "track_date_accept"=>"trackDateAccept",
	// 				"comanda_client"=>"ComandaClient",
	// 				"termen_livrare_solicitat"=>"termenLivrareSolicitat",
	// 				"slid_adresa_livrare"=>"slidAdresaLivrare",
    //                 "val_discount_linii_ron" => "val_discount_linii_ron",
    //                 "val_discount_oferta_ron" => "val_discount_oferta_ron",
    //                 "val_discount_linii_eur" => "val_discount_linii_eur",
    //                 "val_discount_oferta_eur" => "val_discount_oferta_eur",
    //                 "val_discount_linii_huf" => "val_discount_linii_huf",
    //                 "val_discount_oferta_huf" => "val_discount_oferta_huf",
    //                 "from_offer_slid" => "from_offer_slid",
    //                 "discount_proc" => "discount_proc",
    //                 "viewed" => "viewed",
    //                 "observatii_asm" => "observatii_asm",
    //                 "categories" => "categories",
    //                 "nume_utilizator" => "nume_utilizator",
    //                 "track_user_id"=> "track_user_id"
    //             ];
    //     }
}

?>
