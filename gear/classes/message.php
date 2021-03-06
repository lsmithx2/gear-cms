<?php

class message {

    protected $app;

    protected $sessionName = 'messages';

    function __construct($app) {

        $this->app = $app;

        $this->app->api->get('/messages', function() {
            return [
                'data' => json_encode($this->getAll())
            ];
        });

        $this->app->api->post('/addMessage', function() {
            $array = api::getPost('message');
            $this->add($array['message'], $array['type'], $array['stay']);
        });

        $this->app->api->delete('/message/{i}', function($app, $index) {
            $this->delete($index);
            return [
                'data' => json_encode($this->getAll())
            ];
        });

    }

    public function add($message, $type = 'success', $stay = false) {
        $_SESSION[$this->sessionName][$this->getIndex()] = [
            'message' => $message,
            'type' => $type,
            'stay' => $stay
        ];
    }

    public function getAll() {

        $return = [];
        $messages = type::session($this->sessionName);

        if(is_array($messages) && count($messages)) {
            foreach($messages as $index => $val) {
                $return[] = [
                    'message' => $val['message'],
                    'type' => $val['type'],
                    'stay' => $val['stay'],
                    'index' => $index
                ];
            }
        }

        return $return;

    }

    public function delete($index) {
        if($index == -1) {
            unset($_SESSION[$this->sessionName]);
        } elseif(isset($_SESSION[$this->sessionName][$index])) {
            unset($_SESSION[$this->sessionName][$index]);
        }
    }

    protected function getIndex($index = 0) {
        $index = (!$index) ? count(type::session($this->sessionName, 'array', [])) + 1 : $index;
        if(isset($_SESSION[$this->sessionName][$index])) {
            $index++;
            return $this->getIndex($index);
        }
        return $index;
    }

}

?>
