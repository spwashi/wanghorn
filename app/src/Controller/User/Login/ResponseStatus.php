<?php


namespace WANGHORN\Controller\User\Login;


class ResponseStatus implements \JsonSerializable {
    const ERROR   = 'error';
    const SUCCESS = 'success';
    protected $status;
    protected $message;
    protected $data;
    public function __construct($status, $message = null, $data = null) {
        $this->status  = $status;
        $this->message = $message;
        $this->data    = $data;
    }
    
    public function jsonSerialize() {
        $status_response = [ 'status' => $this->status ?? ResponseStatus::SUCCESS ];
        
        if (isset($this->message)) $status_response['message'] = $this->message;
        if (isset($this->data)) $status_response['data'] = $this->data;
        
        return $status_response;
    }
}