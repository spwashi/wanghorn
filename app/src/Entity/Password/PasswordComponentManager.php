<?php


namespace WANGHORN\Entity\Password;


use Sm\Core\Context\Context;
use Sm\Data\Model\Context\ModelPersistenceContext;
use Sm\Data\Model\ModelInstance;
use WANGHORN\Model\Password\Context\Property\HashedPassword;

class PasswordComponentManager extends \Sm\Data\Entity\Component\ComponentManager {
    protected function derivePropertyForModelFromEntity($name, ModelInstance $model = NULL, Context $context = null) {
        $property = parent::derivePropertyForModelFromEntity($name, $model, $context);
        if ($name === 'password' && $context instanceof ModelPersistenceContext) {
            $generic_property = $property;
            $property         = (new HashedPassword)->setUnhashedPassword($generic_property->value);
            return $property;
        }
        return $property;
    }

}