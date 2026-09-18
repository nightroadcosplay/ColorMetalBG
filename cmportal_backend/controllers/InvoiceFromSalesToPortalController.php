<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class InvoiceFromSalesToPortalController extends Controller
{
use TranslatesMessages;
public function indexAction()
    {

    }




public function invoiceFromSales($token){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $rawdata = file_get_contents("php://input");
    $postData= json_decode($rawdata);
    $arrData= json_decode($rawdata,true);
    if(count($arrData)!=18){//lipsesc parametri
        $responce->status="error";
        $responce->message=$this->t('parametri_lipsa');
        $response->setStatusCode(400, 'Bad Request');
    }

    if($responce->status=="init"){//nu a fost nicio eroare pana aici)
        if(md5($this->passTokenApi.$postData->tokenid)==$token){
        // Start a transaction
            $this->db->begin();
            $invoice = new InvoicesModel();
            $invoice->reset();
            $invoice->bill_nr                   =$postData->bill_nr;
            $invoice->bill_data                 =$postData->bill_data;
            $invoice->bill_navisionid           =$postData->bill_navisionid;
            $invoice->cif                       =$postData->cif;
            $invoice->client_navisionid         =$postData->client_navisionid;
            $invoice->amount_including_vat      =$postData->amount_including_vat;
            $invoice->amount_vat                =$postData->amount_vat;
            $invoice->amount_without_vat        =$postData->amount_without_vat;
            $invoice->percent_vat               =$postData->percent_vat;
            $invoice->id_valuta                 =$postData->id_valuta;
            $invoice->valoare_incasata          =$postData->valoare_incasata;
            $invoice->sales_team                =$postData->sales_team;
            $invoice->order_navisionid          =$postData->order_navisionid;
            $invoice->este_retur                =$postData->este_retur;

            if($invoice->save()===false){
                        $responce->status="error";
                        $responce->message=$this->t('error_on_save_invoice_with_bill_nr_s', $postData->bill_nr);
                        $messages = $invoice->getMessages();
                        foreach ($messages as $message) {$responce->message.=$message;}
                    }

            if($responce->status=="init"){//no errors found
                $this->db->commit();
                $responce->status="success";
                $response->setStatusCode(200, 'OK');
                }else{
                    $responce->status="error";
                    $response->setStatusCode(400, 'Bad Request');
                    $this->db->rollback();
                }
            }
         else{ //token incorect
                $response->setStatusCode(401, 'Unauthorized');
                $responce->status="error";
                $responce->message="";
            }
        }
    $response
        ->setJsonContent($responce)
        ->send();
}

}
