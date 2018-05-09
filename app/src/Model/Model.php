<?php


namespace WANGHORN\Model;


class Model extends \Sm\Data\Model\Model {
    public function validate() {
        /**
         * @var  \WANGHORN\Model\Property $property
         */
        foreach ($this->properties as $property) {
            $property->validate();
        }
    }
}