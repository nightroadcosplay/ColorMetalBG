<?php
use Phalcon\Mvc\Model;

class AlertaModel extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('alerts');
    }
}

?>
