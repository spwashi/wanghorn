<?php

namespace WANGHORN\Controller\Email;

use Sm\Application\Application;
use Sm\Modules\Network\Http\Request\HttpRequestDescriptor;
use WANGHORN\Controller\AppController;


class EmailController extends AppController {
    public function tmp() {
        $parameters = [ 'signup_nonce' => 'oogabooga' ];
        $route_name = 'user--signup_continue';
        return [ $this->routeAsLink($route_name, $parameters) ];
    }
    public function test() {
        $communicationLayer = $this->app->communication;
        $link               = APP__URL__ROOT;
        
        try {
            $requestDescriptor = $communicationLayer->getRoute('user--signup_continue')->getRequestDescriptor();
            if ($requestDescriptor instanceof HttpRequestDescriptor) {
                $link .= $requestDescriptor->asUrlPath([ 'signup_nonce' => 'oogabooga' ]);
            }
        } catch (\Exception $exception) {
        }
        
        Gmail::init()
             ->initialize([ 'sam@spwashi.com', 'Spwashi Support Team' ])
             ->setDebug($this->app->environmentIs(Application::ENV_DEV))
             ->setSubject('This is a Test!')
             ->setPlaintextContent("Hello!<br> <a href='{$link}'>Click Here to continue</a>")
             ->setContent('Hey there')
             ->send([ 'sam@spwashi.com', 'Sam Washington' ])
             ->save();
    }
}