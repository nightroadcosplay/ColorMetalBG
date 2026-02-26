<?php
use Phalcon\Mvc\Controller;
use Phalcon\Http\Response;
use Phalcon\Filter;
use Phalcon\Image\Factory;
use Phalcon\Paginator\Adapter\Model as PaginatorModel;

class AdminCompaniesController extends Controller
{

private $companyCode;
private $cif;

public function onConstruct()
{
    $responceContent = new stdClass();
    $responceContent->status="init";
    $responceContent->message="";    
    $isConnected=false;
    $response = new Response();
    if ($this->session->has('isConnected') && $this->session->has('userId')) {
             $isConnected = $this->session->get('isConnected');
        }
    else{
        $responceContent->status="error";
        $responceContent->message="Invalid session! Please reconnect!";    
    die(json_encode($responceContent));
    }
}

public function getCompanyByAppid($appid){
    $response = new Response();
    //request = new Request();
    $responceContent = new stdClass();
    $responceContent->status="success";
    $responceContent->message="";
    $responceContent->company = CompaniesModel::findFirst([
                                        'conditions' => 'appid = ?1',
                                        'bind'       => [
                                                1 => $appid,
                                        ]
                                        ]);

    $response
        ->setJsonContent($responceContent)
        ->send();
}

public function getCompanyByCif($cif){
    $response = new Response();
    //request = new Request();
    $responceContent = new stdClass();
    $responceContent->status="success";
    $responceContent->message="";
    $responceContent->company = CompaniesModel::findFirst([
                                        'conditions' => 'cif = ?1',
                                        'bind'       => [
                                                1 => $cif,
                                        ]
                                        ]);

    $response
        ->setJsonContent($responceContent)
        ->send();
}

public function getCompanyAddress($cif) {
    $response = new Response();
    //request = new Request();
    $responceContent = new stdClass();
    $responceContent->status="init";
    $responceContent->message="";

    $responceContent->adresa = new stdClass(); 
    $adresa = AdresaLivrare::findFirst([
                                        'conditions' => 'cif = ?1 and tip_adresa = ?2',
                                        'bind'       => [
                                                1 => $cif,
                                                2 => 'baza',
                                        ]
                                        ]);
    if($adresa){ 
        $responceContent->status="success";
        $responceContent->adresa->slid=$adresa->slid;
        $responceContent->adresa->appid=$adresa->appid;
        $responceContent->adresa->cif=$adresa->cif;
        $responceContent->adresa->adresaCodJudet=$adresa->adresa_cod_judet;
        $responceContent->adresa->adresaLocalitate=$adresa->adresa_localitate;
        $responceContent->adresa->adresaAdresa=$adresa->adresa_adresa;
        $responceContent->adresa->adresaCodPostal=$adresa->adresa_cod_postal;
        $responceContent->adresa->tipAdresa=$adresa->tip_adresa;
        $responceContent->adresa->codTara=$adresa->cod_tara;
        $responceContent->adresa->navisionid=$adresa->navisionid;
        $responceContent->adresa->denJudet=$adresa->den_judet;
    }
    else{
        $responceContent->status="error";
        $responceContent->message="Adresa nu este in baza de date!";//appid gresita            
    }

    $response
        ->setJsonContent($responceContent)
        ->send();
}


public function getFirst20CompaniesByFilter(){
    $response = new Response();
    //request = new Request();
    $responceContent = new stdClass();
    $responceContent->status="success";
    $responceContent->message="";
    $sqlConditions='';
    $filterString = $this->request->getPost('filterString', ['string','upper']);
    $arrFilter = explode(" ", $filterString);
    foreach ($arrFilter as $key => $value) {
        $sqlConditions.=" denumire like '%".$value."%' or cif like '%".$value."%'";
    }

   // die(var_dump($sqlConditions));
    
    $responceContent->companies= $this->db->fetchAll("SELECT d.cif, d.denumire as name,d.navisionid as code FROM portal_color.companies d
                                     where  ".$sqlConditions." order by denumire limit 20");

    $response
        ->setJsonContent($responceContent)
        ->send();
}


public function getOnePageCompanies($page_number,$nr_of_rows){
    $response = new Response();
    //request = new Request();
    $responceContent = new stdClass();
    $responceContent->status="success";
    $responceContent->message="";
    $sqlConditions='';
    $filterString = $this->request->get('filter_text', ['string','upper']);
    $pageNumber=intval($page_number);
    $nrOfRows=intval($nr_of_rows);

    $arrFilter = explode(" ", $filterString);
    foreach ($arrFilter as $key => $value) {
        $sqlConditions.=" denumire like '%".$value."%' or cif like '%".$value."%'";
    }
    $paginator = new PaginatorModel([
        'model'      => CompaniesModel::class,
        'parameters' => [
            'conditions' => $sqlConditions,
            'order'      => 'denumire',
        ],
        'limit'      => $nrOfRows,
        'page'       => $pageNumber,
    ]);

    // Get the paginated results (Phalcon 4/5 uses paginate())
    $page = $paginator->paginate();

    // Normalize to legacy shape expected by clients.
    // Some Phalcon versions return a Repository with public properties (no getters).
    // Avoid PHP notices by never reading missing properties directly.
    $items = method_exists($page, 'getItems') ? $page->getItems() : (property_exists($page, 'items') ? $page->items : []);
    $current = method_exists($page, 'getCurrent') ? $page->getCurrent() : (property_exists($page, 'current') ? $page->current : $pageNumber);
    $before = method_exists($page, 'getPrevious') ? $page->getPrevious() : (property_exists($page, 'before') ? $page->before : 1);
    $next = method_exists($page, 'getNext') ? $page->getNext() : (property_exists($page, 'next') ? $page->next : $pageNumber);
    $last = method_exists($page, 'getLast') ? $page->getLast() : (property_exists($page, 'last') ? $page->last : $pageNumber);
    $totalItems = method_exists($page, 'getTotalItems') ? $page->getTotalItems() : (property_exists($page, 'total_items') ? $page->total_items : 0);
    $first = method_exists($page, 'getFirst') ? $page->getFirst() : (property_exists($page, 'first') ? $page->first : 1);

    // total_pages isn't present in all Repository implementations; derive it.
    if (method_exists($page, 'getTotalPages')) {
        $totalPages = $page->getTotalPages();
    } elseif (property_exists($page, 'total_pages')) {
        $totalPages = $page->total_pages;
    } elseif (is_numeric($last) && $last > 0) {
        $totalPages = (int) $last;
    } elseif ($nrOfRows > 0) {
        $totalPages = (int) ceil(((int) $totalItems) / $nrOfRows);
    } else {
        $totalPages = 0;
    }

    $responceContent->page = [
        'items'        => $items,
        'current'      => $current,
        'before'       => $before,
        'next'         => $next,
        'last'         => $last,
        'total_pages'  => $totalPages,
        'total_items'  => $totalItems,
        'first'        => $first,
    ];

   // die(var_dump($sqlConditions));
     /*
    $responceContent->companies= $this->db->fetchAll("
                SELECT d.appid,d.cif, d.denumire as name,d.navisionid as navisionid
                        FROM portal_color.companies d
                        WHERE  ".$sqlConditions." order by denumire LIMIT ".$nrOfRows." OFFSET ".$offSet);
          */
    $response
        ->setJsonContent($responceContent)
        ->send();
}

}