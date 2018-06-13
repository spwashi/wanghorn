<?php
/**
 * Created by PhpStorm.
 * User: sam
 * Date: 6/12/18
 * Time: 4:38 PM
 */

namespace WANGHORN\Controller\Event;


use DateInterval;
use DateTime;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\AppController;
class EventController extends AppController {
	public function create() {
		return HttpRequestFromEnvironment::getRequestData();
	}

	/**
	 * @return array
	 */
	public function all() {
		$arr = [];
		foreach (range(1, 10) as $i) {
			$interval_spec = '' . ($i + rand(2, 3)) . ' day';
			$interval      = DateInterval::createFromDateString($interval_spec);
			$start         = $this->randomDatetime()->add($interval);
			$arr[]         = [
				'id'          => $i,
				'title'       => 'Example Event ' . $i,
				'start_dt'    => $start->format(DATE_ISO8601),
				'end_dt'      => $this->randomDatetime($start)->format(DATE_ISO8601),
				'description' => 'Event Description'
			];
		}
		return $arr;
	}
	/**
	 * @param DateTime|null $datetime
	 * @return DateTime
	 */
	protected function randomDatetime(DateTime $datetime = null) {
		$interval = \DateInterval::createFromDateString('' . rand(1, 5) . ' hours');
		$dateTime = $datetime ?? new DateTime;
		return $dateTime->add($interval);
	}
}