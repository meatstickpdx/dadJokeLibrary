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

    // page('/game/vote/:id', (ctx) => Joke.fetchOne(ctx.params.id, gameView.vote()));

    page('/results', () => resultsView.init());

    page('/admin', () => adminView.init());

    // page('*', () => page.redirect('/login'));

    page({ hashbang: true });

})(window.module);
