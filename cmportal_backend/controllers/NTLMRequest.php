<?php

class NTLMRequest {

	private $navrequest;

	public function createRequest() {
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
	       $this->$navrequest = new NTLMSoapClient($baseURL,$options);
	    } catch (SoapFault $navrequest) {
	        var_dump(libxml_get_last_error());
	        var_dump($this->$navrequest);
	    }
	}
}