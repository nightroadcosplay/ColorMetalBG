<?php
use Phalcon\Mvc\Router;

$di->setShared('router', function () {
    $router = new Router(false);
    $router->setDefaultNamespace('App\Controllers');
    $router->setDefaultController('index');
    $router->setDefaultAction('index');
    
    $router->add('/', [
        'controller' => 'index',
        'action'     => 'index'
    ]);
    
    return $router;
});
