<?php
use Phalcon\Mvc\Model;

class UserCompanies extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('users_companies');
    }


}

?>
