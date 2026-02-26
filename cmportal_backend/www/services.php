<?php
use Phalcon\Db\Adapter\Pdo\Postgresql;
use Dotenv\Dotenv;

// Load .env file
$dotenv = Dotenv::createImmutable(BASE_PATH);
$dotenv->load();

$di->setShared('db', function () {
    return new Postgresql([
        'host'     => $_ENV['DB_HOST'],
        'port'     => $_ENV['DB_PORT'],
        'username' => $_ENV['DB_USER'],
        'password' => $_ENV['DB_PASS'],
        'dbname'   => $_ENV['DB_NAME'],
        'charset'  => 'utf8'
    ]);
});

$di->setShared('view', function () {
    $view = new \Phalcon\Mvc\View();
    $view->setViewsDir(APP_PATH . '/views/');
    return $view;
});

$di->setShared('loader', function () {
    $loader = new \Phalcon\Autoload\Loader();
    $loader->setNamespaces([
        'App\Controllers' => APP_PATH . '/controllers/',
        'App\Models'      => APP_PATH . '/models/',
    ]);
    $loader->register();
    return $loader;
});
