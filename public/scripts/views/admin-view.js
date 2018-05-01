'use strict';

(function (module) {

    const adminView = {};
    const errorView = module.errorView;
    const handleError = err => errorView.init(err);

    adminView.init = () => {
        $('#admin-view').show();

        $('#question-form')
            .off('submit')
            .on('submit', event => {
                event.preventDefault();
        
                const data = {
                    setQuestion: $('textarea[id=setQuestion]').val(),
                };

                console.log('Question set to:', data.setQuestion);
                adminView.sendQuestion(data);
            });

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

    adminView.sendQuestion = (data) => {

        const question = {
            prompt: data.setQuestion,
        };
    
        // fetch(`http://localhost:27017/questions`, {
        //     body: JSON.stringify(question),
        //     method: 'POST',
        //     mode: 'cors'
        // })
        //     .then(response => response.json())
        //     .then(res => {
        //         console.log('RESPONSE', res);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });

    };

    module.adminView = adminView;

})(window.module);