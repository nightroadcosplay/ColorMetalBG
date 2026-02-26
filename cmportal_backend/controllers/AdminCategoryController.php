<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter\FilterFactory;

class AdminCategoryController extends Controller
{
public function indexAction()
    {

    }


public function getCategory($pid){
$response = new Response();
$responce = new stdClass();
$responce->status="init";
$responce->message="";
$responce->category = new stdClass();

$category = NomCategoryProduct::findFirstByPid($pid);
if($category){
        $responce->status="success";
        $responce->category->pid=$category->pid;
        $responce->category->parent_pid=$category->parent_pid;
        if($category->parent_pid){
            $categoryParent = NomCategoryProduct::findFirstByPid($category->parent_pid);
            $responce->category->parent_name=$categoryParent->name_ro;
        }else{
            $responce->category->parent_name='';
        }

        $categoryChild = NomCategoryProduct::findFirstByParentPid($pid);
        if($categoryChild){
            $responce->category->hasChilds='y';
        }else{
            $responce->category->hasChilds='n';
        }
        $responce->category->name_ro=$category->name_ro;
        $responce->category->name_en=$category->name_en;
        $responce->category->name_bg=$category->name_bg;
        $responce->category->withLength=$category->with_length;
        $responce->category->withWidth=$category->with_width;
        $responce->category->withThickness=$category->with_thickness;
        $responce->category->withDiameter=$category->with_diameter;
        $responce->category->withHeight=$category->with_height;
        $responce->category->withAlloy=$category->with_alloy;
        $responce->category->withType=$category->with_type;
        $responce->category->withRollWeight=$category->with_roll_weight;
        $responce->category->positionLength=$category->length_position;
        $responce->category->positionWidth=$category->width_position;
        $responce->category->positionThickness=$category->thickness_position;
        $responce->category->positionDiameter=$category->diameter_position;
        $responce->category->positionHeight=$category->height_position;
        $responce->category->positionAlloy=$category->alloy_position;
        $responce->category->positionType=$category->type_position;
        $responce->category->positionRollWeight=$category->roll_weight_position;
        $responce->category->um1=$category->um1;
        $responce->category->um2=$category->um2;
        $responce->category->is_parent_for_articles=$category->is_parent_for_articles;
    }
    else{
        $responce->status="error";
        $responce->message="Nu poate fi identificata categoria pentru modificare!";
    }

$response
    ->setJsonContent($responce)
    ->send();
}



public function deleteCategory($pid){
$response = new Response();
$responce = new stdClass();
$responce->status="init";
$responce->message="";

$category = NomCategoryProduct::findByPid($pid);
if($category){
     if ($category->delete() === false) {
        $messages = $category->getMessages();
        foreach ($messages as $message) {
                $responce->message.=$message;
            }
        } else {
                $responce->status="success";
                $responce->message="Categoria fost stearsa!";
        }
    }
    else{
        $responce->status="error";
        $responce->message="Nu poate fi identificata categoria pentru stergere!";
    }

$response
    ->setJsonContent($responce)
    ->send();
}


public function getListDataCateg($rnd){
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->listDataCategories=[];

    $dataCategs = VNomCategoryHierarchy::find(
                    [
                        'order' => 'lant_complet_ro'
                    ]
                );
    foreach($dataCategs as $dataCateg){
                array_push($responce->listDataCategories, [
                            "pid"=>$dataCateg->pid,
                            "name_ro"=>$dataCateg->name_ro,
                            "name_en"=>$dataCateg->name_en,
                            "name_bg"=>$dataCateg->name_bg,
                            "lantHierarchyCategoriesRO"=>$dataCateg->lant_complet_ro,
                            "lantHierarchyCategoriesEN"=>$dataCateg->lant_complet_en,
                            "lantHierarchyCategoriesBG"=>$dataCateg->lant_complet_bg,
                            "withLength"=>$dataCateg->with_length,
                            "withWidth"=>$dataCateg->with_width,
                            "withThickness"=>$dataCateg->with_thickness,
                            "withDiameter"=>$dataCateg->with_diameter,
                            "withHeight"=>$dataCateg->with_height,
                            "withAlloy"=>$dataCateg->with_alloy,
                            "withType"=>$dataCateg->with_type,
                            "withRollWeight"=>$dataCateg->with_roll_weight
                        ]);
}

$responce->status="success";
$response
    ->setJsonContent($responce)
    ->send();
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
                $cildrenLevel3Categ=[];
            	$level4Categs = NomCategoryProduct::find(
                            [
                                'conditions' => 'parent_pid = ?1',
                                'bind'       => [
                                                1 => $level3Categ->pid,
                                            ]
                                ,'order' => 'pid'
                            ]);
            	foreach($level4Categs as $level4Categ){
                	array_push($cildrenLevel3Categ, [
                            "appid"=>$level4Categ->appid,
                            "pid"=>$level4Categ->pid,
                            "name_ro"=>$level4Categ->name_ro,
                            "name_en"=>$level4Categ->name_en,
                            "name_bg"=>$level4Categ->name_bg,
                            "is_parent_for_articles"=>$level4Categ->is_parent_for_articles,
                            "category_level"=>4,
                            "children"=>[]
                        ]);
                	
                }
                array_push($cildrenLevel2Categ, [
                            "appid"=>$level3Categ->appid,
                            "pid"=>$level3Categ->pid,
                            "name_ro"=>$level3Categ->name_ro,
                            "name_en"=>$level3Categ->name_en,
                            "name_bg"=>$level3Categ->name_bg,
                            "is_parent_for_articles"=>$level3Categ->is_parent_for_articles,
                            "category_level"=>3,
                            "children"=>$cildrenLevel3Categ
                        ]);
            }

