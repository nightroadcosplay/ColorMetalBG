<?php
use Phalcon\Mvc\Controller;
use Phalcon\Filter;
use Phalcon\Http\Response;
use Phalcon\Http\Request;
use Phalcon\Image\Factory;

class UserAdreseLivrareController extends Controller
{
public function indexAction()
    {

    }
   
public function getAdrese($rnd){
    $response = new Response();
    $request = new Request();
    $responceContent = new stdClass();
    $responceContent->status="success";
    $responceContent->message="";
    $responceContent->adrese=[];
    $cif=$this->session->get('cif');
    $adrese = AdresaLivrare::findByCif($cif);
    foreach ($adrese as $key => $adresa) {
        array_push($responceContent->adrese,[
                        "slid"=>$adresa->slid
                        ,"appid"=>$adresa->appid
                        ,"cif"=>$adresa->cif
                        ,"adresaCodJudet"=>$adresa->adresa_cod_judet
                        ,"adresaLocalitate"=>$adresa->adresa_localitate
                        ,"adresaAdresa"=>$adresa->adresa_adresa
                        ,"adresaCodPostal"=>$adresa->adresa_cod_postal
                        ,"tipAdresa"=>$adresa->tip_adresa
                        ,"codTara"=>$adresa->cod_tara
                        ,"navisionid"=>$adresa->navisionid
                        ,"denJudet"=>$adresa->den_judet
                        ,"isNewAddress"=>'0'
                    ]);
    }


    $adrese = AdresaLivrareNoi::findByCif($cif);
    foreach ($adrese as $key => $adresa) {
        array_push($responceContent->adrese,[
                        "slid"=>$adresa->slid
                        ,"appid"=>$adresa->appid
                        ,"cif"=>$adresa->cif
                        ,"adresaCodJudet"=>$adresa->adresa_cod_judet
                        ,"adresaLocalitate"=>$adresa->adresa_localitate
                        ,"adresaAdresa"=>$adresa->adresa_adresa
                        ,"adresaCodPostal"=>$adresa->adresa_cod_postal
                        ,"tipAdresa"=>$adresa->tip_adresa
                        ,"codTara"=>$adresa->cod_tara
                        ,"navisionid"=>$adresa->navisionid
                        ,"denJudet"=>$adresa->den_judet
                        ,"isNewAddress"=>'1'
                    ]);
    }

    $countAdrese= CountNewDataModel::findFirst([
        'conditions' => 'cif = ?1 and userid is null',
        'bind'       => [
                1 => $cif
            ]
    ]);
    if($countAdrese) {
        $countAdrese->adrese = 0;
        $countAdrese->update();
    }
    $response
        ->setJsonContent($responceContent)
        ->send();
}   

public function saveAdresa(){
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";  

    $codTara = $this->request->getPost('codTara', 'string');
    $adresaAdresa = $this->request->getPost('adresaAdresa', 'string');
    $adresaCodJudet = $this->request->getPost('adresaCodJudet', 'string');
    $adresaLocalitate = $this->request->getPost('adresaLocalitate', 'string');
    $cif = $this->request->getPost('cif', 'string');
    $adresaCodPostal = $this->request->getPost('adresaCodPostal', 'string');
    $userid = $this->request->getPost('userid', 'string');
    $slid = $this->request->getPost('slid', 'string');
    $den_judet = $this->request->getPost('den_judet', 'string');

    $judet = Judete::findFirstByCode($adresaCodJudet);
    $user = Users::findFirstByUserid($userid);
    if($user){ 
        if($slid == '0') {
            // $this->db->begin();
            $newSlid = $this->db->fetchOne("select nextval('portal_color.clients_address_new_slid_seq'::regclass) as slid")['slid'];
            $result = $this->db->query("insert into portal_color.clients_address_new (slid, cod_tara, adresa_adresa, adresa_localitate, track_user_last_update, den_judet, cif, adresa_cod_judet)
                values (:slid, :cod_tara, :adresa_adresa, :adresa_localitate, :track_user_last_update, :den_judet, :cif, :adresa_cod_judet)", 
                array(
                    ':slid' => $newSlid,
                    ':cod_tara' => $codTara,
                    ':adresa_adresa' => $adresaAdresa,
                    ':adresa_localitate' => $adresaLocalitate,
                    ':track_user_last_update' => $userid,
                    ':den_judet' => $den_judet,
                    ':cif' => $user->cif,
                    ':adresa_cod_judet' => $adresaCodJudet 
                ));
            $responce->status="success";
            $responce->message="Datele au fost salvate cu succes!"; 
            $logEvent=new LogEventsController();
            $logEvent->logEvent($newSlid,'new','clients_address');
        } else {
            $adresa = AdresaLivrare::findFirstBySlid($slid);
            if(!$adresa){
                $responce->status="error";
                $responce->message="Adresa nu poate fi identificata!";
            } else {
                $adresa->adresa_cod_judet = $adresaCodJudet;
                $adresa->adresa_localitate = $adresaLocalitate;
                $adresa->adresa_adresa = $adresaAdresa;
                $adresa->adresa_cod_postal = $adresaCodPostal;
                $adresa->cod_tara = $codTara;
                if($judet) {
                    $adresa->den_judet = $judet->name;
                } else {
                    $adresa->den_judet = $den_judet;
                }
                
                if ($adresa->save() === false) {
                    $responce->status="error";
                    $responce->message='';
                    $messages = $adresa->getMessages();
                    foreach ($messages as $message) {
                        $responce->message.=$message."\n";
                    }
                }else {
                    $logEvent=new LogEventsController();
                    $logEvent->logEvent($slid,'modify','clients_address');
                    $responce->status="success";
                    $responce->message="Datele au fost salvate cu succes!"; 
                }
            }
            }
    }
    else{
        $responce->status="error";
        $responce->message="Userul nu poate fi identificat!";//appid gresita            
    }
    die(json_encode($responce));
}

