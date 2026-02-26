<?php
use Phalcon\Mvc\Model;

class CountNewDataModel extends Model
{
    public static $denDepartament = '';

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('counter_new_data');
    }

}

?>
