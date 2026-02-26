<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class SalesApiController extends Controller
{
public function indexAction()
    {

    }

public function getUsers($lastSynchedAppid,$token){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->users=[];

    $events= LogEvents::find(
                                [
                                    'conditions' => 'appid >?1 and event_table=?2',
                                        'bind'       => [
                                                        1 => $lastSynchedAppid,
                                                        2 => 'users'
                                                ]
                                        ,'order'=>'appid'
                                ]
                            );

    foreach($events as $event){
    $user= Users::findFirst(
                                [
                                  'conditions' => 'appid = ?1',
                                    'bind'       => [
                                           1 => $event->object_id,
                                        ]
                                    ,'order'=>'appid'
                                ]
                            );

                array_push($responce->users, [
                            "appid"=>$user->appid,
                            "userid"=>$user->userid,
                            "email"=>$user->email,
                            "first_name"=>$user->first_name,
                            "last_name"=>$user->last_name,
                            "company_code"=>$user->company_code,
                            "phone_nr"=>$user->phone_nr,
                            "cif"=>$user->cif,
                            "functie"=>$user->functie,
                            "navisionid"=>$user->navisionid,
                            "event_action"=>$event->event_action,
                            "event_appid"=>$event->appid
                        ]);
                }

    $responce->status="success";
    $response
        ->setJsonContent($responce)
        ->send();
}


public function getAllOffersHeaders($lastSynchedAppid,$token){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->offers=[];
    // die(var_dump($lastSynchedAppid));
    $events= LogEvents::find(
                                [
                                  'conditions' => 'appid >?1 and event_table=?2',
                                    'bind'       => [
                                            1 => $lastSynchedAppid,
                                            2 => 'offer_from_user'
                                        ]
                                    ,'order'=>'appid'
                                ]
                            );

    foreach($events as $event){

    $offer= OfferFromUserModel::findFirst(
                                        [
                                          'conditions' => 'id_offer = ?1',
                                        'bind'       => [
                                                1 => $event->object_id,
                                            ]
                                        ]
                );

        if($offer){
                $products=[];
                if($event->event_action=='new'){//numai pentru ofertele noi aducem si produsele
                    $offerProducts=OfferProductsFromUserModel::find(
                                                        [
                                                          	'conditions' => 'id_offer = ?1',
                                                        	'bind'       => [
                                                                1 => $offer->id_offer,
                                                            	],
                                                         	'order' => 'nr_ord asc'
                                                        ]   
                                );

                    foreach($offerProducts as $product){
                            array_push($products, [
                                        "offerId"=>$product->id_offer,
                                        "appid"=>$product->appid,
                                        "status"=>$product->status,
                                        "productCode"=>$product->product_code,
                                        "qNrBuc"=>$product->q_nr_buc,
                                        "um1"=>$product->um1,
                                        "um2"=>$product->um2,
                                        "qUm1"=>$product->qum1,
                                        "qUm2"=>$product->qum2,
                                        "sizeLength"=>$product->size_length,
                                        "sizeWidth"=>$product->size_width ,
                                        "sizeThickness"=>$product->size_thickness ,
                                        "sizeDiameter"=>$product->size_diameter,
                                        "sizeHeight"=>$product->size_height,
                                        "sizeAlloy"=>$product->size_alloy,
                                        "sizeType"=>$product->size_type,
                                        "dorescDebitare"=>$product->cu_debitare,
                                        "cuttingLength"=>$product->size_length_cutting,
                                        "cuttingWidth"=>$product->size_width_cutting,
                           	 			"observatii"=>$product->observatii,
                                        "nr_ord"=>$product->nr_ord,
                            			"tip_um"=>$product->tip_um ? $product->tip_um : 'um12',
                                        "id_depozit"=>$product->id_depozit ? $product->id_depozit : '0',               
                                        "termen_livrare"=>$product->termen_livrare ? $product->termen_livrare : $offer->termen_livrare_solicitat ,           
                                        "pret_mediu_calculat_um1_ron"=>$product->pret_mediu_calculat_um1_ron,
                                        "pret_mediu_calculat_um1_eur"=>$product->pret_mediu_calculat_um1_eur,
                                        "pret_mediu_calculat_um2_ron"=>$product->pret_mediu_calculat_um2_ron,
                                        "pret_mediu_calculat_um2_eur"=>$product->pret_mediu_calculat_um2_eur,
                                        "pret_mediu_calculat_um1_huf"=>$product->pret_mediu_calculat_um1_huf,
                                        "pret_mediu_calculat_um2_huf"=>$product->pret_mediu_calculat_um2_huf,
                                        "val_finala_fara_tva_ron"=>$product->val_finala_fara_tva_ron,
                                        "val_tva_ron"=>$product->val_tva_ron,
                                        "val_finala_cu_tva_ron"=>$product->val_finala_cu_tva_ron,
                                        "val_finala_fara_tva_eur"=>$product->val_finala_fara_tva_eur,
                                        "val_tva_eur"=>$product->val_tva_eur,
                                        "val_finala_cu_tva_eur"=>$product->val_finala_cu_tva_eur,
                                        "val_finala_fara_tva_huf"=>$product->val_finala_fara_tva_huf,
                                        "val_tva_huf"=>$product->val_tva_huf,
                                        "val_finala_cu_tva_huf"=>$product->val_finala_cu_tva_huf,
                                        "cost_livrare_ron"=>$product->cost_livrare_ron ? $product->cost_livrare_ron : 0,
                                        "cost_livrare_eur"=>$product->cost_livrare_eur ? $product->cost_livrare_eur : 0,
                                        "cost_livrare_huf"=>$product->cost_livrare_huf ? $product->cost_livrare_huf : 0,
                                        "discount_proc"=>$product->discount_proc ? $product->discount_proc : 0,
                                        "tva_proc"=>$product->tva_proc,
                                        "cu_cheltuieli_transport"=>$product->cu_cheltuieli_transport ? $product->cu_cheltuieli_transport : 'n',
                                        "curseur"=>$product->curseur,
                                        "q_kg"=>$product->q_kg,
                                        "um1_to_um2"=>$product->um1_to_um2,
                            			"val_baza_ron"=>$product->val_baza_ron,
                            			"val_baza_eur"=>$product->val_baza_eur,
                            			"val_baza_huf"=>$product->val_baza_huf,
                                    ]);
                        }
                }else{
                    $offerProducts=[];//ca sa nu-mi dea eroare cand e altceva decat new
                }
                //acum aducem detalii si despre utilizatorul din Portal care a creat cererea

                $user = Users::findFirst(
                                        [
                                            'conditions' => 'userid = ?1',
                                            'bind'       => [
                                                            1 => $offer->track_user_id ,
                                                        ]
                                            ,'order' => 'last_name'
                                        ]);

                if($user){
                        $user_first_name=$user->first_name;
                        $user_last_name=$user->last_name;
                        $user_email=$user->email;
                        $user_phone_nr=$user->phone_nr;
                    }else{
                        $user_first_name='';
                        $user_last_name='';
                        $user_email='';
                        $user_phone_nr='';
                }

                array_push($responce->offers, [
                            "offerId"=>$offer->id_offer,
                            "appid"=>$offer->appid,
                            "status"=>$offer->status,
                            "trackUserId"=>$offer->track_user_id,
                            "cif"=>$offer->cif,
                            "trackCancelationDate"=>$offer->track_cancelation_date,
                            "trackCreationDate"=>$offer->track_creation_date ,
                            "comandaClient"=>$offer->comanda_client ,
							"slidAdresaLivrare"=>$offer->slid_adresa_livrare ,
                            "termenLivrareSolicitat"=>$offer->termen_livrare_solicitat ,
                            "count_products"=>count($offerProducts),
                            "products"=>$products,
                            "user_first_name"=>$user_first_name,
                            "user_last_name"=>$user_last_name,
                            "user_email"=>$user_email,
                            "user_phone_nr"=>$user_phone_nr,
                            "event_action"=>$event->event_action,
                            "event_appid"=>$event->appid,
                            "from_offer_slid"=>$offer->from_offer_slid,
                            "observatii_asm"=>$offer->observatii_asm
                        ]);
                }
    }


    $responce->status="success";
    $response
        ->setJsonContent($responce)
        ->send();
}


public function getAllOffersProducts($lastSynchedAppid,$token){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->offers=[];

    $events= LogEvents::find(
                                [
                                  'conditions' => 'appid >?1 and event_action = ?2',
                                    'bind'       => [
                                            1 => $lastSynchedAppid,
                                            2 => 'new'
                                        ]
                                    ,'order'=>'appid'
                                ]
                            );

    foreach($events as $event){
        $offers= OfferProductsFromUserModel::find(
                                            [
                                              'conditions' => 'id_offer = ?1',
                                                'bind'       => [
                                                        1 => $event->object_id,
                                                    ]
                                                ,'order'=>'nr_ord asc'
                                            ]
                    );

        foreach($offers as $offer){
                array_push($responce->offers, [
                            "offerId"=>$offer->id_offer,
                            "appid"=>$offer->appid,
                            "status"=>$offer->status,
                            "productCode"=>$offer->product_code,
                            "qNrBuc"=>$offer->q_nr_buc,
                            "um1"=>$offer->um1,
                            "um2"=>$offer->um2,
                            "qUm1"=>$offer->qum1,
                            "qUm2"=>$offer->qum2,
                            "sizeLength"=>$offer->size_length,
                            "sizeWidth"=>$offer->size_width ,
                            "sizeThickness"=>$offer->size_thickness ,
                            "sizeDiameter"=>$offer->size_diameter,
                            "sizeHeight"=>$offer->size_height,
                            "sizeAlloy"=>$offer->size_alloy,
                            "sizeType"=>$offer->size_type,
                            "dorescDebitare"=>$offer->cu_debitare,
                            "cuttingLength"=>$offer->size_length_cutting,
                            "cuttingWidth"=>$offer->size_width_cutting,
                            "event_appid"=>$event->appid,
                            "observatii"=>$offer->observatii,
                            "nr_ord" => $offer->nr_ord
                        ]);
            }
    }

    $responce->status="success";
    $response
        ->setJsonContent($responce)
        ->send();
}


public function getNewOrders($lastSynchedAppid,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $responce->offers=[];

        $events= LogEvents::find(
                                    [
                                        'conditions' => 'appid >?1 and event_action=?2',
                                            'bind'       => [
                                                            1 => $lastSynchedAppid,
                                                            2 => 'offer_accept'
                                                    ]
                                            ,'order'=>'appid'
                                    ]
                            );

        foreach($events as $event){
            $offer= OfferFromUserModel::findFirst(
                                        [
                                            'conditions' => 'id_offer = ?1',
                                        'bind'       => [
                                                        1 => $event->object_id,
                                                ]
                                        ]
                                );

                if($offer){
                                array_push($responce->offers, [
                                                        "offerId"=>$offer->id_offer,
                                                        "offer_slid"=>$offer->offer_slid,
                                                        "appid"=>$offer->appid,
                                                        "status"=>$offer->status,
                                                        "trackUserId"=>$offer->track_user_id,
                                                        "cif"=>$offer->cif,
                                                        "trackDateAccept"=>$offer->track_date_accept ,
                                                        "event_action"=>$event->event_action,
                                                        "event_appid"=>$event->appid,
                                                        "nrComandaCerere"=>$offer->comanda_client,
                                                        "slidAdresaLivrare"=>$offer->slid_adresa_livrare,
                                                        "observatii_asm"=>$offer->observatii_asm,
                                                ]);
                                }
        }


        $responce->status="success";
        $response
                ->setJsonContent($responce)
                ->send();
}

}
