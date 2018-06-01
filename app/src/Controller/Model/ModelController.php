<?php


namespace WANGHORN\Controller\Model;


use Sm\Modules\Network\Http\Request\HttpRequestFromEnvironment;
use WANGHORN\Controller\AppController;
use WANGHORN\Model\Model;

class ModelController extends AppController {
    public function createWithData(string $model_name, array $data = []) {
        /** @var \WANGHORN\Model\Model $model */
        $model      = $this->app->data->models->instantiate($model_name);
        $properties = $data;
        foreach ($properties as $key => $value) {
            /** @var \WANGHORN\Model\Property $property */
            $property = $model->properties->{$key};
            if (!$property) {
                return [
                    'success' => false,
                    'message' => [
                        '_message' => 'Could not save model',
                        $key       => 'Property does not exist',
                    ],
                ];
            }
            $property->setDoStrictResolve(true);
            $property->value = $value;
        }
        
        $modelPersistenceManager = $this->app->data->models->persistenceManager;
        $modelPersistenceManager->create($model);
        /** @var Model $newModel */
        $newModel      = $modelPersistenceManager->find($model);
        $id            = $newModel->properties->id->value;
        $wasSuccessful = isset($id);
        
        $all = [];
        foreach ($newModel->properties as $resolution) {
            $all[] = $resolution;
        }
        
        return [
            'success' => $wasSuccessful,
            'message' => [ '_message' => $wasSuccessful ? 'Successfully Created Model' : 'Could not create Model' ],
            'model'   => $wasSuccessful ? $newModel : $model,
        ];
    }
    
    // URL accessible
    public function create($model_name) {
        switch ($model_name) {
            case 'user':
                return $this->createWithData($model_name, HttpRequestFromEnvironment::getRequestData()['properties'] ?? []);
            default:
                return [
                    'success' => false,
                    'message' => 'Cannot create models of this type yet',
                ];
        }
    }
    
    public function createBatch($model_name) {
        return [
            'success' => false,
            'message' => [ '_message' => 'Unimplemented' ],
        ];
    }
}