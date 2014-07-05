<?php

namespace Trivago\HackathonBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{

    const PROXY = '192.168.245.141:8080';

    public function indexAction()
    {
        return $this->render('TrivagoHackathonBundle:Default:index.html.twig');
    }

    public function proxyGetAction(Request $request)
    {

        $callback = $request->get('callback');
        $route = $request->get('route');

        $response = new JsonResponse(json_decode(file_get_contents('http://' . static::PROXY . '/Webservice/' . $route), true), 200);
        $response->setCallback($callback);

        return $response;
    }

    public function proxyPostAction(Request $request)
    {

        $callback = $request->get('callback');
        $route = $request->get('route');

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, 'http://' . static::PROXY . '/Webservice/' . $route);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        //curl_setopt($ch, CURLOPT_POSTFIELDS, '{"kmPerDay":10,"startDate":1404580320186,"position":{"lat":100.0,"lon":10.0},"priceRange":{"min":20,"max":100}};');

        curl_setopt($ch, CURLOPT_POSTFIELDS, $request->getContent());
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

        $result = curl_exec($ch);

        $response = new JsonResponse(json_decode($result, true), 200);
        $response->setCallback($callback);

        return $response;
    }
}
