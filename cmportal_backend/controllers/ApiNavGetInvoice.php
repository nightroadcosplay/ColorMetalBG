<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class ApiNavGetInvoice extends Controller
{
    use TranslatesMessages;
    private $logger;
    private $writeComputationalsToLogs = true;
    public $nav_success;
    public $nav_error;
    public $navisionId;

    public function getInvoices($pcif) {
    	$responce = new stdClass();
    	$responce->status = "init";
    	$responce->invoices = [];

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
     	$company= CompaniesModel::findFirst(
                                        [
                                        'conditions' => 'cif = ?1',
                                        'bind'       => [
                                                1 => $pcif
                                            ]
                                        ]
                                    );
    	if($company) {
    		// die(var_dump($company->navisionid));
        	$currentDateTime = new DateTime('- 400 days');
			$data_rulare=$currentDateTime->format('Y-m-d');
	       	$navrequest->request_for_Nav='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="urn:microsoft-dynamics-schemas/codeunit/PublicNavisionServices" xmlns:x50="urn:microsoft-dynamics-nav/xmlports/x50058">
	       	<soapenv:Header/>
	           <soapenv:Body>
	              <cus:Invoice><cus:companyID>'.$company->navisionid.'</cus:companyID><cus:lastSynchDate>'.$data_rulare.'</cus:lastSynchDate><cus:navisionID></cus:navisionID><cus:ofertaID>0</cus:ofertaID><cus:invoice></cus:invoice></cus:Invoice>
	           </soapenv:Body>
	        </soapenv:Envelope>';
	        // die(var_dump($navrequest->request_for_Nav));
			// die(var_dump($navrequest->__getFunctions()));
			// die(var_dump($navrequest->__getTypes()));
			$navrequest->Invoice();
	      $xml = $navrequest->result;
	    	$xml = preg_replace("/(<\/?)(\w+):([^>]*>)/", '$1$2$3', $xml);
	    	$xml = simplexml_load_string($xml);
	    	$json = json_encode($xml);
	    	$responseObj = json_decode($json, false); // true to have an array, false for an object
	    	// die(var_dump($responseObj->SoapBody->Invoice_Result->invoice->SalesInvoiceHeader));
	    	// array_push($responce->invoices, [$responseObj->SoapBody->Invoice_Result->invoice->SalesInvoiceHeader]);
	    	// die(var_dump($responseObj->SoapBody->Invoice_Result->invoice->SalesInvoiceHeader));
	    	// die(var_dump($responseObj));
	    	$invoiceModel = new InvoicesModel();
			$nr_of_invoices=0;
			$nr_of_invoices_overdue=0;
			
			$areInvoicesOverdue = false;
			$today = new DateTime();
	    	$userid=$this->session->get('userId');
	    	foreach($responseObj->SoapBody->Invoice_Result->invoice->SalesInvoiceHeader as $invoice) {
	    		$nr_of_invoices++;
	    		if(!property_exists($invoice, 'AmountIncludingVAT')){
	    			continue;
	    		}
				$val_tva=1*$invoice->AmountIncludingVAT-1*$invoice->Amount;

				
				$dueDate = new DateTime($invoice->DueDate);
    			if($dueDate > $today){
                $dueDate = $today;
            }
    			$interval = $today->diff($dueDate);
    			$diffInDays = $interval->format("%d");
    			if($diffInDays > 3 && $invoice->RemainingAmount > 0) {
    				if(!$areInvoicesOverdue) {
	    				$areInvoicesOverdue = true;
	    			}
	    			$update_alert_db = $this->db->query("insert into portal_color.alerts (description, \"type\" , custom_id, userid)
																	values ('Scadenta depasita pentru factura cu nr ', 'i', :bill_nr, :userid)
																	on conflict (custom_id) do nothing", array(':bill_nr' => $invoice->InvoiceNo, ':userid' => $userid));
	    			if($update_alert_db) { //inserted new alert for invoice
	    				$nr_of_invoices_overdue++;
	    			}
    			}
	    		
	    		$nr_of_rows_inserted = $this->db->query("
	    			insert into portal_color.invoices (cif,amount_including_vat,amount_without_vat,amount_vat,client_navisionid,bill_nr,bill_data,bill_navisionid,order_navisionid,sales_team,id_valuta,este_retur,bill_due_date,remaining_amount,id_oferta)
						values(:cif,:amount_including_vat,:amount_without_vat,:amount_vat,:client_navisionid,:bill_nr,:bill_data,:bill_navisionid,:order_navisionid,:sales_team,:id_valuta,:este_retur,:bill_due_date, :remaining_amount, :id_oferta)
						on conflict (bill_nr) do update set amount_including_vat=EXCLUDED.amount_including_vat,amount_without_vat=EXCLUDED.amount_without_vat,amount_vat=EXCLUDED.amount_vat, bill_data=EXCLUDED.bill_data, bill_due_date=EXCLUDED.bill_due_date, remaining_amount=EXCLUDED.remaining_amount",
						array (
	               		':cif' => $invoice->VATRegistrationNo
						, ':amount_including_vat' => $invoice->AmountIncludingVAT
						, ':amount_without_vat' => $invoice->Amount
						, ':amount_vat' => $val_tva
						, ':client_navisionid' => $invoice->BilltoCustomerNo
						, ':bill_nr' => $invoice->InvoiceNo
						, ':bill_data' => $invoice->PostingDate
						, ':bill_navisionid' => $invoice->InvoiceNo
						, ':order_navisionid' => (empty((array)  $invoice->DisposalOrderNo)?'': $invoice->DisposalOrderNo)
						, ':sales_team' =>(empty((array)  $invoice->SalesteamCode)?'': $invoice->SalesteamCode)
						, ':id_valuta' => 'RON'
						, ':este_retur' => 'n'
						, ':bill_due_date' => $invoice->DueDate
						, ':remaining_amount' => $invoice->RemainingAmount
						, ':id_oferta' => $invoice->OfertaId
	    		 	));

	    		array_push($responce->invoices, [ 'bill_nr' => $invoice->InvoiceNo]);
	    	}

	    	if(empty($responce->invoices)) {
	    		$responce->status = "info";
    			$responce->message = $this->t('nu_sunt_facturi_noi_in_nav_pentru_acest_client');
    			return $responce;
	    	} else {
	    		$responce->status = "success";
	    		$responce->message = $nr_of_invoices . ' ' . $pcif;
	    		$responce->areInvoicesOverdue = $areInvoicesOverdue;
	    		$responce->overdueInvoiceCount = $nr_of_invoices_overdue;

	       	return $responce;
       	}
    	}
 	}

 	public function getInvoicePDF($bill_nr){
 		$responce = new stdClass();
    	$responce->status = "init";
    	$responce->message = "";

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
              <pub:InvoicePDF><pub:navisionID>'. $bill_nr .'</pub:navisionID><pub:invoiceData></pub:invoiceData></pub:InvoicePDF>
           </soapenv:Body>
        </soapenv:Envelope>';
        // die(var_dump($navrequest->request_for_Nav));
		// die(var_dump($navrequest->__getFunctions()));
		// die(var_dump($navrequest->__getTypes()));
		$navrequest->InvoicePDF();
      $xml = $navrequest->result;
    	$xml = preg_replace("/(<\/?)(\w+):([^>]*>)/", '$1$2$3', $xml);
    	$xml = simplexml_load_string($xml);
    	$json = json_encode($xml);
    	$responseObj = json_decode($json, false); // true to have an array, false for an object
    	// die(var_dump($responseObj));
    	// die(var_dump($responseObj->SoapBody->InvoicePDF_Result->invoiceData));
    	// array_push($responce->invoices, [$responseObj->SoapBody->Invoice_Result->invoice->SalesInvoiceHeader]);
    	// die(var_dump($responseObj->SoapBody->Invoice_Result->invoice->SalesInvoiceHeader));

    	$responce->status = "success";
 		$responce->message = $responseObj->SoapBody->InvoicePDF_Result->invoiceData;

    	 return $responce;
 	}
}
