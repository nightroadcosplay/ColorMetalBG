<?php
use Phalcon\Mvc\Model;

class NomProduct extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('nom_products');
    }

    public function beforeSave(){
    	$userId=$this->getDI()->getSession()->get('userId');
		$robot = $this->getDI()->getShared('db')->fetchOne("select portal_color.get_next_appid() as appid ");
		$this->appid = 1*$robot['appid'];

/*
        if (isset($userId)) {
            $this->track_user_last_update=$userId;
        }
        else{
            $message=new Message('Nu poate fi identificat utilizatorul!');
            $this->appendMessage($message);
            return false;
        }
        */
    }


}

?>
