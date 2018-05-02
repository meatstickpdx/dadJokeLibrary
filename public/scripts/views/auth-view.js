'use strict';

(function (module) {

    const authView = {};

    authView.init = () => {
        $('#auth-view').show();
        $('#sign-up').off('click').on('click', handleSignup);
        $('#login').off('click').on('click', handleLogin);
    };
    
    const handleSignup = event => {
        event.preventDefault();
        const credentials = {
            username: $('#email').val(),
            password: $('#password').val()
        };

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
                localStorage.token = res.token;
                localStorage.user = res.username;
                $('#login-form').trigger('reset');
                $('#header-content').text(`Logged in as ${credentials.username}`);
                page('/game');
            })
            .catch(err => {
                console.log(err);
            });
    };
    const handleLogin = event => {
        event.preventDefault();
        const credentials = {
            username: $('#email').val(),
            password: $('#password').val()
        };

        fetch(`/auth/signin`, {
            body: JSON.stringify(credentials),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors'
        })
            .then(response => response.json())
            .then(res => {
                localStorage.token = res.token;
                $('#login-form').trigger('reset');
                $('#header-content').text(`Logged in as ${credentials.username}`);
                page('/game');
            })
            .catch(err => {
                console.log(err);
            });
    };

    module.authView = authView;

})(window.module);