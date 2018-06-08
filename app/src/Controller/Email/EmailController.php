<?php

namespace WANGHORN\Controller\Email;

use Sm\Application\Application;
use Sm\Communication\CommunicationLayer;
use Sm\Modules\Network\Http\Request\HttpRequestDescriptor;
use WANGHORN\Controller\AppController;


class EmailController extends AppController {
	public function tmp() {
		$parameters = ['signup_nonce' => 'oogabooga'];
		$route_name = 'user--signup_continue';
		return [$this->routeAsLink($route_name, $parameters)];
	}

	/**
	 * @throws \Sm\Core\Context\Layer\Module\Exception\MissingModuleException
	 */
	public function test() {
		$communicationLayer = $this->app->communication;
		$link               = APP__URL__ROOT;

		try {
			$requestDescriptor = $communicationLayer->getRoute('user--signup_continue')->getRequestDescriptor();
			if ($requestDescriptor instanceof HttpRequestDescriptor) {
				$link .= $requestDescriptor->asUrlPath(['signup_nonce' => 'oogabooga']);
			}
		} catch (\Exception $exception) {
		}

		$from       = ['support@spwashi.com', 'Spwashi Support Team'];
		$reply_to   = ['sam@spwashi.com', 'Sam Washington'];
		$subject    = 'This is a Test!';
		$html       = "Hello!<br> <a href='{$link}'>Click Here to continue</a>";
		$plain_text = 'Hey there';
		$recipients = [['percy@spwashi.com', 'Percy Washington'],['samgineer@gmail.com','Sam Washington'], ['Spwashi', 'sam@spwashi.com']];
		$this->sendEmail($subject, $html, $plain_text, $from, $recipients, $reply_to);
	}

	/**
	 * @param string     $subject
	 * @param            $html
	 * @param            $plain_text
	 * @param array      $from
	 * @param array      $recipients
	 * @param array|null $reply_to
	 * @return \Sm\Modules\Communication\Email\Email
	 * @throws \Sm\Core\Context\Layer\Module\Exception\MissingModuleException
	 */
	public function sendEmail(string $subject, $html, $plain_text, array $from, array $recipients, array $reply_to = null) {
		$reply_to = $reply_to ?? $from;
		return $this->app->communication->email()
		                                ->initialize($from, $reply_to)
			//
			                            ->setSubject($subject)
		                                ->setPlaintextContent($plain_text)
		                                ->setContent($html)
			//
			                            ->send($recipients);
	}
}