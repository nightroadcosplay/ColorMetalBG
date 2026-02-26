<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class OfferPDFController extends Controller {
	public function offerPDF($slid, $lang, $tokenId, $token){
 		header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
	    $rawdata = file_get_contents("php://input");
	    $postData= json_decode($rawdata);
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        //verificam ca nu a mai fost folosit acest token
        $logToken = new LogTokenidFromSalesController();
        if(!$logToken->check($tokenId)){
            $responce->status="error";
            $responce->message="2Token Invalid";
           die(json_encode($responce));
        }

        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$tokenId)!=$tokenHash){
            $responce->status="error";
            $responce->message="3Token Invalid";
            die(json_encode($responce));
        }

        $file=$this->pathToApps.'/offers_pdf/offer_'.$slid. '_' . $lang .'.pdf';
        file_get_contents($file, base64_decode($postData->pdfBase64));
        $responce->status="success";
        $responce->message="File saved successfully";

        $response
            ->setJsonContent($responce)
            ->send();
	}

    public function savePDF($type, $slid, $lang, $tokenId, $tokenHash){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $rawdata = file_get_contents("php://input");
        $postData= json_decode($rawdata);
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

        if($type == 'offer'){
            $file=$this->pathToApps.'/offers_pdf/offer_'.$slid. '_' . $lang .'.pdf';
            file_put_contents($file, base64_decode($postData->pdfBase64));
        } else if($type == 'confirmare'){
            $file=$this->pathToApps.'/offers_pdf/confirmare_'.$slid. '_' . $lang .'.pdf';
            file_put_contents($file, base64_decode($postData->pdfBase64));
        }
        $responce->status="success";
        $responce->message="File saved successfully";

        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function deletePdf($type, $slid, $lang, $tokenId, $tokenHash){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $rawdata = file_get_contents("php://input");
        $postData= json_decode($rawdata);
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        if($type == 'offer') {
            $file=$this->pathToApps.'/offers_pdf/offer_'.$slid. '_' . $lang .'.pdf';
            if(file.exists($file)) {
                if(unlink($file)) {
                    $responce->status="success";
                    $responce->message="File deleted successfully";
                } else {
                    $responce->status="error";
                    $responce->message="Unable to delete file";
                }
            } else {
                $responce->status="error";
                $responce->message="File not found";
            }
        } else if($type == 'confirmare'){
            $file=$this->pathToApps.'/offers_pdf/confirmare_'.$slid. '_' . $lang .'.pdf';
            if(file.exists($file)) {
                if(unlink($file)) {
                    $responce->status="success";
                    $responce->message="File deleted successfully";
                } else {
                    $responce->status="error";
                    $responce->message="Unable to delete file";
                }
            } else {
                $responce->status="error";
                $responce->message="File not found";
            }
        }

        $response
            ->setJsonContent($responce)
            ->send();
    }
}
?>