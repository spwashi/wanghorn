<?php

use Sm\Application\Application;
use Sm\Core\Sm\Sm;
use Sm\Data\Entity\Context\EntityCreationContext;
use Sm\Data\Entity\Property\EntityAsProperty;
use Sm\Data\Entity\Property\EntityProperty;
use Sm\Data\Entity\Property\EntityPropertyContainer;
use Sm\Data\Type\Undefined_;
use WANGHORN\Entity\Password\Password;
use WANGHORN\Entity\User\User;
use WANGHORN\Response\ApiResponse;

require_once __DIR__ . '/../../app.php';

class StandardUserProcessTest extends \PHPUnit\Framework\TestCase {

    /** @var Application */
    protected $app;

    public function setUp() {
        $this->app = resolveApplication();
    }

    public function testExistsProperly() {
        $user = $this->instantiateUser();
        $this->assertInstanceOf(User::class, $user);

        $property_names = array_keys($user->properties->getAll());
        $this->assertContains('verification', $property_names);
        $this->assertContains('password', $property_names);
        $this->assertContains('email', $property_names);
        $this->assertContains('username', $property_names);

        $this->assertInstanceOf(EntityPropertyContainer::class, $user->properties);
        $this->assertInstanceOf(EntityAsProperty::class, $user->properties->password);
        $this->assertInstanceOf(EntityAsProperty::class, $user->properties->verification);
        $this->assertInstanceOf(EntityProperty::class, $user->properties->username);
        $this->assertInstanceOf(EntityProperty::class, $user->properties->email);

        # we haven't set this yet
        $this->assertInstanceOf(Undefined_::class, $user->properties->password->resolve());
    }

    public function testCanSetProperties() {
        # # # #   initialization   # # # #
        $e_user   = $this->instantiateUser();
        $USERNAME = 'sam_' . \Sm\Core\Util::generateRandomString(4, 'abcdefghijkl');
        $EMAIL    = "{$USERNAME}@wanghorn.site";
        $PASSWORD = str_replace(['s', 'a', 'e', '_'], ['$', '@', '3', '!!'], $USERNAME);

        echo "Setting up test:\n";
        echo "\t- username  :  '{$USERNAME}' \n";
        echo "\t- email     :  '{$EMAIL}' \n";
        echo "\t- password  :  '{$PASSWORD}' \n";
        echo "\n";

        # # # #  SIMPLE PROPERTY GET & SET  # # # #

        ##  Entities receive properties that have been set
        $e_user->properties->email    = $EMAIL;
        $e_user->properties->username = $USERNAME;
        # can resolve properties
        $this->assertEquals($USERNAME, $e_user->properties->username->resolve());
        # check that stringification works
        $this->assertEquals($USERNAME, (string)$e_user->properties->username);
        # same for email
        $this->assertEquals($EMAIL, (string)$e_user->properties->email);


        ##  Model inherits properties of entity
        $m_user = $e_user->components->model;
        # all properties should be based on the Property class we defined for this application
        $this->assertContainsOnlyInstancesOf(\WANGHORN\Model\Property::class, $m_user->properties->getAll());
        # the model username should
        $this->assertEquals($USERNAME, (string)$m_user->properties->username);

        # # # #  COMPLEX PROPERTY  GET & SET  # # # #
        $e_user->properties->password   = $PASSWORD;
        $e_user__p_password             = $e_user->properties->password;
        $_test__password_entity         = $e_user->properties->password->entity;
        $e_user__p_password__e_password = $e_user__p_password->entity;
        $value                          = $e_user__p_password__e_password->components->valueProperty;

        $this->assertInstanceOf(Password::class, $_test__password_entity);

        $this->assertEquals($PASSWORD, (string)$e_user->properties->password->resolve());
        $resolved_in_context = $e_user->properties->proxy(EntityCreationContext::init())->password;
        $this->assertEquals($PASSWORD, $resolved_in_context);

        ##  Can save entity
        $this->print_item($e_user->properties, 'User Entity');
        $this->print_item($m_user->properties, 'User Model');
    }

    public function testCreate() {
        Sm::$globals->server['REQUEST_METHOD'] = 'POST';

        $createUser = $this->app->controller->get('[User]@create');

        /** @var ApiResponse $result__empty */
        $result__empty = $createUser();
        $this->assertInstanceOf(ApiResponse::class, $result__empty);
        $this->assertFalse($result__empty->status); # Should be false because we haven't posted anything


        # Attempt again with a normal password
        $username = 'spiget_' . \Sm\Core\Util::generateRandomString(5, \Sm\Core\Util::ALPHA);
        $password = 'boonboonboon';

        Sm::$globals->post['properties'] = ['username' => $username, 'password' => $password];
        $result__okay                    = $createUser();
        $modelPersistenceManager         = $this->app->data->models->persistenceManager;

        ##  USER
        $user_model = $this->app->data->models->instantiate('user')->set(['username' => $username]);
        $user_id    = $modelPersistenceManager->find($user_model)->properties->id->value;

        /** @var User $e_user */
        $e_user                       = $this->app->data->entities->instantiate('user');
        $e_user->properties->username = $username;
        $e_user                       = $e_user->find();

        $this->assertInternalType('int', $user_id);

        ##  PASSWORD


        $password_model  = $this->app->data->models->instantiate('password')->set(['user_id' => $user_id]);
        $hashed_password = $modelPersistenceManager->find($password_model)->properties->password->value;

        # # # # should be hashed and pass verification
        $this->assertNotEquals($hashed_password, $password);
        $this->assertTrue(password_verify($password, $hashed_password));

        $this->print_item($result__okay, '`Create User` Result');


        $login_user        = $this->app->controller->get('[User]@login');
        Sm::$globals->post = ['username' => $username, 'password' => $password];
        $result__login     = $login_user();
        $this->assertInstanceOf(ApiResponse::class, $result__login);
        $this->assertTrue($result__login->status);
        $this->print_item($result__login, 'Attempt Login Post Creation');
    }

    #
    ##  Helpers
    private function instantiateUser(): User {
        /** @var User $user */
        $user = $this->app->data->entities->instantiate('user');
        return $user;
    }
    protected function print_item($item, string $id): void {
        echo "{$id}:\n" . json_encode($item, JSON_PRETTY_PRINT) . "\n\n";
    }
}