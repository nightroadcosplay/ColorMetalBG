<?php
class NTLMSoapClient extends SoapClient {
    public $paramForSoapRequest;
    public $request_for_Nav;
    public $result;
    private $NAVUSERPWD='COLORMETAL\nav_salesapp:Nsapud2018#.';
//    function __soapCall($functionName,$arguments){    }
    function __doRequest(string $request, string $location, string $action, int $version = 1, bool $one_way = false): ?string {
        $headers = array(
            'Method: POST',
            'Connection: Keep-Alive',
            'User-Agent: PHP-SOAP-CURL',
            'Content-Type: text/xml; charset=utf-8',
            'SOAPAction: "'.$action.'"',
        );
        //die(var_dump($action));
        $arr_action=explode(":",$action) ;
//die(var_dump($myrequest));
//$this->__last_request_headers = $x;
        $this->__last_request_headers = $headers;
        $ch = curl_init($location);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, true );
        curl_setopt($ch, CURLOPT_POSTFIELDS, $this->request_for_Nav);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_NTLM);
        curl_setopt($ch, CURLOPT_USERPWD, $this->NAVUSERPWD);
        $this->result = curl_exec($ch);
        //die(var_dump($this->result));
        curl_close($ch);
        return $this->result;
    }

    function __getLastRequestHeaders(): ?string {
        // die(var_dump($this->__last_request_headers));
        return implode("\n", $this->__last_request_headers)."\n";
    }
}
?>