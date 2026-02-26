<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class ApiNavGetAccountingBalance extends Controller
{
    private $logger;
    private $writeComputationalsToLogs = true;
    public $nav_success;
    public $nav_error;
    public $navisionId;


    /**
     * @param $f3
     * check user and password
     * return json if error, else reroute to apps space
     */

    public function getBalanta($pcif)
    {
    $responce = new stdClass();
    $responce->status = "init";

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
    if($company){
        $startDate=(1*date("Y")-1).'-01-01';
        $endDate=date("Y-m-d");
           $navrequest->request_for_Nav='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="urn:microsoft-dynamics-schemas/codeunit/PublicNavisionServices" xmlns:x50="urn:microsoft-dynamics-nav/xmlports/x50097">
           <soapenv:Header/>
               <soapenv:Body>
                  <cus:Balance><cus:lastSynchDate>1900-01-01</cus:lastSynchDate><cus:navisionID>'.$company->navisionid.'</cus:navisionID><cus:startDate>'.$startDate.'</cus:startDate><cus:endDate>'.$endDate.'</cus:endDate><cus:balance></cus:balance></cus:Balance>
               </soapenv:Body>
            </soapenv:Envelope>';
//die(var_dump($navrequest->request_for_Nav));
//die(var_dump($navrequest->__getFunctions()));
//die(var_dump($navrequest->__getTypes()));
        $navrequest->Balance();
        $xml = $navrequest->result;
        $xml = preg_replace("/(<\/?)(\w+):([^>]*>)/", '$1$2$3', $xml);
        //file_put_contents($f3->dir_trackxml."/".$pcif."_getClient".date("Y_m_d_H_i_s").".txt",html_entity_decode($xml));
        $xml = simplexml_load_string($xml);
        $json = json_encode($xml);
        $responseObj = json_decode($json, false); // true to have an array, false for an object
        //die(var_dump($responseObj));
        $responce->balantaInNav=$responseObj->SoapBody->Balance_Result->balance->Customer;
        $responce->status = "success";
        //die(var_dump($responce->balantaInNav));
        //if($f3->get('SESSION.user')=='BC'){die(var_dump($responce->balantaInNav));}
        }else{
           $responce->status = "error";
           $responce->message = "Compania nu poate fi identficata!";
        }
        return $responce;
        //die(json_encode($responseObj));
    }
}



?>
