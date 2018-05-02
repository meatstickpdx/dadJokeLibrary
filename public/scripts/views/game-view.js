'use strict';

(function (module) {

    const gameView = {};
    const answerTemplate = Handlebars.compile($('#answers-template').html());

    gameView.currentQuestion = {};

    gameView.init = () => {
        $('#game-view').show();

        $('#question').empty();
        $('#answers').empty();

        $.get( '/questions', ( questions ) => {
            questions.length ? loadQuestion(questions) : questionError();
        }).then( () => gameView.loadAnswers() );

        $('#submitAnswer').off('click').on('click', handleAnswer);
    };
    
    gameView.loadAnswers = () => {
        $.get( `/answers/all?question=${gameView.currentQuestion._id}`, ( answers ) => {
            answers.forEach(answer => {
                const answerCard = answerTemplate(answer);
                $('#answers').append(answerCard);
                checkVotes(gameView.currentQuestion._id);
            });
        });
    };

    gameView.vote = (id, question, emoji, next) => {
        const vote = {
            emoji: emoji,
            question: question,
            answer: id
        };
        const token = window.localStorage.getItem('token');

        fetch(`/votes`, {
            body: JSON.stringify(vote),
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
                next();
            })
            .catch(err => {
                console.log(err);
                next();
            });
    };

    const loadQuestion = (questions) => {
        gameView.currentQuestion = questions[questions.length - 1];
        $('#question').append(`<h2>${gameView.currentQuestion.prompt}</h2>`);
    };

    const questionError = () => {
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
                location.reload();
                $('#answers-form').trigger('reset');
            })
            .catch(err => {
                console.log(err);
            });
    };

    const checkVotes = (questionId) => {
        const token = window.localStorage.getItem('token');

        fetch(`/votes/myVotes`, {
            headers: {
                'token' : token,
            },
            method: 'GET'
        })
            .then( response => response.json())
            .then( ( votes ) =>
                votes.forEach(vote => {
                    $(`.${vote.answer}${vote.emoji}`).addClass('disabled');
                }));
    };
   
    module.gameView = gameView;

})(window.module);