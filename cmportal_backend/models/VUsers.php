<?php
use Phalcon\Mvc\Model;

class VUsers extends Model
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
    public $companyAppid;

    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('v_users');
    }

   public function columnMap()
    {
        // Keys are the real names in the table and
        // the values their names in the application
        return [
            'appid' => 'appid',
            'userid' => 'userid',
            'email' => 'email',
            'parola' => 'parola',
            'first_name' => 'firstName',
            'last_name' => 'lastName',
            'is_admin' => 'isAdmin',
            'session_token' => 'sessionToken',
            'company_code' => 'companyCode',
            'company_name' => 'companyName',
            'file_extension_for_profile' => 'fileExtensionForProfile',
            'cif' => 'cif',
            'functie' => 'functie',
            'phone_nr' => 'phoneNr',
            'is_disabled' => 'isDisabled',
            'id_country' => 'idCountry',
            'company_appid'=>'companyAppid',
            'lang'=>'lang'
        ];
    }

}

?>
