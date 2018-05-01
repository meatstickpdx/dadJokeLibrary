'use strict';

(function (module) {

    const gameView = {};

    gameView.init = () => {
        $('#game-view').show();
    };

    module.gameView = gameView;

})(window.module);