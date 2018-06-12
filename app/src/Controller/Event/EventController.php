<?php
/**
 * Created by PhpStorm.
 * User: sam
 * Date: 6/12/18
 * Time: 4:38 PM
 */

namespace WANGHORN\Controller\Event;


use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\AppController;
class EventController extends AppController {
	public function create() {
		return HttpRequestFromEnvironment::getRequestData();
	}

	public function all() {
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
}