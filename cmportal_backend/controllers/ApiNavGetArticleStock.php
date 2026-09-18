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
    	$responce->itemStockBG = 0;
    	$responce->itemStockRO = 0;

    	stream_wrapper_unregister('http');
    	stream_wrapper_register('http', 'NTLMStream') or die("Failed to register protocol");
    	$baseURL = $this->di->get('baseURLNavision');
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
       	$navrequest->request_for_Nav='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="urn:microsoft-dynamics-schemas/codeunit/PublicNavisionServices" xmlns:x50="urn:microsoft-dynamics-nav/xmlports/x50060">
       	<soapenv:Header/>
           <soapenv:Body>
              <cus:GetArticleStock><cus:lastSynchDate>1900-01-01</cus:lastSynchDate><cus:itemNo>'.$productCode.'</cus:itemNo><cus:itemStock></cus:itemStock></cus:GetArticleStock>
           </soapenv:Body>
        </soapenv:Envelope>';
		$result = $navrequest->GetArticleStock();
		// die(var_dump($result));

     	if(is_array($result->itemStock->Item->ItemLedgerEntry)){
            foreach ($result->itemStock->Item->ItemLedgerEntry as $navdepozit){
            	if($navdepozit->Quantity-$navdepozit->ReservedQuantity != "0") {
            		$responce->itemStockBG += $navdepozit->Quantity-$navdepozit->ReservedQuantity;
            	}
            }
        }else{
            if(is_object($result->itemStock->Item->ItemLedgerEntry)){
                $navdepozit=$result->itemStock->Item->ItemLedgerEntry;
            	if($navdepozit->Quantity-$navdepozit->ReservedQuantity != "0") {
            		$responce->itemStockBG = $navdepozit->Quantity-$navdepozit->ReservedQuantity;
            	}
            }
        }
    		
		$baseURL = $this->di->get('baseURLNavisionRO');
		try {
			$navrequest = new NTLMSoapClient($baseURL,$options);
		} catch (SoapFault $navrequest) {
			var_dump(libxml_get_last_error());
			var_dump($navrequest);
		}
		$navrequest->request_for_Nav='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="urn:microsoft-dynamics-schemas/codeunit/PublicNavisionServices" xmlns:x50="urn:microsoft-dynamics-nav/xmlports/x50060">
		<soapenv:Header/>
		<soapenv:Body>
			<cus:GetArticleStock><cus:lastSynchDate>1900-01-01</cus:lastSynchDate><cus:itemNo>'.$productCode.'</cus:itemNo><cus:itemStock></cus:itemStock></cus:GetArticleStock>
		</soapenv:Body>
		</soapenv:Envelope>';
		$result = $navrequest->GetArticleStock();
		// die(var_dump($result));

		if(is_array($result->itemStock->Item->ItemLedgerEntry)){
			foreach ($result->itemStock->Item->ItemLedgerEntry as $navdepozit){
				if($navdepozit->Quantity-$navdepozit->ReservedQuantity != "0") {
					$responce->itemStockRO += $navdepozit->Quantity-$navdepozit->ReservedQuantity;
				}
			}
		}else{
			if(is_object($result->itemStock->Item->ItemLedgerEntry)){
				$navdepozit=$result->itemStock->Item->ItemLedgerEntry;
				if($navdepozit->Quantity-$navdepozit->ReservedQuantity != "0") {
					$responce->itemStockRO = $navdepozit->Quantity-$navdepozit->ReservedQuantity;
				}
			}
		}
        // $responce->depozite = $depozite;
        $responce->status = "success";
        return $responce;
 	}
}
