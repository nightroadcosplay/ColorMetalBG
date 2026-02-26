<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;

class NomenclatoareController extends Controller
{
public function indexAction()
{

}


public function getCountries($rnd)
{
    $response = new Response();
    $responceContent = new stdClass();
    $responceContent->status="init";
    $responceContent->message=""; 
    $responceContent->countries = Countries::find( [        'order' => 'name' ]);

    $response
        ->setJsonContent($responceContent)
        ->send();
}


public function getJudete($rnd)
{
    $response = new Response();
    $responceContent = new stdClass();
    $responceContent->status="init";
    $responceContent->message=""; 
    $responceContent->judete = Judete::find( [        'order' => 'name' ]);

    $response
        ->setJsonContent($responceContent)
        ->send();
}

}