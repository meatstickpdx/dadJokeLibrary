'use strict';

(function (module) {

    const questionView = {};
    const errorView = module.errorView;
    const handleError = err => errorView.init(err);

    questionView.init = () => {
        $('#question-view').show();

        $('#question-form')
            .off('submit')
            .on('submit', event => {
                event.preventDefault();
        
                const data = {
                    setQuestion: $('textarea[id=setQuestion]').val(),
                };

                console.log('Question set to:', data.setQuestion);
                questionView.sendQuestion(data);
            });
    };

    questionView.sendQuestion = (data) => {

        const question = {
            prompt: data.setQuestion,
        };
    
        const token = window.localStorage.getItem('token');

        fetch(`http://localhost:3000/questions`, {
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

    };

    module.questionView = questionView;

})(window.module);