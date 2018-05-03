'use strict';

(function (module) {

    const resultsView = {};

    resultsView.init = () => {
        const token = window.localStorage.getItem('token');
        
        fetch(`/questions/voting`, {
            headers: {
                'token' : token,
                'content-type': 'application/json'
            },
            method: 'GET',
            mode: 'cors'
        })
            .then(res => res.json())
            .then(res => {
                console.log('res id', res._id);
                fetch(`/votes/results?question=${res._id}`, {
                    headers: {
                        'token' : token,
                        'content-type': 'application/json'
                    },
                    method: 'GET',
                    mode: 'cors'
                })
                    .then(response => response.json())
                    .then(res => {
                        console.log('RES', res);
                        $('#results-view').show();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
    };

    module.resultsView = resultsView;

})(window.module);