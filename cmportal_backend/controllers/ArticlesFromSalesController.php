<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class ArticlesFromSalesController extends Controller
{
    public function indexAction(){}

    public function getArticlesFromSales($token) {
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");

        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $rawdata = file_get_contents("php://input");
        $postData= json_decode($rawdata);

        foreach($postData as $postProduct){
            // die(var_dump($postProduct));
            $product = VNomProduct::findFirst([
                'conditions' => 'product_code = ?1',
                'bind'       => [
                    1 => $postProduct->product_code
                ]
            ]);
            if(!$product) {
                $product = new NomProduct();
                // $product->reset();
                $product->appid = 0;
                $product->product_code = $postProduct->product_code;
                $product->product_name_ro = $postProduct->product_name_ro;
                $product->cu_debitare = $postProduct->cu_debitare;
                $product->um1 = $postProduct->um1;
                $product->um_base = $postProduct->um1;
                $product->um2 = $postProduct->um2;
                $product->um1_to_um2 = $postProduct->um1_to_um2;
                $product->aliaj = $postProduct->aliaj;
                $product->additional_info = $postProduct->description;
                $product->product_name_en = $postProduct->product_name_en;
                $product->product_name_bg = $postProduct->product_name_bg;
                $product->pid_category='{0}';
                if($product->save()===false) {
                    $responce->message='Error on save product ='.$postProduct->product_name_ro;
                    $messages = $product->getMessages();
                    if($messages) {
                        foreach ($messages as $message) {$responce->message.=$message;}
                    }
                } else {
                    $responce->message .= $postProduct->product_code . ' a fost salvat in Portal'; 
                }
            } else {
                    $changed = false;
                	
                	if($product->product_name_ro !== $postProduct->product_name_ro) {
                		$product->product_name_ro = $postProduct->product_name_ro;
                    	$changed = true;
                    }
                    if($product->product_name_en !== $postProduct->product_name_en) {
                		$product->product_name_en = $postProduct->product_name_en;
                    	$changed = true;
                    }
                    if($product->product_name_bg !== $postProduct->product_name_bg) {
                		$product->product_name_bg = $postProduct->product_name_bg;
                    	$changed = true;
                    }
                	if($product->cu_debitare !== $postProduct->cu_debitare) {
                		$product->cu_debitare = $postProduct->cu_debitare;
                    	$changed = true;
                    }
                	if($product->um1 !== $postProduct->um1) {
                		$product->um1 = $postProduct->um1;
                    	$changed = true;
                    }
                	if($product->um2 !== $postProduct->um2) {
                		$product->um2 = $postProduct->um2;
                    	$changed = true;
                    }
                	if($product->um1_to_um2 !== $postProduct->um1_to_um2) {
                		$product->um1_to_um2 = $postProduct->um1_to_um2;
                    	$changed = true;
                    }
                	if($product->um_base !== $postProduct->um1) {
                		$product->um_base = $postProduct->um1;
                    	$changed = true;
                    }
                	if($product->aliaj !== $postProduct->aliaj) {
                		$product->aliaj = $postProduct->aliaj;
                    	$changed = true;
                    }
                	if($product->additional_info !== $postProduct->description) {
               	 		$product->additional_info = $postProduct->description;
                    	$changed = true;
                    }
                	// $product->size_diameter = $postProduct->diametru;
                	// $product->size_thickness = $postProduct->grosime;
                	if($changed) {
                   		if($product->save()===false) {
                        	$responce->message=' Error on save product ='.$postProduct->product_name_ro. ', '.$postProduct->product_code;
                        	$messages = $product->getMessages();
                        	if($messages) {
                            	foreach ($messages as $message) {$responce->message.=$message;}
                        	}
                    	} else {
                        	$responce->message .= $postProduct->product_code.', '.$postProduct->product_name_ro . ' a fost salvat in Portal'; 
                    	}
                    }
            }
        }

        $response
        ->setJsonContent($responce)
        ->send();
    }  

}