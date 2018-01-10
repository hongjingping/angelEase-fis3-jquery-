(function () {

    var Title = {
        init: function () {
            $("#ts").val("");
            this.setTitleHeader();
        },

        setTitleHeader: function () {
            $('.cmn-header-title').text('关于我们');
        }
    };

    Title.init();

})();