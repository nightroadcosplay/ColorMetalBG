<?php
use Phalcon\Mvc\Model;

class CompaniesModel extends Model
{

    public $appid;
    public $userid;
    public $email;
    public $parola;
    public $firstName;
    public $lastName;
    public $isAdmin;
    public $isDisabled;
    public $sessionToken;
    public $companyCode;
    public $companyName;
    public $fileExtensionForProfile;
    public $cif;
    public $functie;
    public $phoneNr;
    public $idCountry;

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('companies');
    }   

}

?>
