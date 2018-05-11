<?php


namespace WANGHORN\Entity\Password;


use Sm\Data\Entity\ContextualizedEntityProxy;
use Sm\Data\Type\Datatype;

class PasswordDatatype extends ContextualizedEntityProxy implements Datatype {
    public function jsonSerialize() {
        return '*********';
    }
    function setSubject($subject) {
        $this->subject = $subject;
        return $this;
    }
    /**
     * Get the end value of a Resolvable
     *
     * @return mixed
     */
    public function resolve() {
        return '**********';
    }
}