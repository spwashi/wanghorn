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
        
        $from       = [ 'sam@spwashi.com', 'Spwashi Support Team' ];
        $reply_to   = [ 'sam@spwashi.com', 'Spwashi Support Team' ];
        $subject    = 'This is a Test!';
        $html       = "Hello!<br> <a href='{$link}'>Click Here to continue</a>";
        $plain_text = 'Hey there';
        $recipients = [
            [ 'sam@spwashi.com', 'Sam Washington' ],
        ];
    }
    public function sendEmail(string $subject, $html, $plain_text, array $from, array $recipients, array $reply_to = null) {
        $reply_to = $reply_to ?? $from;
        $is_debug = $this->app->environmentIs(Application::ENV_DEV);
        return Gmail::init()
                    ->initialize($from, $reply_to)
                    ->setDebug($is_debug)
                    ->setSubject($subject)
                    ->setPlaintextContent($html)
                    ->setContent($plain_text)
                    ->send(...$recipients);
    }
}