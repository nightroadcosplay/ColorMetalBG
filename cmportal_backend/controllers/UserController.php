<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter\FilterFactory;
use Phalcon\Encryption\Security;
class UserController extends Controller
{
    use TranslatesMessages;

    private $userid='x';
    private $cif='x';
    private $isConnected=false;
    
public function setCurrentUser()
    {
        if(isset($_SESSION["userId"]) && isset($_SESSION["isConnected"])){

         if($_SESSION["isConnected"]=='yes'){
                $this->userid=$_SESSION["userId"];
                $this->cif=$_SESSION["cif"];
                $this->isConnected=true;
             } 
            else{
                $this->isConnected=false;
            }  
        }
         else{
                $this->isConnected=false;
            } 
    }



public function getCurrentUser(){
$response = new Response();
$contents = ['status'=>'init','message'=>''];
$userId    = $this->request->getPost('userId'); 
$userToken = $this->request->getPost('userToken');
$user = VUsers::findFirst(
                                    [
                                    'conditions' => 'userid = ?1',
                                    'bind'       => [
                                                    1 =>  strtolower((string)$userId)
                                                    ]
                                    ]
                );

    if ($user && $user->isDisabled=='n' && $user->sessionToken==$userToken ) {
            //$_SESSION["isConnected"] = "yes";
            //$_SESSION["userId"] = $user->userid;
            //$_SESSION["companyCode"] = $user->companyCode;
            //$_SESSION["cif"] = $user->cif;

    $this->session->set('isConnected', 'yes');
    $this->session->set('userId', $user->userid);
    $this->session->set('companyCode', $user->companyCode);
    $this->session->set('cif', $user->cif);
    $this->session->set('userLocale', $user->lang);

//die(var_dump($this->session->get('isConnected')));
    $contents = [
                'status'=>'success',
                'message'=>$this->t('token_valid'),
                'user' => [
                    "appid"=> $user->appid,
                    "userid"=> $user->userid,
                    "phoneNr"=> $user->phoneNr,
                    "emailAddress"=> $user->email,
                    "lastName"=>  $user->lastName,
                    "firstName"=> $user->firstName,
                    "isAdmin"=> $user->isAdmin,
                    "userToken"=> $user->sessionToken,
                    "companyCode"=>$user->companyCode,
                    "companyName"=>$user->companyName,
                    "cif"=>$user->cif,
                    "lang"=>$user->lang
                ]
            ];
        }
    else{
    $contents = [
                'status'=>'error',
                'message'=>$this->t('sunteti_deconectat_de_la_aplicatie')
            ];
    }

$response
    ->setJsonContent($contents)
    ->send();
}

public function login()
{
$response = new Response();
$contents = ['status'=>'init','message'=>''];
$userId    = trim($this->request->getPost('user'));
$password = trim($this->request->getPost('password'));
$security = new Security();
$user = Users::findFirstByUserid(strtolower($userId));
$vUserCompany = VUsers::findFirstByUserid(strtolower($userId));
    if ($user && $user->is_disabled=='n' && $vUserCompany && strlen($vUserCompany->cif)>0) {
        //if ($security->checkHash($password, $user->parola)) {
        if(password_verify('rasmuslerdorf'.$password, $user->parola)){
            // The password is valid
           $csrfToken=substr(md5(time().'abc'),0,64);
           $user->session_token= $csrfToken;
           $user->track_time_token= date('Y-m-d H:i:s');
           $user->save();
            $contents = [
                'status'=>'success',
                'message'=>'',
                'user' => [
                    "appid"=> $vUserCompany->appid,
                    "userid"=> $vUserCompany->userid,
                    "phoneNr"=> $vUserCompany->phoneNr,
                    "emailAddress"=> $vUserCompany->email,
                    "lastName"=>  $vUserCompany->lastName,
                    "firstName"=> $vUserCompany->firstName,
                    "isAdmin"=> $vUserCompany->isAdmin,
                    "userToken"=> $csrfToken,
                    "companyCode"=>$vUserCompany->companyCode,
                    "companyName"=>$vUserCompany->companyName,
                    "lang"=>$user->lang
                ]
            ];
            //$_SESSION["isConnected"] = "yes";
            //$_SESSION["userId"] = $user->userid;
            //$_SESSION["companyCode"] = $user->company_code;
            //$_SESSION["cif"] = $user->cif;
            $this->session->set('isConnected', 'yes');
            $this->session->set('userId', $user->userid);
            $this->session->set('companyCode', $user->company_code);
            $this->session->set('cif', $user->cif);
            $this->session->set('userLocale', $user->lang);
        }
        else{
             $contents = [
                'status'=>'error',
                'message'=>$this->t('parola_incorecta')
            ];
        }
    } else {
        // To protect against timing attacks. Regardless of whether a user
        // exists or not, the script will take roughly the same amount as
        // it will always be computing a hash.
        $this->security->hash(rand());
        $contents = [
                'status'=>'error',
                'message'=>$this->t('date_de_logare_incorecte')
            ];
    }



    $response
        ->setJsonContent($contents)
        ->send();

    }

