<?php
use Phalcon\Mvc\Model;

class AdresaLivrareNoi extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('clients_address_new');
    }

}

?>
