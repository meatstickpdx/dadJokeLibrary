'use strict';

(function (module) {

    const gameView = {};
    const errorView = module.errorView;
    const handleError = err => errorView.init(err);

    let currentQuestion = {};

    gameView.init = () => {
        $('#game-view').show();

        $('#question').empty();

        $.get( 'http://localhost:3000/questions', ( questions ) => {
            questions.length ? gameView.loadQuestion(questions) : gameView.questionError();
        }).then( () => gameView.loadAnswers() );
    },
    
    gameView.loadAnswers = () => {
        $.get( `http://localhost:3000/questions/${currentQuestion._id}/answers`, ( answers ) => {
            console.log('ANSWERS', answers);
        });
    },

    gameView.loadQuestion = (questions) => {
        currentQuestion = questions[questions.length - 1];
        $('#question').append(`<h2>${currentQuestion.prompt}</h2>`);
    },

    gameView.questionError = () => {
        $('#question').append('<h2>Please set a question on the Admin Page</h2>');
    },

    module.gameView = gameView;

})(window.module);