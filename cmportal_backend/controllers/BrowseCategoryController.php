<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;

class BrowseCategoryController extends Controller
{
public function indexAction()
    {

    }


public function getAllCategories(){
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
$response = new Response();
$responce = new stdClass();
$responce->status="init";
$responce->message="";
$responce->categories = [];

$categories = NomCategoryProduct::find([
                                          'conditions' => 'parent_pid is null and pid != 1 and ord is not null'
                                         ,'order' => 'ord'
                                          ]);
if($categories){
        $responce->status="success";
        foreach ($categories as $category){
            $categoriesChildren = NomCategoryProduct::findByParentPid($category->pid);
            $children=[];
            foreach($categoriesChildren as $categoryChild){
                $categoriesChildren2 = NomCategoryProduct::findByParentPid($categoryChild->pid);
                $children2=[];
                foreach($categoriesChildren2 as $categoryChild2){
                    array_push($children2, [
                                            "pid"=>$categoryChild2->pid,
                                            "name_ro"=>$categoryChild2->name_ro,
                                            "name_en"=>$categoryChild2->name_en,
                                            "name_bg"=>$categoryChild2->name_bg,
                                            "isParentForArticles"=>$categoryChild2->is_parent_for_articles
                                        ]);
                }
                array_push($children, [
                                        "pid"=>$categoryChild->pid,
                                        "name_ro"=>$categoryChild->name_ro,
                                        "name_en"=>$categoryChild->name_en,
                                        "name_bg"=>$categoryChild->name_bg,
                                        "isParentForArticles"=>$categoryChild->is_parent_for_articles,
                                        "children"=>$children2
                                    ]);
            }
            array_push($responce->categories, [
                        "pid"=>$category->pid,
                        "name_ro"=>$category->name_ro,
                        "name_en"=>$category->name_en,
                        "name_bg"=>$category->name_bg,
                        "isParentForArticles"=>$category->is_parent_for_articles,
                        "children"=>$children
                    ]);
        }
    }
    else{
        $responce->status="error";
        $responce->message="Nu poate fi interogate datele!";
    }

$response
    ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
    ->setJsonContent($responce)
    ->send();
}

public function getCategory($pid){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->categoryPid="";
    $responce->categoryNameRO="";
    $responce->categoryNameEN="";
    $responce->categoryNameBG="";
    $responce->isParentForArticles="";
    $responce->categories = [];
    $responce->hierarchicalChain = [];

    $selectedCategory = NomCategoryProduct::findFirst(
        "pid = ".$pid
    );

    if($selectedCategory){
        $responce->categoryPid=$selectedCategory->pid;
        $responce->categoryName=$selectedCategory->name_ro;
        $responce->isParentForArticles=$selectedCategory->is_parent_for_articles;

        $categories = NomCategoryProduct::findByParentPid($pid);
        if($categories){
            $responce->status="success";
            foreach ($categories as $category){
                    $categoriesChildren = NomCategoryProduct::findByParentPid($category->pid);
                    $children=[];
                    foreach($categoriesChildren as $categoryChild){
                        $categoriesChildren2 = NomCategoryProduct::findByParentPid($categoryChild->pid);
                        $children2=[];
                        foreach($categoriesChildren2 as $categoryChild2){
                            array_push($children2, [
                                                    "pid"=>$categoryChild2->pid,
                                                    "name_ro"=>$categoryChild2->name_ro,
                                                    "name_en"=>$categoryChild2->name_en,
                                                    "name_bg"=>$categoryChild2->name_bg,
                                                    "isParentForArticles"=>$categoryChild2->is_parent_for_articles
                                                ]);
                        }
                        array_push($children, [
                                                "pid"=>$categoryChild->pid,
                                                "name_ro"=>$categoryChild->name_ro,
                                                "name_en"=>$categoryChild->name_en,
                                                "name_bg"=>$categoryChild->name_bg,
                                                "isParentForArticles"=>$categoryChild->is_parent_for_articles,
                                                "children"=>$children2
                                            ]);
                    }
                    array_push($responce->categories, [
                                "pid"=>$category->pid,
                                "name_ro"=>$category->name_ro,
                                "name_en"=>$category->name_en,
                                "name_bg"=>$category->name_bg,
                                "isParentForArticles"=>$category->is_parent_for_articles,
                                "children"=>$children
                            ]);
            }
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
        $responce->message="Nu poate fi identificata aceasta categorie!";
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
