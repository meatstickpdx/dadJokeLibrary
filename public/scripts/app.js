'use strict';

(function(module) {

    const authView = module.authView;
    const gameView = module.gameView;
    const resultsView = module.resultsView;
    const adminView = module.adminView;


    const resetView = () => {
        $('.view').hide();
    };

    page('*', (ctx, next) => {
        resetView();
        next();
    });

    page('/login', () => authView.init());
    
    page('/game', () => gameView.init());

    page('/vote/:question/:id/:emoji', (ctx) => gameView.vote(ctx.params.id, ctx.params.question, ctx.params.emoji));

    page('/results', () => resultsView.init());

    page('/admin', () => adminView.init());

    // page('*', () => page.redirect('/login'));

    page({ hashbang: true });

})(window.module);
