<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter\FilterFactory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class AdminProductController extends Controller
{
use TranslatesMessages;
public function indexAction()
    {

    }

public function editProduct($pid){
    //error_reporting(0);
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->apppid=0;
    $responce->pid=0;
    $result=false;
    $filterFactory = new FilterFactory();
    $filter = $filterFactory->newInstance();

    if(empty($_POST['code'])){
            $responce->status="error";
            $responce->message=$this->t('codul_produsului_este_obligatoriu');
            die(json_encode($responce));
    }

    if(empty($_POST['um1'])){
            $responce->status="error";
            $responce->message=$this->t('um1_este_obligatoriu');
            die(json_encode($responce));
    }

    if($pid=='0'){
        $product = new NomProduct();
        $product->reset();
        $product->appid=0;
    }
    else{
        $product = NomProduct::findFirst($pid);
    }

    $product->product_code = trim(mb_strtoupper($filter->sanitize( $_POST['code'], 'string'),$encoding = 'UTF-8'));
    $product->product_name_ro = trim(mb_strtoupper($filter->sanitize( $_POST['name_ro'], 'string'),$encoding = 'UTF-8'));
    $product->product_name_en = trim(mb_strtoupper($filter->sanitize( $_POST['name_en'], 'string'),$encoding = 'UTF-8'));
    $product->product_name_bg = trim(mb_strtoupper($filter->sanitize( $_POST['name_bg'], 'string'),$encoding = 'UTF-8'));
    $product->pid_category= $filter->sanitize($_POST['categoryPid'],  'string');
    $product->um_base = trim(strtoupper($filter->sanitize( $_POST['UMBase'], 'string')));
    $product->um1 = trim(strtoupper($filter->sanitize( $_POST['um1'], 'string')));
    $product->um2 = trim(strtoupper($filter->sanitize( $_POST['um2'], 'string')));
    $product->um1_to_um2 = trim(strtoupper($filter->sanitize( $_POST['um1ToUm2'], 'string')));


    $product->is_active = trim(strtolower($filter->sanitize( $_POST['isActive'], 'string')));

    if(strlen($_POST['sizeLength'])>0){$product->size_length= filter_var($_POST['sizeLength'],  FILTER_SANITIZE_NUMBER_INT);}
    if(strlen($_POST['sizeWidth'])>0){ $product->size_width= filter_var($_POST['sizeWidth'],  FILTER_SANITIZE_NUMBER_INT);}
    if(strlen($_POST['sizeThickness'])>0){$product->size_thickness= filter_var($_POST['sizeThickness'],  FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);}
    if(strlen($_POST['sizeDiameter'])>0){$product->size_diameter= filter_var($_POST['sizeDiameter'],  FILTER_SANITIZE_NUMBER_INT);}
    if(strlen($_POST['sizeHeight'])>0){$product->size_height= filter_var($_POST['sizeHeight'],  FILTER_SANITIZE_NUMBER_INT);}

    if(strlen($_POST['sizeAlloy'])>0){$product->size_alloy= $filter->sanitize($_POST['sizeAlloy'],  'string');}
    if(strlen($_POST['sizeType'])>0){$product->size_type= $filter->sanitize($_POST['sizeType'],  'string');}


    try {
        $result=$product->save();
    } 
    catch (PDOException $e) {
                            $responce->status="error";
                            $responce->message.=$e->getMessage();
                            }

    if (!$result) {
            $messages = $product->getMessages();
            foreach ($messages as $message) {
                $responce->status="error";
                $responce->message.=$message;
            }
            die(json_encode($responce));
    }else{
        $responce->status="success";
        $responce->message=($pid=='0'? $this->t('articolul_a_fost_adaugat_cu_succes'):$this->t('articolul_a_fost_modificat'));
    }

    //mai departe ajunge numai daca nu sunt erori
    $responce->apppid=$product->appid; 
    $responce->pid=$product->pid; 


    die(json_encode($responce));
}


public function changeStatusActivInactiv($pid,$newStatus){
    error_reporting(0);
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->apppid=0;
    $responce->pid=0;
    $result=false;
    $filter = new Filter();

    $product = NomProduct::findFirst($pid);
    if($product){
        $product->is_active=trim(strtolower($newStatus));

        try {
            $result=$product->save();
        }
        catch (PDOException $e) {
                            $responce->status="error";
                            $responce->message.=$e->getMessage();
                            }

        if (!$result) {
                $messages = $product->getMessages();
                foreach ($messages as $message) {
                    $responce->status="error";
                    $responce->message.=$message;
                }
                die(json_encode($responce));
        }else{
            $responce->status="success";
            $responce->message=$this->t('vizibilitatea_a_fost_schimbata_cu_succes');
        }
    }
    else{
            $responce->status="error";
            $responce->message=$this->t('articolul_nu_poate_fi_identificat');
    }

    //mai departe ajunge numai daca nu sunt erori
    $responce->apppid=$product->appid;
    $responce->pid=$product->pid;


    die(json_encode($responce));
}

public function getProduct($pid,$rnd){
    //error_reporting(0);
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message=""; 
    $responce->product = new stdClass();    
    $product = VNomProduct::findFirst("pid = ".$pid);

    $responce->product->appid=$product->appid;
    $responce->product->pid=$product->pid;
    $responce->product->categoryPid=$product->pid_category;
    $responce->product->lantHierarchyCategories='';
    $responce->product->code=$product->product_code;
    $responce->product->name_ro=$product->product_name_ro;
    $responce->product->name_en=$product->product_name_en;
    $responce->product->name_bg=$product->product_name_bg;
    $responce->product->UMBase=$product->um_base;
    $responce->product->um1=$product->um1;
    $responce->product->um2=$product->um2;
    $responce->product->um1ToUm2=$product->um1_to_um2;
    $responce->product->isActive=$product->is_active;
    $responce->product->sizeLength=$product->size_length;
    $responce->product->sizeWidth=$product->size_width;
    $responce->product->sizeThickness=$product->size_thickness;
    $responce->product->sizeDiameter=$product->size_diameter;
    $responce->product->sizeHeight=$product->size_height;
    $responce->product->sizeAlloy=$product->size_alloy;
    $responce->product->sizeType=$product->size_type;
    
    $responce->product->categories=json_decode($product->categories);

    $responce->status="success";
    $response
        ->setJsonContent($responce)
        ->send();      
}


public function searchProducts($rnd){
    //error_reporting(0);
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message=""; 
    $responce->products=[];    
    $products= NomProduct::find(
                    [
                        'order' => 'product_name_ro'
                    ]
                );
    foreach($products as $product){
                array_push($responce->products, [
                            "pid"=>$product->pid,
                            "name_ro"=>$product->product_name_ro,
                            "name_en"=>$product->product_name_en,
                            "name_bg"=>$product->product_name_bg,
                            "product_code"=>$product->product_code,
                            "pid_category"=>$product->pid_category,
                            "size_length"=>$product->size_length,
                            "size_width"=>$product->size_width,
                            "size_diameter"=>$product->size_diameter,
                            "um_base"=>$product->um_base
                        ]);
    }

$responce->status="success";
$response
    ->setJsonContent($responce)
    ->send();      
}

public function getPage($rowsPerPage,$pageNumber,$rnd){
    //error_reporting(0);
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->products=[];
    $responce->totalPages=0;
    $responce->totalItems=0;
    $sqlConditions='';
    $filterString = $this->request->get('filter_text', ['string','upper']);

    // Every word must match the code or the name in some language - BG products
    // have no RO name. Bound, not pasted into the SQL.
    $parameters = ['order' => 'product_name_'.$this->dataLang()];
    $conditions = [];
    $bind = [];
    foreach (explode(" ", (string)$filterString) as $key => $value) {
        if ($value === '') { continue; }
        $conditions[] = "(product_code ILIKE :w$key: OR product_name_ro ILIKE :w$key: OR product_name_en ILIKE :w$key: OR product_name_bg ILIKE :w$key:)";
        $bind["w$key"] = '%'.$value.'%';
    }
    if ($conditions) {
        $parameters['conditions'] = implode(' AND ', $conditions);
        $parameters['bind'] = $bind;
    }
    $paginator = new PaginatorModel([
        'model'      => VNomProduct::class,
        'parameters' => $parameters,
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
                            "name_ro"=>$product->product_name_ro,
                            "name_en"=>$product->product_name_en,
                            "name_bg"=>$product->product_name_bg,
                            "code"=>$product->product_code,
                            "UMBase"=>$product->um_base,
                            "um1"=>$product->um1,
                            "um2"=>$product->um2,
                            "um1ToUm2"=>$product->um1_to_um2,
                            "isActive"=>$product->is_active,
                            "sizeLength"=>$product->size_length,
                            "sizeWidth"=>$product->size_width,
                            "sizeThickness"=>$product->size_thickness,
                            "sizeDiameter"=>$product->size_diameter,
                            "sizeHeight"=>$product->size_height,
                            "sizeAlloy"=>$product->size_alloy,
                            "sizeType"=>$product->size_type,
                            "categories"=>$product->categories
                        ]);
    }

$responce->status="success";
$response
    ->setJsonContent($responce)
    ->send();      
}


}