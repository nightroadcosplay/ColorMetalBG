<?php
use Phalcon\Mvc\Model;

class Users extends Model
{
    public static $denDepartament = '';

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('users');
    }

}

?>
