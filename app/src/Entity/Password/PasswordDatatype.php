<?php


namespace WANGHORN\Entity\Password;


use Sm\Core\Resolvable\Resolvable;
use Sm\Core\Resolvable\StringResolvable;
use Sm\Core\Util;
use Sm\Data\Type\Exception\CannotCastException;
use Sm\Data\Type\String_;

class PasswordDatatype extends String_ {
  public function jsonSerialize() {
    return '*********';
  }
  public function setSubject($subject) {
    if (is_string($subject) || $subject instanceof StringResolvable || !isset($subject)) {
      return parent::setSubject($subject);
    }

    throw new CannotCastException("Cannot set password to anything but a string (" . Util::getShape($subject) . ' given)');
  }

  public function resolve($_ = NULL) {
    return $this->subject;
  }
}