<?php


namespace WANGHORN\Controller\Dev;


use Sm\Controller\ControllerProxy;

class DevProxy extends ControllerProxy {
    protected $can_access;
    
    public function __call($name, $args = []) {
        //todo should throw error
        if (!$this->canAccess()) return null;
        return parent::__call($name, $args);
    }
    public function canAccess() {
        return $this->can_access;
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