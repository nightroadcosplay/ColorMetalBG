<?php
use Phalcon\Mvc\Model;

class VBasketModel extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('v_basket');
    }
}

?>
