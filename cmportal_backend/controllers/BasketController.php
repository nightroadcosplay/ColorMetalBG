<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter\FilterFactory;

class BasketController extends Controller
{
public function indexAction()
    {

    }


public function identifyArticleAndPutIntoBasket(){
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
    $nrBuc=$_POST['nrBucati'];
    $dorescDebitare=$_POST['dorescDebitare'];
    $cuttingLength=$_POST['cuttingLength']; 
    $cuttingWidth=$_POST['cuttingWidth'];
    $tip_um = $_POST['tip_um'];
    if(isset($_POST['inputFreeTextComments'])){
      $inputFreeTextComments=$_POST['inputFreeTextComments'];
    } else{$inputFreeTextComments='';  }

    $browseArticol= new BrowseArticleController();
    $identifiedArticol=$browseArticol->identifyArticleInDB($pidCategory,$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter,$selectedHeight,$selectedAlloy,$selectedType,$selectedRollWeight);
    if($identifiedArticol->status=="success"){
        $responce=$this->insert($identifiedArticol->categoryPid,$identifiedArticol->productPid,$identifiedArticol->productCode,$nrBuc,$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter,$selectedHeight,$selectedAlloy,$selectedType,$um1,$um2,$qUm1, $qUm2,$dorescDebitare,$cuttingLength, $cuttingWidth, $inputFreeTextComments, $tip_um);

        if($responce->status=="success"){
                $productInBasket= VBasketModel::findFirst(
                    [
                        'appid'=>$responce->appid
                    ]
                );
                $responce->productName=$productInBasket->product_name_ro ?? null;
                $responce->categoryName=$productInBasket->category_name_ro ?? null;
        }

    }else{//nu exista articolul, poate vrea alte dimensiuni
        if(strlen($inputFreeTextComments)>3){
          $responce=$this->insert($identifiedArticol->categoryPid,$identifiedArticol->categoryPid,$identifiedArticol->categoryPid,$nrBuc,$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter,$selectedHeight,$selectedAlloy,$selectedType,$nrBucati,$inputFreeTextComments, $tip_um);
        }else{
            $responce->status=$identifiedArticol->status;
            $responce->message=$identifiedArticol->message;
          }
    }

    $response
        ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
        ->setJsonContent($responce)
        ->send();
}

public function getArticleByCodeAndPutIntoBasket(){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $productCode=$_POST['productCode'];
        $qUm1=$_POST['qUm1'];
        $qUm2=$_POST['qUm2'];
        if(isset($_POST['inputFreeTextComments'])){
            $inputFreeTextComments=$_POST['inputFreeTextComments'];
        } else{$inputFreeTextComments='';  }

        $Articol= new ArticolController();
        $articolResponse=$Articol->getArticleByProductCode($productCode);
        if($articolResponse->status=="success"){
            $identifiedArticol=$articolResponse->product;
            
            $cleaned = trim($identifiedArticol->categoryPid, '{}'); // "25,26,55"

            // 2) Split into an array
            $arr = explode(',', $cleaned); // ["25", "26", "55"]

            // 3) Convert each to integer (if needed)
            $arr = array_map('intval', $arr); // [25, 26, 55]

                $responce=$this->insert($arr[0],
                $identifiedArticol->pid,
                $identifiedArticol->code,
                $identifiedArticol->sizeLength,
                $identifiedArticol->sizeWidth,
                $identifiedArticol->sizeThickness,
                $identifiedArticol->sizeDiameter,
                $identifiedArticol->sizeHeight,
                $identifiedArticol->sizeAlloy,
                $identifiedArticol->sizeType,
                $identifiedArticol->um1,
                $identifiedArticol->um2,
                $qUm1, 
                $qUm2, 
                $inputFreeTextComments);

                if($responce->status=="success"){
                                $productInBasket= VBasketModel::findFirst(
                                        [
                                                'appid'=>$responce->appid
                                        ]
                                );
                                // $responce->productName=$productInBasket->product_name_ro;
                                // $responce->categoryName=$productInBasket->category_name_ro;
                }

        }else{//nu exista articolul, poate vrea alte dimensiuni
                if(strlen($inputFreeTextComments)>3){
                    $responce=$this->insert($identifiedArticol->categoryPid,$identifiedArticol->categoryPid,$identifiedArticol->categoryPid,$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter,$selectedHeight,$selectedAlloy,$selectedType,$nrBucati,$inputFreeTextComments);
                }else{
                        $responce->status=$identifiedArticol->status;
                        $responce->message=$identifiedArticol->message;
                    }
        }

        $response
                ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
                ->setJsonContent($responce)
                ->send();
}

public function insert($pidCategory,$productPid,$productCode,$nrBuc,$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter,
                        $selectedHeight,$selectedAlloy,$selectedType,$um1,$um2,$qUm1,$qUm2,$dorescDebitare,$cuttingLength, $cuttingWidth,
                        $inputFreeTextComments, $tip_um){
    //error_reporting(0);
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->appid=0;
    $result=false;
    $filterFactory = new FilterFactory();
    $filter = $filterFactory->newInstance();
    $userid=$this->session->get('userId');
    if(!isset($userid)) {
        $responce->status="error";
        $responce->message='Sesiunea a expirat!';
        return $responce;
    }

    $alreadyInBasket=false;
    // die(var_dump($userid));
    //$nrBucati=$filter->sanitize($nrBucati,  [Filter::FILTER_INT]);
//die(var_dump($productCode));
    // $product= BasketModel::findFirst(
    //                 [
    //                 'conditions' => 'userid = ?1 and product_code=?2',
    //                 'bind'       => [
    //                         1 => $userid,
    //                         2 => $productCode
    //                     ]
    //                 ]
    //             );
    // if($product){
    //     $alreadyInBasket=true;
    //     if(!empty($dorescDebitare)){//verificam sa nu fie situatia in care e deja in cos, dar fara debitare
    //         if($dorescDebitare=='y' && $product->cu_debitare=='n'){
    //             $responce->status="error";
    //             $responce->message='Aveti deja in cos acest produs, si e fara debitare!';
    //             return $responce;
    //         }
    //         if($dorescDebitare=='n' && $product->cu_debitare=='n'){
    //             $product->qum1=$product->qum1+$qUm1;
    //             if(!empty($qUm1)){$product->qum2=$product->qum2+$qUm2;}
    //         }
    //         if($dorescDebitare=='y' && $product->cu_debitare=='y'){
    //             if($product->size_length_cutting==$cuttingLength){
    //                 $product->qum1=$product->qum1+$qUm1;
    //                 if(!empty($qUm1)){$product->qum2=$product->qum2+$qUm2;}
    //                 if(!empty($nrBuc)){$product->q_nr_buc=$product->q_nr_buc+$nrBuc;}
    //             }else{
    //                 $alreadyInBasket=false;
    //                 $product = new BasketModel();
    //                 $product->reset();
    //                 $product->userid=$userid;
    //                 $product->product_code = trim(mb_strtoupper(filter_var( $productCode, FILTER_SANITIZE_STRING),$encoding = 'UTF-8'));
    //                 $product->pid_category= $filter->sanitize($pidCategory,  [Filter::FILTER_INT]);
    //                 $product->pid_product= $filter->sanitize($productPid,  [Filter::FILTER_INT]);
    //                 if(!empty($um1)){$product->um1=$um1;}
    //                 if(!empty($um2)){$product->um2=$um2;}
    //                 if(!empty($qUm1)){$product->qum1=$qUm1;}
    //                 if(!empty($qUm2)){$product->qum2=$qUm2;}
    //                 if(!empty($nrBuc)){$product->q_nr_buc= $filter->sanitize($nrBuc,  [Filter::FILTER_INT]);}
    //                 if(!empty($selectedLength)){$product->size_length= $filter->sanitize($selectedLength,  [Filter::FILTER_INT]);}
    //                 if(!empty($selectedWidth)){$product->size_width= $filter->sanitize($selectedWidth,  [Filter::FILTER_INT]);}
    //                 if(!empty($selectedThickness)){$product->size_thickness= $filter->sanitize($selectedThickness,  [Filter::FILTER_FLOAT]);}
    //                 if(!empty($selectedDiameter)){$product->size_diameter= $filter->sanitize($selectedDiameter,  [Filter::FILTER_INT]);}
    //                 if(!empty($selectedHeight)){$product->size_height= $filter->sanitize($selectedHeight,  [Filter::FILTER_INT]);}
    //                 if(!empty($selectedAlloy)){$product->size_alloy= $filter->sanitize($selectedAlloy,  [Filter::FILTER_STRING]);}
    //                 if(!empty($selectedType)){$product->size_type= $filter->sanitize($selectedType,  [Filter::FILTER_STRING]);}
    //                 if(!empty($dorescDebitare)){$product->cu_debitare= $filter->sanitize($dorescDebitare,  [Filter::FILTER_STRING]);}
    //                 if(!empty($cuttingLength)){$product->size_length_cutting= $filter->sanitize($cuttingLength,  [Filter::FILTER_INT]);}
    //                 if(!empty($cuttingWidth)){$product->size_width_cutting= $filter->sanitize($cuttingWidth,  [Filter::FILTER_INT]);}
    //                 if(!empty($inputFreeTextComments)){$product->free_comments= $filter->sanitize($inputFreeTextComments,  [Filter::FILTER_STRING]);}
    //                 $product->tip_um = $tip_um;
    //             }
    //         }

    //     } else {
    //         $product->qum1=$product->qum1+$qUm1;
    //         if(!empty($qUm1)){$product->qum2=$product->qum2+$qUm2;}
    //     }
    // } else {
        $alreadyInBasket=false;
        $product = new BasketModel();
        // $product->reset();
        $product->userid=$userid;
        $product->product_code = trim(mb_strtoupper(htmlspecialchars(strip_tags($productCode)), 'UTF-8'));
        $product->pid_category= $filter->sanitize($pidCategory,  'int');
        $product->pid_product= $filter->sanitize($productPid,  'int');
        if(!empty($um1)){$product->um1=$um1;}
        if(!empty($um2)){$product->um2=$um2;}
        if(!empty($qUm1)){$product->qum1=$qUm1;}
        if(!empty($qUm2)){$product->qum2=$qUm2;}
        if(!empty($nrBuc)){$product->q_nr_buc= $filter->sanitize($nrBuc,  'int');}
        if(!empty($selectedLength)){$product->size_length= $filter->sanitize($selectedLength,  'int');}
        if(!empty($selectedWidth)){$product->size_width= $filter->sanitize($selectedWidth,  'int');}
        if(!empty($selectedThickness)){$product->size_thickness= $filter->sanitize($selectedThickness,  'float');}
        if(!empty($selectedDiameter)){$product->size_diameter= $filter->sanitize($selectedDiameter,  'int');}
        if(!empty($selectedHeight)){$product->size_height= $filter->sanitize($selectedHeight,  'int');}
        if(!empty($selectedAlloy)){$product->size_alloy= $filter->sanitize($selectedAlloy,  'string');}
        if(!empty($selectedType)){$product->size_type= $filter->sanitize($selectedType,  'string');}
        if(!empty($dorescDebitare)){$product->cu_debitare= $filter->sanitize($dorescDebitare,  'string');}
        if(!empty($cuttingLength)){$product->size_length_cutting= $filter->sanitize($cuttingLength,  'int');}
        if(!empty($cuttingWidth)){$product->size_width_cutting= $filter->sanitize($cuttingWidth,  'int');}
        if(!empty($inputFreeTextComments)){$product->free_comments= $filter->sanitize($inputFreeTextComments,  'string');}
        $product->tip_um = $tip_um;
    // }
    $sql="select nextval('basket_appid_seq')";
    $this->db->fetchOne($sql);
    $sql="select CURRVAL(pg_get_serial_sequence('basket', 'appid'))";
    $this->db->fetchOne($sql);
    if ($product->save()===false) {
        $responce->status="error";
        $responce->message='Error for product code '.$productCode;
        $messages = $product->getMessages();
        foreach ($messages as $message) {
            $responce->message.=$message;
        }
    } else {
        $responce->status="success";
        if($alreadyInBasket){
            $responce->message="Inca ".$qUm1." ".$um1." a fost adaugat in cos! In total, acum sunt ".$product->qum1.$product->um1."!";
        }else{
            $responce->message="Produsul a fost adaugat in cos!";
        }
        //mai departe ajunge numai daca nu sunt erori
        $responce->appid=$product->appid;
        $responce->categoryPid=$pidCategory;
        $responce->productPid=$productPid;
        $responce->productCode=$productCode;
    }
    return $responce;
}





public function getMyBasket(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->products=[];
    $userid=$this->session->get('userId');


    $products= VBasketModel::find(
                    [
                        'conditions' => 'userid = ?1 ',
                        'bind'       => [
                                1 => $userid
                            ],
                        'order' => 'nr_ord'
                    ]
                );

    $index = 0;
    foreach($products as $product){
            array_push($responce->products, [
                        "appid"=>$product->appid,
                        "categoryPid"=>$product->pid_category,
                        "productPid"=>$product->pid_product ,
                        "productCode"=>$product->product_code ,
                        "productNameRO"=>$product->product_name_ro,
                        "productNameEN"=>$product->product_name_en,
                        "productNameBG"=>$product->product_name_bg,
                        "qBuc"=>$product->q_nr_buc,
                        "q_um_base"=>'',
                        "um1"=>$product->um1,
                        "um2"=>$product->um2,
                        "qUm1"=>1*$product->qum1,
                        "qUm2"=>1*$product->qum2,
                        "l"=>$product->size_length,
                        "w"=>$product->size_width,
                        "t"=>$product->size_thickness,
                        "d"=>$product->size_diameter,
                        "h"=>$product->size_height,
                        "a"=>$product->size_alloy,
                        "k"=>$product->size_type,
                        "dorescDebitare"=>($product->cu_debitare=='y'?1:0),
                        "cuttingLength"=>$product->size_length_cutting,
                        "cuttingWidth"=>$product->size_width_cutting,
                        "observatii"=>$product->free_comments,
                        "nr_ord" => $index,
                        "tip_um" => $product->tip_um
                    ]);
            $index++;
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


public function clearMyBasket(){
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $userid=$this->session->get('userId');

    $sqlQuery="delete from portal_color.basket where userid='".$userid."'";
    $data=$this->db->query($sqlQuery);
    $responce->status="success";
/*
    $productsInBasket= BasketModel::find(
                                        [
                                        'conditions' => 'userid = ?1 ',
                                        'bind'       => [
                                                1 => $userid
                                            ]
                                        ]
                                    );



    foreach ($productsInBasket as $product) {
        if ($product->delete() === false) {
                                            $responce->status="error";
                                            $messages = $robot->getMessages();
                                            foreach ($messages as $message) {$responce->message.=$message;}
                                        }
        }


    if($responce->status=="init"){
            $responce->status="success";
         }
*/
    return $responce;
}



}
