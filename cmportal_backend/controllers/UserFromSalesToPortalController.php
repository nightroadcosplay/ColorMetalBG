<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class UserFromSalesToPortalController extends Controller
{

    public function getInfoUser($cif,$slid_user,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";


        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$slid_user)!=$token){
            $responce->status="error";
            $responce->message="3Token Invalid";
            die(json_encode($responce));
        }
        //daca ajunge pana aici, inseamna ca a trecut de toate validarile
        $company = CompaniesModel::findFirst(
                                    [
                                    'conditions' => 'cif = ?1',
                                    'bind'       => [
                                                    1 =>  $cif
                                                    ]
                                    ]
                );
        $user = Users::findFirst(
                                    [
                                    'conditions' => 'slid = ?1',
                                    'bind'       => [
                                                    1 =>  $slid_user
                                                    ]
                                    ]
                );
        if($company && $company->status=='client' && $company->portal_status == 'a'){
           $responce->companyStatus='clientDefinitInPortal';
        }else{
            $responce->companyStatus='NeDefinitInPortal';
        }

        if($user && $user->cif==$cif){
                $responce->user =new stdClass();
                $responce->status="success";
                $responce->user->is_disabled=$user->is_disabled;
                $responce->user->track_time_token=$user->track_time_token;
        }
        else{
            $responce->status="error";
            $responce->message="Nu exista user in Portal!";
           die(json_encode($responce));
        }
        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function getInfoUserById($cif,$userid,$slid_user,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";


        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$slid_user)!=$token){
            $responce->status="error";
            $responce->message="3Token Invalid";
            die(json_encode($responce));
        }
        //daca ajunge pana aici, inseamna ca a trecut de toate validarile
        $company = CompaniesModel::findFirst(
                                    [
                                    'conditions' => 'cif = ?1',
                                    'bind'       => [
                                                    1 =>  $cif
                                                    ]
                                    ]
                );
        $user = Users::findFirst(
                                    [
                                    'conditions' => 'userid = ?1',
                                    'bind'       => [
                                                    1 =>  $userid
                                                    ]
                                    ]
                );
        if($company && $company->status=='client' && $company->portal_status == 'a'){
           $responce->companyStatus='clientDefinitInPortal';
        }else{
           $responce->companyStatus='NeDefinitInPortal';
        }

        if($user){
                $responce->user =new stdClass();
                $responce->status="success";
                $responce->user->is_disabled=$user->is_disabled;
                $responce->user->track_time_token=$user->track_time_token;
                if($user->cif == $cif) {
                    $responce->user->same_company = 'true';
                } else {
                    $company = UserCompanies::findFirst([
                            'conditions' => 'userid = ?1 and cif = ?2',
                            'bind'       => [
                                    1 => $userid,
                                    2 => $cif
                                    ]
                        ]);
                    if($company) {
                        $responce->user->same_company = 'true';
                    } else {
                        $responce->user->same_company = 'false';
                    }
                }
        }
        else{
            $responce->status="error";
            $responce->message="Nu exista user in Portal!";
            die(json_encode($responce));
        }
        $response
            ->setJsonContent($responce)
            ->send();
    }


    public function createUserPortal($cif,$slid_user,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $rawdata = file_get_contents("php://input");
        $postData= json_decode($rawdata);
        //die(var_dump($postData->firstName));
        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$cif.$slid_user)!=$token){
            $responce->status="error";
            $responce->message="33Token Invalid";
            die(json_encode($responce));
        }
        //daca ajunge pana aici, inseamna ca a trecut de toate validarile
        $company = CompaniesModel::findFirst(
                                    [
                                    'conditions' => 'cif = ?1',
                                    'bind'       => [
                                                    1 =>  $cif
                                                    ]
                                    ]
                );
        $user = Users::findFirst(
                                    [
                                    'conditions' => 'slid = ?1',
                                    'bind'       => [
                                                    1 =>  $slid_user
                                                    ]
                                    ]
                );
        if($company && $company->status=='client'){
                if($user && $user->cif==$cif) {
                    $responce->status="error";
                    $responce->message="Utilizatorul exista deja in Portal!";
                }
                else{
                    $newUser= new Users();
                    $newUser->userid=$postData->email;
                    $newUser->email=$postData->email;
                    $newUser->first_name=$postData->firstName;
                    $newUser->last_name=$postData->lastName;
                    $newUser->company_code=$postData->companyCode;
                    $newUser->is_disabled='n';
                    $newUser->phone_nr=$postData->phoneNr;
                    $newUser->cif=$postData->cif;
                    $newUser->functie=$postData->functie;
                    $newUser->slid=$postData->slid;
                    $newUser->navisionid = $postData->navisionid;
                    if($newUser->save()===false) {
                                                $responce->status="error";
                                                $responce->message='Error la salvare utilizator in Portal!';
                                                $messages = $newUser->getMessages();
                                                foreach ($messages as $message) {$responce->message.=$message;}
                                        }
                                else{
                                    $responce->status="success";
                                    $responce->message="Utilizatorul a fost creat in Portal! Daca doriti sa-i trimiteti link cu parola, folositi butonul 'Resetare parola Portal'";
                                }
                }
        }else{
            $responce->status="error";
            $responce->message="Compania nu are cont in Portal!";
            die(json_encode($responce));
        }

        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function changeStatusUserPortal($cif,$slid_user,$newStatus,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        if($newStatus!='true' && $newStatus!='false'){
            $responce->status="error";
            $responce->message="Status invalid!";
            die(json_encode($responce));
        }
        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$cif.$slid_user)!=$token){
            $responce->status="error";
            $responce->message="33Token Invalid";
            die(json_encode($responce));
        }
        //daca ajunge pana aici, inseamna ca a trecut de toate validarile
        $company = CompaniesModel::findFirst(
                                    [
                                    'conditions' => 'cif = ?1',
                                    'bind'       => [
                                                    1 =>  $cif
                                                    ]
                                    ]
                );
        $user = Users::findFirst(
                                    [
                                    'conditions' => 'slid = ?1',
                                    'bind'       => [
                                                    1 =>  $slid_user
                                                    ]
                                    ]
                );
        if($company && $company->status=='client'){
                if($user && $user->cif==$cif){
                    if($newStatus=='true'){
                        $user->is_disabled='n';
                    }
                    if($newStatus=='false'){
                        $user->is_disabled='y';
                    }
                    if($user->save()===false) {
                                                $responce->status="error";
                                                $responce->message='Error la salvare utilizator in Portal!';
                                                $messages = $user->getMessages();
                                                foreach ($messages as $message) {$responce->message.=$message;}
                                        }
                                else{
                                    $responce->status="success";
                                    $responce->message="Statusul utilizatorului a fost schimbat in Portal!";
                                }
                }
                else{
                       $responce->status="error";
                       $responce->message="Cod fiscal eronat!";
                }
        }else{
            $responce->status="error";
            $responce->message="Compania nu are cont in Portal!";
        }

        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function updateUserPortal($cif,$slid_user,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $rawdata = file_get_contents("php://input");
        $postData= json_decode($rawdata);
        //die(var_dump($postData->firstName));
        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$cif.$slid_user)!=$token){
            $responce->status="error";
            $responce->message="33Token Invalid";
            die(json_encode($responce));
        }
        //daca ajunge pana aici, inseamna ca a trecut de toate validarile
        $company = CompaniesModel::findFirst(
                                    [
                                    'conditions' => 'cif = ?1',
                                    'bind'       => [
                                                    1 =>  $cif
                                                    ]
                                    ]
                );
        $user = Users::findFirst(
                                    [
                                    'conditions' => 'slid = ?1',
                                    'bind'       => [
                                                    1 =>  $slid_user
                                                    ]
                                    ]
                );
        if($company && $company->status=='client'){
                if($user){
                    $user->email=$postData->email;
                    $user->first_name=$postData->firstName;
                    $user->last_name=$postData->lastName;
                    $user->company_code=$postData->companyCode;
                    $user->phone_nr=$postData->phoneNr;
                    $user->cif=$postData->cif;
                    $user->functie=$postData->functie;
                    $user->slid=$postData->slid;
                    $user->navisionid = $postData->navisionid;
                    if($user->save()===false) {
                        $responce->status="error";
                        $responce->message='Error la updateUserPortal utilizator in Portal!';
                        $messages = $user->getMessages();
                        foreach ($messages as $message) {$responce->message.=$message;}
                    } else {
                        $responce->status="success";
                        $responce->message="Update date utilizator cu success";
                    }
                } else {
                    $responce->status="error";
                    $responce->message="Utilizatorul nu are cont de portal";
                }
        }else{
            $responce->status="error";
            $responce->message="Compania nu are cont in Portal!";
            die(json_encode($responce));
        }

        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function setUserToMultipleCompanies($cif,$slid_user,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $rawdata = file_get_contents("php://input");
        $postData= json_decode($rawdata);
        //die(var_dump($postData->firstName));
        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$cif.$slid_user)!=$token){
            $responce->status="error";
            $responce->message="33Token Invalid";
            die(json_encode($responce));
        }

        $user = Users::findFirst(
                            [
                            'conditions' => 'slid = ?1',
                            'bind'       => [
                                            1 =>  $slid_user
                                            ]
                            ]
        );
        if($user) {
            $company = UsersCompanies::findFirst([
                    'conditions' => 'userid = ?1 and cif = ?2',
                    'bind'       => [
                                    1 => $userid,
                                    2 => $cif
                                    ]
                ]);
            $type = $postData->type;
            if($company && $type == 'delete') {
                $company->delete();
                $responce->status="success";
                $responce->message="Utilozatorul a fost sters de la companie";
            } else {
                $company = new UserCompanies();
                $company->userid = $slid_user;
                $company->company_code = $postData->company_code;
                $company->cif = $cif;

                if($company->save()===false) {
                    $responce->status="error";
                    $responce->message='Error la adaugare utilizator la o noua companie in Portal!';
                    $messages = $company->getMessages();
                    if($messages) {
                        foreach ($messages as $message) {$responce->message.=$message;}
                    }
                } else {
                    $responce->status="success";
                    $responce->message="Utilizatorul a fost adaugat cu succes la companie!";
                }
            }

        } else {
            $responce->status="error";
            $responce->message="Utilizatorul nu are cont de portal!";
        }

        $response
            ->setJsonContent($responce)
            ->send();
    }

}
