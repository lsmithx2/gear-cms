<?php

class formCheckbox extends formField {

    public $output = [];
    public $inline = false;
    public $divSwitch = false;

    public function __construct($name, $attributes = []) {

        if(isset($attributes['switch'])) {
            $this->divSwitch = true;
            unset($attributes['switch']);
        }

        if(isset($attributes['inline'])) {
            $this->inline = true;
            unset($attributes['inline']);
        }

        parent::__construct($name, $attributes);

    }

    public function add($name, $value, $attributes = []) {

        $attributes['type'] = 'checkbox';
        $attributes['value'] = $name;
        $attributes['name'] = $this->name;

        $attributes['v-model'] = 'props.data.'.$this->name;

        $this->output[$attributes['value']] = ['value' => $value, 'attr' => $attributes];

        return $this;

    }

    public function del($name) {
        unset($this->output[$name]);
        return $this;
    }

    public function get() {

        $return = '';

        foreach($this->output as $val) {

            $class = ($this->divSwitch) ? 'switch' : 'checkbox';
            $inline = ($this->inline) ? ' inline' : '';

            $return .= '
                <label class="'.$class.$inline.'">
                    <input '.$this->convertAttr($val['attr']).'>
                    <span>'.$val['value'].'</span>
                </label>
            ';

        }

        return $return;

    }

}

?>
