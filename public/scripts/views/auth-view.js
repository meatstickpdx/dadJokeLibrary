'use strict';

(function (module) {

    const authView = {};

    authView.init = () => {
        $('#admin-view').show();
    };

    module.authView = authView;

})(window.module);