    public function deleteAdresa($slid){
        $responce = new stdClass();
        $responce->status="init";
        $responce->message=""; 
        $userId='';
        if ($this->session->has('userId')) {
            $userId = $this->session->get('userId');
        }
        $user = Users::findFirstByUserid($userId);
        $adresa = AdresaLivrare::findFirstBySlid($slid);
        if($user && $adresa){ 
                if ($adresa->delete() === false) {
                $responce->status="error";
                $responce->message='';
                $messages = $adresa->getMessages();
                foreach ($messages as $message) {
                    $responce->message.=$message."\n";
                    }
                } 
                else {
                    $responce->status="success";
                    $responce->message="Adresa a fost stearsa!"; 
                }
        }
        else{
            $responce->status="error";
            $responce->message="Date incorecte!";//appid gresita            
        }
        die(json_encode($responce));
    }    

    public function getAdresa($slid){
        $responce = new stdClass();
        $responce->status="init";
        $responce->message=""; 
        $responce->adresa = []; 
        $adresa = AdresaLivrare::findFirstBySlid($slid);
        if($adresa){ 
            $responce->status="success";
            array_push($responce->adresa,[
                        "slid"=>$adresa->slid
                        ,"appid"=>$adresa->appid
                        ,"cif"=>$adresa->cif
                        ,"adresaCodJudet"=>$adresa->adresa_cod_judet
                        ,"adresaLocalitate"=>$adresa->adresa_localitate
                        ,"adresaAdresa"=>$adresa->adresa_adresa
                        ,"adresaCodPostal"=>$adresa->adresa_cod_postal
                        ,"tipAdresa"=>$adresa->tip_adresa
                        ,"codTara"=>$adresa->cod_tara
                        ,"navisionid"=>$adresa->navisionid
                        ,"denJudet"=>$adresa->den_judet
                    ]);
        }
        else{
            $responce->status="error";
            $responce->message="Adresa nu este in baza de date!";//appid gresita            
        }
        die(json_encode($responce));
    }    

}