'use strict';

(function (module) {
    const User = require('../../../lib/models/User');

    const authView = {};

    authView.init = () => {
        $('#auth-view').show();
        $('#sign-up').off('submit').on('submit', handleSignup);
    };

    const handleSignup = event => {
        event.preventDefault();
        const credentials = {
            username: $('#email').val(),
            password: $('#password').val()
        };

        User.signup(credentials)
            .then(() => {
                $('#email')[0].reset();
                $('#password')[0].reset();
                page('/');
            })
            .catch(err => {
                console.log(err);
            });
    };

    module.authView = authView;

})(window.module);