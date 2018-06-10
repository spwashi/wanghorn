<?php


namespace WANGHORN\Entity\User;


use Sm\Core\Exception\UnimplementedError;
use Sm\Data\Entity\Property\EntityAsProperty;
use Sm\Data\Property\Property;
use Sm\Data\Property\PropertyContainer;

/**
 * Class UserPropertyContainer
 *
 * @property Property         $id
 * @property Property         $username
 * @property Property         $email
 * @property EntityAsProperty $password
 * @property EntityAsProperty $verification
 */
class UserPropertyContainer extends PropertyContainer {
	public function __construct() { throw new UnimplementedError("We don't actually use this"); }
}