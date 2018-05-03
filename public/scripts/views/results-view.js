'use strict';

(function (module) {

    const resultsView = {};
    const resultsTemplate = Handlebars.compile($(`#results-template`).html());

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
                        loadResults(res);
                        $('#results-view').show();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
    };
    const loadResults = (resultsArray) => {
        resultsArray.forEach(results => {
            const resultsCard = resultsTemplate(results);
            $(`#results-view`).append(resultsCard);
        });
    };
    module.resultsView = resultsView;

})(window.module);