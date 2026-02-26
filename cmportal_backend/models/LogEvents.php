<?php
use Phalcon\Mvc\Model;

class LogEvents extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('log_events');
    }
}

?>
