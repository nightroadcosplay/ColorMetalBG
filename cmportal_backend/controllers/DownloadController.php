<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;
use Phalcon\Mvc\View;
use Dompdf\Dompdf;

class DownloadController extends Controller
{
	use TranslatesMessages;

	public function generareOfertaPdfLink($type,$id_offer, $lang) {

        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $pdf_path = $this->pathToApps.'/offers_pdf/'.$type.'_'.$id_offer. '_' . $lang .'.pdf';
        // die(var_dump($pdf_path));

        if(file_exists($pdf_path)) {
        	if(filesize($pdf_path) > 0) { 
	        	$b64Doc = chunk_split(base64_encode(file_get_contents($pdf_path)));
	        	$responce->message=$b64Doc;
	        	$responce->status = "success";
	        } else {
	    		$responce->status = "error";
	        	$responce->message=$this->t('fisierul_este_gol');
	        }
    	} else {
    		$responce->status = "error";
        	$responce->message=$this->t('fisierul_nu_a_fost_gasit');
    	}

        $response
            ->setJsonContent($responce)
            ->send();	
    }

    public function generarePdfPrivacy($type) {

        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";

        $pdf_path = $this->pathToApps.'/offers_pdf/'.$type.'.pdf';

        if(file_exists($pdf_path)) {
        	if(filesize($pdf_path) > 0) { 
	        	$b64Doc = chunk_split(base64_encode(file_get_contents($pdf_path)));
	        	$responce->message=$b64Doc;
	        	$responce->status = "success";
	        } else {
	    		$responce->status = "error";
	        	$responce->message=$this->t('fisierul_este_gol');
	        }
    	} else {
    		$responce->status = "error";
        	$responce->message=$this->t('fisierul_nu_a_fost_gasit');
    	}

        $response
            ->setJsonContent($responce)
            ->send();	
    }

}