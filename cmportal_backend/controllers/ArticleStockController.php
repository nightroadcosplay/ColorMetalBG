<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class ArticleStockController extends Controller
{
public function indexAction()
    {

    }

     public function getArticleStock($productCode) {

        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $apiNav = new ApiNavGetArticleStock();
        $raspunsDinNav = $apiNav->getArticleStock($productCode);
        // $responce->message = $raspunsDinNav->message;
        $responce->itemStockBG = $raspunsDinNav->itemStockBG;
        $responce->itemStockRO = $raspunsDinNav->itemStockRO;
        $responce->status="success";
        $response
            ->setJsonContent($responce)
            ->send();
    }

}