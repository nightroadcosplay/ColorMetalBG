<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter\FilterFactory;

class FavoritesController extends Controller
{
public function indexAction()
    {

    }


public function getArticleByCodeAndPutIntoFavorites(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $productCode=$_POST['productCode'];
    $qUm1=$_POST['qUm1'];
    $qUm2=$_POST['qUm2'];

    $Articol= new ArticolController();
    $articolResponse=$Articol->getArticleByProductCode($productCode);
    if($articolResponse->status=="success"){
        $identifiedArticol=$articolResponse->product;
         //verific sa nu fie deja in favorite
        $favorite= FavoritesModel::findFirst(
                                         [
                                        'conditions' => 'userid = ?1 and pid_product=?2',
                                        'bind'       => [
                                                            1 => $this->getDI()->getSession()->get('userId'), 2 =>$identifiedArticol->pid
                                                        ]
                                        ]
            );
        if($favorite !== false){
                        $responce->status="error";
                        $responce->message="Acest articol este deja in lista dvs. de favorite";
                    }
            else{
                $responce=$this->insert($identifiedArticol->categoryPid,$identifiedArticol->pid,$identifiedArticol->code,$identifiedArticol->sizeLength,$identifiedArticol->sizeWidth,$identifiedArticol->sizeThickness,$identifiedArticol->sizeDiameter,$identifiedArticol->sizeHeight,$identifiedArticol->sizeAlloy,$identifiedArticol->sizeType,$identifiedArticol->um1,$identifiedArticol->um2,$qUm1, $qUm2);
                if($responce->status=="success"){
                                                    $favorite= VFavoritesModel::findFirst(
                                                        [
                                                            'appid'=>$responce->appid
                                                        ]
                                                    );
                                                    $responce->productName=$favorite->product_name_ro;
                                                    $responce->categoryName=$favorite->category_name_ro;
                                                    }
                }
        }
        else{//nu a putut fi identificat articolul
                $responce->status=$identifiedArticol->status;
                $responce->message=$identifiedArticol->message;
            }

    $response
        ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
        ->setJsonContent($responce)
        ->send();
}

public function identifyArticleAndPutIntoFavorites(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $pidCategory=$_POST['pidCategory'];
    $selectedLength=$_POST['selectedLength'];
    $selectedWidth=$_POST['selectedWidth'];
    $selectedThickness=$_POST['selectedThickness'];
    $selectedDiameter=$_POST['selectedDiameter'];
    $selectedHeight=$_POST['selectedHeight'];
    $selectedAlloy=$_POST['selectedAlloy'];
    $selectedType=$_POST['selectedType'];
    $selectedRollWeight=$_POST['selectedRollWeight'];
    $um1=$_POST['um1'];
    $um2=$_POST['um2'];
    $qUm1=$_POST['qUm1'];
    $qUm2=$_POST['qUm2'];

    $cleaned = trim($pidCategory, '{}'); // "25,26,55"

    // 2) Split into an array
    $arr = explode(',', $cleaned); // ["25", "26", "55"]

    // 3) Convert each to integer (if needed)
    $arr = array_map('intval', $arr); // [25, 26, 55]


    $browseArticol= new BrowseArticleController();
    $identifiedArticol=$browseArticol->identifyArticleInDB($arr[0],$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter,$selectedHeight,$selectedAlloy,$selectedType,$selectedRollWeight);
    if($identifiedArticol->status=="success"){
        // die(var_dump($identifiedArticol));
        //verific sa nu fie deja in favorite
        $favorite= FavoritesModel::findFirst(
                                             [
                                            'conditions' => 'userid = ?1 and pid_product=?2',
                                            'bind'       => [
                                                                1 => $this->getDI()->getSession()->get('userId'), 2 =>$identifiedArticol->productPid
                                                            ]
                                            ]
                );
        // die(var_dump($favorite));
        if($favorite){
                $responce->status="error";
                $responce->message="Acest articol este deja in lista dvs. de favorite";
        }else{
            $responce=$this->insert($identifiedArticol->categoryPid,$identifiedArticol->productPid,$identifiedArticol->productCode,$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter,$selectedHeight,$selectedAlloy,$selectedType,$um1,$um2,$qUm1, $qUm2);
            if($responce->status=="success"){
                                            $favorite= VFavoritesModel::findFirst(
                                                [
                                                    'appid'=>$responce->appid
                                                ]
                                            );
                                            // $responce->productName=$favorite->product_name_ro;
                                            // $responce->categoryName=$favorite->category_name_ro;
                                            }
        }
        }
        else{//nu a putut fi identificat articolul
                $responce->status=$identifiedArticol->status;
                $responce->message=$identifiedArticol->message;
            }

    $response
        ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
        ->setJsonContent($responce)
        ->send();
}

public function insert($categoryPid,$productPid,$productCode,$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter,$selectedHeight,$selectedAlloy,$selectedType,$um1,$um2,$qUm1, $qUm2){
    //error_reporting(0);
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->appid=0;
    $result=false;
    $filterFactory = new FilterFactory();
    $filter = $filterFactory->newInstance();

    $favorite = new FavoritesModel();
    // $favorite->reset();
    $favorite->appid=0;
    $favorite->userid=$this->session->get('userId');


    $favorite->product_code = trim(mb_strtoupper($filter->sanitize( $productCode, 'string'),$encoding = 'UTF-8'));
    //$product->userid = trim(mb_strtoupper(filter_var( $_POST['name'], FILTER_SANITIZE_STRING),$encoding = 'UTF-8'));
    $favorite->pid_category= $filter->sanitize($categoryPid,  'int');
    $favorite->pid_product= $filter->sanitize($productPid,  'int');
    if(!empty($um1)){$favorite->um1=$um1;}
    if(!empty($um2)){$favorite->um2=$um2;}
    if(!empty($qUm1)){$favorite->qum1=$qUm1;}
    if(!empty($qUm2)){$favorite->qum2=$qUm2;}
    if(!empty($selectedLength)){$favorite->size_length= $filter->sanitize($selectedLength,  'int');}
    if(!empty($selectedWidth)){$favorite->size_width= $filter->sanitize($selectedWidth,  'int');}
    if(!empty($selectedThickness)){$favorite->size_thickness= $filter->sanitize($selectedThickness,  'int');}
    if(!empty($selectedDiameter)){$favorite->size_diameter= $filter->sanitize($selectedDiameter,  'int');}
    if(!empty($selectedHeight)){$favorite->size_height= $filter->sanitize($selectedHeight,  'int');}
    if(!empty($selectedAlloy)){$favorite->size_alloy= $filter->sanitize($selectedAlloy,  'string');}
    if(!empty($selectedType)){$favorite->size_type= $filter->sanitize($selectedType,  'string');}

    try {
        $result=$favorite->save();
    }
    catch (PDOException $e) {
                            $responce->status="error";
                            $responce->message.=$e->getMessage();
                            }

    if (!$result) {
            $responce->status="error";
            $responce->message='Error for product code '.$productCode;
            $messages = $favorite->getMessages();
            foreach ($messages as $message) {
                $responce->message.=$message;
            }
    }else{
        $responce->status="success";
        $responce->message="Produsul a fost adaugat cu succes!";
    }

    //mai departe ajunge numai daca nu sunt erori
    $responce->appid=$favorite->appid;
    $responce->categoryPid=$categoryPid;
    $responce->productPid=$productPid;
    $responce->productCode=$productCode;
    return $responce;
}


public function getAllMyFvorites(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->products=[];
    $userid=$this->session->get('userId');

    $products= VFavoritesModel::find(
                                     [
                                    'conditions' => 'userid = ?1',
                                    'bind'       => [
                                                    1 => $userid,
                                                ],
                                    'order' => 'track_date DESC',
                                    ]
                                );

    foreach($products as $product){
            array_push($responce->products, [
                        "appid"=>$product->appid,
                        "categoryPid"=>$product->pid_category,
                        "productPid"=>$product->pid_product,
                        "productCode"=>$product->product_code ,
                        "productNameRO"=>$product->product_name_ro,
                        "productNameEN"=>$product->product_name_en,
                        "productNameBG"=>$product->product_name_bg,
                        "qBuc"=>$product->q_nr_buc,
                        "um1"=>$product->um1,
                        "um2"=>$product->um2,
                        "um1_to_um2"=>$product->um1_to_um2,
                        "qUm1"=>$product->qum1,
                        "qUm2"=>$product->qum2,
                        "l"=>$product->size_length,
                        "w"=>$product->size_width,
                        "t"=>$product->size_thickness,
                        "d"=>$product->size_diameter,
                        "h"=>$product->size_height,
                        "a"=>$product->size_alloy,
                        "k"=>$product->size_type
                    ]);
        }


    $responce->status="success";
    $response
        ->setJsonContent($responce)
        ->send();
}


public function delete($productCode){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->products=[];
    $userid=$this->session->get('userId');

    $product= FavoritesModel::findFirst(
                                        [
                                        'conditions' => 'userid = ?1 and product_code = ?2',
                                        'bind'       => [
                                                1 => $userid,
                                                2 => $productCode
                                            ]
                                        ]
                                    );
    if($product){
    if ($product->delete() === false) {
        $responce->status="error";
       $messages = $product->getMessages();
        foreach ($messages as $message) {
            $responce->message.=$message;
        }
     }else{
        $responce->status="success";
     }
    }
    else{
        $responce->status="error";
        $responce->message="Nu poate fi identificat articolul";
    }


    $response
        ->setJsonContent($responce)
        ->send();
}

}
