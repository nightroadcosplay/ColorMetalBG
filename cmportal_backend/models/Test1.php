<?php
use Phalcon\Mvc\Model;

class Test1 extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('test1');
    }


}

?>
