<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Encryption\Security;

class AdminUsersController extends Controller
{
public function indexAction()
{

}

public function getUsers($companyAppid)
{
$response = new Response();
$contents = ['status'=>'success','message'=>'', 'users'=>[]];
if($companyAppid>0){
    $users = VUsers::find(
                            [
                                'conditions' => 'companyAppid = ?1',
                                'bind'       => [
                                                1 => $companyAppid ,
                                            ]
                                ,'order' => 'lastName'
                            ]);
}else{
    $users = VUsers::find();
}

foreach ($users as $user) {
        $userSetup=["appid"=>$user->appid
                    ,"userid"=>$user->userid
                    ,"emailAddress"=>$user->email
                    ,"firstName"=>$user->firstName
                    ,"lastName"=>$user->lastName
                    ,"phoneNr"=>$user->phoneNr
                    ,"companyCode"=>$user->companyCode
                    ,"companyName"=>$user->companyName
                    ,"isDisabled"=>$user->isDisabled];
        array_push($contents['users'], $userSetup);
     }

$response
    ->setJsonContent($contents)
    ->send();

}

public function newUser(){
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->userappid="";
    $emailAddress = $this->request->getPost('emailAddress',  ['email','lower']);
    $userid = $this->request->getPost('userid', ['striptags','lower','alphanum']);
    $firstName = $this->request->getPost('firstName', ['striptags','upper']);
    $lastName = $this->request->getPost('lastName', ['striptags','upper']);
    $phoneNr = $this->request->getPost('phoneNr', ['striptags','lower']);
    $functie = $this->request->getPost('functie', ['striptags','lower']);
    $companyCif = $this->request->getPost('companyCif', ['striptags','alphanum']);
    $companyCode = $this->request->getPost('companyCode', ['striptags','alphanum']);
    //die(var_dump($userid));
    $user = Users::findFirstByUserid($userid);
    if($user){
        $responce->status="error";
        $responce->message="UserId existent!";
        die(json_encode($responce));
    }
    $user = Users::findFirstByEmail($emailAddress);
    if($user){
        $responce->status="error";
        $responce->message="Exista un utilizator (".$user->userid.") cu acest email!";
        die(json_encode($responce));
    }

    $Company = CompaniesModel::findFirstByNavisionid($companyCode);

    if(!$Company){
        $responce->status="error";
        $responce->message="Nu ati indicat o companie valida din care face parte Utilizatorul!";
        die(json_encode($responce));
    }

    //daca a ajuns aici inseamna ca nu sunt erori
    $passwordHash = password_hash('color123metal', PASSWORD_DEFAULT);
    $user = new Users();
    $user->userid=$userid;
    $user->email=$emailAddress;
    $user->first_name=$firstName;
    $user->last_name=$lastName;
    $user->company_code=$companyCode;
    $user->parola=$passwordHash;
    $user->is_disabled='n';
    $user->phone_nr=$phoneNr;
    $user->cif=$Company->cif;
    $user->functie=$functie;
    if ($user->save() === false) {
        $responce->status="error";
        $messages = $user->getMessages();
        foreach ($messages as $message) {
            $responce->message.=$message;
        }
    } else {
        $responce->userappid=$user->appid;
        $responce->status="success";
        $responce->message="Utilizatorul a fost creat! Pentru a seta o parola accesati detaliile utilizatorului!";

        $logEvent=new LogEventsController();
        $logEvent->logEvent($user->appid,'new','users');
    }
    die(json_encode($responce));
}

public function getUserDetails($appid)
{
$responce = new stdClass();
$responce->status="init";
$responce->message="";
$responce->user=new stdClass();
$user = VUsers::findFirstByAppid($appid);
if($user){
    $responce->status="success";
    $responce->user->appid=$user->appid;
    $responce->user->userid=$user->userid;
    $responce->user->emailAddress=$user->email;
    $responce->user->firstName=$user->firstName;
    $responce->user->lastName=$user->lastName;
    $responce->user->phoneNr=$user->phoneNr;
    $responce->user->isDisabled=$user->isDisabled;
    $responce->user->companyCode=$user->companyCode;
    $responce->user->companyName=$user->companyName;
    $responce->user->hasAvatar=((!empty($user->file_extension_for_profile) && strlen($user->file_extension_for_profile)>1)?'y':'n');
    }else{
            $responce->status="error";
            $responce->message="Utilizator inexistent";
        }
die(json_encode($responce));
}

public function getImgProfileAsJpgByUserAppid($appid){
    $user = Users::findFirstByAppid($appid);
    if($user){
//        $file=$this->pathToApps.'/img_for_profiles/'.$appid.'.'.$user->file_extension_for_profile;
                $file=$this->pathToApps.'/img_for_profiles/'.$appid.'.jpg';
        if (file_exists($file)) {
        /*
          if ( ! function_exists( 'exif_imagetype' ) ) {
                function exif_imagetype ( $filename ) {
                    if ( ( list($width, $height, $type, $attr) = getimagesize( $filename ) ) !== false ) {
                        return $type;
                    }
                return false;
                }
            }
            */
            $image_mime = image_type_to_mime_type(exif_imagetype($file));
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header('Content-Description: File Transfer');
            header('Content-type: ' . $image_mime);
            header('Content-length: ' . filesize($file));
            header('Content-Disposition: attachment; filename="'.$appid.'.'.$user->file_extension_for_profile.'"');
            readfile($file);
        }
    }
    die();
}

public function resetPassword($appid){
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $security = new Security();
    //$passwordHash = password_hash(, PASSWORD_DEFAULT);
    //$passwordHash=$security->hash('color123metal');
    $passwordHash=password_hash("rasmuslerdorfcolor123metal", PASSWORD_DEFAULT);

    $user = Users::findFirstByAppid($appid);
    if($user){
        $user->parola=$passwordHash;
        if ($user->update() === false) {
            $responce->status="error";
            $messages = $user->getMessages();
            foreach ($messages as $message) {
                $responce->message.=$message;
            }
        } else {
            $responce->status="success";
            $responce->message="Parola este: <b>color123metal</b><br />Va rugam sa comunicati aceasta parola utilizatorului. In viitor, urmeaza sa fie implementat mail catre utilizator, cu link de resetare.";
        }
    }else{
        $responce->status="error";
        $responce->message="Userul nu poate fi identificat!";
    }
    die(json_encode($responce));
}
}
