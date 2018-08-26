<?php


namespace WANGHORN\Entity\User\Role;

use Sm\Core\Context\Context;
use Sm\Core\Exception\UnimplementedError;
use Sm\Core\Resolvable\Resolvable;
use Sm\Core\Schema\Schematic;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use Sm\Data\Entity\EntitySchema;
use Sm\Data\Entity\Validation\EntityValidationResult;
use Sm\Data\Evaluation\Validation\ValidationResult;
use Sm\Data\Type\Undefined_;
use WANGHORN\Entity\Entity\Entity;
use WANGHORN\Entity\User\Verification\Proxy\UserVerificationProxy;
use WANGHORN\Entity\User\Verification\Response\UserVerificationStatusResponse;


/**
 * Class VerificationHash
 *
 * * Currently hashed using the BCRYPT algorithm
 */
class UserRole extends Entity implements Resolvable {
    protected $internal = [];
    use EntityHasPrimaryModelTrait {
        getPropertiesForModel as gProps;
    }

    #
    ##  Resolution
    public function resolve() {
        /** @var \Sm\Data\Entity\Property\EntityProperty $role */
        $role = $this->properties->role;
        return $role->resolve();
    }

    #
    ##  Initialization/Instantiation
    public function find($attributes = [], Context $context = null) {
        return $this->findPrimaryModel($attributes, $context);
    }

    #
    ##  Persistence
    public function create(Context $context, $attributes = []): ?EntityValidationResult {
        $result                 = $this->createPrimaryModel($context, $attributes);
        $model                  = $this->getPersistedIdentity();
        $this->properties->hash = $model->properties->hash->resolve();
        return $result;
    }
    public function destroy() {
        throw new UnimplementedError("Cannot yet delete verificationHashes");
    }
    public function save($attributes = []) {
        throw new UnimplementedError("Cannot yet update verificationHashes");
    }

    #
    ##  Validation

    #
    ##  Contextualization]

    #
    ##  Serialization
    public function jsonSerialize() {
        return $this->resolve();
    }
}