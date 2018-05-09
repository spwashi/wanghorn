<?php


namespace WANGHORN\Entity;


use Sm\Core\Internal\Monitor\Monitored;

abstract class Entity extends \Sm\Data\Entity\Entity implements Monitored {
    public function jsonSerialize() {
        return parent::jsonSerialize();
    }
    public function initialize() {
        return $this;
    }
}