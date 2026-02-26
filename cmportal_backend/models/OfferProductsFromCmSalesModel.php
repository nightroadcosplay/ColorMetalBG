<?php
use Phalcon\Mvc\Model;

class OfferProductsFromCmSalesModel extends Model
{

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('offer_products_from_cmsales');
    }
}

?>
