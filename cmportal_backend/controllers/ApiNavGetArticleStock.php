<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class ApiNavGetArticleStock extends Controller
{
    private $logger;
    private $writeComputationalsToLogs = true;
    public $nav_success;
    public $nav_error;
    public $navisionId;

    public function getArticleStock($productCode) {
    	$responce = new stdClass();
    	$responce->status = "init";
    	$responce->itemStock = 0;

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
		// die(var_dump($company->navisionid));
    	// $currentDateTime = new DateTime('- 400 days');
		// $data_rulare=$currentDateTime->format('Y-m-d');
       	$navrequest->request_for_Nav='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="urn:microsoft-dynamics-schemas/codeunit/PublicNavisionServices" xmlns:x50="urn:microsoft-dynamics-nav/xmlports/x50060">
       	<soapenv:Header/>
           <soapenv:Body>
              <cus:GetArticleStock><cus:lastSynchDate>1900-01-01</cus:lastSynchDate><cus:itemNo>'.$productCode.'</cus:itemNo><cus:itemStock></cus:itemStock></cus:GetArticleStock>
           </soapenv:Body>
        </soapenv:Envelope>';
        // die(var_dump($navrequest->request_for_Nav));
		// die(var_dump($navrequest->__getFunctions()));
		// die(var_dump($navrequest->__getTypes()));
		$result = $navrequest->GetArticleStock();
      	$xml = $navrequest->result;
    	$xml = preg_replace("/(<\/?)(\w+):([^>]*>)/", '$1$2$3', $xml);
    	$xml = simplexml_load_string($xml);
    	$json = json_encode($xml);
    	$responseObj = json_decode($json, false); // true to have an array, false for an object
    	// die(var_dump($responseObj->SoapBody->Invoice_Result->invoice->SalesInvoiceHeader));
    	// array_push($responce->invoices, [$responseObj->SoapBody->Invoice_Result->invoice->SalesInvoiceHeader]);
    	// die(var_dump($responseObj->SoapBody->Invoice_Result->invoice->SalesInvoiceHeader));
    	// die(var_dump($result));

     	if(is_array($result->itemStock->Item->ItemLedgerEntry)){
            foreach ($result->itemStock->Item->ItemLedgerEntry as $navdepozit){
            	if($navdepozit->Quantity-$navdepozit->ReservedQuantity != "0") {
            		$responce->itemStock += $navdepozit->Quantity-$navdepozit->ReservedQuantity;
            	}
            }
        }else{
            if(is_object($result->itemStock->Item->ItemLedgerEntry)){
                $navdepozit=$result->itemStock->Item->ItemLedgerEntry;
            	if($navdepozit->Quantity-$navdepozit->ReservedQuantity != "0") {
            		$responce->itemStock = $navdepozit->Quantity-$navdepozit->ReservedQuantity;
            	}
            }
        }

        // $responce->depozite = $depozite;
        $responce->status = "success";
        return $responce;
 	}
}
