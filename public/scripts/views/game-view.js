'use strict';

(function (module) {

    const gameView = {};
    const errorView = module.errorView;
    const handleError = err => errorView.init(err);

    gameView.currentQuestion = {};

    gameView.init = () => {
        $('#game-view').show();

        $('#question').empty();

        $.get( 'http://localhost:3000/questions', ( questions ) => {
            questions.length ? gameView.loadQuestion(questions) : gameView.questionError();
        }).then( () => gameView.loadAnswers() );
        $('#submitAnswer').off('click').on('click', handleAnswer);
    };
    
    gameView.loadAnswers = () => {
        $.get( `http://localhost:3000/questions/${gameView.currentQuestion._id}/answers`, ( answers ) => {
            console.log('ANSWERS', answers);
        });
    };

    gameView.loadQuestion = (questions) => {
        gameView.currentQuestion = questions[questions.length - 1];
        $('#question').append(`<h2>${gameView.currentQuestion.prompt}</h2>`);
    };

    gameView.questionError = () => {
        $('#question').append('<h2>Please set a question on the Admin Page</h2>');
    };

    const handleAnswer = event => {
        event.preventDefault();
        const answer = {
            content: $('#answer').val(),
            question: gameView.currentQuestion._id
        };
        const token = window.localStorage.getItem('token');

        fetch(`/answers`, {
            body: JSON.stringify(answer),
            headers: {
                'token' : token,
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors'
        })
            .then(response => response.json())
            .then(res => {
                console.log('res???', res);
                $('#answers-form').trigger('reset');
            })
            .catch(err => {
                console.log(err);
            });
    };
   
    module.gameView = gameView;

})(window.module);