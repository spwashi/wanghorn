<?php


namespace WANGHORN\Model\Password\Property;


use Sm\Core\Context\Context;
use Sm\Core\Exception\InvalidArgumentException;
use Sm\Core\Schema\Schematic;
use Sm\Data\Property\Context\PropertyContainerProxy;
use Sm\Data\Property\Property;
use Sm\Data\Property\PropertyContainer;
use Sm\Data\Property\PropertySchema;
use Sm\Data\Property\PropertySchematic;
use WANGHORN\Model\Password\Context\Property\HashedPassword;
use WANGHORN\Model\Password\Context\Property\UnhashedPassword;
use WANGHORN\Model\Password\Property\Context\PasswordPropertyContainerProxy;

class PasswordPropertyContainer extends PropertyContainer {
    public function proxy(Context $context = null): PropertyContainerProxy {
        return PasswordPropertyContainerProxy::init($this, $context);
    }
    public function register($name = null, $registrant = null) {
        if (is_iterable($name)) return parent::register($name);

        if ($name === 'password') {
            if ((!$registrant instanceof HashedPassword) && (!$registrant instanceof UnhashedPassword)) {
                throw new InvalidArgumentException("Should only register Hashed or UnhashedPasswords");
            }
        }

        return parent::register($name, $registrant);
    }
    public function instantiate($schematic = null): Property {
        if ((is_string($schematic) && $name = $schematic) || ($schematic instanceof PropertySchema && $name = $schematic->getName())) {
            if ($name === 'password') {
                return new UnhashedPassword;
            }
        }
        return parent::instantiate($schematic);
    }

}