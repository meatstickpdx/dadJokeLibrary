'use strict';

(function (module) {

    const resultsView = {};

    resultsView.init = () => {
        $('#results-view').show();
    };

    module.resultsView = resultsView;

})(window.module);