        array_push($cildrenMainCateg, [
                    "appid"=>$level2Categ->appid,
                    "pid"=>$level2Categ->pid,
                    "name_ro"=>$level2Categ->name_ro,
                    "name_en"=>$level2Categ->name_en,
                    "name_bg"=>$level2Categ->name_bg,
                    "is_parent_for_articles"=>$level2Categ->is_parent_for_articles,
                    "category_level"=>2,
                    "children"=>$cildrenLevel2Categ
                ]);
    }

    array_push($responce->treeDataCategories, [
                    "appid"=>$mainCateg->appid,
                    "pid"=>$mainCateg->pid,
                    "name_ro"=>$mainCateg->name_ro,
                    "name_en"=>$mainCateg->name_en,
                    "name_bg"=>$mainCateg->name_bg,
                    "is_parent_for_articles"=>$mainCateg->is_parent_for_articles,
                    "category_level"=>1,
                    "children"=>$cildrenMainCateg
                        ]);
}

$responce->status="success";
$response
    ->setJsonContent($responce)
    ->send();
}


public function newCategory(){
    ini_set('memory_limit','56M');
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->apppid=0;
    $responce->pid=0;
    $result=false;
    $filterFactory = new FilterFactory();
    $filter = $filterFactory->newInstance();
    $category = new NomCategoryProduct();

    $category->name_ro = trim(mb_strtoupper(strip_tags( $_POST['name_ro']), 'UTF-8'));
    $category->name_en = trim(mb_strtoupper(strip_tags( $_POST['name_en']), 'UTF-8'));
    $category->name_bg = trim(mb_strtoupper(strip_tags( $_POST['name_bg']), 'UTF-8'));
    $category->with_length = trim(strtolower(strip_tags($_POST['with_length'])));
    $category->with_width = trim(strtolower(strip_tags($_POST['with_width'])));
    $category->with_thickness = trim(strtolower(strip_tags($_POST['with_thickness'])));
    $category->with_diameter = trim(strtolower(strip_tags($_POST['with_diameter'])));
    $category->with_height = trim(strtolower(strip_tags($_POST['with_height'])));
    $category->with_alloy = trim(strtolower(strip_tags($_POST['with_alloy'])));
    $category->with_type = trim(strtolower(strip_tags($_POST['type_alloy'])));
    $category->with_roll_weight = trim(strtolower(strip_tags($_POST['with_roll_weight'])));
    $category->length_position = trim(strtolower($filter->sanitize($_POST['length_position'], 'int')));
    $category->width_position = trim(strtolower($filter->sanitize($_POST['width_position'], 'int')));
    $category->diameter_position = trim(strtolower($filter->sanitize($_POST['diameter_position'], 'int')));
    $category->thickness_position = trim(strtolower($filter->sanitize($_POST['thickness_position'], 'int')));
    $category->height_position = trim(strtolower($filter->sanitize($_POST['height_position'], 'int')));
    $category->alloy_position = trim(strtolower($filter->sanitize($_POST['alloy_position'], 'int')));
    $category->type_position = trim(strtolower($filter->sanitize($_POST['type_position'], 'int')));
    $category->roll_weight_position = trim(strtolower($filter->sanitize($_POST['roll_weight_position'], 'int')));
    $category->um1 = trim(strtoupper(strip_tags( $_POST['um1'])));
    $category->um2 = trim(strtoupper(strip_tags( $_POST['um2'])));
    $category->is_parent_for_articles = trim(strtolower(strip_tags( $_POST['is_parent_for_articles'])));
    if(strlen($_POST['parent_pid'])>0){
        $category->parent_pid= $filter->sanitize($_POST['parent_pid'],  [Filter::FILTER_INT]);
    }else{
        $category->parent_pid=null;
    }

    $category->appid=0;
    // if(empty($_POST['name'])){
    //         $responce->status="error";
    //         $responce->message="Denumirea categoriei este obligatorie";
    //         die(json_encode($responce));
    // }

    try {
        $result=$category->save();
    }
    catch (PDOException $e) {
                            $responce->status="error";
                            $responce->message.=$e->getMessage();
                            }

    if (!$result) {
            $messages = $category->getMessages();
            foreach ($messages as $message) {
                $responce->status="error";
                $responce->message.=$message;
            }
            die(json_encode($responce));
    }else{
        $responce->status="success";
        $responce->message="Categorie adaugata cu succes!";
    }

    //mai departe ajunge numai daca nu sunt erori
    $responce->apppid=$category->appid;
    $responce->pid=$category->pid;
        if ($this->request->hasFiles() == true) {
            // Print the real file names and sizes
            foreach ($this->request->getUploadedFiles() as $file) {
                //Print file details
                //echo $file->getName(), " ", $file->getSize(), "\n";
                //die($file->getExtension());

                //Move the file into the application
                $filePathAndName=$this->pathToApps.'/uploads_img_product/tmp'.$category->pid.'.'.strtolower($file->getExtension());
                $filePathAndNameAsJpg=$this->pathToApps.'/uploads_img_product/'.$category->pid.'.jpg';
                $file->moveTo($filePathAndName);
                require $this->pathToApps.'/controllers/SimpleImage.php';
                $image = new \claviska\SimpleImage();
                $image->fromFile($filePathAndName)                     // load image.jpg
                ->autoOrient()                              // adjust orientation based on exif data
                ->fitToWidth(300)                          // resize to 320x200 pixels
                ->toFile($filePathAndNameAsJpg, 'image/jpeg');      // convert to JPG and save a copy to new-image.png
            }
        }


    die(json_encode($responce));
}


