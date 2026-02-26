<?php
use Phalcon\Mvc\Controller;
use Phalcon\Filter;
use Phalcon\Http\Response;
use Phalcon\Http\Request;
use Phalcon\Image\Factory;

class CounterNewDataController extends Controller
{
    public function indexAction()
        {

        }
   
    public function getCounters() {
        $response = new Response();
        $request = new Request();
        $responceContent = new stdClass();
        $responceContent->status="success";
        $responceContent->message="";
        $responceContent->countAdrese=0;
        $responceContent->countOferte=0;
        $cif=$this->session->get('cif');
        $userId = $this->session->get('userId');

        $countOferte = CountNewDataModel::findFirst([
            'conditions' => 'cif = ?1 and userid = ?2',
            'bind'       => [
                    1 => $cif,
                    2 => $userId
                ]
        ]);
        if($countOferte) {
            $responceContent->countOferte = $countOferte->oferte;
        } else {
            $count = new CountNewDataModel();
            $count->cif = $cif;
            $count->userid = $userId;
            $count->save();
        }

        $countAdrese= CountNewDataModel::findFirst([
            'conditions' => 'cif = ?1 and userid is null',
            'bind'       => [
                    1 => $cif
                ]
        ]);
        if($countAdrese) {
            $responceContent->countAdrese = $countAdrese->adrese;
        } else {
            $count = new CountNewDataModel();
            $count->cif = $cif;
            $count->save();
        }

        $response
        ->setJsonContent($responceContent)
        ->send();
    }
}