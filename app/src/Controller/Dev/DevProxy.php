<?php


namespace WANGHORN\Controller\Dev;


use Sm\Controller\ControllerProxy;

class DevProxy extends ControllerProxy {
    protected $can_access;
    
    public function __call($name, $args = []) {
        if (!$this->can_access) return null;
        return parent::__call($name, $args);
    }
    /**
     * @param mixed $can_access
     *
     * @return DevProxy
     */
    public function setCanAccess($can_access) {
        $this->can_access = $can_access;
        return $this;
}
}