<?php

namespace WANGHORN\Entity\Event;


use Sm\Core\Context\Context;
use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Resolvable\Exception\UnresolvableException;
use Sm\Core\Resolvable\Resolvable;
use Sm\Data\Entity\Context\EntityModificationContext;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\Validation\EntityValidationResult;
use WANGHORN\Entity\Entity\Entity;

class Event extends Entity {
	use EntityHasPrimaryModelTrait;

	public function save($attributes = [], Context $context = null) {
		$context = $context ?? new EntityModificationContext;
		return $this->savePrimaryModel($context, $attributes);
	}
	public function find($identity = [], Context $context = null) {
		if (is_scalar($identity) || $identity instanceof Resolvable) {
			$index      = is_numeric($identity) ? 'id' : 'name';
			$attributes = [$index => $identity];
		} else if (is_array($identity)) {
			$attributes = $identity;
		} else {
			throw new UnresolvableException("Could not resolve event name");
		}

		$this->findPrimaryModel($attributes, $context);
		$this->fillPropertyValue($this->properties->event_name);
		return $this;
	}
	public function create(Context $context = null, $attributes = []): EntityValidationResult {
		return $this->createPrimaryModel($context, $attributes);
	}
	public function destroy() {
		throw new UnimplementedError("Can't destroy events yet");
	}
}