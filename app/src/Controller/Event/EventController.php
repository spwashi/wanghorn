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
use Sm\Data\Model\Exception\ModelNotFoundException;
use Sm\Data\Model\ModelSchematic;
use Sm\Data\Model\StandardModelPersistenceManager;
use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\AppController;
use WANGHORN\Datatype\Slug;
use WANGHORN\Entity\Entity\Entity;
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
		if (!isset($properties['name'])) {
			if (!isset($properties['title'])) {
				$please_name_event = 'Each event should have a name (we can guess from the title). Please provide at least a name or a title.';
				return new ApiResponse(false, $please_name_event);
			}
			$properties['name'] = Slug::slugify($properties['title'] ?? '');
		}
		$event->set($properties);
		try {
			$event->create($context);
		} catch (CannotDuplicateEntryException $exception) {
			return new ApiResponse(false, 'Event with this name already exists!');
		} catch (CannotCreateEntityException $exception) {
			$failedProperties     = $exception->getFailedProperties();
			$messages             = $failedProperties;
			$messages['_message'] = 'Could not continue';
			return new ApiResponse(false, $messages);
		}


		return new ApiResponse(true, 'Successfully added event');
	}

	/**
	 * @return array
	 */
	public function all() {
		$modelDataManager   = $this->app->data->models;
		$entityDataManager  = $this->app->data->entities;
		$persistenceManager = $modelDataManager->persistenceManager;
		if ($persistenceManager instanceof StandardModelPersistenceManager) {
			$persistenceManager->setFindSafety(false);
		}
		/** @var ModelSchematic $schematic */
		$schematic = $modelDataManager->getSchematicByName('event');
		try {
			$all = $persistenceManager->findAll($schematic);
			$persistenceManager->setFindSafety(true);
			$mapToEntity =
				function ($model) use ($entityDataManager) {
					/** @var Event $entity */
					$entity           = $entityDataManager->instantiate('event');
					$entity           = $entity->fromModel($model);
					$entityProperties = $entity->properties;
					return $entityProperties;
				};
			$ret         = array_map($mapToEntity, $all);
			return $ret;
		} catch (ModelNotFoundException $e) {
			return [];
		}
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