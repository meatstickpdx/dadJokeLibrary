'use strict';

(function (module) {

    const gameView = {};
    const errorView = module.errorView;
    const handleError = err => errorView.init(err);

    gameView.init = () => {
        $('#game-view').show();
    };

    module.gameView = gameView;

})(window.module);