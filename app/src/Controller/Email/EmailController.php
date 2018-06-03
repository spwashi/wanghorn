<?php

namespace WANGHORN\Controller\Email;

use PHPMailer\PHPMailer\PHPMailer;
use Sm\Application\Application;
use Sm\Core\Exception\Error;
use Sm\Modules\Network\Http\Request\HttpRequestDescriptor;
use WANGHORN\Controller\AppController;


class EmailController extends AppController {
    private $imgResolutionDir;
    private $mailInstance;
    public function __construct() {
        parent::__construct();
        $username = '';
        $password = '';
        ##
        $this->mailInstance = $this->setUp('smtp.gmail.com', 587, $username, $password);
    }
    public function getInstance() {
        if (isset($this->mailInstance)) {
            $clone            = clone $this->mailInstance;
            $clone->SMTPDebug = $this->app->environmentIs(Application::ENV_DEV) ? 2 : 0;
            return $clone;
        }
        throw new Error("No instance available");
    }
    
    public function setUp($host, $port, $username, $password) {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = $host;
        $mail->Port       = $port;
        $mail->SMTPSecure = 'tls';
        $mail->SMTPAuth   = true;
        $mail->Username   = $username;
        $mail->Password   = $password;
        return $mail;
    }
    
    public function sendEmail(PHPMailer $mail,
                              array $from,
                              array $reply_to,
                              array $to,
                              string $html_body,
                              string $plain_txt_body = '',
                              $subject) {
        $mail->setFrom(...$from);
        $mail->addReplyTo(...$reply_to);
        $mail->addAddress(...$to);
        $mail->Subject = $subject;
        $mail->msgHTML($html_body, $this->imgResolutionDir);
        $mail->AltBody = $plain_txt_body;
        
        $results = [ 'success' => false ];
        ob_start();
        try {
            $mail->send();
            $results['success'] = true;
        } catch (\Exception $e) {
            $results['success'] = false;
            if ($this->app->environmentIs(Application::ENV_DEV)) {
                $results['output'] = explode("\n", ob_get_contents());
            }
            return $results;
        } finally {
            ob_end_clean();
        }
        try {
            $results['saved_email'] = $this->save_mail($mail);
        } catch (\Exception $e) {
            $results['saved_email'] = false;
        }
        return $results;
    }
    
    public function completeTest($nonce = null) {
        return "Received Nonce: {$nonce}";
    }
    public function tmp() {
        $parameters = [ 'signup_nonce' => 'oogabooga' ];
        $route_name = 'user--signup_continue';
        return [ $this->routeAsLink($route_name, $parameters) ];
    }
    public function test() {
        $mail = $this->getInstance();
        ##
        $reply_to = [ 'support@spwashi.com', 'Spwashi Support' ];
        $from     = [ 'support@spwashi.com', 'Spwashi Support Team' ];
        $send_to  = [ 'sam@spwashi.com', 'Sam Washington' ];
        ##
        $communicationLayer = $this->app->communication;
        $link               = APP__URL__ROOT;
        
        try {
            $requestDescriptor = $communicationLayer->getRoute('user--signup_continue')->getRequestDescriptor();
            if ($requestDescriptor instanceof HttpRequestDescriptor) {
                $link .= $requestDescriptor->asUrlPath([ 'signup_nonce' => 'oogabooga' ]);
            }
        } catch (\Exception $exception) {
        }
        $html      = "Hello!<br> <a href='{$link}'>Click Here to continue</a>";
        $plain_txt = 'Hey there';
        $subject   = 'This is a Test!';
        ##
        return $this->sendEmail($mail,
                                $from,
                                $reply_to,
                                $send_to,
                                $html,
                                $plain_txt,
                                $subject);
    }
    function save_mail(PHPMailer $mail) {
        //You can change 'Sent Mail' to any other folder or tag
        $path = "{imap.gmail.com:993/imap/ssl}[Gmail]/Sent Mail";
        
        //Tell your server to open an IMAP connection using the same username and password as you used for SMTP
        $imapStream = imap_open($path, $mail->Username, $mail->Password);
        $result     = imap_append($imapStream, $path, $mail->getSentMIMEMessage());
        
        imap_close($imapStream);
        return $result;
    }
}