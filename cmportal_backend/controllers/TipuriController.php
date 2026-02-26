<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;

class TipuriController extends Controller
{
public function indexAction()
    {

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
                                     where p.is_active = 'y' and p.pid_category=".$selectedCategory->pid." order by size_length");
        foreach($arr as $size){
            array_push($responce->arrLength,$size['size_length']);
            }
    }

    if($selectedCategory->with_width=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_width
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and  p.pid_category=".$selectedCategory->pid." order by size_width");
        foreach($arr as $size){
            array_push($responce->arrWidth,$size['size_width']);
            }
    }

    if($selectedCategory->with_thickness=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_thickness
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and  p.pid_category=".$selectedCategory->pid." order by size_thickness");
        foreach($arr as $size){
            array_push($responce->arrThickness,$size['size_thickness']);
            }
    }

    if($selectedCategory->with_diameter=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_diameter
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and  p.pid_category=".$selectedCategory->pid." order by size_diameter");
        foreach($arr as $size){
            array_push($responce->arrDiameter,$size['size_diameter']);
            }
    }

    if($selectedCategory->with_height=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_height
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and  p.pid_category=".$selectedCategory->pid." order by size_height");
        foreach($arr as $size){
            array_push($responce->arrHeight,$size['size_height']);
            }
    }

    if($selectedCategory->with_alloy=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_alloy
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and  p.pid_category=".$selectedCategory->pid." order by size_alloy");
        foreach($arr as $size){
            array_push($responce->arrAlloy,$size['size_alloy']);
            }
    }


