'use strict';

(function(module) {

    const authView = module.authView;
    const gameView = module.gameView;
    const resultsView = module.resultsView;
    const adminView = module.adminView;
    const questionView = module.questionView;

    const resetView = () => {
        $('.view').hide();
        if(localStorage.user) {
            $('#header-content').text(`Logged in as Mr. ${localStorage.user}`);
        }
    };

    page('*', (ctx, next) => {
        resetView();
        next();
    });

    page('/', () => authView.init());
    
    page('/game', () => gameView.init());

    page('/vote/:question/:id/:emoji', (ctx) => gameView.vote(ctx.params.id, ctx.params.question, ctx.params.emoji, gameView.init));

    page('/results', () => resultsView.init());

    page('/questions', () => questionView.init());

    page('/admin', () => adminView.init());

    page('/logout', () => {
        localStorage.clear();
        authView.init();
    });

    page('*', () => page.redirect('/login'));

    page({ hashbang: true });

})(window.module);
