<?php
namespace App\Controllers;

use Phalcon\Mvc\Controller;

class IndexController extends Controller
{
    public function indexAction()
    {
        // $this->view->disable();
        echo "<h1>Phalcon 5.9.3 is working!</h1>";
        echo "<p>PostgreSQL 17.6 connection OK!</p>";
        echo "<p>Nginx + PHP-FPM active!</p>";
    }
}
