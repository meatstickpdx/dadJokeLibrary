'use strict';

(function (module) {

    const authView = {};

    authView.init = () => {
        $('#auth-view').show();
        $('#sign-up').off('click').on('click', handleSignup);
    };

    const handleSignup = event => {
        event.preventDefault();
        const credentials = {
            username: $('#email').val(),
            password: $('#password').val()
        };
        console.log(credentials);

        fetch(`/auth/signup`, {
            body: JSON.stringify(credentials),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors'
        })
            .then(response => response.json())
            .then(res => {
                console.log(res);
                localStorage.token = res.token;
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