    public function changePassword(){
        $response = new Response();
        $contents = ['status'=>'init','message'=>''];
        $userId    = trim($this->request->getPost('user'));
        $password = trim($this->request->getPost('password'));
        $user = Users::findFirstByUserid(strtolower($userId));
        if($user) {
            $user->parola = password_hash('rasmuslerdorf'.$password, PASSWORD_DEFAULT);
            $user->save();
            $contents = [
                'status'=>'success',
                'message'=>$this->t('parola_setata_cu_succes')
            ];
        } else {
             $contents = [
                'status'=>'error',
                'message'=>$this->t('userul_nu_este_in_portal')
            ];
        }
        $response
        ->setJsonContent($contents)
        ->send();
    }

    public function uploadImageMyProfile($appid){
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $responce->email="";
        ini_set('memory_limit','256M');
        $user = Users::findFirstByAppid($appid);
        if($user){
            $responce->status="success";

            if ($this->request->hasFiles() == true) {
                // Print the real file names and sizes
                foreach ($this->request->getUploadedFiles() as $file) {
                    //Print file details
                    //echo $file->getName(), " ", $file->getSize(), "\n";
                    //die($file->getExtension());

                    //Move the file into the application
                    $user->file_extension_for_profile='jpg';//strtolower($file->getExtension());//oricum il fac jpg
                    $user->update();
                    $filePathAndName=$this->pathToApps.'/img_for_profiles/tmp'.$appid.strtolower($file->getExtension());
                    $filePathAndNameAsJpg=$this->pathToApps.'/img_for_profiles/'.$appid.'.jpg';
                    $file->moveTo($filePathAndName);
                    require $this->pathToApps.'/controllers/SimpleImage.php';
                    $image = new \claviska\SimpleImage();
                    $image->fromFile($filePathAndName)                     // load image.jpg
                    ->autoOrient()                              // adjust orientation based on exif data
                    ->fitToWidth(300)                          // resize to 320x200 pixels
                    ->toFile($filePathAndNameAsJpg, 'image/jpeg');      // convert to PNG and save a copy to new-image.png
                }
            }
            else{
                die('there is not any file');
            }

        }else{
            $responce->status="error";
            $responce->message=$this->t('utilizator_inexistent');
        }
        die(json_encode($responce));
    }


public function getMyImageProfile($appid){
    $user = Users::findFirstByAppid($appid);
    if($user){
        $file=$this->pathToApps.'/img_for_profiles/'.$appid.'.'.$user->file_extension_for_profile;
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

public function getMyColorContacts(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->colorContacts=[];    
    $this->setCurrentUser();
    if($this->isConnected){
        
        $company= CompaniesModel::findFirst(
                                            [
                                            'conditions' => 'cif = ?1',
                                            'bind'       => [
                                                    1 => $this->cif
                                                ]
                                            ]
                                        );    
        
        $responce->colorContacts= VColorUsersTeams::find(
                                            [
                                            'conditions' => 'idTeam = ?1',
                                            'bind'       => [
                                                    1 => $company->sales_team
                                                ],
                                            'order' => 'lastName,firstName'
                                            ]
                                        );
        
        $responce->status="success";
    }
    $response
        ->setJsonContent($responce)
        ->send();
}

public function getMyImageProfileAsString($appid){
    $user = Users::findFirstByAppid($appid);
    if($user){
        $file=$this->pathToApps.'/img_for_profiles/'.$appid.'.'.$user->file_extension_for_profile;
        if (file_exists($file)) {
            $resource_avatar=imagecreatefromjpeg($file) ;
            ob_start();
            imagejpeg($resource_avatar);
            $image_data=ob_get_contents();
            ob_end_clean();
            die('data:image/jpeg;base64,'.base64_encode($image_data));
        }
    }
    die('');
}

public function test(){
    die('deci?!');
}

public function saveMyProfile($appid){
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $user = Users::findFirstByAppid($appid);
        if($user){
            $filterFactory = new FilterFactory();
            $filter = $filterFactory->newInstance();
            $request_body = file_get_contents('php://input');
            $data = json_decode($request_body);
            $user->last_name=$filter->sanitize($data->lastName, 'string');
            $user->first_name=$filter->sanitize($data->firstName, 'string');

            //firstly, check if the user change also the password
            if(strlen(trim($data->newPassword))>0 && strlen(trim($data->newPasswordRetyped))>0 && trim($data->newPassword)==trim($data->newPasswordRetyped)){
                    //$security = new Security();
                    //$passwordHash=$security->hash(trim($data->newPassword));
                    $passwordHash=password_hash("rasmuslerdorf".trim($data->newPassword), PASSWORD_DEFAULT);
                    $user->parola = $passwordHash;
            }

            if(strtolower($user->email)!=strtolower($filter->sanitize($data->email, 'string'))){
                $user->email=$filter->sanitize($data->email, ['trim','string','email','lower']);
            }

            if(strtolower($user->phone_nr)!=strtolower($filter->sanitize($data->phoneNr, 'string'))){
                $user->phone_nr=$filter->sanitize($data->phoneNr, ['trim','string','email','lower']);
            }

            $user->update();

            if ($user->update() === false) {
                $responce->status="error";
                $responce->message='';
                $messages = $user->getMessages();
                foreach ($messages as $message) {
                    $responce->message.=$message."\n";
                }
                }
                else {
             
                    $logEvent=new LogEventsController();
                    $logEvent->logEvent($user->appid,'edit','users');             
                
                    $responce->status="success";
                    $responce->message=$this->t('datele_au_fost_salvate_cu_succes');
                }
        }
        else{
            $responce->status="error";
            $responce->message=$this->t('userul_nu_poate_fi_identificat');//appid gresita
        }
        die(json_encode($responce));
    }

    public function checkSessionStatus() {

        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $userid=$this->session->get('userId');
        $isConnected=$this->session->get('isConnected');
        if(isset($userid) && isset($isConnected)) {
            $responce->status="success";
            $responce->message=$this->t('session_is_active');
        } else {
            $responce->status="error";
            $responce->message=$this->t('sesiunea_a_expirat');
        }

        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function changeLang($lang) {
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $userid=$this->session->get('userId');
        $user = Users::findFirst(
                    [
                    'conditions' => 'userid = ?1',
                    'bind'       => [
                                    1 =>  strtolower($userid)
                                    ]
                    ]
        );
        if($user){
            $user->lang = $lang;
            $user->update();
            $this->session->set('userLocale', $lang);
            $responce->status="success";
            $responce->message=$this->t('datele_au_fost_salvate_cu_succes');
        } else {
            $responce->status="error";
            $responce->message=$this->t('userul_nu_poate_fi_identificat');//appid gresita
        }
        die(json_encode($responce));
    }

}
