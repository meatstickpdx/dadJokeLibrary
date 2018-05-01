'use strict';

(function (module) {
    const errorView = {};

    const template = Handlebars.compile($('#error-template').text());

    errorView.init = function(err) {

        const html = template(err);
        
        $('#error-view')
            .empty()
            .append(html)
            .show();

    };

    module.errorView = errorView;

})(window.module);