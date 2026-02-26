<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class ResetPasswordFromSalesToPortalController extends Controller
{

    public function resetTokenForPassword($slid_user,$tokenId,$tokenHash){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        //verificam ca nu a mai fost folosit acest token
        $logToken = new LogTokenidFromSalesController();
        if(!$logToken->check($tokenId)){
            $responce->status="error";
            $responce->message="2Token Invalid";
           die(json_encode($responce));
        }

        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$tokenId)!=$tokenHash){
            $responce->status="error";
            $responce->message="3Token Invalid";
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
        if($user){
            //daca ajunge pana aici, inseamna ca a trecut de toate validarile
            $newHashToResetPwd=md5($slid_user.$this->passTokenApi.time());
            $user->token_reset_password = $newHashToResetPwd;
            if($user->update() === false) {
                $responce->status="error";
                $messages = $user->getMessages();
                foreach ($messages as $message) {
                    $responce->message.=$message;
                }
            }else{
                $responce->status="success";
                $responce->resetToken=$newHashToResetPwd;
            }
        }
        else{
            $responce->status="error";
            $responce->message="4User Invalid";
            die(json_encode($responce));
        }
        $response
            ->setJsonContent($responce)
            ->send();
    }
    public function checkToken($slid_user, $tokenHash) {
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $user = Users::findFirst(
                            [
                            'conditions' => 'slid = ?1',
                            'bind'       => [
                                            1 =>  $slid_user
                                            ]
                            ]
        );

        if($user) {
            if($user->token_reset_password != $tokenHash) {
                $responce->status="error";
                $responce->message="3Token Invalid";
                die(json_encode($responce));
            } else {
                $responce->status="success";
                $responce->message="Token Valid";
                $responce->user = $user;
            }
        } else {
            $responce->status="error";
            $responce->message="4User Invalid";
            die(json_encode($responce));
        }
        $response
            ->setJsonContent($responce)
            ->send();
    }
}
