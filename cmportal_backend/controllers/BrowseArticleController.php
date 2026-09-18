<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Db\Enum;

class BrowseArticleController extends Controller
{
use TranslatesMessages;
public function indexAction()
    {

    }


public function identifyArticleInDB($pidCategory,$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter, $selectedHeight, $selectedAlloy, $selectedType, $selectedRollWeight){
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->categoryPid="";
    $responce->productPid="";
    $responce->productCode="";
    $responce->productName="";
    $sqlForLength='';
    $sqlForWidth='';
    $sqlForThickness='';
    $sqlForDiameter='';
    $sqlForHeight='';
    $sqlForAlloy='';
    $sqlForType='';
    $sqlForRollWeight='';
    $arrWhereCondition=[];
    $arrWhereCondition["pid_category"]=$pidCategory;
    if(!empty($selectedLength)){ $sqlForLength=' and size_length =:size_length ';
                                 $arrWhereCondition["size_length"]= $selectedLength;
                                 }
    if(!empty($selectedWidth)){ $sqlForWidth=' and size_width =:size_width ';
                                $arrWhereCondition["size_width"]= $selectedWidth;
                                }
    if(!empty($selectedThickness)){ $sqlForThickness=' and size_thickness =:size_thickness ';
                                $arrWhereCondition["size_thickness"]= $selectedThickness;
                                }
    if(!empty($selectedDiameter)){ $sqlForDiameter=' and size_diameter =:size_diameter ';
                                $arrWhereCondition["size_diameter"]= $selectedDiameter;
                                }
    if(!empty($selectedHeight)){ $sqlForHeight=' and size_height =:size_height ';
                                $arrWhereCondition["size_height"]= $selectedHeight;
                                }
    if(!empty($selectedAlloy)){ $sqlForAlloy=' and size_alloy =:size_alloy ';
                                $arrWhereCondition["size_alloy"]= $selectedAlloy;
                                }
    if(!empty($selectedType)){ $sqlForType=' and size_type =:size_type ';
                                $arrWhereCondition["size_type"]= $selectedType;
                                }
    if(!empty($selectedRollWeight)){ $sqlForRollWeight=' and size_roll_weight =:size_roll_weight ';
                                $arrWhereCondition["size_roll_weight"]= $selectedRollWeight;
                                }                            
    $sql="select * from ".$this->dbSchema.".nom_products p where p.is_active = 'y' and :pid_category=any(pid_category) ".$sqlForLength.$sqlForWidth.$sqlForThickness.$sqlForDiameter.$sqlForHeight.$sqlForAlloy.$sqlForType.$sqlForRollWeight;
    // die(var_dump($sql));
    //die(var_dump($arrWhereCondition));
    $article = $this->db->fetchOne($sql,Enum::FETCH_ASSOC,$arrWhereCondition);
    //die(var_dump($article));

    $responce->densitate=null;
    if($article){
        $responce->enumPlacaBara='others';  
        if(is_null($article['size_diameter']) && !is_null($article['size_thickness'])){ 
            $responce->enumPlacaBara='placa';   
            $sqlAliaj="select * from ".$this->dbSchema.".nom_aliaje alj where alj.aliaj=:paliaj ";  
            $densitate = $this->db->fetchOne($sqlAliaj,Enum::FETCH_ASSOC,['paliaj'=>$article['aliaj']]); 
            $responce->densitate = ($densitate && isset($densitate['kg_per_dmc'])) ? $densitate['kg_per_dmc'] : null;
        }   
        if(!is_null($article['size_diameter']) && is_null($article['size_thickness'])){ 
            $responce->enumPlacaBara='bara';    
        }

        $responce->isPlacaAluminiu = '0';
        // 1) Remove the braces
        $cleaned = trim($article['pid_category'], '{}'); // "25,26,55"

        // 2) Split into an array
        $arr = explode(',', $cleaned); // ["25", "26", "55"]

        // 3) Convert each to integer (if needed)
        $arr = array_map('intval', $arr); // [25, 26, 55]

        if(in_array(25, $arr) || in_array(26, $arr) || in_array(27, $arr)) {
            $responce->isPlacaAluminiu = '1';
        } 

        //Does this category enter its quantity in um2, with the weight derived?
        //Declared per category because the placa/bara shape alone also catches
        //flat bars, profiles and square tubes.
        $responce->kgFromUm2 = 'n';
        if(count($arr) > 0){
            $categ = NomCategoryProduct::findFirst([
                'conditions' => 'pid = ?1',
                'bind'       => [1 => $arr[0]]
            ]);
            if($categ && $categ->kg_from_um2 == 'y'){ $responce->kgFromUm2 = 'y'; }
        }

        $responce->status="success";
        $responce->categoryPid=$article['pid_category'];
        $responce->productPid=$article['pid'];
        $responce->productCode=$article['product_code'];
        $responce->productName=$this->localizedName($article['product_name_ro'], $article['product_name_en'], $article['product_name_bg']);
        $responce->productNameRO=$article['product_name_ro'];
        $responce->productNameEN=$article['product_name_en'];
        $responce->productNameBG=$article['product_name_bg'];
        $responce->um1=$article['um1'];
        $responce->um2=$article['um2'];
        $responce->um1ToUm2=$article['um1_to_um2'];
        $responce->cuDebitare=$article['cu_debitare'];
    }else{
            $responce->status="error";
            $responce->message=$this->t('nu_poate_fi_identificat_articolul');
    }

    return $responce;
    }


public function identifyArticleInDBAndReturnToBrowser(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $pidCategory=$_POST['pidCategory'];
    $selectedLength=$_POST['selectedLength'];
    $selectedWidth=$_POST['selectedWidth'];
    $selectedThickness=$_POST['selectedThickness'];
    $selectedDiameter=$_POST['selectedDiameter'];
    $selectedHeight=$_POST['selectedHeight'];
    $selectedAlloy=$_POST['selectedAlloy'];
    $selectedType=$_POST['selectedType'];
    $selectedRollWeight=$_POST['selectedRollWeight'];
    $responce=$this->identifyArticleInDB($pidCategory,$selectedLength,$selectedWidth,$selectedThickness,$selectedDiameter,$selectedHeight,$selectedAlloy,$selectedType,$selectedRollWeight);
    // die(var_dump($responce));
    $response
    ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
    ->setJsonContent($responce)
    ->send();
}

public function getArticlesForCategory($pid){
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
$response = new Response();
$responce = new stdClass();
$responce->status="init";
$responce->message="";
$responce->categoryPid="";
$responce->categoryName="";
$responce->categoryNameRO="";
$responce->categoryNameEN="";
$responce->categoryNameBG="";
$responce->isParentForArticles="";
$responce->withLength="";
$responce->withWidth="";
$responce->withThickness="";
$responce->withDiameter="";
$responce->withHeight="";
$responce->withAlloy="";
$responce->withType="";
$responce->withRollWeight="";
$responce->arrLength = [];
$responce->arrWidth = [];
$responce->arrThickness = [];
$responce->arrDiameter = [];
$responce->arrHeight = [];
$responce->arrAlloy = [];
$responce->arrType = [];
$responce->arrSizes = [];
$responce->arrRollWeight = [];
$responce->hierarchicalChain = [];

$selectedCategory = NomCategoryProduct::findFirst(
    "pid = ".$pid
);

if($selectedCategory){
    $responce->status="success";
    $responce->categoryPid=$selectedCategory->pid;
    $responce->categoryName=$selectedCategory->name_ro;
    $responce->categoryNameRO=$selectedCategory->name_ro;
    $responce->categoryNameEN=$selectedCategory->name_en;
    $responce->categoryNameBG=$selectedCategory->name_bg;
    $responce->isParentForArticles=$selectedCategory->is_parent_for_articles;
    $responce->withLength=$selectedCategory->with_length;
    $responce->withWidth=$selectedCategory->with_width;
    $responce->withThickness=$selectedCategory->with_thickness;
    $responce->withDiameter=$selectedCategory->with_diameter;
    $responce->withHeight=$selectedCategory->with_height;
    $responce->withAlloy=$selectedCategory->with_alloy;
    $responce->withType=$selectedCategory->with_type;
    $responce->withRollWeight=$selectedCategory->with_roll_weight;

    $responce->positionLength=$selectedCategory->length_position;
    $responce->positionWidth=$selectedCategory->width_position;
    $responce->positionThickness=$selectedCategory->thickness_position;
    $responce->positionDiameter=$selectedCategory->diameter_position;
    $responce->positionHeight=$selectedCategory->height_position;
    $responce->positionAlloy=$selectedCategory->alloy_position;
    $responce->positionType=$selectedCategory->type_position;
    $responce->positionRollWeight=$selectedCategory->roll_weight_position;

    if($selectedCategory->with_length=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_length
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and ".$selectedCategory->pid."=any(p.pid_category) order by size_length");
        foreach($arr as $size){
            array_push($responce->arrLength,$size['size_length']);
            }
    }

    if($selectedCategory->with_width=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_width
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and ".$selectedCategory->pid."=any(p.pid_category) order by size_width");
        foreach($arr as $size){
            array_push($responce->arrWidth,$size['size_width']);
            }
    }

    if($selectedCategory->with_thickness=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_thickness
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and ".$selectedCategory->pid."=any(p.pid_category) order by size_thickness");
        foreach($arr as $size){
            array_push($responce->arrThickness,$size['size_thickness']);
            }
    }

    if($selectedCategory->with_diameter=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_diameter
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and ".$selectedCategory->pid."=any(p.pid_category) order by size_diameter");
        foreach($arr as $size){
            array_push($responce->arrDiameter,$size['size_diameter']);
            }
    }

    if($selectedCategory->with_height=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_height
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and ".$selectedCategory->pid."=any(p.pid_category) order by size_height");
        foreach($arr as $size){
            array_push($responce->arrHeight,$size['size_height']);
            }
    }

    if($selectedCategory->with_alloy=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_alloy
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and ".$selectedCategory->pid."=any(p.pid_category) order by size_alloy");
        foreach($arr as $size){
            array_push($responce->arrAlloy,$size['size_alloy']);
            }
    }


    if($selectedCategory->with_type=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_type
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and ".$selectedCategory->pid."=any(p.pid_category) order by size_type");
        foreach($arr as $size){
            array_push($responce->arrType,$size['size_type']);
        }
    }
    if($selectedCategory->with_roll_weight=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_roll_weight
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and ".$selectedCategory->pid."=any(p.pid_category) order by size_roll_weight");
        foreach($arr as $size){
            array_push($responce->arrRollWeight,$size['size_roll_weight']);
            }
    }

     $arr= $this->db->fetchAll("SELECT distinct size_length,size_width,size_thickness,size_diameter,size_height,size_alloy,size_type, size_roll_weight,um1,um2,um1_to_um2
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and ".$selectedCategory->pid."=any(p.pid_category)");
        foreach($arr as $size){
            array_push($responce->arrSizes,["l"=>$size['size_length'],
                                            "w"=>$size['size_width'],
                                            "t"=>$size['size_thickness'],
                                            "d"=>$size['size_diameter'],
                                            "h"=>$size['size_height'],
                                            "a"=>$size['size_alloy'],
                                            "k"=>$size['size_type'],
                                            "g"=>$size['size_roll_weight'],
                                            "um1"=>$size['um1'],
                                            "um2"=>$size['um2'],
                                            "um1_to_um2"=>$size['um1_to_um2']
                                        ]);
        }

        $pidParentCategToGet=$selectedCategory->parent_pid;
        //array_unshift($responce->hierarchicalChain,["categoryPid"=>$pidParentCategToGet,"categoryName"=>$selectedCategory->name_ro]);
         while($categoryParent = NomCategoryProduct::findFirstByPid($pidParentCategToGet)){
            if($categoryParent->parent_pid){
                                array_unshift($responce->hierarchicalChain,["categoryPid"=>$categoryParent->pid,"categoryName"=>$categoryParent->name_ro,"categoryNameRO"=>$categoryParent->name_ro,"categoryNameEN"=>$categoryParent->name_en,"categoryNameBG"=>$categoryParent->name_bg] );
                                            }
            $pidParentCategToGet=$categoryParent->parent_pid;
         }
}
else{
    $responce->status="error";
    $responce->message=$this->t('nu_poate_fi_identificata_categoria');
}
$response
    ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
    ->setJsonContent($responce)
    ->send();
}

public function getCategoryImage($pid){
    $file=$this->pathToApps.'/uploads_img_product/'.$pid.'.jpg';
    $type = 'image/jpeg';
    header('Content-Type:'.$type);
    if (file_exists($file)) {
                    header('Content-Length: ' . filesize($file));
                    }
        else{
           $file=$this->pathToApps.'/uploads_img_product/0.jpg';
           header('Content-Length: ' . filesize($file));
        }
    readfile($file);
    die('');
    }


}
