<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;
use Phalcon\Mvc\View;
use Dompdf\Dompdf;
class AccountingBalanceController extends Controller
{
    
 private $cif='x';
   
public function setCompany()
    {
        $this->cif=$_SESSION["cif"];
    }

    public function getMyAccountingBalanceJson(){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $responce->invoices=[];
        //$cif=$this->session->get('cif');
        $this->setCompany();
        //die(var_dump($cif));
        $apiNav = new ApiNavGetAccountingBalance();
        $raspunsDinNav = $apiNav->getBalanta($this->cif);
        //die(var_dump($raspunsDinNav));
        if($raspunsDinNav->status='success'){
            $responce->status="success";
            $responce->balantaInNav=$raspunsDinNav->balantaInNav;
        }else{
        $responce->status="error";
        $responce->message="Eroare interogare balanta contabila!";
        }




        $response
            ->setJsonContent($responce)
            ->send();
    }


    public function getMyAccountingBalancePdf(){
        //header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        //header("Cache-Control: post-check=0, pre-check=0", false);
        //header("Pragma: no-cache");
        $simpleView = new \Phalcon\Mvc\View\Simple();
        $simpleView->setViewsDir($this->pathToApps.'/templates/');
        require_once $this->pathToApps.'/dompdf/autoload.inc.php';
        $balantaInNav=null;
        $this->setCompany();
        $apiNav = new ApiNavGetAccountingBalance();
        $raspunsDinNav = $apiNav->getBalanta($this->cif);
        //die(var_dump($raspunsDinNav));
        if($raspunsDinNav->status='success'){
            //die(var_dump($raspunsDinNav->balantaInNav));
               $params = [
                        'balantaInNav' =>$raspunsDinNav->balantaInNav,
                        'cif'=>$this->cif
                    ];
        }

        $bodyHTML=$simpleView->render('balanta_pdf_client', $params);
        //$this->view->pick('balanta_pdf_client');

        // instantiate and use the dompdf class
        $dompdf = new Dompdf();
        $dompdf->loadHtml($bodyHTML);

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4', 'landscape');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser
        $dompdf->stream();
    }


    public function getMyAccountingBalancePdfMobile() {
        //header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        //header("Cache-Control: post-check=0, pre-check=0", false);
        //header("Pragma: no-cache");
        $simpleView = new \Phalcon\Mvc\View\Simple();
        $simpleView->setViewsDir($this->pathToApps.'/templates/');
        require_once $this->pathToApps.'/dompdf/autoload.inc.php';
        $balantaInNav=null;
        $this->setCompany();
        $apiNav = new ApiNavGetAccountingBalance();
        $raspunsDinNav = $apiNav->getBalanta($this->cif);
        //die(var_dump($raspunsDinNav));
        if($raspunsDinNav->status='success'){
            //die(var_dump($raspunsDinNav->balantaInNav));
               $params = [
                        'balantaInNav' =>$raspunsDinNav->balantaInNav,
                        'cif'=>$this->cif
                    ];
        }

        $bodyHTML=$simpleView->render('balanta_pdf_client', $params);
        //$this->view->pick('balanta_pdf_client');

        // instantiate and use the dompdf class
        $dompdf = new Dompdf();
        $dompdf->loadHtml($bodyHTML);

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4', 'landscape');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser
        $pdf64 = base64_encode($dompdf->output());

        $response = new Response();
        $responce = new stdClass();
        $responce->status="success";
        $responce->message=$pdf64;

        $response
        ->setJsonContent($responce)
        ->send();
    }
}