public function editCategory($pid){
    ini_set('memory_limit','56M');
    // die('sssss');
    // error_reporting(0);
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->apppid=0;
    $responce->pid=0;
    $result=false;
    $filterFactory = new FilterFactory();
    $filter = $filterFactory->newInstance();
    $category = NomCategoryProduct::findFirstByPid($pid);
    if(!$category){
            $responce->status="error";
            $responce->message="Nu poate fi identificata categoria pentru modificare.";
            die(json_encode($responce));
    }

    $category->name_ro = trim(mb_strtoupper(strip_tags( $_POST['name_ro']), 'UTF-8'));
    $category->name_en = trim(mb_strtoupper(strip_tags( $_POST['name_en']), 'UTF-8'));
    $category->name_bg = trim(mb_strtoupper(strip_tags( $_POST['name_bg']), 'UTF-8'));
    $category->with_length = trim(strtolower(strip_tags( $_POST['with_length'])));
    $category->with_width = trim(strtolower(strip_tags( $_POST['with_width'])));
    $category->with_thickness = trim(strtolower(strip_tags( $_POST['with_thickness'])));
    $category->with_diameter = trim(strtolower(strip_tags( $_POST['with_diameter'])));
    $category->with_height = trim(strtolower(strip_tags( $_POST['with_height'])));
    $category->with_alloy = trim(strtolower(strip_tags( $_POST['with_alloy'])));
    $category->with_type = trim(strtolower(strip_tags( $_POST['with_type'])));
    $category->with_roll_weight = trim(strtolower(strip_tags( $_POST['with_roll_weight'])));
    $category->length_position = trim(strtolower($filter->sanitize($_POST['length_position'], 'int')));
    $category->width_position = trim(strtolower($filter->sanitize($_POST['width_position'], 'int')));
    $category->diameter_position = trim(strtolower($filter->sanitize($_POST['diameter_position'], 'int')));
    $category->thickness_position = trim(strtolower($filter->sanitize($_POST['thickness_position'], 'int')));
    $category->height_position = trim(strtolower($filter->sanitize($_POST['height_position'], 'int')));
    $category->alloy_position = trim(strtolower($filter->sanitize($_POST['alloy_position'], 'int')));
    $category->type_position = trim(strtolower($filter->sanitize($_POST['type_position'], 'int')));
    $category->roll_weight_position = trim(strtolower($filter->sanitize($_POST['roll_weight_position'], 'int')));
    $category->um1 = trim(strtoupper(strip_tags( $_POST['um1'])));
    $category->um2 = trim(strtoupper(strip_tags( $_POST['um2'])));
    $category->is_parent_for_articles = trim(strtolower(strip_tags( $_POST['is_parent_for_articles'])));

    // $category->appid=0;
    // if(empty($_POST['name_ro'])){
    //         $responce->status="error";
    //         $responce->message="Denumirea categoriei este obligatorie";
    //         die(json_encode($responce));
    // }

    try {
        $result=$category->save();
    }
    catch (PDOException $e) {
                            $responce->status="error";
                            $responce->message.=$e->getMessage();
                            }

    if (!$result) {
            $messages = $category->getMessages();
            foreach ($messages as $message) {
                $responce->status="error";
                $responce->message.=$message;
            }
            die(json_encode($responce));
    }else{
        $responce->status="success";
        $responce->message="Categorie adaugata cu succes!";
    }

    //mai departe ajunge numai daca nu sunt erori
    $responce->apppid=$category->appid;
    $responce->pid=$category->pid;
        if ($this->request->hasFiles() == true) {
            // Print the real file names and sizes
            foreach ($this->request->getUploadedFiles() as $file) {
                //Print file details
                //echo $file->getName(), " ", $file->getSize(), "\n";
                //die($file->getExtension());

                //Move the file into the application
                $filePathAndName=$this->pathToApps.'/uploads_img_product/tmp'.$category->pid.'.'.strtolower($file->getExtension());
                $filePathAndNameAsJpg=$this->pathToApps.'/uploads_img_product/'.$category->pid.'.jpg';
                $file->moveTo($filePathAndName);
                require $this->pathToApps.'/controllers/SimpleImage.php';
                $image = new \claviska\SimpleImage();
                $image->fromFile($filePathAndName)                     // load image.jpg
                ->autoOrient()                              // adjust orientation based on exif data
                ->fitToWidth(300)                          // resize to 320x200 pixels
                ->toFile($filePathAndNameAsJpg, 'image/jpeg');      // convert to JPG and save a copy to new-image.png
            }
        }


    die(json_encode($responce));
}


public function getImageCategoryAsString($pid){
    $category = NomCategoryProduct::findFirstByPid($pid);
    if($category){
        $file=$this->pathToApps.'/uploads_img_product/'.$pid.'.jpg';
        if (file_exists($file)) {
            $resource_avatar=imagecreatefromjpeg($file) ;
            ob_start();
            imagejpeg($resource_avatar);
            $image_data=ob_get_contents();
            ob_end_clean();
            die('data:image/jpeg;base64,'.base64_encode($image_data));
        }
    }
    die('');
}


}
