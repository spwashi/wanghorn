<?php
/**
 * Created by PhpStorm.
 * User: sam
 * Date: 6/14/18
 * Time: 4:24 PM
 */

namespace WANGHORN\Entity\Event;


use Sm\Core\Context\Context;
use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Resolvable\Exception\UnresolvableException;
use Sm\Core\Resolvable\Resolvable;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\Validation\EntityValidationResult;
use WANGHORN\Entity\Entity\Entity;

class Event extends Entity {
	use EntityHasPrimaryModelTrait;

	public function save($attributes = []) {
		throw new UnimplementedError("Can't save Events yet");
	}
	public function find($identity = [], Context $context = null) {
		if (is_string($identity) || $identity instanceof Resolvable) {
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
		$result = $this->createPrimaryModel($context, $attributes);
		return $result;
	}
	public function destroy() {
		throw new UnimplementedError("Can't destroy events yet");
	}
}