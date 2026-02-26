<?php
//$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
//die(var_dump($actual_link));
// header("Access-Control-Allow-Origin: http://localhost:8080");
//header("Access-Control-Allow-Credentials: true");
// header("Access-Control-Allow-Headers: X-Requested-With");
/*
if(isset($_SERVER['HTTP_ORIGIN'])){
    $http_origin = $_SERVER['HTTP_ORIGIN'];
    $accepted_servers=array('hrapp12bcr','hrapp11bcr','hrapp04bcr','localhost');
    if (array_reduce($accepted_servers,
                    function($v1,$v2){if (strpos($http_origin, $v2) >=0) return true;else return false;}
                    ,false))
    {
        header("Access-Control-Allow-Origin: *");
    }else{die('bau!');}
}
*/
$session_lifetime = 43200;
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('session.gc_maxlifetime', $session_lifetime);
session_set_cookie_params($session_lifetime);
session_start([
    'cookie_lifetime' => $session_lifetime,
    'gc_maxlifetime'  => $session_lifetime,
    'cookie_path'     => '/',
    'save_path'     => __DIR__.'/sessions'
]);

error_reporting(E_ALL);

use Phalcon\Di\FactoryDefault;
use Phalcon\Mvc\Micro\Collection as MicroCollection;
use Phalcon\Http\Response;
use Phalcon\Session\Manager;
use Phalcon\Session\Adapter\Stream;
//use mikehaertl\wkhtmlto\Pdf;
require_once('config.php');

$loader = new \Phalcon\Autoload\Loader();
/*
$loader->registerDirs(array(
    '/home/kcdxupqd/apps/wishlist/controllers/',
    '/home/kcdxupqd/apps/wishlist/models/'
))->register();
*/

$loader->setDirectories(array(
    $pathToApps.'/controllers/',
    $pathToApps.'/models/'
))->register();

$app = new \Phalcon\Mvc\Micro();


$di = new FactoryDefault();

// Start the session the first time when some component request the session service
$AppSession = new Manager();
$files = new Stream(
    [
        'savePath' => $pathToApps . '/tmp',
    ]
);
$AppSession->setAdapter($files);
$AppSession->start();

$di->setShared(
    'session',
    function () {
        GLOBAL $AppSession;
        return $AppSession;
    }
);


// Set up the database service
$di->set('db', function (){
    GLOBAL $dbUser;
    GLOBAL $dbName;
    GLOBAL $dbPassword;
    $connection = new Phalcon\Db\Adapter\Pdo\Postgresql(array(
        'host'     => "localhost",
        'username' => $dbUser,
        'password' => $dbPassword,
        'dbname'   => $dbName,
        'schema'   => "portal_color",
        "port"     => 5432,
        "options" => [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ]
    ));

    $connection->execute('set search_path=portal_color;');
    return $connection;
});
$di->set('pathToApps', function (){
                                GLOBAL $pathToApps;
                                return $pathToApps;
                                });

$di->set('dbSchema', function (){
                                GLOBAL $dbSchema;
                                return $dbSchema;
                                });

$di->set('passTokenApi', function (){
                                return 'silviU99!';
                                });

if(($_SERVER['HTTP_HOST']=='localhost:83'||$_SERVER['HTTP_HOST']=='regisdra-test'||$_SERVER['HTTP_HOST']=='regisdra-live')&& (strpos( $_SERVER['REQUEST_URI'], 'pdf_cover') !== false)){
include $pathToApps."/htmltopdf/vendor/autoload.php";
}

//die(var_dump($di));
$app->setDI($di);

