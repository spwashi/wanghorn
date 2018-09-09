<?php


namespace WANGHORN\Entity\User\Verification;

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
class UserVerification extends Entity implements Resolvable {
    protected $internal = [];
    use EntityHasPrimaryModelTrait {
        getPropertiesForModel as gProps;
    }

    #
    ##  Resolution
    public function resolve() {
        /** @var \Sm\Data\Entity\Property\EntityProperty $verificationHash */
        $verificationHash = $this->properties->hash;
        return $verificationHash->resolve();
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
    protected function getPropertiesForModel(\Sm\Data\Entity\Entity $entity, Context $context = null): array {
        $properties = $this->gProps($entity);
        if ($context instanceof EntityCreationContext) {
            $properties['hash'] = md5(date('mdy') . date('mdy') . microtime());
        }
        return $properties;
    }

    #
    ##  Validation
    public function validate(Context $context = null): ValidationResult {
        if ($context instanceof EntityCreationContext) {
            /** @var \Sm\Data\Entity\Property\EntityProperty $verificationHash */
            $verificationHash        = $this->properties->hash;
            $value_validation_result = $verificationHash->validate();
            $isSuccess               = $value_validation_result ? $value_validation_result->isSuccess() : true;

            if ($isSuccess) {
                return new EntityValidationResult($isSuccess,
                                                  'VerificationHash is the right length',
                                                  ['verificationHash' => $value_validation_result]);
            }

            return new EntityValidationResult($isSuccess,
                                              $value_validation_result->getMessage(),
                                              [
                                                  'verificationHash' => $value_validation_result,
                                              ]);
        }
        return new EntityValidationResult(false, get_class($context));
    }

    #
    ##  Contextualization]
    /**
     * @param Context|null $context
     * @return UserVerificationProxy|EntitySchema
     * @throws \Sm\Core\Exception\InvalidArgumentException
     */
    public function proxyInContext(Context $context = null): ?EntitySchema {
        return new UserVerificationProxy($this, $context);
    }

    #
    ##  Serialization
    public function jsonSerialize() {
        /** @var \DateTime $creationDatetime */
        $creationDatetime = $this->persistedIdentity && !($this->persistedIdentity instanceof Schematic) ? $this->persistedIdentity->properties->creation_dt->resolve() : null;
        $is_expired       = $creationDatetime && !$creationDatetime instanceof Undefined_ && $creationDatetime->diff(new \DateTime)->days >= 3;
        $response         = new UserVerificationStatusResponse;
        $response->setIsExpired($is_expired);
        return $response;
    }
}