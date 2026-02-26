<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;

class TestController extends Controller
{

private $companyCode;
private $cif;



public function test1(){
    $response = new Response();
    //request = new Request();
    $responceContent = new stdClass();
    $responceContent->status="success";
    $responceContent->message="";
    $responceContent->users = Test1::find(    [
                            'conditions' => 'nume like ?1',
                            'bind'       => [
                                1 =>  'F%',
                            ],
                                'order'      => 'nume asc'
                            ]);
    $response
        ->setJsonContent($responceContent)
        ->send();
}


}