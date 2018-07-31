<?php


namespace WANGHORN\Model\Password\Context\Property;


use WANGHORN\Model\Property;

/**
 * Password after it has been hashed
 */
class HashedPassword extends Property {
    protected $unhashed_password;
    public function setUnhashedPassword(string $password) {
        $this->setValue(password_hash($password, PASSWORD_BCRYPT));
        $this->unhashed_password = $password;
        return $this;
    }
}