<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class AlertsController extends Controller
{
	public function indexAction()
    {

    }

    public function getMyAlerts(){
	    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	    header("Cache-Control: post-check=0, pre-check=0", false);
	    header("Pragma: no-cache");
	    $response = new Response();
	    $responce = new stdClass();
	    $responce->status="init";
	    $responce->message="";
	    $responce->alerts=[];
	    $userId = $this->session->get('userId');

	    $alerts= AlertaModel::find(
	                                    [
	                                    'conditions' => 'userid = ?1',
	                                    'bind'       => [
	                                                    1 =>  $userId
	                                                    ],
	                                    'order'=>'date desc'
	                                    ]
	                );
	    foreach($alerts as $alerta){
            array_push($responce->alerts, [
                        "id"=>$alerta->id,
                        "date"=>substr($alerta->date,0,16),
                        "description"=>$alerta->type == 'i' ? $alerta->description.$alerta->custom_id : $alerta->description,
                        "type"=>$alerta->type,
                        "custom_id"=>$alerta->custom_id
                    ]);
        }

	    $responce->status="success";
	    $response
	        ->setJsonContent($responce)
	        ->send();
	}
}

