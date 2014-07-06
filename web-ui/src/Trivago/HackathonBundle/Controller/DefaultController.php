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

        if($route == 'search') {

            $array = array();
            foreach($request->query->all() as $key => $value) {

                if($key == 'callback' || $key == '_') {
                    continue;
                }

                $array[$key] = $value;
            }

            return $this->getResponsePostFake($callback, $route, $array);
        }

        $response = new JsonResponse(json_decode(file_get_contents('http://' . static::PROXY . '/Webservice/' . $route), true), 200);
        $response->setCallback($callback);

        return $response;
    }

    private function getResponsePostFake($callback, $route, array $array)
    {

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, 'http://' . static::PROXY . '/Webservice/' . $route);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        //curl_setopt($ch, CURLOPT_POSTFIELDS, '{"kmPerDay":10,"startDate":1404580320186,"position":{"lat":100.0,"lon":10.0},"priceRange":{"min":20,"max":100}};');

        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($array));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

        $result = curl_exec($ch);

        $response = new JsonResponse(json_decode($result, true), 200);
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

    public function hotelResultsAction() {

        $items = array(
            array(
                'name' => 'Hotel foo',
                'image' => 'http://lorempixel.com/400/200',
                'description' => 'fooo',
                'link' => 'http://www.google.de',
            ),
            array(
                'name' => 'Hotel foo',
                'image' => 'http://lorempixel.com/400/200',
                'description' => 'foo',
                'link' => 'http://www.google.de',
            ),
        );

        return $this->render('TrivagoHackathonBundle:Default:hotel_results.html.twig', array(
            'items' => $items,
        ));

    }

    public function hotelResultsPostAction(Request $request) {


        $items = array();
        $hotels = $request->request->get('hotels');

        foreach($hotels as $hotel) {
            $items[] = array(
                'name' => 'Hotel foo id:' . $hotel['id'],
                'image' => 'http://lorempixel.com/400/200',
                'description' => 'fooo',
            );
        }

        return $this->render('TrivagoHackathonBundle:Default:hotel_results.html.twig', array(
            'items' => $items,
        ));

    }

}
