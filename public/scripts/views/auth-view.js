'use strict';

(function (module) {

    const authView = {};

    authView.init = () => {
        $('#auth-view').show();
    };

    module.authView = authView;

})(window.module);