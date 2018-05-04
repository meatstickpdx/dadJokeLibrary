'use strict';

(function (module) {

    const adminView = {};

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
                            text: `${question.prompt}`,
                            _id: question._id
                        })
                    );
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    adminView.initializeQuestionSelection = () => {
        const token = window.localStorage.getItem('token');

        $('#question-list')
            .off('change')
            .on('change', event => {
                event.preventDefault();
        
                const data = {
                    setQuestion: $('#question-list').val(),
                    questionId: $('#question-list option:selected').attr('_id')
                };

                fetch(`/questions`, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'token' : token,
                        'content-type': 'application/json'
                    }
                })
                    .then(() => {
                        fetch(`questions/${data.questionId}`, {
                            method: 'PUT',
                            mode: 'cors',
                            headers: {
                                'token' : token,
                                'content-type': 'application/json'
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });

                console.log('Question set to:', data.setQuestion);
            });
    };

    adminView.init = () => {
        ($('#question-list').empty());

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
