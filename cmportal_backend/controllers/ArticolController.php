<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;
use Phalcon\Db\Enum;

class ArticolController extends Controller
{
use TranslatesMessages;
public function indexAction()
    {

    }    

public function getArticol($pid,$rnd){
    //error_reporting(0);
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->product = new stdClass();
    $product = VNomProduct::findFirst("pid = ".$pid);
    if(is_null($product->size_diameter) && !is_null($product->size_thickness)){
        $responce->product->enumPlacaBara='placa';
        $sqlAliaj="select * from ".$this->dbSchema.".nom_aliaje alj where alj.aliaj=:paliaj ";
        $densitate = $this->db->fetchOne($sqlAliaj,Enum::FETCH_ASSOC,['paliaj'=>$product->aliaj]);
        $responce->product->densitate = ($densitate && isset($densitate['kg_per_dmc'])) ? $densitate['kg_per_dmc'] : null;
    }
    if(!is_null($product->size_diameter) && is_null($product->size_thickness)){
        $responce->product->enumPlacaBara='bara';
    }


    $responce->product->appid=$product->appid;
    $responce->product->pid=$product->pid;
    $responce->product->categoryPid=$product->pid_category;
    $responce->product->lantHierarchyCategories='';
    $responce->product->code=$product->product_code;
	$responce->product->productCode=$product->product_code;
    $responce->product->name=$this->localizedName($product->product_name_ro, $product->product_name_en, $product->product_name_bg);
	$responce->product->productName=$responce->product->name;
    $responce->product->productNameRO=$product->product_name_ro;
    $responce->product->productNameEN=$product->product_name_en;
    $responce->product->productNameBG=$product->product_name_bg;
    $responce->product->UMBase=$product->um_base;
    $responce->product->um1=$product->um1;
    $responce->product->um2=$product->um2;
    $responce->product->um1_to_um2=$product->um1_to_um2;
    $responce->product->isActive=$product->is_active;
    // $responce->product->withLength=$product->with_length;
    // $responce->product->withWidth=$product->with_width;
    // $responce->product->withThickness=$product->with_thickness;
    // $responce->product->withDiameter=$product->with_diameter;
    // $responce->product->withHeight=$product->with_height;
    // $responce->product->withAlloy=$product->with_alloy;
    // $responce->product->withType=$product->with_type;
    // $responce->product->withRollWeight=$product->with_roll_weight;
    $responce->product->sizeLength=$product->size_length;
    $responce->product->sizeWidth=$product->size_width;
    $responce->product->sizeThickness=$product->size_thickness;
    $responce->product->sizeDiameter=$product->size_diameter;
    $responce->product->sizeHeight=$product->size_height;
    $responce->product->sizeAlloy=$product->size_alloy;
    $responce->product->sizeType=$product->size_type;
    $responce->product->sizeRollWeight=$product->size_roll_weight;
    $responce->product->l=$product->size_length;
    $responce->product->w=$product->size_width;
    $responce->product->t=$product->size_thickness;
    $responce->product->d=$product->size_diameter;
    $responce->product->h=$product->size_height;
    $responce->product->a=$product->size_alloy;
    $responce->product->k=$product->size_type;
    $responce->product->g=$product->size_roll_weight;
    $responce->product->dorescDebitare = $product->cu_debitare == 'y' ? true : false;

    $responce->status="success";
    $response
        ->setJsonContent($responce)
        ->send();
}

public function getArticleByProductCode($productCode){
    //error_reporting(0);
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->product = new stdClass();
    $product = VNomProduct::findFirst([
                                        'conditions' => 'product_code = ?1',
                                        'bind'       => [
                                            1 => $productCode
                                        ]
                                        ]);

    if(is_null($product->size_diameter) && !is_null($product->size_thickness)){
        $responce->product->enumPlacaBara='placa';
        $sqlAliaj="select * from ".$this->dbSchema.".nom_aliaje alj where alj.aliaj=:paliaj ";
        $densitate = $this->db->fetchOne($sqlAliaj,Enum::FETCH_ASSOC,['paliaj'=>$product->size_alloy]);
        $responce->product->densitate = is_array($densitate) ? ($densitate['kg_per_dmc'] ?? null) : null;
    }
    if(!is_null($product->size_diameter) && is_null($product->size_thickness)){
        $responce->product->enumPlacaBara='bara';
    }

    $responce->product->appid=$product->appid;
    $responce->product->pid=$product->pid;
    $responce->product->categoryPid=$product->pid_category;
    $responce->product->lantHierarchyCategories='';
    $responce->product->code=$product->product_code;
    $responce->product->name=$this->localizedName($product->product_name_ro, $product->product_name_en, $product->product_name_bg);
    $responce->product->productNameRO=$product->product_name_ro;
    $responce->product->productNameEN=$product->product_name_en;
    $responce->product->productNameBG=$product->product_name_bg;
    $responce->product->UMBase=$product->um_base;
    $responce->product->um1=$product->um1;
    $responce->product->um2=$product->um2;
    $responce->product->um1_to_um2=$product->um1_to_um2;
    $responce->product->isActive=$product->is_active;
    // $responce->product->withLength=$product->with_length;
    // $responce->product->withWidth=$product->with_width;
    // $responce->product->withThickness=$product->with_thickness;
    // $responce->product->withDiameter=$product->with_diameter;
    // $responce->product->withHeight=$product->with_height;
    // $responce->product->withAlloy=$product->with_alloy;
    // $responce->product->withType=$product->with_type;
    // $responce->product->withRollWeight=$product->with_roll_weight;
    $responce->product->sizeLength=$product->size_length;
    $responce->product->sizeWidth=$product->size_width;
    $responce->product->sizeThickness=$product->size_thickness;
    $responce->product->sizeDiameter=$product->size_diameter;
    $responce->product->sizeHeight=$product->size_height;
    $responce->product->sizeAlloy=$product->size_alloy;
    $responce->product->sizeType=$product->size_type;
    $responce->product->sizeRollWeight=$product->size_roll_weight;
    $responce->product->l=$product->size_length;
    $responce->product->w=$product->size_width;
    $responce->product->t=$product->size_thickness;
    $responce->product->d=$product->size_diameter;
    $responce->product->h=$product->size_height;
    $responce->product->a=$product->size_alloy;
    $responce->product->k=$product->size_type;
    $responce->product->g=$product->size_roll_weight;

    $responce->status="success";
    return $responce;
}

public function searchProducts($rnd){
    //error_reporting(0);
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message=""; 
    $responce->products="";    
    $products= NomProduct::find(
                    [
                        'order' => 'product_name_ro'
                    ]
                );
    foreach($products as $product){
                array_push($responce->products, [
                            "pid"=>$dataCateg->pid,
                            "name"=>$dataCateg->product_name_ro,
                            "product_code"=>$dataCateg->product_code,
                            "pid_category"=>$dataCateg->pid_category,
                            "size_length"=>$dataCateg->size_length,
                            "size_width"=>$dataCateg->size_width,
                            "size_diameter"=>$dataCateg->size_diameter,
                            "um_base"=>$dataCateg->um_base
                        ]);
    }

    $responce->status="success";
    $response
        ->setJsonContent($responce)
        ->send();      
}

public function getAllProducts($rowsPerPage,$pageNumber,$rnd){
    //error_reporting(0);
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message=""; 
    $responce->products=[];
    $responce->totalPages=0;
    $responce->totalItems=0;    
    $paginator = new PaginatorModel([
        'model'      => VNomProduct::class,
        'parameters' => [
            'order' => 'product_name_ro'
        ],
        'limit'      => $rowsPerPage,
        'page'       => $pageNumber,
    ]);

    // Get the paginated results (Phalcon 4/5)
    $page = $paginator->paginate();

    // Normalize counters (support both getter-based and property-based repositories)
    $responce->totalItems = method_exists($page, 'getTotalItems') ? $page->getTotalItems() : (property_exists($page, 'total_items') ? $page->total_items : 0);
    if (method_exists($page, 'getTotalPages')) {
        $responce->totalPages = $page->getTotalPages();
    } elseif (property_exists($page, 'total_pages')) {
        $responce->totalPages = $page->total_pages;
    } elseif (property_exists($page, 'last')) {
        $responce->totalPages = (int) $page->last;
    } elseif ($rowsPerPage > 0) {
        $responce->totalPages = (int) ceil(((int) $responce->totalItems) / $rowsPerPage);
    } else {
        $responce->totalPages = 0;
    }

        $items = method_exists($page, 'getItems') ? $page->getItems() : (property_exists($page, 'items') ? $page->items : []);
        foreach($items as $product){
                    array_push($responce->products, [
                                "appid"=>$product->appid,
                                "pid"=>$product->pid,
                                "categoryPid"=>$product->pid_category,
                                "name"=>$product->product_name_ro,
                                "code"=>$product->product_code,
                                "UMBase"=>$product->um_base,
                                "isActive"=>$product->is_active,
                                "withLength"=>$product->with_length,
                                "withWidth"=>$product->with_width,
                                "withThickness"=>$product->with_thickness,
                                "withDiameter"=>$product->with_diameter,
                                "sizeLength"=>$product->size_length,
                                "sizeWidth"=>$product->size_width,
                                "sizeThickness"=>$product->size_thickness,
                                "sizeDiameter"=>$product->size_diameter
                            ]);
        }

    $responce->status="success";
    $response
        ->setJsonContent($responce)
        ->send();      
    }

    public function verifyIfProductIsActivInPortal($productCode, $tokenId, $tokenHash) {
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");

        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        //verificam ca nu a mai fost folosit acest token
        // $logToken = new LogTokenidFromSalesController();
        // if(!$logToken->check($tokenId)){
        //     $responce->status="error";
        //     $responce->message="2Token Invalid";
        //    die(json_encode($responce));
        // }

        // //verificam sa corectitudinea hashului
        // if(md5($this->passTokenApi.$tokenId)!=$tokenHash){
        //     $responce->status="error";
        //     $responce->message="3Token Invalid";
        //     die(json_encode($responce));
        // }

        $product = VNomProduct::findFirst([
            'conditions' => 'product_code = ?1',
            'bind'       => [
                1 => $productCode
            ]
        ]);

        $responce->is_active=$product->is_active;
        if($product && $product->is_active == 'y') {
            $responce->status="success";
            $responce->message= $this->t('este_activ_in_portal', $this->localizedName($product->product_name_ro, $product->product_name_en, $product->product_name_bg));
        } else {
            $responce->status="success";
            $responce->message= $this->t('nu_este_activ_in_portal', $productCode);
        }

        $response
            ->setJsonContent($responce)
            ->send();
    }
}