<?php
use Phalcon\Mvc\Model;

class UsersMailboxModel extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('users_mailbox');
    }

    public function beforeSave(){
        //die(var_dump($this->getDI()->getSession()->get('userId')));
  	    $userId=$this->getDI()->getSession()->get('userId');
        $robot = $this->getDi()->getShared('db')->fetchOne("select portal_color.get_next_appid() as appid ");
	      $this->appid = 1*$robot['appid'];
        if (isset($userId)) {
            $this->track_creation_userid=$userId;
        }
    }


}

?>
