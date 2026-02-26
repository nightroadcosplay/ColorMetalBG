<?php
use Phalcon\Mvc\Model;

class InvoicesModel extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('invoices');
    }

}

?>
