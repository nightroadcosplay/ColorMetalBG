<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class CompanyFromSalesToPortalController extends Controller
{
use TranslatesMessages;

    public function getInfoUser($slid_user,$token){
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
            $responce->message=$this->t('3token_invalid');
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
                $responce->user =new stdClass();
                $responce->status="success";
                $responce->user->is_disabled=$user->is_disabled;
                $responce->user->track_time_token=$user->track_time_token;
        }
        else{
            $responce->status="error";
            $responce->message=$this->t('nu_exista_user_in_portal');
           die(json_encode($responce));
        }
        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function getStatusCompany($cif,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";


        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$cif)!=$token){
            $responce->status="error";
            $responce->message=$this->t('3token_invalid');
            die(json_encode($responce));
        }
          $company = CompaniesModel::findFirst(
                                    [
                                    'conditions' => 'cif = ?1',
                                    'bind'       => [
                                                    1 =>  $cif
                                                    ]
                                    ]
                );
        if($company){
            //daca ajunge pana aici, inseamna ca a trecut de toate validarile
            $responce->status="success";
            $responce->companyStatus=$company->portal_status;
        }
        else{
            $responce->status="error";
            $responce->message=$this->t('nu_exista_compania_in_portal');
            die(json_encode($responce));
        }
        $response
            ->setJsonContent($responce)
            ->send();
    }

     public function createCompanyPortal($cif,$token){
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
        if(md5($this->passTokenApi.$cif)!=$token){
            $responce->status="error";
            $responce->message=$this->t('33token_invalid');
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
        if($company){
            $company->portal_status = 'a';
            if($company->save() === false) {
                $responce->status="error";
                $responce->message=$this->t('error_la_salvare_companie_in_portal');
                $messages = $newCompany->getMessages();
                foreach ($messages as $message) {$responce->message.=$message;}
            } else {
                $responce->status="success";
                $responce->message=$this->t('compania_a_fost_activata_in_portal');
            }
            die(json_encode($responce));
        } else {
            $newCompany= new CompanyModel();
            $newCompany->cif = $postData->cif;
            $newCompany->denumire = $postData->denumire;
            $newCompany->last_name = $postData->last_name;
            $newCompany->first_name = $postData->first_name;
            $newCompany->pf_pj = $postData->pf_pj;
            $newCompany->phone = $postData->phone;
            $newCompany->email = $postData->email;
            $newCompany->rg_jfc = $postData->rg_jfc;
            $newCompany->rg_nr = $postData->rg_nr;
            $newCompany->rg_an = $postData->rg_an;
            $newCompany->status = $postData->status;
            $newCompany->site_url = $postData->site_url;
            $newCompany->este_client = $postData->este_client;
            $newCompany->id_country = $postData->id_country;
            $newCompany->sales_team = $postData->sales_team;
            $newCompany->navisionid = $postData->navisionid;
            $newCompany->navid_as_contact = $postData->navid_as_contact;
            $newCompany->blocking_type = $postData->blocking_type;
            $newCompany->request_for_client = $postData->request_for_client;
            $newCompany->is_sent_mail_request_for_client = $postData->is_sent_mail_request_for_client;
            $newCompany->privilegiat = $postData->privilegiat;
            $newCompany->neinregistrat_scop_tva = $postData->neinregistrat_scop_tva;
            $newCompany->portal_status = 'a';
            if($newCompany->save()===false) {
                $responce->status="error";
                $responce->message=$this->t('error_la_salvare_companie_in_portal');
                $messages = $newCompany->getMessages();
                foreach ($messages as $message) {$responce->message.=$message;}
            } else {
                $responce->status="success";
                $responce->message=$this->t('compania_a_fost_creata_in_portal');
            }
        }   

        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function changeStatusCompanyPortal($cif,$newStatus,$token){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        if($newStatus!='true' && $newStatus!='false'){
            $responce->status="error";
            $responce->message=$this->t('status_invalid');
            die(json_encode($responce));
        }
        //verificam sa corectitudinea hashului
        if(md5($this->passTokenApi.$cif)!=$token){
            $responce->status="error";
            $responce->message=$this->t('33token_invalid');
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
        if($company){
            if($newStatus=='true'){
                $company->portal_status='a';
            }
            if($newStatus=='false'){
                $company->portal_status='i';
            }
            if($company->save()===false) {
                                        $responce->status="error";
                                        $responce->message=$this->t('error_la_salvare_companie_in_portal');
                                        $messages = $company->getMessages();
                                        foreach ($messages as $message) {$responce->message.=$message;}
                                }
                        else{
                            $responce->status="success";
                            $responce->message=$this->t('statusul_companiei_a_fost_schimbat_in_portal');
                        }
        }else{
            $responce->status="error";
            $responce->message=$this->t('compania_nu_are_cont_in_portal');
        }

        $response
            ->setJsonContent($responce)
            ->send();
    }
}
