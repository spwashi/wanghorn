<?php

namespace WANGHORN\Controller\Entity\Image;

use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\AppController;

class ImageController extends AppController {
    public function create() {
        $requestData = HttpRequestFromEnvironment::getRequestData();
        
        $messages   = $requestData['messages'] ?? null;
        $messages   = $this->getCreationStatusMessages($requestData, $messages);
        $properties = $requestData['properties'] ?? null;
        
        $file         = $this->app->controller->createControllerResolvable('File\\File@fileFromSession')->resolve($properties['file']);
        $imageCreator = $this->app->controller->createControllerResolvable('Model\\Model@createWithData');
        $userProxy    = $this->app->controller->createControllerResolvable('User\\User@findSessionUser')->resolve();
        
        $user_id = null;
        if ($userProxy) {
            return [
                $userProxy,
            ];
        }
        
        return $imageCreator->resolve('image',
                                      [
                                          'readable_name'    => $properties['filename'] ?? null,
                                          'name'             => $file ? $file['name'] : null,
                                          'mime'             => $file ? $file['mime'] : null,
                                          'hash'             => $file ? $file['md5'] : null,
                                          'size'             => $file ? $file['size'] : null,
                                          'file_location_id' => $properties['file_location_id'] ?? 1,
                                      ]);
    }
    /**
     * @param $requestData
     * @param $messages
     *
     * @return mixed
     */
    protected function getCreationStatusMessages($requestData, $messages) {
        $properties = $requestData['properties'] ?? null;
        
        $file = $properties['file'] ?? null;
        $name = $properties['name'] ?? null;
        $url  = $properties['url'] ?? null;
        
        if (isset($name) && @strlen($name) > 0) {
            $messages['name'] = "We actually don't do anything with this yet.";
        }
        
        if (($file && strlen($file)) && ($url && strlen($url))) {
            $messages['file'] =
            $messages['url'] =
                [
                    'success' => false,
                    'message' => 'Please pick either a URL or a File (not both)',
                ];
        } else {
            $messages['file'] =
            $messages['url'] = null;
        }
        return $messages;
    }
}