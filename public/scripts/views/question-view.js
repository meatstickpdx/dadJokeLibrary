'use strict';

(function (module) {

    const questionView = {};

    questionView.init = () => {
        $('#question-view').show();

        $('#question-form')
            .off('submit')
            .on('submit', event => {
                event.preventDefault();
        
                const data = {
                    setQuestion: $('textarea[id=setQuestion]').val(),
                };

                questionView.sendQuestion(data);
            });
    };

    questionView.sendQuestion = (data) => {

        const question = {
            prompt: data.setQuestion,
        };
    
        const token = window.localStorage.getItem('token');

        fetch(`/questions`, {
            body: JSON.stringify(question),
            method: 'POST',
            mode: 'cors',
            headers: {
                'token' : token,
                'content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(res => {
                console.log('RESPONSE', res);
            })
            .catch(err => {
                console.log(err);
            });

        $('#question-form').trigger('reset');

        $('.status').toggleClass('status-submit');
        
        setTimeout(() => {
            $('.status').toggleClass('status-submit');
        }, 3000);

    };

    module.questionView = questionView;

})(window.module);
