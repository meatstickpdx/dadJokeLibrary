'use strict';

(function (module) {

    const gameView = {};
    const errorView = module.errorView;
    const handleError = err => errorView.init(err);

    gameView.init = () => {
        $('#game-view').show();

        $('#question').empty();

        $.get( 'http://localhost:3000/questions', ( questions ) => {
            questions.length ? gameView.loadQuestion(questions) : gameView.questionError();
        });

    },

    gameView.loadQuestion = (questions) => {
        $('#question').append(`<h2>${questions[questions.length - 1].prompt}</h2>`);
    },

    gameView.questionError = () => {
        $('#question').append('<h2>Please set a question on the Admin Page</h2>');
    },

    module.gameView = gameView;

})(window.module);