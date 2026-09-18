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

// Every type's name in each language, for the frontend to label types with.
public function getTipuri($rnd)
{
    $response = new Response();
    $responceContent = new stdClass();
    $responceContent->status="success";
    $responceContent->message="";
    $responceContent->tipuri = TipuriModel::find([
        'columns' => 'pid_category, size_type_ro, size_type_en, size_type_bg',
        'order' => 'pid_category, type_id'
    ])->toArray();

    $response
        ->setJsonContent($responceContent)
        ->send();
}

}