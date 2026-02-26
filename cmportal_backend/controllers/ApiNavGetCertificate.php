<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class ApiNavGetCertificate extends Controller
{
    private $logger;
    private $writeComputationalsToLogs = true;
    public $nav_success;
    public $nav_error;
    public $navisionId;


	public function getCertificatePDF($bill_nr){
 		$responce = new stdClass();
    	$responce->status = "init";
    	$responce->message = "";
    	$responce->articles = [];
    	$responce->countCertificates = 0;

    	stream_wrapper_unregister('http');
    	stream_wrapper_register('http', 'NTLMStream') or die("Failed to register protocol");
    	$baseURL = 'http://84.1.113.194:7047/DynamicsNAV100/WS/COLOR%20METAL/Codeunit/PublicNavisionServices';
    	//libxml_disable_entity_loader(false);
    	$options = array(
	                    'encoding' => 'UTF-8',
	                    'verifypeer' => false,
	                    'verifyhost' => false,
	                    'soap_version' => SOAP_1_2,
	                    'trace' => 1,
	                    'exceptions' => 1,
	                    'connection_timeout' => 180,
	                    'security_level' => 1,
	                    'stream_context' => stream_context_create(array(

	                                                                    'socket' => [
	                                                                         'bindto' => '84.1.113.194'
	                                                                        ],
	                                                                    'ssl' => array(
	                                                                                   'verify_peer' => false,
	                                                                                    'verify_peer_name' => false,
	                                                                                    'allow_self_signed' => true
	                                                                                )
	                                                                    )
	                                                                )
	                    );
    	try {
       	$navrequest = new NTLMSoapClient($baseURL,$options);
    	} catch (SoapFault $navrequest) {
        	var_dump(libxml_get_last_error());
       	var_dump($navrequest);
    	}

 		$navrequest->request_for_Nav='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pub="urn:microsoft-dynamics-schemas/codeunit/PublicNavisionServices" xmlns:x50="urn:microsoft-dynamics-nav/xmlports/x50099">
       	<soapenv:Header/>
           <soapenv:Body>
              <pub:CertificatePDF><pub:navisionID>'. $bill_nr .'</pub:navisionID><pub:certificateData></pub:certificateData></pub:CertificatePDF>
           </soapenv:Body>
        </soapenv:Envelope>';
        // die(var_dump($navrequest->request_for_Nav));
		// die(var_dump($navrequest->__getFunctions()));
		// die(var_dump($navrequest->__getTypes()));
		$navrequest->CertificatePDF();
      $xml = $navrequest->result;
    	$xml = preg_replace("/(<\/?)(\w+):([^>]*>)/", '$1$2$3', $xml);
    	$xml = simplexml_load_string($xml);
    	$json = json_encode($xml);
    	$responseObj = json_decode($json, false); // true to have an array, false for an object
    	// die(var_dump($responseObj));
    	// die(var_dump($responseObj->SoapBody->CertificatePDF_Result->certificateData));

    	$articles = $responseObj->SoapBody->CertificatePDF_Result->certificateData->Articles;
    	if(is_array($articles)) {
    		$responce->countCertificates = count($articles);
    		foreach ($articles as $article) {
    			array_push($responce->articles, [
    					'ItemNo' => $article->ItemNo,
    					'Description' => $article->Description,
    					'Certificate' => $article->Certificate,
    			]);
    		}
 			$responce->message = '';
    	} else {
    		$responce->message = $responseObj->SoapBody->CertificatePDF_Result->certificateData->Articles->Certificate;
    	}
    	$responce->status = "success";
 		// $responce->message = $responseObj->SoapBody->CertificatePDF_Result->certificateData->Articles[0]->Certificate;

    	 return $responce;
 	}
}
