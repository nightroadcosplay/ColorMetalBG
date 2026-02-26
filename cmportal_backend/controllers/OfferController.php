<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter\FilterFactory;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class OfferController extends Controller
{
public function indexAction()
    {

    }


public function cancelOffer($id_offer){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responseHttp = new Response();

    $this->db->begin();
    $offer = OfferFromUserModel::findFirst(    [
        'conditions' => 'id_offer = ?1 and track_user_id=?2',
        'bind'       => [
            1 => $id_offer,
            2 => $this->session->get('userId')
        ]
    ]);

    if($offer){
        $offer->status = 'c';
        $offer->track_cancelation_date = date("Y-m-d H:i:s");
        if($offer->save() === false) {
            $responce->status="error";
            $messages = $offer->getMessages();
            foreach ($messages as $message) {
                $responce->message.=$message;
            }
            $this->db->rollback();
        }else{
            $logEvent=new LogEventsController();
            if($logEvent->logEvent($id_offer,'cancel','offer_from_user')){
                    $this->db->commit();
                    $responce->status="success";
                    $responce->message="Oferta a fost trimisa spre anulare catre ColorMetal!";
                }
                else{
                    $responce->status="error";
                    $responce->message="Log event could not be created! Reason: ".$logEvent->message;
                    $this->db->rollback();
                }
        }

    }else{
        $responce->status="error";
        $responce->message="Oferta nu poate fi identificata pentru anulare!";
    }

    $responseHttp
        ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
        ->setJsonContent($responce)
        ->send();
}


public function sendBasketForAnOffer(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responseHttp = new Response();
    $data = json_decode(file_get_contents('php://input'), true);
    //die(var_dump($data['nrComandaCerere']));
    $nrComandaCerere=trim(htmlspecialchars(strip_tags($data['nrComandaCerere'])));
    $slidAdresaLivrare=trim(filter_var( $data['slidAdresaLivrare'], FILTER_SANITIZE_NUMBER_INT));
    $termenCerere=((strlen($data['termenCerere'])==10)?$data['termenCerere']:'');
    $observatii_asm=trim(htmlspecialchars(strip_tags($data['inputFreeTextComments'])));
    $this->db->begin();
    $offer= new OfferFromUserModel();
    $offer->appid=0;
    $offer->track_user_id=$this->session->get('userId');
    $offer->comanda_client=$nrComandaCerere;
    $offer->slid_adresa_livrare=$slidAdresaLivrare;
    $offer->observatii_asm = $observatii_asm;
    if(strlen($termenCerere)==10){
        $date = DateTime::createFromFormat("d.m.Y", $termenCerere);
        $termenCerere = $date->format('Y/m/d');
        $offer->termen_livrare_solicitat=$termenCerere;
    }

    if($offer->create() === false) {
            $responce->status="error";
            $messages = $offer->getMessages();
            foreach ($messages as $message) {$responce->message.=$message;}
        }
        else {
            $logEvent=new LogEventsController();
            if($logEvent->logEvent($offer->id_offer,'new','offer_from_user')){
                            foreach($data['basket'] as $productBasket){
                                 //die(var_dump($productBasket));
                                 if($productBasket['qUm1']*1>0){
                                     $resultProduct=$this->insertProductForAnOfferFromUser($offer->id_offer,$productBasket['productCode'],$productBasket['l'],$productBasket['w'],$productBasket['t'],$productBasket['d'],$productBasket['h'],$productBasket['a'],$productBasket['um1'],$productBasket['um2'],$productBasket['qUm1'],$productBasket['qUm2'],$productBasket['dorescDebitare'],$productBasket['qBuc'],$productBasket['cuttingLength'],$productBasket['cuttingWidth'], $productBasket['observatii'], $productBasket['nr_ord'], $productBasket['tip_um']);
                                     if($resultProduct->status!="success"){
                                        $responce->status="error";
                                        $responce->message=$resultProduct->message;
                                     }
                                 }
                            }
                }
                else{
                    $responce->status="error";
                    $responce->message="Log event could not be created! Reason: ".$logEvent->message;
                }

        }
        if($responce->status=="init"){
            $responce->status="success";
            $responce->offerId=$offer->id_offer;
            $this->db->commit();

            $basket= new BasketController();
            $basket->clearMyBasket();

        }else{
            $this->db->rollback();
        }

    $responseHttp
        ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
        ->setJsonContent($responce)
        ->send();
}

public function sendCerereForNewOffer(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responseHttp = new Response();
    $data = json_decode(file_get_contents('php://input'), true);
    //die(var_dump($data['nrComandaCerere']));
    $nrComandaCerere=trim(htmlspecialchars(strip_tags($data['nrComandaCerere'])));
    $slidAdresaLivrare=trim(filter_var( $data['slidAdresaLivrare'], FILTER_SANITIZE_NUMBER_INT));
    $termenCerere=((strlen($data['termenCerere'])==10)?$data['termenCerere']:'');
    $observatii_asm=trim(htmlspecialchars(strip_tags($data['inputFreeTextComments'])));
    $this->db->begin();
    $offer= new OfferFromUserModel();
    $offer->appid=0;
    $offer->track_user_id=$this->session->get('userId');
    if(!empty($data['offerSlid'])) {
        $offerSlid=trim(filter_var( $data['offerSlid'], FILTER_SANITIZE_NUMBER_INT));
    } else {
        $offerSlid = 0;
    }
    $offer->comanda_client=$nrComandaCerere;
    $offer->from_offer_slid=$offerSlid;
    $offer->slid_adresa_livrare=$slidAdresaLivrare;
    $offer->observatii_asm = $observatii_asm;
    if(strlen($termenCerere)==10){
        $date = DateTime::createFromFormat("Y-m-d", $termenCerere);
        $termenCerere = $date->format('Y/m/d');
        $offer->termen_livrare_solicitat=$termenCerere;
    }

    if($offer->create() === false) {
        $responce->status="error";
        $messages = $offer->getMessages();
        foreach ($messages as $message) {$responce->message.=$message;}
    }
    else {
        $logEvent=new LogEventsController();
        if($logEvent->logEvent($offer->id_offer,'new','offer_from_user')){
            foreach($data['basket'] as $productBasket){
            //die(var_dump($productBasket));
                if($productBasket['qUm1']*1>0){
                    $resultProduct=$this->insertProductForAnOfferFromUser($offer->id_offer,$productBasket['productCode'],$productBasket['l'],$productBasket['w'],$productBasket['t'],$productBasket['d'],$productBasket['h'],$productBasket['a'],$productBasket['um1'],$productBasket['um2'],$productBasket['qUm1'],$productBasket['qUm2'],$productBasket['dorescDebitare'],$productBasket['qBuc'],$productBasket['cuttingLength'],$productBasket['cuttingWidth'], $productBasket['observatii'], $productBasket['nr_ord'], $productBasket['tip_um']);
                    if($resultProduct->status!="success"){
                        $responce->status="error";
                        $responce->message=$resultProduct->message;
                    }
                }
            }
        }
        else{
            $responce->status="error";
            $responce->message="Log event could not be created! Reason: ".$logEvent->message;
        }

    }
    if($responce->status=="init"){
        $responce->status="success";
        $responce->offerId=$offer->id_offer;
        $this->db->commit();

    }else{
        $this->db->rollback();
    }

    $responseHttp
        ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
        ->setJsonContent($responce)
        ->send();
}

public function insertProductForAnOfferFromUser($idOffer,$productCode,$sizeLength,$sizeWidth,$sizeThickness,$sizeDiameter,$sizeHeight,$sizeAlloy,$um1,$um2,$qum1,$qum2,$dorescDebitare,$qBuc,$cuttingLength,$cuttingWidth,$inputFreeTextComments, $nr_ord, $tip_um){
    //error_reporting(0);
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->appid=0;
    $result=false;
    $filterFactory = new FilterFactory();
    $filter = $filterFactory->newInstance();

    $product = new OfferProductsFromUserModel();
    // $product->reset();
    $product->appid=0;

    $product->id_offer=$idOffer;
    $product->product_code = trim(mb_strtoupper(strip_tags($productCode), 'UTF-8'));
    if(!empty($sizeLength)){$product->size_length= filter_var($sizeLength,  FILTER_SANITIZE_NUMBER_INT);}
    if(!empty($sizeWidth)){$product->size_width= filter_var($sizeWidth,  FILTER_SANITIZE_NUMBER_INT);}
    if(!empty($sizeThickness)){$product->size_thickness= filter_var($sizeThickness,  FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);}
    if(!empty($sizeDiameter)){$product->size_diameter= filter_var($sizeDiameter,  FILTER_SANITIZE_NUMBER_INT);}
    if(!empty($sizeHeight)){$product->size_height= filter_var($sizeHeight,  FILTER_SANITIZE_NUMBER_INT);}
    if(!empty($sizeAlloy)){$product->size_alloy= $filter->sanitize($sizeAlloy,  'string');}

    if(!empty($dorescDebitare) && $dorescDebitare==1){$product->cu_debitare='y';}

    if(!empty($qBuc)){$product->q_nr_buc= filter_var($qBuc,  FILTER_SANITIZE_NUMBER_INT);}
    if(!empty($cuttingLength)){$product->size_length_cutting= filter_var($cuttingLength,  FILTER_SANITIZE_NUMBER_INT);}
    if(!empty($cuttingWidth)){$product->size_width_cutting= filter_var($cuttingWidth,  FILTER_SANITIZE_NUMBER_INT);}

    if(!empty($um1)){$product->um1= $filter->sanitize($um1,  'string');}
    if(!empty($um2)){$product->um2= $filter->sanitize($um2,  'string');}

    if(!empty($qum1)){$product->qum1= filter_var($qum1,  FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);}
    if(!empty($qum2)){$product->qum2= filter_var($qum2,  FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);}
    if(!empty($inputFreeTextComments)){$product->observatii= $filter->sanitize($inputFreeTextComments,  'string');}
    if(!empty($nr_ord)){$product->nr_ord= filter_var($nr_ord,  FILTER_SANITIZE_NUMBER_INT);}
    $product->tip_um = $tip_um;

    try {
        $result=$product->save();
    }
    catch (PDOException $e) {
        $responce->status="error";
        $responce->message.=$e->getMessage();
        // die(var_dump($e->getMessage()));
    }

    if (!$result) {
            $responce->status="error";
            $responce->message='Error for product code '.$productCode;
            $messages = $product->getMessages();
            if($messages) {
                foreach ($messages as $message) {
                    $responce->message.=$message;
                }
            }
    }else{
        $responce->status="success";
        $responce->message="Produsul a fost adaugat cu succes!";
    }

    //mai departe ajunge numai daca nu sunt erori
    return $responce;
}

public function sendCerereForNewOffer2(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responseHttp = new Response();
    $data = json_decode(file_get_contents('php://input'), true);
    //die(var_dump($data['nrComandaCerere']));
    $nrComandaCerere=trim(strip_tags($data['nrComandaCerere']));
    $offerSlid=trim(filter_var( $data['offerSlid'], FILTER_SANITIZE_NUMBER_INT));
    $slidAdresaLivrare=trim(filter_var( $data['slidAdresaLivrare'], FILTER_SANITIZE_NUMBER_INT));
    $termenCerere=((strlen($data['termenCerere'])==10)?$data['termenCerere']:'');
    $observatii_asm=trim(strip_tags($data['inputFreeTextComments']));
    $this->db->begin();
    $offer= new OfferFromUserModel();
    $offer->appid=0;
    $offer->track_user_id=$this->session->get('userId');
    $offer->comanda_client=$nrComandaCerere;
    $offer->from_offer_slid=$offerSlid;
    $offer->slid_adresa_livrare=$slidAdresaLivrare;
    $offer->observatii_asm = $observatii_asm;
    if(strlen($termenCerere)==10){
        $date = DateTime::createFromFormat("Y-m-d", $termenCerere);
        $termenCerere = $date->format('Y/m/d');
        $offer->termen_livrare_solicitat=$termenCerere;
    }

    // die(var_dump($data['basket']));

    if($offer->create() === false) {
        $responce->status="error";
        $messages = $offer->getMessages();
        foreach ($messages as $message) {$responce->message.=$message;}
    } else {
        $logEvent=new LogEventsController();
        if($logEvent->logEvent($offer->id_offer,'new','offer_from_user')) {
            foreach($data['basket'] as $productBasket){
                $resultProduct=$this->insertProductForAnOfferFromUser2($offer->id_offer,$productBasket);
                if($resultProduct->status!="success"){
                    $responce->status="error";
                    $responce->message=$resultProduct->message;
                }
            }
        }
        else{
            $responce->status="error";
            $responce->message="Log event could not be created! Reason: ".$logEvent->message;
        }

    }
    if($responce->status=="init"){
        $responce->status="success";
        $responce->offerId=$offer->id_offer;
        $this->db->commit();

    }else{
        $this->db->rollback();
    }

    $responseHttp
    ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
    ->setJsonContent($responce)
    ->send();
}

public function insertProductForAnOfferFromUser2($idOffer,$productBasket){
    //error_reporting(0);
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->appid=0;
    $result=false;
    $filterFactory = new FilterFactory();
    $filter = $filterFactory->newInstance();
    // die(var_dump($filter->sanitize($sizeThickness,  'float')));

    $product = new OfferProductsFromUserModel();
    // $product->reset();
    $product->appid=0;
    $product->id_offer=$idOffer;

    $productCode = $productBasket['productCode'];
    $sizeLength = $productBasket['l'];
    $sizeWidth = $productBasket['w'];
    $sizeThickness = $productBasket['t'];
    $sizeDiameter = $productBasket['d'];
    $sizeHeight = $productBasket['h'];
    $sizeAlloy = $productBasket['a'];
    $um1 = $productBasket['um1'];
    $um2 = $productBasket['um2'];
    $qum1 = $productBasket['q1'];
    $qum2 = $productBasket['q2'];
    $qBuc = $productBasket['nrBuc'];
    $cuttingLength = $productBasket['sizeLengthFromSales'];
    $cuttingWidth = $productBasket['sizeWidthFromSales'];
    $inputFreeTextComments = $productBasket['observatii'];
    $nr_ord = $productBasket['nr_ord'];

    $product->product_code = trim(mb_strtoupper(strip_tags($productCode), 'UTF-8'));
    if(!empty($sizeLength)){$product->size_length= $filter->sanitize($sizeLength,  'int');}
    if(!empty($sizeWidth)){$product->size_width= $filter->sanitize($sizeWidth,  'int');}
    if(!empty($sizeThickness)){$product->size_thickness= $filter->sanitize($sizeThickness,  'float');}
    if(!empty($sizeDiameter)){$product->size_diameter= $filter->sanitize($sizeDiameter,  'int');}
    if(!empty($sizeHeight)){$product->size_height= $filter->sanitize($sizeHeight,  'int');}
    if(!empty($sizeAlloy)){$product->size_alloy= $filter->sanitize($sizeAlloy,  'string');}

    if(!empty($qBuc)){$product->q_nr_buc= $filter->sanitize($qBuc,  'int');}
    if(!empty($cuttingLength)){$product->size_length_cutting= $filter->sanitize($cuttingLength,  'int');}
    if(!empty($cuttingWidth)){$product->size_width_cutting= $filter->sanitize($cuttingWidth,  'int');}

    if(!empty($um1)){$product->um1= $filter->sanitize($um1,  'string');}
    if(!empty($um2)){$product->um2= $filter->sanitize($um2,  'string');}

    if(!empty($qum1)){$product->qum1= $filter->sanitize($qum1,  'float');}
    if(!empty($qum2)){$product->qum2= $filter->sanitize($qum2,  'float');}
    if(!empty($inputFreeTextComments)){$product->observatii= $filter->sanitize($inputFreeTextComments,  'string');}
    if(!empty($nr_ord)){$product->nr_ord= $filter->sanitize($nr_ord,  'int');}

    // die(var_dump($product->size_thickness));
    $product->cu_debitare                =$productBasket['cuDebitare'];                 
    $product->id_depozit                 =$productBasket['idDepozit'];
    $product->termen_livrare             =$productBasket['termenLivrare'];
    $product->pret_mediu_calculat_um1_ron=$productBasket['pretMediuCalculatUM1RON'];
    $product->pret_mediu_calculat_um1_eur=$productBasket['pretMediuCalculatUM1EUR'];
    $product->pret_mediu_calculat_um2_ron=$productBasket['pretMediuCalculatUM2RON'];
    $product->pret_mediu_calculat_um2_eur=$productBasket['pretMediuCalculatUM2EUR'];
    $product->pret_mediu_calculat_um1_huf=$productBasket['pretMediuCalculatUM1HUF'];
    $product->pret_mediu_calculat_um2_huf=$productBasket['pretMediuCalculatUM2HUF'];
    $product->val_finala_fara_tva_ron    =$productBasket['valFinalaFaraTvaRON'];
    $product->val_tva_ron                =$productBasket['valTvaRON'];
    $product->val_finala_cu_tva_ron      =$productBasket['valFinalaCuTvaRON'];
    $product->val_finala_fara_tva_eur    =$productBasket['valFinalaFaraTvaEUR'];
    $product->val_tva_eur                =$productBasket['valTvaEUR'];
    $product->val_finala_cu_tva_eur      =$productBasket['valFinalaCuTvaEUR'];
    $product->val_finala_fara_tva_huf    =$productBasket['valFinalaFaraTvaHUF'];
    $product->val_tva_huf                =$productBasket['valTvaHUF'];
    $product->val_finala_cu_tva_huf      =$productBasket['valFinalaCuTvaHUF'];
    $product->cost_livrare_ron           =$productBasket['costLivrareRON'];
    $product->cost_livrare_eur           =$productBasket['costLivrareEUR'];
    $product->cost_livrare_huf           =$productBasket['costlivrareHUF'];
    $product->discount_proc              =$productBasket['discount_proc'];
    $product->tip_um                     =$productBasket['tip_um'];
    $product->tva_proc                   =$productBasket['tvaProc'];
    $product->cu_cheltuieli_transport    =$productBasket['cuCheltuieliTransport'];
    $product->curseur                    =$productBasket['curseur'];
    $product->q_kg                       =$productBasket['qKg'];
    $product->um1_to_um2                 =$productBasket['um1_to_um2'];
    $product->val_baza_ron               =$productBasket['val_baza_ron'];
    $product->val_baza_eur               =$productBasket['val_baza_eur'];
    $product->val_baza_huf               =$productBasket['val_baza_huf'];
    
    try {
        $result=$product->save();
    }
    catch (PDOException $e) {
                            $responce->status="error";
                            $responce->message.=$e->getMessage();
                            }

    // die(var_dump($result));
    if (!$result) {
            $responce->status="error";
            $responce->message='Error for product code '.$productCode;
            $messages = $product->getMessages();
            // if($messages) {
                foreach ($messages as $message) {
                    $responce->message.=$message;
                }
            // }
    }else{
        $responce->status="success";
        $responce->message="Produsul a fost adaugat cu succes!";
    }

    //mai departe ajunge numai daca nu sunt erori
    return $responce;
}


public function getOffer($id_offer){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
//    $responce->productsFromSales=[];
    $cif=$this->session->get('cif');
    $userId = $this->session->get('userId');
//die(var_dump($cif));

    $offerHeader= OfferFromUserAdaptedColsModel::findFirst(
                                        [
                                        'conditions' => 'cif = ?1 and offerId = ?2',
                                        'bind'       => [
                                                1 => $cif,
                                                2 => $id_offer
                                            ]
                                        ]
                                    );
    if ($offerHeader && strlen($offerHeader->cif)>0) {
        $responce->status="success";
        $responce->offerHeader=$offerHeader;
        $responce->productsFromSales= OfferArticlesFromSalesAdaptedColsModel::find(
                                            [
                                            'conditions' => 'offerId = ?1',
                                            'bind'       => [
                                                    1 => $id_offer
                                                ],
                                            'order' => 'nr_ord asc'
                                            ]
                                        );
        if($offerHeader->viewed == 'n') {
            $count = CountNewDataModel::findFirst([
                'conditions' => 'cif = ?1 and userid = ?2',
                'bind' => [
                        1 => $cif,
                        2 => $userId
                    ]
            ]);
            if($count && $count->oferte > 0) {
                $count->oferte = $count->oferte - 1;
                $count->update();
            }
            $this->db->query("update portal_color.offer_from_user set viewed = 'y' where id_offer = :offerId", array(':offerId' => $offerHeader->offerId));
        }

     }else{
        $responce->status="error";
        $responce->message="Nu poate fi identificata oferta!";
     }

    $response
        ->setJsonContent($responce)
        ->send();
}

public function sendAcceptOffer($id_offer){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responseHttp = new Response();
    
    $this->db->begin();
    $offer = OfferFromUserModel::findFirst(    [
        'conditions' => 'id_offer = ?1',
        'bind'       => [
            1 => $id_offer
        ]
    ]);

    if($offer){
        $now = new DateTime();
        $date_when_offer_expire = new DateTime($offer->date_when_offer_expire);
        $difTime=$now->getTimestamp()-$date_when_offer_expire->getTimestamp();
        //die(var_dump($difTime));
        if($difTime > 3600){
          $responce->status="error";
          $responce->message="Termenul ofertei este expirat!";
          $this->db->rollback();
        }
        else{
              $offer->status = 'k';//comanda-oferta acceptata
              $offer->track_date_accept = date("Y-m-d H:i:s");
              if($offer->save() === false) {
                  $responce->status="error";
                  $messages = $offer->getMessages();
                  foreach ($messages as $message) {
                      $responce->message.=$message;
                  }
                  $this->db->rollback();
              }else{
                  $logEvent=new LogEventsController();
                  if($logEvent->logEvent($id_offer,'offer_accept','offer_from_user')){
                          $this->db->commit();
                          $responce->status="success";
                          $responce->message="Comanda a fost trimisa catre ColorMetal!";
                      }
                      else{
                          $responce->status="error";
                          $responce->message="Log event could not be created! Reason: ".$logEvent->message;
                          $this->db->rollback();
                      }
              }
          }
    }else{
        $responce->status="error";
        $responce->message="Oferta nu poate fi identificata pentru acceptare!";
    }

    $responseHttp
        ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
        ->setJsonContent($responce)
        ->send();
}

public function getMyOffers(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->offers=[];
    $userid=$this->session->get('userId');
    $cif=$this->session->get('cif');

    $user = Users::findFirstByUserid($userid);

    if($user) {

    // if(strpos($user->email, '@color-metal.ro') !== false) {
        $offers= VOfferFromUser::find(
                                        [
                                    'conditions' => 'status!=?1 and cif = ?2',
                                    'bind'       => [
                                                    1 => 'c', //c-Anulat
                                                    2 => $cif
                                                    ],
                                    'order'=>'id_offer desc'
                                        ]
                );
        // } else {

            // $offers= OfferFromUserModel::find(
                        //                         [
                        //                     'conditions' => 'track_user_id = ?1 and status!=?2 and cif = ?3',
                        //                     'bind'       => [
                        //                                     1 =>  $userid,
                        //                                     2 => 'c', //c-Anulat
                        //                                     3 => $cif
                        //                                     ],
                        //                     'order'=>'id_offer desc'
                        //                         ]
                        // );
        // }

        foreach($offers as $offer){
            $invoices = [];
            $invoicesDB= InvoicesModel::find(
                                    [
                                    'conditions' => 'id_oferta = ?1',
                                    'bind' => [
                                            1 => $offer->offer_slid
                                          ]
                                    ]
                );
            foreach($invoicesDB as $invoice){
                array_push($invoices, [
                            "id"=>$invoice->bill_nr,
                            "data"=>substr($invoice->bill_data,0,16),
                            "valoare"=>round($invoice->amount_including_vat,2),
                            "moneda"=>$invoice->id_valuta,
                            "nrZileDepasireTermenPlata"=>$invoice->nr_zile_depasire_termen_plata,
                            "restDeAchitat"=>round($invoice->remaining_amount, 2),
                            "dataScadenta"=>$invoice->bill_due_date,
                            "isInvoiceOverdue"=>$invoice->nr_zile_depasire_termen_plata
                        ]);
            }
            array_push($responce->offers, [
                        "offerId"=>$offer->id_offer,
                        "offerSlid"=>$offer->offer_slid,
                        "status"=>$offer->status,
                        "trackCreationDate"=>$offer->track_creation_date ? substr($offer->track_creation_date,0,16) : null,
                        "trackDateOfertare"=>$offer->track_date_ofertare ? substr($offer->track_date_ofertare,0,16) : null,
                        "trackDateAccept"=>$offer->track_date_accept ? substr($offer->track_date_accept,0,16) : null,
                        "dateWhenOfferExpire"=>$offer->date_when_offer_expire ? substr($offer->date_when_offer_expire,0,16) : null,
                        "comandaClient"=>$offer->comanda_client,
                        "termenLivrareSolicitat"=>$offer->termen_livrare_solicitat,
                        "invoices" => $invoices,
                        "track_user_id"=>$offer->track_user_id,
                        "nume_utilizator"=>$offer->nume_utilizator
                    ]);
        } 
    } else {
        $responce->status = 'error';
        $responce->message = 'Nu poate fi identificat userul in baza de date';
    }

    
    $responce->status="success";
    $response
        ->setJsonContent($responce)
        ->send();
}


public function delete($appid){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->products=[];
    $userid=$this->session->get('userId');

    $product= BasketModel::findFirst(
                                        [
                                        'conditions' => 'userid = ?1 and appid = ?2',
                                        'bind'       => [
                                                1 => $userid,
                                                2 => $appid
                                            ]
                                        ]
                                    );
    if ($product->delete() === false) {
       $messages = $product->getMessages();
        foreach ($messages as $message) {
            $responce->message.=$message;
        }
     }else{
        $responce->status="success";
     }

    $response
        ->setJsonContent($responce)
        ->send();
}

}
