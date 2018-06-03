<?php


namespace WANGHORN\Controller\Email;


abstract class Email {
    protected $content;
    protected $subject;
    protected $plaintext_content;
    
    protected $host;
    protected $port;
    protected $username;
    protected $password;
    
    public function __construct($username, $password, $host, $port) {
        $this->host     = $host;
        $this->port     = $port;
        $this->username = $username;
        $this->password = $password;
    }
    
    #
    ##  Email methods
    abstract public function send(array $to);
    abstract public function save();
    
    #
    ##  Send
    
    public function setContent($content) {
        $this->content = $content;
        return $this;
    }
    public function setPlaintextContent($content) {
        $this->plaintext_content = $content;
        return $this;
    }
    public function setSubject(string $subject) {
        $this->subject = $subject;
        return $this;
    }
}