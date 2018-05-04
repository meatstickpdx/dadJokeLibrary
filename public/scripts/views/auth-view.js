'use strict';

(function (module) {

    const authView = {};

    authView.init = () => {
        $('.admin').addClass('hidden');
        $('#auth-view').show();
        $('#sign-up').off('click').on('click', handleSignup);
        $('#login').off('click').on('click', handleLogin);
        $('#logout').off('click').on('click', () => {
            localStorage.clear();
            page.redirect('/');
            location.reload();
        });
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
                if(res.error) {
                    alert(res.error);
                } else if(res.role === 'admin') {
                    $('.admin').removeClass('hidden');
                    page('/game');
                } else {
                    $('.admin').addClass('hidden');
                    page('/game');
                }
                $('#login-form').trigger('reset');
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
                if(res.error) {
                    $('#login-form').trigger('reset');
                    alert(res.error);
                } else {
                    if(res.role === 'admin') {
                        $('.admin').removeClass('hidden');
                    } else {
                        $('.admin').addClass('hidden');
                    }
                    localStorage.token = res.token;
                    localStorage.user = res.username;
                    $('#login-form').trigger('reset');
                    page('/game');
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    module.authView = authView;

})(window.module);