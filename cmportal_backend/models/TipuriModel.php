<?php
use Phalcon\Mvc\Model;

class TipuriModel extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('tipuri_mapare');
    }

}

?>
