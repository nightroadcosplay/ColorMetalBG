<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class UsersMailboxController extends Controller
{

public $message='';

public function indexAction()
    {

    }


public function insertNewMessage($cif,$reference_appid,$reference_object,$to_sales,$to_portal,$expeditor,$destinatar,$track_creation_userid,$message_title,$message_body){
    $responce = false;
    $userMailbox= new UsersMailboxModel();
    $userMailbox->cif=$cif;
    $userMailbox->appid=0;//oricum il reface in model
    $userMailbox->reference_appid=$reference_appid;
    $userMailbox->reference_object=$reference_object;
    $userMailbox->to_sales=$to_sales;
    $userMailbox->to_portal=$to_portal;
    $userMailbox->expeditor=$expeditor;
    $userMailbox->destinatar=$destinatar;
    $userMailbox->message_title=$message_title;
    $userMailbox->message_body=$message_body;
    $userMailbox->to_sales=$to_sales;
    $userMailbox->track_creation_userid=$track_creation_userid;
    if ($userMailbox->save()!==false) {
            $responce=true;
        }
    else{
            $responce=false;
            $messages = $userMailbox->getMessages();
            foreach ($messages as $message) {
                $this->message.=$message;
            }
        }
    return $responce;
    }

  public function getNewMessagesForMe(){
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->newMails=[];
    $userid=$this->session->get('userId');

    // $defaultSessionDuration = ini_get('session.cookie_lifetime');
    // $responce->message = "Default session duration: $defaultSessionDuration seconds";

    // if(!isset($userid)) {
    //     $userController = new UserController();
    //     $userController->login();
    // }
    $responce->message = $userid;
    $newMails= UsersMailboxModel::find(
                                    [   
                                      'conditions' => 'destinatar=?1 and has_been_read=?2',
                                        'bind'       => [
                                                1 => $userid,
                                                2 => 'n'
                                            ]
                                        ,'order'=>'track_creation_date desc'
                                    ]
                                );

    foreach($newMails as $mail){
      $responce->status="success";
      $mail->has_been_read='y';
      $mail->save();
                array_push($responce->newMails, [
                            "refAppid"=>$mail->reference_appid,
                            "refObject"=>$mail->reference_object,
                            "messageTitle"=>$mail->message_title,
                            "messageBody"=>$mail->message_body
                        ]);
      }
    $response
        ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
        ->setJsonContent($responce)
        ->send();
    }
}
