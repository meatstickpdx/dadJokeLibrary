'use strict';

(function (module) {

    const resultsView = {};
    const resultsTemplate = Handlebars.compile($(`#results-template`).html());

    resultsView.init = (questionId) => {
        $('#results-view').show();
        const data = {
            question: questionId
        };
        const token = window.localStorage.getItem('token');
        console.log('DATA', data);

        fetch(`/votes/results`, {
            body: JSON.stringify(data),
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
                // $('#answers-form').trigger('reset');
                // next();
            })
            .catch(err => {
                console.log(err);
                // next();
            });


    };

    module.resultsView = resultsView;

})(window.module);