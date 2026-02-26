<?php
use Phalcon\Mvc\Model;

class OfferFromUserModel extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('offer_from_user');
    }

    public function beforeCreate(){
        //die(var_dump($this->getDI()->getSession()->get('userId')));
    	$userId=$this->getDI()->getSession()->get('userId');
        $cif=$this->getDI()->getSession()->get('cif');
        $robot = $this->getDi()->getShared('db')->fetchOne("select portal_color.get_next_appid() as appid ");
	      $this->appid = 1*$robot['appid'];


        if (isset($userId)) {
            $this->track_user_id=$userId;
        }
        else{
            $message=new Message('Nu poate fi identificat utilizatorul!');
            $this->appendMessage($message);
            return false;
        }

        if (isset($cif)) {
            $this->cif=$cif;
        }
        else{
            $message=new Message('Nu poate fi identificat codul fiscal al companiei!');
            $this->appendMessage($message);
            return false;
        }
    }


}

?>
