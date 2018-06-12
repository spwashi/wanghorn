<?php

namespace WANGHORN\Controller\Home;

use Sm\Data\Model\Model;
use Sm\Modules\View\Twig\TwigView;
use WANGHORN\Controller\AppController;
use WANGHORN\Model\Property;

/**
 * Class Home
 *
 * The controller that contains the core of the application logic.
 */
class HomeController extends AppController {
	/**
	 * @return string
	 * @throws \Sm\Core\Exception\UnimplementedError
	 * @throws \Sm\Core\Exception\InvalidArgumentException
	 */
	public function index() {
		$html_filename = APP__NAME . '.html';
		/** @var \Sm\Data\Entity\EntitySchematic $userSchematic */
		$context_name  = 'signup_process';
		$entityContext = $this->controller('User\\User@resolveContext')->resolve($context_name);
		$userProxy     = $this->controller('User\\User@findSessionUser')->resolve();
		$tags          = [
			$this->wrapWithScriptTag($entityContext, "context__{$context_name}--configuration"),
			$this->wrapWithScriptTag($userProxy, "session__user"),
		];
		return $this->app->representation->render(TwigView::class, $html_filename, ['inject' => join("\n", array_filter($tags))]);
	}
	/**
	 * @return string
	 * @throws \Sm\Core\Exception\InvalidArgumentException
	 * @throws \Sm\Core\Exception\UnimplementedError
	 */
	public function test() {
		$application         = $this->app;
		$representationLayer = $application->representation;
		$dataLayer           = $application->data;

		/** @var \Sm\Data\Model\ModelDataManager $model_manager */
		$model_manager = $dataLayer->getDataManager(Model::class);

		$model = new Model;

		$model_manager->persistenceManager->find($model);

		# -- rendering

		$vars     = ['path_to_site' => $this->app->path,];
		$rendered = $representationLayer->render('hello.twig', $vars);

		#

		return $rendered;
	}

	public function events() {
		return [
			[
				'id'          => 1,
				'title'       => 'Example Event 1',
				'start_dt'    => ((new \DateTime)->add(\DateInterval::createFromDateString('' . rand(1, 5) . ' hours')))->format(DATE_ISO8601),
				'end_dt'      => ((new \DateTime)->add(\DateInterval::createFromDateString('' . rand(5, 24) . ' hours')))->format(DATE_ISO8601),
				'description' => 'Event Description'
			],
			[
				'id'          => 2,
				'title'       => 'This is an example of an event description',
				'start_dt'    => ((new \DateTime)->add(\DateInterval::createFromDateString('' . rand(1, 5) . ' hours')))->format(DATE_ISO8601),
				'end_dt'      => ((new \DateTime)->add(\DateInterval::createFromDateString('' . rand(10, 36) . ' hours')))->format(DATE_ISO8601),
				'description' => 'Event Description'
			],
			[
				'id'          => 3,
				'title'       => 'Example Event 3',
				'start_dt'    => ((new \DateTime)->add(\DateInterval::createFromDateString('' . rand(-30, -10) . ' hours')))->format(DATE_ISO8601),
				'end_dt'      => ((new \DateTime)->add(\DateInterval::createFromDateString('' . rand(-10, 0) . ' hours')))->format(DATE_ISO8601),
				'description' => 'Event Description'
			],
			[
				'id'          => 4,
				'title'       => 'Example Event 4',
				'start_dt'    => ((new \DateTime)->add(\DateInterval::createFromDateString('' . rand(1, 5) . ' hours')))->format(DATE_ISO8601),
				'end_dt'      => ((new \DateTime)->add(\DateInterval::createFromDateString('' . rand(5, 10) . ' hours')))->format(DATE_ISO8601),
				'description' => 'Event Description'
			],
		];
	}

	public function gallery() {
		$file_get_contents = file_get_contents(__DIR__ . '/projects.json');
		$json_decode       = json_decode($file_get_contents, 1);
		return $json_decode;
	}

	private function wrapWithScriptTag($items, $id = null) {
		if (isset($items)) {
			$encoded = json_encode($items);
			return "<script type='application/json' id='{$id}'>{$encoded}</script>";
		}
		return '';
	}
}