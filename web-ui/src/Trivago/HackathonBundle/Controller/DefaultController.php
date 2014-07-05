<?php

namespace Trivago\HackathonBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('TrivagoHackathonBundle:Default:index.html.twig');
    }
}
