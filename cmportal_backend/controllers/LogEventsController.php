<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class LogEventsController extends Controller
{

public $message='';

public function indexAction()
    {

    }


private function calculateApiAction($event_action,$event_table){
    $result='';
    if($event_table=='offer_from_user'){
        if($event_action=='new'){
            $result='offer/new';
        }
        if($event_action=='offer_accept'){
            $result='offer/accept';
        }
        if($event_action=='cancel'){
            $result='offer/cancel';
        }
    } else if($event_table=='clients_address'){
        if($event_action=='new'){
            $result='address/new';
        }
        if($event_action=='modify'){
            $result='address/modify';
        }
    }
    return $result;
}

public function logEvent($object_id,$event_action,$event_table){
    $responce = false;
    $logEvent= new LogEvents();
    $logEvent->object_id=$object_id;
    $logEvent->event_action=$event_action;
    $logEvent->event_table=$event_table;
    $logEvent->api_action=$this->calculateApiAction($event_action,$event_table);
    if ($logEvent->save()!==false) {
            $responce=true;
        }
    else{
            $responce=false;
            $messages = $logEvent->getMessages();
            foreach ($messages as $message) {
                $this->message.=$message;
            }
        }
    return $responce;
    }
}