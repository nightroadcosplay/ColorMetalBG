<?php
use Phalcon\Mvc\Model;

class VCerereProducts extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('v_cerere_products');
    }

}

?>
