<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class OfferFromSalesToPortalController extends Controller
{
public function indexAction()
    {

    }




public function offersFromSales($token){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $rawdata = file_get_contents("php://input");
    $postData= json_decode($rawdata);
    //die(var_dump($postData));
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    // Start a transaction
    $this->db->begin();
    foreach($postData as $postOffer){
        foreach($postOffer->rows as $productCmSales){
            $product = new OfferProductsFromCmSalesModel();
            // $product->reset();
            $product->id_offer                   =$postOffer->id_offer;
            $product->offer_slid                 =$postOffer->offer_slid;
            $product->product_code               =$productCmSales->product_code;
            $product->status                     ='o';
            $product->q1                         =$productCmSales->q1;
            $product->um1                        =$productCmSales->um1;
            $product->q2                         =$productCmSales->q2;
            $product->um2                        =$productCmSales->um2;
            $product->um1_to_um2                 =$productCmSales->um1_to_um2;
            $product->tip_um                     =$productCmSales->tip_um;
            $product->nr_buc                     =$productCmSales->nr_buc;
            $product->q_kg                       =$productCmSales->q_kg;
            $product->tva_proc                   =$productCmSales->tva_proc;
            $product->cu_cheltuieli_transport    =$productCmSales->cu_cheltuieli_transport;
            $product->curseur                    =$productCmSales->curseur;
            $product->size_length                =intval($productCmSales->size_length);
            $product->size_width                 =intval($productCmSales->size_width);
            $product->size_thickness             =intval($productCmSales->size_thickness);
            $product->size_diameter              =intval($productCmSales->size_diameter);
            $product->cu_debitare                =$productCmSales->cu_debitare;
            $product->id_depozit                 =$productCmSales->id_depozit;
            $product->termen_livrare             =$productCmSales->termen_livrare;
            $product->pret_mediu_calculat_um1_ron=$productCmSales->pret_mediu_calculat_um1_ron;
            $product->pret_mediu_calculat_um1_eur=$productCmSales->pret_mediu_calculat_um1_eur;
            $product->pret_mediu_calculat_um2_ron=$productCmSales->pret_mediu_calculat_um2_ron;
            $product->pret_mediu_calculat_um2_eur=$productCmSales->pret_mediu_calculat_um2_eur;
            $product->pret_mediu_calculat_um1_huf=$productCmSales->pret_mediu_calculat_um1_huf;
            $product->pret_mediu_calculat_um2_huf=$productCmSales->pret_mediu_calculat_um2_huf;
            $product->val_finala_fara_tva_ron    =$productCmSales->val_finala_fara_tva_ron;
            $product->val_tva_ron                =$productCmSales->val_tva_ron;
            $product->val_finala_cu_tva_ron      =$productCmSales->val_finala_cu_tva_ron;
            $product->val_finala_fara_tva_eur    =$productCmSales->val_finala_fara_tva_eur;
            $product->val_tva_eur                =$productCmSales->val_tva_eur;
            $product->val_finala_cu_tva_eur      =$productCmSales->val_finala_cu_tva_eur;
            $product->val_finala_fara_tva_huf    =$productCmSales->val_finala_fara_tva_huf;
            $product->val_tva_huf                =$productCmSales->val_tva_huf;
            $product->val_finala_cu_tva_huf      =$productCmSales->val_finala_cu_tva_huf;
            $product->cost_livrare_ron           =$productCmSales->cost_livrare_ron;
            $product->cost_livrare_eur           =$productCmSales->cost_livrare_eur;
            $product->cost_livrare_huf           =$productCmSales->cost_livrare_huf;
            $product->discount_proc              =$productCmSales->discount_proc;
            $product->nr_ord                     =$productCmSales->nr_ord;
            $product->val_baza_ron               =$productCmSales->val_baza_ron;
            $product->val_baza_eur               =$productCmSales->val_baza_eur;
            $product->val_baza_huf               =$productCmSales->val_baza_huf;

            if($product->save()===false) {
                        $responce->status="error";
                        $responce->message='Error on save product code='.$productCmSales->product_code.' for id offer='.$postOffer->id_offer;
                        $messages = $product->getMessages();
                        foreach ($messages as $message) {$responce->message.=$message;}
                        break;
                    }
            } //end foreach($postOffer->rows as $productCmSales)
                $offer = OfferFromUserModel::findFirst(    [
                    'conditions' => 'id_offer = ?1',
                    'bind'       => [
                        1 => $postOffer->id_offer
                    ]
                ]);
                if($offer && strlen($offer->cif)>0){
                    $offer->offer_slid = $postOffer->offer_slid;
                    $offer->status = 'o';//o-ofertare
                    $offer->track_date_ofertare = date("Y-m-d H:i:s");
                    $offer->date_when_offer_expire = $postOffer->date_when_offer_expire;
                    $offer->q_kg = $postOffer->q_kg;
                    $offer->id_valuta = $postOffer->id_valuta;
                    $offer->val_finala_fara_tva_ron = $postOffer->val_finala_fara_tva_ron;
                    $offer->val_tva_ron = $postOffer->val_tva_ron;
                    $offer->val_finala_cu_tva_ron = $postOffer->val_finala_cu_tva_ron;
                    $offer->val_finala_fara_tva_eur = $postOffer->val_finala_fara_tva_eur;
                    $offer->val_tva_eur = $postOffer->val_tva_eur;
                    $offer->val_finala_cu_tva_eur = $postOffer->val_finala_cu_tva_eur;
                    $offer->val_finala_fara_tva_huf = $postOffer->val_finala_fara_tva_huf;
                    $offer->val_tva_huf = $postOffer->val_tva_huf;
                    $offer->val_finala_cu_tva_huf = $postOffer->val_finala_cu_tva_huf;
                    
                    $offer->val_discount_linii_ron = $postOffer->val_discount_linii_ron;
                    $offer->val_discount_oferta_ron = $postOffer->val_discount_oferta_ron;
                    $offer->val_discount_linii_eur = $postOffer->val_discount_linii_eur;
                    $offer->val_discount_oferta_eur = $postOffer->val_discount_oferta_eur;
                    $offer->val_discount_linii_huf = $postOffer->val_discount_linii_huf;
                    $offer->val_discount_oferta_huf = $postOffer->val_discount_oferta_huf;
                    $offer->slid_adresa_livrare = $postOffer->slid_adresa_livrare;

                    if($offer->save() === false) {
                            $responce->status="error";
                            $messages = $offer->getMessages();
                            foreach ($messages as $message) {$responce->message.=$message;}
                            break;
                        }
                    $userMail=new UsersMailboxController();
                    $val = $offer->id_valuta == 'RON' ? $offer->val_finala_cu_tva_ron : ($offer->id_valuta == 'EUR' ? $offer->val_finala_cu_tva_eur : $offer->val_finala_cu_tva_huf);
                    $userMail->insertNewMessage($offer->cif,$offer->id_offer,'NewOfferFromSales','n','y','Echipa ColorMetal',$offer->track_user_id,'cmsales','Oferta noua!','Ati primit o oferta noua in valoare de '. $val . ' ' . $offer->id_valuta . ' pentru cererea '.$offer->id_offer);

                    $count = CountNewDataModel::findFirst([
                        'conditions' => 'cif = ?1 and userid = ?2',
                        'bind'       => [
                                1 => $offer->cif,
                                2 => $offer->track_user_id
                            ]
                    ]);
                    if($count){
                        $count->oferte = $count->oferte + 1;
                        $count->update();
                    } else {
                        $count = new CountNewDataModel();
                        $count->oferte = 1;
                        $count->cif = $offer->cif;
                        $count->userid = $offer->track_user_id;
                        $count->save();
                    }

                      //die(var_dump(  $userMail->message));
                }else{
                    $responce->status="error";
                    $responce->message="nu poate fi identificata oferta cu slid=".$offer->offer_slid;
                    break;
                }

    }//end foreach($postData as $postOffer)

    if($responce->status=="init"){//no errors found
        $this->db->commit();
        $responce->status="success";
    }else{
            $responce->status="error";
            $this->db->rollback();
        }
    $response
        ->setJsonContent($responce)
        ->send();
}



public function lansareOrdersFromSales($token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $rawdata = file_get_contents("php://input");
        $postData= json_decode($rawdata);
        //die(var_dump($postData));
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        // Start a transaction
        $this->db->begin();
        foreach($postData as $idOffer){
                        $offer = OfferFromUserModel::findFirst([
                                        'conditions' => 'id_offer = ?1',
                                        'bind'       => [
                                                1 => $idOffer
                                        ]
                                ]);
                                if($offer && strlen($offer->cif)>0){
                                                $offer->status = 'l';//l-lansare
                                                if($offer->save() === false) {
                                                                $responce->status="error";
                                                                $messages = $offer->getMessages();
                                                                foreach ($messages as $message) {$responce->message.=$message;}
                                                                break;
                                                        }
                                            $userMail=new UsersMailboxController();
                                            $userMail->insertNewMessage($offer->cif,$offer->id_offer,'LansareOfferFromSales','n','y','Echipa ColorMetal',$offer->track_user_id,'cmsales','Lansare in lucru comanda!','Au fost lansate in lucru comenzi ColorMetal pentru cererea '.$offer->id_offer);
                                            //die(var_dump(  $userMail->message));
                                }else{
                                        $responce->status="error";
                                        $responce->message="nu poate fi identificata oferta cu slid=".$offer->offer_slid;
                                        break;
                                }

        }//end foreach($postData as $postOffer)

        if($responce->status=="init"){//no errors found
                $this->db->commit();
                $responce->status="success";
        }else{
                        $responce->status="error";
                        $this->db->rollback();
                }
        $response
                ->setJsonContent($responce)
                ->send();
    }


    public function deleteProductsFromOrder($token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $rawdata = file_get_contents("php://input");
        $postData= json_decode($rawdata);
        //die(var_dump($postData));
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        // Start a transaction
        $this->db->begin();
        $productsFromSales = OfferProductsFromCmSalesModel::find(
                                                [
                                                'conditions' => 'offer_slid = ?1',
                                                'bind'       => [
                                                        1 => $postData->offer_slid
                                                    ],
                                                'order' => 'nr_ord asc'
                                                ]
                                            );
        foreach($productCmSales as $product){
            if ($product->delete() === false) {
                $responce->status = "error";
                $messages = $product->getMessages();
                foreach ($messages as $message) {
                    $responce->message.=$message;
                }
            }
        }

        if($responce->status=="init"){//no errors found
            $this->db->commit();
            $responce->status="success";
        } else {
            $responce->status="error";
            $this->db->rollback();
        }

        $response
                ->setJsonContent($responce)
                ->send();
    }

}