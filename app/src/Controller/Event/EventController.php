<?php

namespace WANGHORN\Controller\Event;


use DateInterval;
use DateTime;
use Sm\Core\Util;
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
			$description   = 'Event Description -- ' . Util::generateRandomString(rand(100, 1000),
			                                                                      Util::ALPHA_ALL . ':&');
			$description   = str_replace([':', '&'], [' ', "\n"], $description);
			$description   = join("\n\n", str_split($description, rand(100, 300)));
			$description   = preg_replace('/([a-z]+[A-Z]{1})/', '$1 ', $description);
			$description   = preg_replace("/\n{2,}/", "\n\n", $description);
			$arr[]         = [
				'id'          => $i,
				'title'       => 'Example Event ' . $i,
				'start_dt'    => $start->format(DATE_ISO8601),
				'end_dt'      => $this->randomDatetime($start)->format(DATE_ISO8601),
				'description' => str_replace("\n\n", '<br><br>', $description)
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