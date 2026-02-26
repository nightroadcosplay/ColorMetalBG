<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class AddressController extends Controller
{
	public function indexAction()
    {

    }

    public function addNewAddress($token) {
	 	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	    header("Cache-Control: post-check=0, pre-check=0", false);
	    header("Pragma: no-cache");
	    $rawdata = file_get_contents("php://input");
	    $postData= json_decode($rawdata);
	    // die(var_dump($postData));
	    $response = new Response();
	    $responce = new stdClass();
	    $responce->status="init";
	    $responce->message="";
	    // Start a transaction
	    $this->db->begin();
	    $address = AdresaLivrare::findFirstBySlid($postData->slid);
	    if(!$address) {
	    	$address = new AdresaLivrare();
	    	// $address->reset();
	    	$address->slid = $postData->slid;
		}
		$address->cif = $postData->cif;
		$address->adresa_cod_judet = $postData->adresa_cod_judet;
		$address->adresa_localitate = $postData->adresa_localitate;
		$address->adresa_adresa = $postData->adresa_adresa;
		$address->adresa_cod_postal = $postData->adresa_cod_postal;
		$address->tip_adresa = $postData->tip_adresa;
		$address->cod_tara = $postData->cod_tara;
		$address->navisionid = $postData->navisionid;
		$address->navid_as_contact = $postData->navid_as_contact;
		$address->den_judet = $postData->den_judet;

		if($address->save()===false) {
            $responce->status="error";
            $responce->message='Error on save adrress code='.$postData->slid;
            $messages = $address->getMessages();
            if($messages) {
                foreach ($messages as $message) {$responce->message.=$message;}
            }
        } else {

			$count = CountNewDataModel::findFirst([
		        'conditions' => 'cif = ?1 and userid is null',
		        'bind'       => [
		                1 => $address->cif
		            ]
		    ]);
			if($count){
				$count->adrese = $count->adrese + 1;
				$count->update();
			} else {
				$count = new CountNewDataModel();
				$count->adrese = 1;
				$count->cif = $address->cif;
				$count->save();
			}

        	$this->db->commit();
        	$responce->status="success";
        }

        $response
        ->setJsonContent($responce)
        ->send();
    }

    public function deleteAddress($token) {
    	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	    header("Cache-Control: post-check=0, pre-check=0", false);
	    header("Pragma: no-cache");
	    $rawdata = file_get_contents("php://input");
	    $postData= json_decode($rawdata);
	    // die(var_dump($postData));
	    $response = new Response();
	    $responce = new stdClass();
	    $responce->status="init";
	    $responce->message="";
	    // Start a transaction
	    $this->db->begin();
     	$address = AdresaLivrare::findFirstBySlid($postData->slid);
	    if($address) {
	    	if($address->delete() === false) {
	    		$responce->status="error";
           	 	$responce->message='Error on delete adrress code='.$postData->slid;
	    	} else {
	        	$this->db->commit();
	        	$responce->status="success";
	        	$responce->message='Delete successfully!';
	    	}
	    } else {
    		$responce->status="error";
       	 	$responce->message='Adresa nu este in Portal!';
	    }
	    $response
        ->setJsonContent($responce)
        ->send();
    }

	public function deleteNewAddress($token) {
    	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	    header("Cache-Control: post-check=0, pre-check=0", false);
	    header("Pragma: no-cache");
	    $rawdata = file_get_contents("php://input");
	    $postData= json_decode($rawdata);
	    // die(var_dump($postData));
	    $response = new Response();
	    $responce = new stdClass();
	    $responce->status="init";
	    $responce->message="";
	    // Start a transaction
	    $this->db->begin();
     	$address = AdresaLivrareNoi::findFirstBySlid($postData->slid);
	    if($address) {
	    	if($address->delete() === false) {
	    		$responce->status="error";
           	 	$responce->message='Error on delete adrress code='.$postData->slid;
	    	} else {
	        	$this->db->commit();
	        	$responce->status="success";
	        	$responce->message='Delete successfully!';
	    	}
	    } else {
    		$responce->status="error";
       	 	$responce->message='Adresa nu este in Portal!';
	    }
	    $response
        ->setJsonContent($responce)
        ->send();
    }

    public function getAddressEvents($lastSynchedAppid,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $responce->adrese=[];

        $events= LogEvents::find(
                                    [
                                        'conditions' => 'appid >?1 and event_table=?2',
                                            'bind'       => [
                                                            1 => $lastSynchedAppid,
                                                            2 => 'clients_address'
                                                    ]
                                            ,'order'=>'appid'
                                    ]
                            );

        foreach($events as $event){
            $address= AdresaLivrareNoi::findFirstBySlid($event->object_id);
            $company = CompaniesModel::findFirst(
                                    [
                                    'conditions' => 'cif = ?1',
                                    'bind'       => [
                                                    1 =>  $address->cif
                                                    ]
                                    ]
                );
            if($address && $company){
                array_push($responce->adrese, [
    						'slid' => $address->slid,
                            'cif' => $address->cif,
							'adresa_cod_judet' => $address->adresa_cod_judet,
							'adresa_localitate' => $address->adresa_localitate,
							'adresa_adresa' => $address->adresa_adresa,
							'adresa_cod_postal' => $address->adresa_cod_postal,
							'tip_adresa' => $address->tip_adresa,
							'cod_tara' => $address->cod_tara,
							'navisionid' => $address->navisionid,
							'navid_as_contact' => $address->navid_as_contact,
							'den_judet' => $address->den_judet,
							'id_team' => $company->sales_team,
                			'client_name' => $company->denumire,
                            'event_action'=>$event->event_action,
                            'event_appid'=>$event->appid
                    ]);
            }
        }


        $responce->status="success";
        $response
                ->setJsonContent($responce)
                ->send();
    }
}

