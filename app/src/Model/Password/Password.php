<?php


namespace WANGHORN\Model\Password;


use Sm\Core\Context\Context;
use Sm\Data\Model\Context\ContextualizedModelProxy;
use Sm\Data\Model\Context\ModelCreationContext;
use WANGHORN\Model\Model;
use WANGHORN\Model\Password\Context\PasswordCreationProxy;
use WANGHORN\Model\Password\Property\PasswordPropertyContainer;


class Password extends Model {

    public function proxy(Context $context = null): ContextualizedModelProxy {
        if ($context instanceof ModelCreationContext) return new PasswordCreationProxy($this, $context);
        return parent::proxy($context);
    }
    protected function instantiatePropertyContainer() {
        return new PasswordPropertyContainer;
    }
}