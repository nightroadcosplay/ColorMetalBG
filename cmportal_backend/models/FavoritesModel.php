<?php
use Phalcon\Mvc\Model;

class FavoritesModel extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('favorites');
    }

    public function beforeSave(){
        //die(var_dump($this->getDI()->getSession()->get('userId')));
    	$userId=$this->getDI()->getSession()->get('userId');
        $robot = $this->getDi()->getShared('db')->fetchOne("select portal_color.get_next_appid() as appid ");
		$this->appid = 1*$robot['appid'];


        if (isset($userId)) {
            $this->userid=$userId;
        }
        else{
            $message=new Message('Nu poate fi identificat utilizatorul!');
            $this->appendMessage($message);
            return false;
        }

    }


}

?>
