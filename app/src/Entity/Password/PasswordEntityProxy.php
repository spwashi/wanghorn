<?php


namespace WANGHORN\Entity\Password;


use Sm\Data\Entity\ContextualizedEntityProxy;

class PasswordEntityProxy extends ContextualizedEntityProxy {
    public function jsonSerialize() {
        return '*********';
    }
}