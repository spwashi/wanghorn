<?php

namespace WANGHORN\Controller\Event;


use DateInterval;
use DateTime;
use Modules\Query\Sql\Exception\CannotDuplicateEntryException;
use Sm\Core\Exception\InvalidArgumentException;
use Sm\Core\Resolvable\Exception\UnresolvableException;
use Sm\Core\Resolvable\Resolvable;
use Sm\Core\Util;
use Sm\Data\Entity\Context\EntityContext;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\Exception\EntityNotFoundException;
use Sm\Data\Entity\Exception\Persistence\CannotCreateEntityException;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\AppController;
use WANGHORN\Entity\Event\Event;
use WANGHORN\Response\ApiResponse;
class EventController extends AppController {
	public function init_entity(): Event {
		return $this->app->data->entities->instantiate('event');
	}
	/**
	 * @param      $context
	 * @param      $identity
	 * @param bool $throw
	 * @return null|Event
	 * @throws EntityNotFoundException
	 */
	public function findEvent($identity, $context = null, $throw = false): ?Event {
		$throw = $throw || isset($_GET['throw']);
		try {
			$entity = $this->find_in_context($identity, $context);

			return $entity;
		} catch (EntityNotFoundException|\Exception $exception) {
			if ($throw) {
				throw $exception;
			}
			return null;
		}
	}

	protected function find_in_context($identity, $context_name = null): Event {
		/** @var Event $eventEntity */
		$eventEntity = $this->init_entity();
		$context     = $this->resolveContext($context_name);
		$eventEntity->find($identity, $context);
		return $eventEntity;
	}

	public function event($id) {
		return $this->findEvent(null, $id);
	}

	public function create() {
		$context = new EntityCreationContext;

		$properties = HttpRequestFromEnvironment::getRequestData()['properties'] ?? [];
		$event      = $this->init_entity();
		$event->set($properties);
		try {
			$event->create($context);
			return $event->properties;
		} catch (CannotDuplicateEntryException $exception) {
			return new ApiResponse(false, 'Event with this name already exists!');
		} catch (CannotCreateEntityException $exception) {
			$failedProperties     = $exception->getFailedProperties();
			$messages             = $failedProperties;
			$messages['_message'] = 'Could not continue';
			return new ApiResponse(false, $messages);
		}


		return new ApiResponse(true, $event->properties);
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