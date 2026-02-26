<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class CerereController extends Controller
{
public function indexAction()
    {

    }


public function getCerere($id_offer){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->products=[];
    $cif=$this->session->get('cif');

    $offerHeader= OfferFromUserAdaptedColsModel::findFirst(
                                        [
                                        'conditions' => 'cif = ?1 and offerId = ?2',
                                        'bind'       => [
                                                1 => $cif,
                                                2 => $id_offer
                                            ]
                                        ]
                                    );
    // die(var_dump($offerHeader));
    if ($offerHeader && strlen($offerHeader->cif)>0) {
        $responce->status="success";
        $responce->offerHeader=$offerHeader;
        // $products= VCerereProducts::findByIdOffer($id_offer);

        $products= VCerereProducts::find(
                            [
                            'conditions' => 'id_offer = ?1 ',
                            'bind'       => [
                                    1 => $id_offer
                                ],
                            'order' => 'nr_ord asc'    
                            ]
                    );
        foreach($products as $product){
                array_push($responce->products, [
                    "appid"=>$product->appid,
                    "categoryPid"=>$product->pid_category,
                    "productPid"=>$product->pid_product ,
                    "productCode"=>$product->product_code ,
                    "productName"=>$product->product_name_ro ,
                    "qBuc"=>$product->q_nr_buc,
                    "q_um_base"=>'',
                    "qUm1"=>1*$product->qum1,
                    "um1"=>$product->um1,
                    "qUm2"=>1*$product->qum2,
                    "um2"=>$product->um2,
                    "l"=>$product->size_length,
                    "w"=>$product->size_width,
                    "t"=>$product->size_thickness,
                    "h"=>$product->size_height,
                    "d"=>$product->size_diameter,
                    "a"=>$product->size_alloy,
                    "k"=>$product->size_type,
                    "dorescDebitare"=>($product->cu_debitare=='y'?1:0),
                    "cuttingLength"=>$product->size_length_cutting,
                    "cuttingWidth"=>$product->size_width_cutting,
                    "observatii"=>$product->observatii,
                    "nr_ord"=>$product->nr_ord,
                    "tip_um"=>$product->tip_um ? $product->tip_um : 'um12'
                ]);
    }


     }else{
        $responce->status="error";
        $responce->message="Nu poate fi identificata oferta!";
     }

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
