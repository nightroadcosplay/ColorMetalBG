<?php
use Phalcon\Mvc\Model;

class Countries extends Model
{

    public $code;
    public $name;

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('nom_country');
    }



   public function columnMap()
    {
        // Keys are the real names in the table and
        // the values their names in the application
        return [
            'code_country' => 'code',
            'name_country' => 'name'
        ];
    }

}

?>
