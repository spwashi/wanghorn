<?php


namespace WANGHORN\Controller\User;


use Sm\Application\Controller\BaseApplicationController;
use Sm\Data\Model\ModelNotFoundException;

class UserController extends BaseApplicationController {
    public function login() {
        $email_address = $_POST['username'] ?? null;
        $password      = $_POST['password'] ?? null;
        
        $application = $this->app;
        $dataLayer   = $application->data;
        
        
        # Instantiate a Model that we'll use to find a matching object (or throw an error if it doesn't exist)
        /** @var \WANGHORN\Model\User\User $user_model */
        $user_model                    = $dataLayer->models->instantiate('users');
        $user_model->properties->email = $email_address;
        
        try {
            $dataLayer->models->persistenceManager->find($user_model);
        } catch (ModelNotFoundException $exception) {
            return 'Could not find Model';
        }
        
        echo '<pre>' . json_encode($user_model, JSON_PRETTY_PRINT) . '</pre>';
        
        $html_filename = EXAMPLE_APP__NAME . '.html';
        return $this->app->representation->render($html_filename);
    }
}