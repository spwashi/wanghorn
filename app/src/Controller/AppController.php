<?php

namespace WANGHORN\Controller;

use InvalidArgumentException;
use Sm\Application\Controller\BaseApplicationController;
use Sm\Data\Entity\Context\EntityContext;
use Sm\Modules\Network\Http\Http;
use Sm\Modules\Network\Http\Request\HttpRequestDescriptor;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;

/**
 * Class AppController
 * @package WANGHORN\Controller
 * @property-read  array $requestData
 */
class AppController extends BaseApplicationController {
	public function __get($name) {
		switch ($name) {
			case 'requestData':
				return $this->resolveRequestData();
		}
		return parent::__get($name); // TODO: Change the autogenerated stub
	}
	public function redirect($name) {
		return $this->app->communication->dispatch(Http::REDIRECT,
		                                           $this->app->communication->getRoute($name));
	}
	public function resolveContext($context_name = null) {
		if ($context_name instanceof EntityContext) {
			return $context_name;
		}

		if (isset($context_name) && !is_string($context_name)) {
			throw new InvalidArgumentException("Cannot find entities within contexts that aren't strings ");
		}

		return EntityContext::init($context_name);
	}
	public function resolveRequestData(): array {
		return HttpRequestFromEnvironment::getRequestData() ?? [];
	}
	protected function controller($controller_identifier): \Sm\Controller\ControllerResolvable {
		return $this->app->controller->createControllerResolvable($controller_identifier);
	}
	public function routeAsLink($route_name, $parameters = []) {
		$requestDescriptor = $this->app->communication->getRoute($route_name)->getRequestDescriptor();
		if ($requestDescriptor instanceof HttpRequestDescriptor) {
			$link = APP__URL__ROOT . $requestDescriptor->asUrlPath($parameters);
		}
		return $link ?? null;
	}
}