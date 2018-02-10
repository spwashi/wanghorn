<?php


namespace WANGHORN\Entity;


use Sm\Core\Internal\Monitor\HasMonitorTrait;
use Sm\Core\Internal\Monitor\Monitored;

abstract class Entity extends \Sm\Data\Entity\Entity implements Monitored {
    use HasMonitorTrait;
    public function jsonSerialize() {
        return
            parent::jsonSerialize() + [
                'monitors' => $this->getMonitorContainer(),
            ];
    }
}