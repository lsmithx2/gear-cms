<section id="user">

    <header>

        <h2><?=lang::get('add'); ?></h2>

        <nav>
            <ul>
                <li>
                    <a href="<?=config::get('url').'admin/user'; ?>" class="button noText border">
                        <i class="icon icon-close-round"></i>
                    </a>
                </li>
            </ul>
        </nav>

    </header>

    <?php

        $form = new form();

        $field = $form->addTextField('email', '');
	    $field->fieldName(lang::get('email'));
        $field->fieldValidate('valid_email|required');

	    $field = $form->addPasswordField('password', '');
        $field->fieldName(lang::get('password'));
        $field->fieldValidate();

        if($form->isSubmit()) {

            if($form->validation()) {

			    extension::add('model_beforeInsert', function($data) {
    			    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    			    $data['password'] = $password;
    		        return $data;
			    });

			    $this->model->insert($form->getAll());

    			echo message::success(lang::get('user_added'));

		    } else {
			    echo $form->getErrors();
		    }

	    }

    ?>

    <div class="columns">
        <div class="md-6">

            <?php
                echo $form->show();
            ?>

        </div>

    </div>

</section>
