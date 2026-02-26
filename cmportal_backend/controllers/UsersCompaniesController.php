<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class UsersCompaniesController extends Controller
{

	public function indexAction()
    {

    }

    public function getUserCompanies($userid){
    	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $responce->companies=[];

        $user = Users::findFirstByUserid($userid);
        if($user) {
            if(strpos($user->email, '@color-metal.ro') !== false) {
                if($user->id_team == 0) {
                    $company = CompanyModel::findFirstByCif($user->cif);
                    if($company) {
                        $user->id_team = $company->sales_team;
                        $user->save();
                    }
                }
                $companies = CompanyModel::find([
                    'conditions' => 'sales_team = ?1 and portal_status = ?2',
                    'bind'       => [
                                    1 => $user->id_team,
                                    2 => 'a'
                                    ]
                ]);
                if($companies) {
                    foreach($companies as $company) {
                        array_push($responce->companies, [
                            'userid' => $user->userid,
                            'company_code' => $company->navisionid,
                            'cif' => $company->cif,
                            'denumire' => $company->denumire
                        ]);
                    }
                    $responce->status = 'success';
                } else {
                    $responce->status = 'error';
                    $responce->message = 'No companies for this user';
                }
            } else {
                $companies = VUsersCompanies::find([
                    'conditions' => 'userid = ?1',
                    'bind'       => [
                                    1 =>  $userid
                                    ]
                ]);
                if($companies) {
                    foreach($companies as $company) {
                        array_push($responce->companies, [
                            'userid' => $company->userid,
                            'company_code' => $company->company_code,
                            'cif' => $company->cif,
                            'denumire' => $company->company_name
                        ]);
                    }
                    $responce->status = 'success';
                } else {
                    $responce->status = 'error';
                    $responce->message = 'No companies for this user';
                }
            }
        } else {
            $responce->status = 'error';
            $responce->message = 'Nu poate fi identificat userul in baza de date';
        }
        

        $response
        ->setJsonContent($responce)
        ->send();
    }

    public function changeUserCompany($userid, $cif) {
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $responce->companies=[];

        $company = VUsersCompanies::findFirst([
            'conditions' => 'userid = ?1 and cif = ?2',
            'bind'       => [
                            1 => $userid,
                            2 => $cif
                            ]
        ]);

        $user = Users::findFirstByUserid(strtolower($userid));

        if($user) {
            if($company) {
                $user->cif = $company->cif;
                $user->company_code = $company->company_code;
                $user->save();

                $this->session->set('companyCode', $user->company_code);
                $this->session->set('cif', $user->cif);

                $responce->status = 'success';
                $responce->message = 'Date companie schimbate cu success';
                array_push($responce->companies, [
                    'userid' => $company->userid,
                    'company_code' => $company->company_code,
                    'cif' => $company->cif,
                    'denumire' => $company->company_name
                ]);
            } else {
                $userCompany = CompanyModel::findFirstByCif($cif);
                if($userCompany) {
                    $company = new UserCompanies();
                    $company->userid = $userid;
                    $company->company_code = $userCompany->navisionid;
                    $company->cif = $cif;

                    if($company->save()===false) {
                        $responce->status="error";
                        $responce->message='Error la adaugare utilizator la o noua companie in Portal!';
                        $messages = $company->getMessages();
                        if($messages) {
                            foreach ($messages as $message) {$responce->message.=$message;}
                        }
                    } else {
                        $user->cif = $company->cif;
                        $user->company_code = $company->company_code;
                        $user->save();

                        $this->session->set('companyCode', $user->company_code);
                        $this->session->set('cif', $user->cif);

                        $responce->status = 'success';
                        $responce->message = 'Date companie schimbate cu success';
                        array_push($responce->companies, [
                            'userid' => $company->userid,
                            'company_code' => $company->company_code,
                            'cif' => $company->cif,
                            'denumire' => $userCompany->denumire
                        ]);
                    }
                } else {
                    $responce->status = 'error';
                    $responce->message = 'Nu poate fi identificata compania in baza de date';
                }
            }
        } else {
            $responce->status = 'error';
            $responce->message = 'Nu poate fi identificat userul in baza de date';
        }

        $response
        ->setJsonContent($responce)
        ->send();
    }
}