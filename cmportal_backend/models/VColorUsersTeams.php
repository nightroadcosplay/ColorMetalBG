<?php
use Phalcon\Mvc\Model;

class VColorUsersTeams extends Model
{

    public $idTeam;
    public $userid;
    public $email;
    public $firstName;
    public $lastName;
    public $phoneNr;


    public function initialize()
    {
    $this->getModelsManager()->setModelSchema($this, 'portal_color');
        $this->setSource('v_sales_teams_users');
    }

   public function columnMap()
    {
        // Keys are the real names in the table and
        // the values their names in the application
        return [
            'id_team' => 'idTeam',
            'userid' => 'userid',
            'last_name' => 'lastName',
            'first_name' => 'firstName',
            'email' => 'email',
            'telefon' => 'phoneNr'
        ];
    }

}

?>