/*
if(isset($_SERVER['HTTP_REFERER']) && $_SERVER['HTTP_REFERER']=='http://localhost:8080/'){
    $app->session->set('isConnected', 'yes');
    $app->session->set('userId', 'florin');
    $app->session->set('companyCode', 'C0000340');
    $app->session->set('cif', '15310980');
}
*/
/*
$app->before(function() use ($app,$AppSession) {
    $origin = $app->request->getHeader("ORIGIN") ? $app->request->getHeader("ORIGIN") : 'http://localhost:8080';
    $app->response->setHeader("Access-Control-Allow-Origin", $origin)
          ->setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,OPTIONS')
          ->setHeader("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type, Authorization')
          ->setHeader("Access-Control-Allow-Credentials", 'true');
        if(isset($_POST['userToken'])){
        $userToken=$_POST['userToken'];
        }   else{
        $userToken='x';
        }

     if ($userToken=='c5a5bb10ee4db82629568f2cb7c39e97' || strpos($_SERVER['REQUEST_URI'], 'login') !== false || strpos($_SERVER['REQUEST_URI'], 'salesapi') !== false || strpos($_SERVER['REQUEST_URI'], 'datafromsalestoportal') !== false) {
            null;
            }else{

                //$isConnected=$app['session']->get('isConnected');
                    $isConnected=$app->session->get('isConnected');
//die(var_dump($AppSession->isConnected));
                    if ($isConnected!='yes') {
                    die('user neautentificat22');
                    // Return false stops the normal execution
                    return false;
                }
            }
    $app->response->sendHeaders();
    return true;
    });

$app->options('/{catch:(.*)}', function() use ($app) {
        $origin = $app->request->getHeader("ORIGIN") ? $app->request->getHeader("ORIGIN") : 'http://localhost:8080/';
        $app->response->setHeader("Access-Control-Allow-Origin", $origin)
                    ->setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,OPTIONS')
                    ->setHeader("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Range, Content-Disposition, Content-Type, Authorization')
                    ->setHeader("Access-Control-Allow-Credentials", 'true');
    $app->response->sendHeaders();
    $app->response->setStatusCode(200, "OK")->send();
});
*/
// register handler
//$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
//die(var_dump($actual_link));
$user = new MicroCollection();
$user
    ->setHandler(UserController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/user')
    ->post('/login', 'login')
    ->get('/testx', 'test')
    ->put('/save_my_profile/{appid}','saveMyProfile')
    ->post('/upload_image_my_profile/{appid}','uploadImageMyProfile')
    ->get('/my_image_profile_as_string/{appid}','getMyImageProfileAsString')
    ->get('/color_contacts','getMyColorContacts')
    ->post('/get_current_user', 'getCurrentUser')
    ->post('/change_password', 'changePassword')
    ->get('/check_session_status', 'checkSessionStatus')
    ->post('/change_lang/{lang}', 'changeLang')
;
$app->mount($user);


$adminusers = new MicroCollection();
$adminusers
    ->setHandler(AdminUsersController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/admin/users')
    ->get('/{companyAppid}', 'getUsers')
    ->post('/new_user', 'newUser')
    ->get('/user_details/{appid}', 'getUserDetails')
    ->get('/img_user_profile_jpg_by_user_appid/{appid}', 'getImgProfileAsJpgByUserAppid')
    ->get('/reset_password/{appid}', 'resetPassword')
;
$app->mount($adminusers);


$adminCategory = new MicroCollection();
$adminCategory
    ->setHandler(AdminCategoryController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/admin/category')
    ->get('/{pid}', 'getCategory')
    ->get('/image_as_string/{pid}', 'getImageCategoryAsString')
    ->post('/', 'newCategory')
    ->post('/{pid}', 'editCategory')
    ->delete('/{pid}', 'deleteCategory')
    ->get('/treedata/{rnd}', 'getTreeDataCateg')
    ->get('/listdata/{rnd}', 'getListDataCateg')
;
$app->mount($adminCategory);

$adminProducts = new MicroCollection();
$adminProducts
    ->setHandler(AdminProductController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/admin/product')
    ->get('/{pid}/{rnd}', 'getProduct')
    ->get('/page/{rowsPerPage}/{pageNumber}/{rnd}', 'getPage')
    ->post('/{pid}', 'editProduct')
    ->delete('/{pid}', 'deleteCategory')
    ->get('/search/{rnd}', 'searchProducts')
    ->put('/change_status_activ_inactiv/{pid}/{newStatus}', 'changeStatusActivInactiv')
;
$app->mount($adminProducts);

$adminCompanies = new MicroCollection();
$adminCompanies
    ->setHandler(AdminCompaniesController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/admin/companies')
    ->post('/filter', 'getFirst20CompaniesByFilter')
    ->get('/page/{page_number}/{nr_of_rows}', 'getOnePageCompanies')
    ->get('/company_by_appid/{appid}', 'getCompanyByAppid')
    ->get('/company_by_cif/{cif}', 'getCompanyByCif')
    ->get('/get_company_address/{cif}', 'getCompanyAddress')

;
$app->mount($adminCompanies);


$nomeclatoare = new MicroCollection();
$nomeclatoare
    ->setHandler(NomenclatoareController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/nomenclatoare')
    ->get('/countries/{rnd}', 'getCountries')
    ->get('/judete/{rnd}', 'getJudete')
;
$app->mount($nomeclatoare);

$userAdreseLivrare = new MicroCollection();
$userAdreseLivrare
    ->setHandler(UserAdreseLivrareController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/user')
    ->get('/adrese_livrare/{rnd}', 'getAdrese')
    ->delete('/adrese_livrare/{slid}', 'deleteAdresa')
    ->post('/adrese_livrare', 'saveAdresa')
    ->get('/get_adresa/{slid}', 'getAdresa')
;
$app->mount($userAdreseLivrare);


$userCompanyUsers= new MicroCollection();
$userCompanyUsers
    ->setHandler(CompanyUsersController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/user')
    ->get('/company_users/{rnd}', 'getAllCompanyUsers')
;
$app->mount($userCompanyUsers);


$articol= new MicroCollection();
$articol
    ->setHandler(ArticolController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/articol')
    ->get('/{pid}/{rnd}', 'getArticol')
    ->get('/by_product_code/{productCode}/{rnd}', 'getArticolByProductCode')
    ->get('/verifica_articol_in_portal/{productCode}/{tokenId}/{tokenHash}','verifyIfProductIsActivInPortal')
;
$app->mount($articol);

$favorites= new MicroCollection();
$favorites
    ->setHandler(FavoritesController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/favorites')
    ->get('/', 'getAllMyFvorites')
    ->delete('/{productCode}', 'delete')
    ->post('/identify_article_and_put_in_favorites', 'identifyArticleAndPutIntoFavorites')
    ->post('/put_article_by_code_in_favorite', 'getArticleByCodeAndPutIntoFavorites')
;
$app->mount($favorites);

$basket= new MicroCollection();
$basket
    ->setHandler(BasketController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/basket')
    ->get('/', 'getMyBasket')
    ->delete('/{appid}', 'delete')
    ->post('/identify_article_and_put_in_basket', 'identifyArticleAndPutIntoBasket')
    ->post('/put_article_by_code_in_basket', 'getArticleByCodeAndPutIntoBasket')
;
$app->mount($basket);

$articol= new MicroCollection();
$articol
    ->setHandler(BrowseCategoryController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/browse')
    ->get('/categories', 'getAllCategories')
    ->get('/categories/{pid}', 'getCategory')
    ->get('/category/image/{pid}', 'getCategoryImage')
   // ->get('/categories/{pid}/{rnd}', 'getAllCategories')
;
$app->mount($articol);

$articol= new MicroCollection();
$articol
    ->setHandler(BrowseArticleController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/browse')
    ->get('/articles/{pid}', 'getArticlesForCategory')
    ->post('/identify_article', 'identifyArticleInDBAndReturnToBrowser')
;
$app->mount($articol);


$offer= new MicroCollection();
$offer
    ->setHandler(OfferController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/offer')
    ->post('/send_basket_for_an_offer', 'sendBasketForAnOffer')
    ->post('/send_cerere_for_new_offer', 'sendCerereForNewOffer')
    ->get('/my_offers', 'getMyOffers')
    ->delete('/offer/{id_offer}', 'cancelOffer')
    ->get('/offer/{id_offer}', 'getOffer')
    ->post('/accept_offer/{id_offer}', 'sendAcceptOffer')
    ->post('/send_cerere_for_new_offer_2', 'sendCerereForNewOffer2')
;
$app->mount($offer);

$cerere= new MicroCollection();
$cerere
    ->setHandler(CerereController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/cerere')
    ->get('/{id_offer}', 'getCerere')
;
$app->mount($cerere);

$invoice= new MicroCollection();
$invoice
    ->setHandler(InvoiceController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/invoice')
    ->get('/', 'getMyInvoices')
    ->get('/{bill_nr}', 'download_invoice')
    ->get('/invoiceNAV', 'getInvoicesFromNAV')
    ->get('/single_invoice/{bill_nr}', 'getInvoice')
    ->get('/certificate/{bill_nr}', 'download_certificate')
    ->post('/filtered_invoices', 'getFilteredInvoices')
;
$app->mount($invoice);

$balanta= new MicroCollection();
$balanta
    ->setHandler(AccountingBalanceController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/my_accounting_balance')
    ->get('/json', 'getMyAccountingBalanceJson')
    ->get('/pdf', 'getMyAccountingBalancePdf')
    ->get('/pdf_mobile', 'getMyAccountingBalancePdfMobile')
;
$app->mount($balanta);

$calculator= new MicroCollection();
$calculator
    ->setHandler(CalculatorController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/calculator')
    ->post('/', 'getCalcule')
;
$app->mount($calculator);

$mailbox= new MicroCollection();
$offer
    ->setHandler(UsersMailboxController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/users_mailbox')
    ->get('/new_messages_for_me', 'getNewMessagesForMe')
;
$app->mount($offer);

$salesApi= new MicroCollection();
$salesApi
    ->setHandler(SalesApiController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/salesapi')
    ->get('/offers_headers/{lastSynchedAppid}/{token}','getAllOffersHeaders')
    ->get('/offers_products/{lastSynchedAppid}/{token}','getAllOffersProducts')
    ->get('/users/{lastSynchedAppid}/{token}','getUsers')
    ->get('/new_orders/{lastSynchedAppid}/{token}','getNewOrders')
;
$app->mount($salesApi);


$salesApi= new MicroCollection();
$salesApi
    ->setHandler(OfferFromSalesToPortalController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/datafromsalestoportal')
    ->post('/offers_from_sales/{token}','offersFromSales')
    ->post('/lansare_orders_from_sales/{token}','lansareOrdersFromSales')
    ->post('/offers_from_sales/delete_products/{token}', 'deleteProductsFromOrder')
;
$app->mount($salesApi);

$salesApi= new MicroCollection();
$salesApi
    ->setHandler(ResetPasswordFromSalesToPortalController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/datafromsalestoportal')
    ->post('/reset_password_get_token/{slid_user}/{tokenId}/{tokenHash}','resetTokenForPassword')
;
$app->mount($salesApi);

$salesApi= new MicroCollection();
$salesApi
    ->setHandler(ResetPasswordFromSalesToPortalController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix)
    ->post('/reset_password/check_token/{slid_user}/{tokenHash}', 'checkToken')
;
$app->mount($salesApi);

$salesApi= new MicroCollection();
$salesApi
    ->setHandler(InvoiceFromSalesToPortalController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/datafromsalestoportal')
    ->post('/invoice/{token}','invoiceFromSales')
;
$app->mount($salesApi);

$salesApi= new MicroCollection();
$salesApi
    ->setHandler(UserFromSalesToPortalController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/datafromsalestoportal')
    ->get('/user/{cif}/{slid_user}/{token}','getInfoUser')
    ->post('/user/create/{cif}/{slid_user}/{token}','createUserPortal')
    ->get('/user/change_status_user/{cif}/{slid_user}/{newStatus}/{token}','changeStatusUserPortal')
    ->post('/user/update/{cif}/{slid_user}/{token}','updateUserPortal')
    ->post('/user/multiple_companies/{cif}/{slid_user}/{token}', 'setUserToMultipleCompanies')
    ->get('/user/{cif}/{userid}/{slid_user}/{token}','getInfoUserById')
;
$app->mount($salesApi);

$salesApi= new MicroCollection();
$salesApi
    ->setHandler(CompanyFromSalesToPortalController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/datafromsalestoportal')
    ->post('/company/create/{cif}/{token}','createCompanyPortal')
    ->get('/company/{cif}/{token}','getStatusCompany')
    ->get('/user/change_status_company/{cif}/{newStatus}/{token}','changeStatusCompanyPortal')
;
$app->mount($salesApi);

$salesApi= new MicroCollection();
$salesApi
    ->setHandler(AlertsController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix)
    ->get('/alerts/get_alerts', 'getMyAlerts')
;
$app->mount($salesApi);

$downloadApi = new MicroCollection();
$downloadApi
    ->setHandler(DownloadController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix)
    ->get('/offer/generare_oferta_pdf_link/{type}/{id_offer}/{lang}', 'generareOfertaPdfLink')
    ->get('/generare_pdf_privacy/{type}', 'generarePdfPrivacy')

;
$app->mount($downloadApi);

$salesApi= new MicroCollection();
$salesApi
    ->setHandler(OfferPDFController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix.'/datafromsalestoportal')
    ->post('/offer_pdf/{slid_offer}/{lang}/{tokenId}/{tokenHash}','offerPDF')
    ->post('/save_pdf/{type}/{slid_offer}/{lang}/{tokenId}/{tokenHash}','savePDF')
    ->post('/delete_pdf/{type}/{slid_offer}/{lang}/{tokenId}/{tokenHash}','deletePdf')
;
$app->mount($salesApi);

$addressApi = new MicroCollection();
$addressApi
    ->setHandler(AddressController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix)
    ->post('/adresa/adresa_noua/{token}', 'addNewAddress')
    ->post('/adresa/delete/{token}', 'deleteAddress')
    ->get('/adrese/get_events/{lastSynchedAppid}/{token}', 'getAddressEvents')
    ->post('/adresa/delete_new_address/{token}', 'deleteNewAddress')
;
$app->mount($addressApi);

$usersCompaniesApi= new MicroCollection();
$usersCompaniesApi
    ->setHandler(UsersCompaniesController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix)
    ->get('/companies/{userId}', 'getUserCompanies')
    ->post('/companies/change_company_user/{userid}/{cif}', 'changeUserCompany')
;
$app->mount($usersCompaniesApi);

$countNewDataApi= new MicroCollection();
$countNewDataApi
    ->setHandler(CounterNewDataController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix)
    ->get('/count_new_data', 'getCounters')
;
$app->mount($countNewDataApi);

$getArticleStockApi= new MicroCollection();
$getArticleStockApi
    ->setHandler(ArticleStockController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix)
    ->get('/get_article_stock/{productCode}', 'getArticleStock')
;
$app->mount($getArticleStockApi);


$getArticlesFromSalesApi= new MicroCollection();
$getArticlesFromSalesApi
    ->setHandler(ArticlesFromSalesController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix)
    ->post('/articles/get_articles_from_sales/{token}', 'getArticlesFromSales')
;
$app->mount($getArticlesFromSalesApi);

$sincronizareTipuri = new MicroCollection();
$sincronizareTipuri
    ->setHandler(TipuriController::class)
    ->setLazy(true)
    ->setPrefix($apiPrefix. '/admin/tipuri')
    ->get('/sincronizare', 'sincronizareTipuri')
    ->get('/get_tipuri/{rnd}', 'getTreeDataCateg')
    ->get('/get_tip/{appid}', 'getTip')
    ->get('/images/{type_id}', 'getImagesTip')
    ->post('/save_tip', 'saveTip')
    ->post('/delete_file', 'deleteFile')
;
$app->mount($sincronizareTipuri);

$testCtrl= new MicroCollection();
$testCtrl
    ->setHandler(TestController::class)
    ->setLazy(true)
    ->get('/test1', 'test1')
;
$app->mount($testCtrl);

$app->notFound(
    function () use ($app) {
        $app->response->setStatusCode(404);
        $message = 'Hmm...This is crazy, but this page was not found!';
        $app->response->setContent($message);
        !$app->response->isSent() && $app->response->send();
        exit;
    }
);

try {

$app->handle(
    $_SERVER["REQUEST_URI"]
);
}
catch (Exception $e) {
    //echo $e->getMessage();
    $response = new Response();
    $responce = new stdClass();
    $responce->status="error";
    $responce->message=$e->getMessage();
     $app->response->setStatusCode(500, 'Internal Server Error')
                ->setJsonContent($responce)
                ->send();
}
