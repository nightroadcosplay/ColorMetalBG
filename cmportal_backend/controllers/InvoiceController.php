<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class InvoiceController extends Controller
{
public function indexAction()
    {

    }


public function getMyInvoices(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $responce->invoices=[];
    $cif=$this->session->get('cif');
    $roCif = "RO".$cif;
    $invoices= InvoicesModel::find(
                                    [
                                    'conditions' => 'cif = ?1 or cif = ?2',
                                    'bind'       => [
                                                    1 =>  $cif,
                                                    2 =>  $roCif
                                                    ],
                                    'order'=>'bill_data desc'
                                    ]
                );

    $today = new DateTime();
    $totalRestDePlata = 0;
    $totalScadenta = 0;
    foreach($invoices as $invoice){
            $dueDate = new DateTime($invoice->bill_due_date ?: 'now');
            if($dueDate > $today){
                $dueDate = $today;
            }
            $interval = $today->diff($dueDate);
            $diffInDays = $interval->format("%d");
            $isInvoiceOverdue = ($diffInDays > 3 && $invoice->remaining_amount > 0);
            $totalRestDePlata += $invoice->remaining_amount ?? 0;
            if($isInvoiceOverdue) {
                $invoice->nr_zile_depasire_termen_plata = $diffInDays;
                $totalScadenta += $invoice->remaining_amount ?? 0;
                $updateInvoiceNr = $this->db->query("update portal_color.invoices set nr_zile_depasire_termen_plata=:nr_zile_depasire_termen_plata where bill_nr =:bill_nr", array(':nr_zile_depasire_termen_plata' => $invoice->nr_zile_depasire_termen_plata, ':bill_nr' => $invoice->bill_nr));
            }
            array_push($responce->invoices, [
                        "id"=>$invoice->bill_nr,
                        "data"=>substr($invoice->bill_data,0,16),
                        "valoare"=>round($invoice->amount_including_vat ?? 0,2),
                        "moneda"=>$invoice->id_valuta,
                        "nrZileDepasireTermenPlata"=>$invoice->nr_zile_depasire_termen_plata,
                        "restDeAchitat"=>round($invoice->remaining_amount ?? 0, 2),
                        "dataScadenta"=>$invoice->bill_due_date,
                        "isInvoiceOverdue"=>$isInvoiceOverdue
                    ]);
        }

    $responce->status="success";
    $responce->totalRestDePlata = round($totalRestDePlata,2);
    $responce->totalScadenta = round($totalScadenta,2);
    $response
        ->setJsonContent($responce)
        ->send();
}


    public function download_invoice($bill_nr) {

        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $apiNav = new ApiNavGetInvoice();
        $raspunsDinNav = $apiNav->getInvoicePDF($bill_nr);
        $responce->message = $raspunsDinNav->message;
        $responce->status="success";
        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function getInvoicesFromNAV() {
        ini_set('memory_limit','2048M');
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $cif=$this->session->get('cif');
        $apiNav = new ApiNavGetInvoice();
        $raspunsDinNav = $apiNav->getInvoices($cif);
        if($raspunsDinNav && $raspunsDinNav->status=='success') {
            $responce->status="success";
            $responce->invoices=$raspunsDinNav->invoices;
            $responce->areInvoicesOverdue=$raspunsDinNav->areInvoicesOverdue;
            $responce->overdueInvoiceCount = $raspunsDinNav->overdueInvoiceCount;
            $responce->message = $raspunsDinNav->message;
        }else{
            $responce->status=$raspunsDinNav->status;
            $responce->message=$raspunsDinNav->message;
        }
        $response
            ->setJsonContent($responce)
            ->send();
    } 

    public function getInvoice($bill_nr){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $responce->invoice=new stdClass();

        $invoice= InvoicesModel::findFirst(
                                    [
                                    'conditions' => 'bill_nr = ?1',
                                    'bind'       => [
                                                    1 =>  $bill_nr
                                                    ],
                                    ]
                );
        if($invoice) {
            $responce->invoice->id = $invoice->bill_nr;
            $responce->invoice->data = substr($invoice->bill_data,0,16);
            $responce->invoice->valoare = round($invoice->amount_including_vat,2);
            $responce->invoice->moneda = $invoice->id_valuta;
            $responce->invoice->nrZileDepasireTermenPlata = $invoice->nr_zile_depasire_termen_plata;
            $responce->invoice->restDeAchitat = round($invoice->remaining_amount, 2);
            $responce->invoice->dataScadenta = $invoice->bill_due_date;
            // array_push($responce->invoice, [
            //             "id"=>$invoice->bill_nr,
            //             "data"=>substr($invoice->bill_data,0,16),
            //             "valoare"=>round($invoice->amount_including_vat,2),
            //             "moneda"=>$invoice->id_valuta,
            //             "nrZileDepasireTermenPlata"=>$invoice->nr_zile_depasire_termen_plata,
            //             "restDeAchitat"=>round($invoice->remaining_amount, 2),
            //             "dataScadenta"=>$invoice->bill_due_date
            //         ]);
            $responce->status="success";
        } else {
            $responce->status="error";
            $responce->message="Factura cu nr. " . $bill_nr . " nu este in baza de date";
        }
        $response
            ->setJsonContent($responce)
            ->send();
    } 

    public function download_certificate($bill_nr) {

        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";

        $apiNav = new ApiNavGetCertificate();
        $raspunsDinNav = $apiNav->getCertificatePDF($bill_nr);
        $responce->countCertificates = $raspunsDinNav->countCertificates;
        $responce->articles = $raspunsDinNav->articles;
        $responce->message = $raspunsDinNav->message;
        $responce->status="success";
        $response
            ->setJsonContent($responce)
            ->send();
    }

    public function getFilteredInvoices(){
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        $id = $_POST['id'];
        $data = $_POST['data'];
        $valoare = $_POST['valoare'];
        $moneda = $_POST['moneda'];
        $nrZileDepasireTermenPlata = $_POST['nrZileDepasireTermenPlata'];
        $restDeAchitat = $_POST['restDeAchitat'];
        $dataScadenta = $_POST['dataScadenta'];
        $dataCondition = '=';
        $response = new Response();
        $responce = new stdClass();
        $responce->status="init";
        $responce->message="";
        $responce->invoices=[];
        $cif=$this->session->get('cif');
        $roCif = "RO".$cif;

        // die(var_dump($dataScadenta));
        if(!isset($data) || $data == ''){
            $data = date('Y-m-d', strtotime('1900-01-01'));
            $dataCondition = '>';
        }

        if(!isset($dataScadenta) || $dataScadenta == ''){
            $dataScadenta = date('Y-m-d', strtotime('1900-01-01'));
        }

        
        // die(var_dump($dataScadenta));
        $invoices= InvoicesModel::find(
                                        [
                                        'conditions' => '(cif = ?1 or cif = ?2) and bill_nr like ?3 and bill_data '.$dataCondition.'?4 and (CAST(amount_including_vat AS TEXT) like ?5 or CAST(amount_including_vat AS TEXT) like ?10) and id_valuta like ?6 and CAST(nr_zile_depasire_termen_plata AS TEXT) like ?7 and CAST(remaining_amount AS TEXT) like ?8 and bill_due_date > ?9' ,
                                        'bind'       => [
                                                        1 =>  $cif,
                                                        2 =>  $roCif,
                                                        3 => $id.'%',
                                                        4 => $data,
                                                        5 => $valoare.'%',
                                                        6 => $moneda.'%',
                                                        7 => $nrZileDepasireTermenPlata.'%',
                                                        8 => $restDeAchitat.'%',
                                                        9 => $dataScadenta,
                                                        10 => '-'.$valoare.'%'
                                                    ],
                                        'order'=>'bill_data desc'
                                    ]
                );
        $today = new DateTime();
        $totalRestDePlata = 0;
        $totalScadenta = 0;
        foreach($invoices as $invoice){
            $dueDate = new DateTime($invoice->bill_due_date ?: 'now');
            if($dueDate > $today){
                $dueDate = $today;
            }
            $interval = $today->diff($dueDate);
            $diffInDays = $interval->format("%d");
            $isInvoiceOverdue = ($diffInDays > 3 && $invoice->remaining_amount > 0);
            $totalRestDePlata += $invoice->remaining_amount ?? 0;
            if($isInvoiceOverdue) {
                $invoice->nr_zile_depasire_termen_plata = $diffInDays;
                $totalScadenta += $invoice->remaining_amount ?? 0;
            }
            array_push($responce->invoices, [
                        "id"=>$invoice->bill_nr,
                        "data"=>substr($invoice->bill_data,0,16),
                        "valoare"=>round($invoice->amount_including_vat ?? 0,2),
                        "moneda"=>$invoice->id_valuta,
                        "nrZileDepasireTermenPlata"=>$invoice->nr_zile_depasire_termen_plata,
                        "restDeAchitat"=>round($invoice->remaining_amount ?? 0, 2),
                        "dataScadenta"=>$invoice->bill_due_date,
                        "isInvoiceOverdue"=>$isInvoiceOverdue
                    ]);
        }

        $responce->status="success";
        $responce->totalRestDePlata = round($totalRestDePlata,2);
        $responce->totalScadenta = round($totalScadenta,2);
        $response
            ->setJsonContent($responce)
            ->send();
    }
}
