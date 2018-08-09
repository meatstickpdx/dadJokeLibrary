'use strict';

(function (module) {

    const resultsView = {};
    const resultsTemplate = Handlebars.compile($(`#results-template`).html());

    resultsView.init = () => {
        const token = window.localStorage.getItem('token');
        $('#question-results').empty();
        $('#heart').empty();
        $('#laughing').empty();
        $('#facepalm').empty();
        
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
                if(!res){
                    $('#results-box').append(`<h2>No results yet!</h2>`);
                    $('#results-view').show();
                    return;
                }
                $('#question-results').append(`<h2>${res.prompt}</h2>`);
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

        const heartArray = resultsArray.filter(vote => vote._id.emoji === '💖');
        heartArray.forEach( heart=> {
            const card = resultsTemplate(heart);
            $('#heart').append(card);
        });

        const laughArray = resultsArray.filter(vote => vote._id.emoji === '😂');
        laughArray.forEach( laughing=> {
            const card = resultsTemplate(laughing);
            $('#laughing').append(card);
        });

        const faceArray = resultsArray.filter(vote => vote._id.emoji === '🤦');
        faceArray.forEach( facepalm=> {
            const card = resultsTemplate(facepalm);
            $('#facepalm').append(card);
        });

    };
    module.resultsView = resultsView;

})(window.module);