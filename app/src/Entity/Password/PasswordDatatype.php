<?php


namespace WANGHORN\Entity\Password;


use Sm\Data\Type\Datatype;
use Sm\Data\Type\Exception\CannotCastException;
use Sm\Data\Type\String_;

class PasswordDatatype extends String_ implements Datatype {
    public function jsonSerialize() {
        return '*********';
    }
    /**
     * @param $subject
     *
     * @return \Sm\Core\Resolvable\Resolvable|static
     * @throws \Sm\Data\Type\Exception\CannotCastException
     */
    public static function resolveType($subject) {
        if (!is_string($subject)) throw new CannotCastException("Wrong type provided");
        return parent::resolveType($subject); // TODO: Change the autogenerated stub
    }
    
    
    /**
     * Get the end value of a Resolvable
     *
     * @param null $_
     *
     * @return mixed
     * @throws \Sm\Data\Type\Exception\CannotCastException
     */
    public function resolve($_ = null) {
        parent::resolve();
        return '**********';
    }
}