    if($selectedCategory->with_type=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_type
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and  p.pid_category=".$selectedCategory->pid." order by size_type");
        foreach($arr as $size){
            array_push($responce->arrType,$size['size_type']);
            }
    }
    if($selectedCategory->with_roll_weight=='y'){
          $arr= $this->db->fetchAll("SELECT distinct size_roll_weight
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and  p.pid_category=".$selectedCategory->pid." order by size_roll_weight");
        foreach($arr as $size){
            array_push($responce->arrRollWeight,$size['size_roll_weight']);
            }
    }

     $arr= $this->db->fetchAll("SELECT distinct size_length,size_width,size_thickness,size_diameter,size_height,size_alloy,size_type, size_roll_weight,um1,um2,um1_to_um2
                                             FROM ".$this->dbSchema.".nom_products p
                                     where p.is_active = 'y' and p.pid_category=".$selectedCategory->pid);
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
                                array_unshift($responce->hierarchicalChain,["categoryPid"=>$categoryParent->pid,"categoryName"=>$categoryParent->name_ro] );
                                            }
            $pidParentCategToGet=$categoryParent->parent_pid;
         }
}
else{
    $responce->status="error";
    $responce->message="Nu poate fi identificata categoria!";
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

    public function sincronizareTipuri(){
        
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="success";
        $responce->message="";

        $categories = NomCategoryProduct::find();

        foreach($categories as $category) {
            if($category->with_type=='y') {
                // var_dump($category->pid, $category->name_ro);
                $arr= $this->db->fetchAll("SELECT distinct size_type
                                                   FROM ".$this->dbSchema.".nom_products p
                                           where p.is_active = 'y' and  p.pid_category=".$category->pid." order by size_type");
                foreach($arr as $index => $size){
                    // array_push($responce->arrType,$size['size_type']);
                    // var_dump($index, $size['size_type']);
                    $tip = TipuriModel::findFirst([
                        'conditions' => 'pid_category = ?1 and type_id = ?2',
                        'bind' => [
                            1 => $category->pid,
                            2 => $category->pid . '_' . $index
                        ]
                    ]);
                    if(!$tip) {
                        $tip = new TipuriModel();
                        $tip->reset();
                    }
                    $tip->pid_category = $category->pid;
                    $tip->type_id = $category->pid . '_' . $index;
                    $tip->size_type = $size['size_type'];
                    if($tip-> save() === false) {
                        $responce->status="error";
                        $responce->message='';
                        $messages = $tip->getMessages();
                        foreach ($messages as $message) {
                            $responce->message.=$message."\n";
                        }
                    }
                }
            }
        }
        die(json_encode($responce));
    }

    public function getTreeDataCateg($rnd){
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $responce->treeDataCategories=[];
        
        $mainCategs = NomCategoryProduct::find(
                            [
                                'conditions' => 'parent_pid is null and pid != 1 and ord is not null'
                                ,'order' => 'ord'
                            ]
                        );
        
        foreach($mainCategs as $mainCateg){
            //die(var_dump($mainCateg->name_ro));
            $cildrenMainCateg=[];
        
            $level2Categs = NomCategoryProduct::find(
                            [
                                'conditions' => 'parent_pid = ?1',
                                'bind'       => [
                                                1 => $mainCateg->pid,
                                            ]
                                ,'order' => 'pid'
                            ]);
            foreach($level2Categs as $level2Categ){
                $cildrenLevel2Categ=[];
        
                $level3Categs = NomCategoryProduct::find(
                                [
                                    'conditions' => 'parent_pid = ?1',
                                    'bind'       => [
                                                    1 => $level2Categ->pid,
                                                ]
                                    ,'order' => 'pid'
                                ]);
                foreach($level3Categs as $level3Categ){
                    $tipuri = TipuriModel::find([
                        'conditions' => 'pid_category = ?1',
                        'bind' => [
                            1 => $level3Categ->pid,
                        ]
                    ]);
                    $arrTip = [];
                    foreach($tipuri as $tip) {
                        array_push($arrTip, [
                            "appid"=>$tip->appid,
                            "pid"=>$tip->pid_category,
                            "name"=>$tip->size_type,
                            "is_tip" => 'y'
                        ]);
                    }
                    if(!empty($arrTip)){
                        array_push($cildrenLevel2Categ, [
                                    "appid"=>$level3Categ->appid,
                                    "pid"=>$level3Categ->pid,
                                    "name"=>$level3Categ->name_ro,
                                    "is_parent_for_articles"=>$level3Categ->is_parent_for_articles,
                                    "category_level"=>3,
                                    "children"=>$arrTip,
                                    "is_tip" => 'n'
                                ]);
                    }
                }
                $tipuri = TipuriModel::find([
                    'conditions' => 'pid_category = ?1',
                    'bind' => [
                        1 => $level2Categ->pid,
                    ]
                ]);  
                $arrTip = [];
                foreach($tipuri as $tip) {
                    array_push($arrTip, [
                        "appid"=>$tip->appid,
                        "pid"=>$tip->pid_category,
                        "name"=>$tip->size_type,
                        "is_tip" => 'y'
                    ]);
                }
                if(!empty($arrTip) || !empty($cildrenLevel2Categ)){
                    array_push($cildrenMainCateg, [
                            "appid"=>$level2Categ->appid,
                            "pid"=>$level2Categ->pid,
                            "name"=>$level2Categ->name_ro,
                            "is_parent_for_articles"=>$level2Categ->is_parent_for_articles,
                            "category_level"=>2,
                            "children"=>!empty($cildrenLevel2Categ) ? $cildrenLevel2Categ : $arrTip,
                            "is_tip" => 'n'
                        ]);
                }
            }
            if(!empty($cildrenMainCateg)){
                array_push($responce->treeDataCategories, [
                            "appid"=>$mainCateg->appid,
                            "pid"=>$mainCateg->pid,
                            "name"=>$mainCateg->name_ro,
                            "is_parent_for_articles"=>$mainCateg->is_parent_for_articles,
                            "category_level"=>1,
                            "children"=>$cildrenMainCateg,
                            "is_tip" => 'n'
                                ]);
            }
        }
        
        $responce->status="success";
        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function getTip($appid) {
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $tip = TipuriModel::findFirst([
            'conditions' => 'appid = ?1',
            'bind' => [
                1 => $appid,
            ]
        ]); 
        if($tip) {
            $responce->status="success";
            $responce->tip = $tip;
        } else {
            $responce->status="error";
            $responce->message = 'Nu am gasit tipul!';

        }

        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function getImagesTip($type_id){ 
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="success";
        $responce->message="";
        $responce->image1="";
        $responce->image2="";
        $responce->image3="";

        $file=$this->pathToApps.'/uploads_img_product/'.$type_id.'_1.jpg';
        if (file_exists($file)) {
            $resource_avatar=imagecreatefromjpeg($file) ;
            ob_start();
            imagejpeg($resource_avatar);
            $image_data=ob_get_contents();
            ob_end_clean();
            $responce->image1 = 'data:image/jpeg;base64,'.base64_encode($image_data);
        }

        $file=$this->pathToApps.'/uploads_img_product/'.$type_id.'_2.jpg';
        if (file_exists($file)) {
            $resource_avatar=imagecreatefromjpeg($file) ;
            ob_start();
            imagejpeg($resource_avatar);
            $image_data=ob_get_contents();
            ob_end_clean();
            $responce->image2 = 'data:image/jpeg;base64,'.base64_encode($image_data);
        }

        $file=$this->pathToApps.'/uploads_img_product/'.$type_id.'_3.jpg';
        if (file_exists($file)) {
            $resource_avatar=imagecreatefromjpeg($file) ;
            ob_start();
            imagejpeg($resource_avatar);
            $image_data=ob_get_contents();
            ob_end_clean();
            $responce->image3 = 'data:image/jpeg;base64,'.base64_encode($image_data);
        }

        $response
        ->setJsonContent($responce)
        ->send();
    }

    public function saveTip(){
        ini_set('memory_limit','1024M');
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $type_id = $_POST['type_id'];
        // die(var_dump($type_id));

        if ($this->request->hasFiles() == true) {
            require $this->pathToApps.'/controllers/SimpleImage.php';
            $image = new \claviska\SimpleImage();
            // Print the real file names and sizes
            foreach ($this->request->getUploadedFiles() as $index => $file) {
                //Print file details
                //echo $file->getName(), " ", $file->getSize(), "\n";
                //die($file->getExtension());
                //Move the file into the application
                $filePathAndName=$this->pathToApps.'/uploads_img_product/tmp'.$type_id.'_'. ($index+1) . '.'.strtolower($file->getExtension());
                $filePathAndNameAsJpg=$this->pathToApps.'/uploads_img_product/'.$type_id.'_'. ($index+1).'.jpg';
                $file->moveTo($filePathAndName);
                $image->fromFile($filePathAndName)                     // load image.jpg
                ->autoOrient()                              // adjust orientation based on exif data
                ->fitToWidth(300)                          // resize to 320x200 pixels
                ->toFile($filePathAndNameAsJpg, 'image/jpeg');      // convert to JPG and save a copy to new-image.png
            }
        }
        $responce->status="success";
        $responce->message="Tip salvat cu succes!";
        $response
        ->setJsonContent($responce)
        ->send();
    }

    public function deleteFile() {
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $filePath=$_POST['filePath'];
        unlink($this->pathToApps.$filePath);

        $responce->status="success";
        $responce->message="Imagine stearsa!";
        $response
        ->setJsonContent($responce)
        ->send();
    }
}
