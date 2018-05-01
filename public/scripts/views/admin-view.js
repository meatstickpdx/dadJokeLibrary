'use strict';

(function (module) {

    const adminView = {};

    adminView.init = () => {
        $('#admin-view').show();
    };

    module.adminView = adminView;

})(window.module);