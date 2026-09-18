<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;

class CompanyUsersController extends Controller
{
use TranslatesMessages;

private $companyCode;
private $cif;

public function onConstruct()
{
    $responceContent = new stdClass();
    $responceContent->status="init";
    $responceContent->message="";    
    $isConnected=false;
    $response = new Response();
    if ($this->session->has('isConnected') && $this->session->has('userId')  && $this->session->has('companyCode') && $this->session->has('cif')) {
             $isConnected = $this->session->get('isConnected');
             $this->companyCode=$this->session->get('companyCode');
             $this->cif=$this->session->get('cif');
        }
    else{
        $responceContent->status="error";
        $responceContent->message=$this->t('invalid_session_please_reconnect');
    die(json_encode($responceContent));
    }
}


public function getAllCompanyUsers($rnd){
    $response = new Response();
    //request = new Request();
    $responceContent = new stdClass();
    $responceContent->status="success";
    $responceContent->message="";
    $responceContent->users = VUsers::find(    [
                            'conditions' => 'cif = ?1',
                            'bind'       => [
                                1 =>  $this->cif,
                            ],
                                'order'      => 'firstName asc'
                            ]);
    $response
        ->setJsonContent($responceContent)
        ->send();
}


}