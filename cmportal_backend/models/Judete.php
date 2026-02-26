<?php
use Phalcon\Mvc\Model;

class Judete extends Model
{

    public $code;
    public $name;

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('nom_judete');
    }



   public function columnMap()
    {
        // Keys are the real names in the table and
        // the values their names in the application
        return [
            'cod_judet' => 'code',
            'den_judet' => 'name'
        ];
    }

}

?>
