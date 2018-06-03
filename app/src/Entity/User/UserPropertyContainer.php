<?php


namespace WANGHORN\Entity\User;


use Sm\Core\Exception\UnimplementedError;
use Sm\Data\Property\PropertyContainer;

/**
 * Class UserPropertyContainer
 *
 * @property \Sm\Data\Property\Property                $id
 * @property \Sm\Data\Property\Property                $username
 * @property \Sm\Data\Entity\Property\EntityAsProperty $password
 */
class UserPropertyContainer extends PropertyContainer {
    public function __construct() {
        throw new UnimplementedError("We don't actually use this");
    }
}