<?php


namespace WANGHORN\Controller\File;


use Sm\Application\Application;
use Sm\Controller\ControllerProxy;

class FileControllerProxy extends ControllerProxy {
    /** @var \WANGHORN\Controller\File\FileController */
    protected $subject;
    
    public function __call($name, $args = []) {
        switch ($name) {
            case 'prime':
                if (!$this->hasValidLocation()) {
                    return [
                        'success' => false,
                        'message' => 'Could not write file' . ($this->subject->app->environmentIs(Application::ENV_DEV) ? ' (presumably to ' . APP__FILE_UPLOAD_PATH . ')' : ''),
                    ];
                }
        }
        return parent::__call($name, $args);
    }
    public function hasValidLocation() {
        try {
            $this->subject->getFilesystemStorage();
            return true;
        } catch (\InvalidArgumentException $e) {
            return false;
        }
    }
}