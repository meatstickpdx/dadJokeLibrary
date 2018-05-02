'use strict';

(function(module) {

    const authView = module.authView;
    const gameView = module.gameView;
    const resultsView = module.resultsView;
    const adminView = module.adminView;

    const resetView = () => {
        $('.view').hide();
        if(localStorage.user) {
            $('#header-content').text(`Logged in as ${localStorage.user}`);
        }
    };

    page('*', (ctx, next) => {
        resetView();
        next();
    });

    page('/', () => authView.init());
    
    page('/game', () => gameView.init());

    // page('/game/vote/:id', (ctx) => Joke.fetchOne(ctx.params.id, gameView.vote()));

    page('/results', () => resultsView.init());

    page('/admin', () => adminView.init());

    page('/logout', () => {
        localStorage.clear();
        authView.init();
    });

    // page('*', () => page.redirect('/login'));

    page({ hashbang: true });

})(window.module);
