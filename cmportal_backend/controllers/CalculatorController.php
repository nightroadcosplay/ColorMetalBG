<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class CalculatorController extends Controller
{
	use TranslatesMessages;

	private $pi=3.14141;
    private $densitate_g_per_cm3=0;
	private $diametru=0;
	private $lungime=0;
	private $grosime=0;
	private $um1_to_um2=0;
    private $productCode=0;
    private $sizeCuttingLength=0;
    private $NrBuc=0;
    private $kg_total=0;
	private $supr_debitata_mm2_buc=0;
	private $supr_debitata_cm2_comanda=0;
	private $greutate_teoretica_kg_buc=0;

    private $product_size_length=0;
	private $product_size_width=0;
	private $product_size_thickness=0;
	private $product_size_diameter=0;
	private $product_size_height=0;
	private $product_size_alloy='';
	private $product_size_type='';
    public $q_ML; //vorbim de bare debitate, deci vom avea mereu metri liniari

	public function indexAction()
    {

    }

	public function getParametersFromDB(){
        $this->productCode=$_POST['productCode'];
		$product = NomProduct::findFirst("product_code = '".$this->productCode."'");

        if($product){
            $this->product_size_length=$product->size_length;
        	$this->product_size_width=$product->size_width;
        	$this->product_size_thickness=$product->size_thickness;
        	$this->product_size_diameter=$product->size_diameter;
        	$this->product_size_height=$product->size_height;
        	$this->product_size_alloy=$product->size_alloy;
        	$this->product_size_type=$product->size_type;
            $this->densitate_g_per_cm3=$product->densitate;
            return true;
        }
        else{return false;}
	}


    public function calculSuprafete(){
        $this->supr_debitata_mm2_buc=$this->pi*$this->product_size_diameter*$this->product_size_diameter/4;
        $this->supr_debitata_cm2_buc=$this->supr_debitata_mm2_buc/100;
        $this->supr_debitata_cm2_comanda=$this->supr_debitata_cm2_buc*$this->NrBuc;
        $this->q_ML=round(($this->NrBuc*$this->sizeCuttingLength)/1000,2);
        return true;
    }

    public function calculGreutati(){
        $this->greutate_teoretica_kg_buc=((($this->supr_debitata_mm2_buc/100)* ($this->sizeCuttingLength/10))* $this->densitate_g_per_cm3)/1000;
        $this->greutate_teoretica_kg_comanda=$this->greutate_teoretica_kg_buc*$this->NrBuc;
        //die(var_dump($this->greutate_teoretica_kg_buc));
        $this->kg_total=$this->greutate_teoretica_kg_comanda;
        return true;
    }


public function getCalcule(){
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
    $response = new Response();
    $responce = new stdClass();
    $responce->status="init";
    $responce->message="";
    $this->sizeCuttingLength=$_POST['sizeCuttingLength'];
    $this->NrBuc=(empty($_POST['NrBuc'])?0:$_POST['NrBuc']);
    if($this->NrBuc>0){
        if(!$this->getParametersFromDB()){
            $responce->status="error";
            $responce->message=$this->t('eroare_la_identificarea_paramterilor_articolului_in_baza_de');
        }
        if(!$this->calculSuprafete()){
            $responce->status="error";
            $responce->message=$this->t('eroare_la_calcul_dimensiuni');
        }
        if(!$this->calculGreutati()){
            $responce->status="error";
            $responce->message=$this->t('eroare_la_calcul_greutate');
        }

        if($responce->status!="error"){
           $responce->status="success";
           $responce->kg_total=$this->kg_total;
           $responce->q_ML=$this->q_ML;
        }
    }

    $response
        ->setJsonContent($responce)
        ->send();
}

}
