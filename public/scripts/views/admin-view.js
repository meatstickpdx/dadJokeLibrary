'use strict';

(function (module) {

    const adminView = {};
    const errorView = module.errorView;
    const handleError = err => errorView.init(err);

    adminView.populateQuestions = () => {
        const token = window.localStorage.getItem('token');

        fetch(`/questions`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'token' : token,
                'content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(res => {
                res.forEach(question => {
                    $('#question-list').append(
                        $(`<option>`, {
                            value: question.prompt,
                            text: `${question.prompt}`
                        })
                    );
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    adminView.initializeQuestionSelection = () => {
        $('#question-list')
            .off('change')
            .on('change', event => {
                event.preventDefault();
        
                const data = {
                    setQuestion: $('#question-list').val(),
                };

                console.log('Question set to:', data.setQuestion);

                // adminView.sendQuestion(data);
            });
    };

    adminView.init = () => {
        $('#question-list').empty();

        adminView.populateQuestions();
        adminView.initializeQuestionSelection();

        $('#admin-view').show();

        $('#game-time-form')
            .off('submit')
            .on('submit', event => {
                event.preventDefault();
        
                const data = {
                    submissionTime: $('input[id=submissionTime]').val(),
                    votingTime: $('input[id=votingTime]').val(),
                };
                console.log('Submission timer set to:', data.submissionTime);
                console.log('Voting timer set to:', data.votingTime);
            });
    };

    module.adminView = adminView;

})(window.module);
