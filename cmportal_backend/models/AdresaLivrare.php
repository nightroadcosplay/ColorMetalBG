<?php
use Phalcon\Mvc\Model;

class AdresaLivrare extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('clients_address');
    }

    // public function beforeSave(){
    // 	$userId=$this->getDi()->getSession()->get('userId');
	// 	$robot = $this->getDi()->getShared('db')->fetchOne("select nextval('portal_color.clients_address_appid_seq'::regclass) as appid ");
	// 	$this->appid = 1*$robot['appid'];

    //     $robot2 = $this->getDi()->getShared('db')->fetchOne("select nextval('portal_color.clients_address_slid_seq'::regclass) as slid ");
    //     $this->slid = 1*$robot2['slid'];

    //     // die(var_dump($this->slid));
    //     // if (isset($userId)) {
    //     //     $this->track_user_last_update=$userId;
    //     // }
    //     // else{
    //     //     $message=new Message('Nu poate fi identificat utilizatorul!');
    //     //     $this->appendMessage($message);
    //     //     return false;
    //     // }
    // }


}

?>
