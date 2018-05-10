<?php


namespace WANGHORN\Entity\Password;

use Sm\Core\Context\Context;
use Sm\Core\Resolvable\Resolvable;
use Sm\Data\Entity\ContextualizedEntityProxy;
use Sm\Data\Entity\EntityHasPrimaryModelTrait;
use WANGHORN\Entity\Entity;

class Password extends Entity implements Resolvable {
    use EntityHasPrimaryModelTrait {
        find as _find;
    }
    
    /**
     * Save the Entity
     *
     * @param array $attributes The properties that we want to se on this Entity
     *
     * @return mixed
     */
    public function save($attributes = []) { }
    public function proxyInContext(Context $context): ?ContextualizedEntityProxy {
        return new PasswordEntityProxy($this, $context);
    }
    public function jsonSerialize() {
        return false;
    }
    public function destroy() { }
    /**
     * Get the end value of a Resolvable
     *
     * @return mixed
     */
    public function resolve() {
        return $this->properties->password->resolve();
    }
}