(function () {

    checkUserLogin();

    var BankLimit = {
        init: function () {
            this.getBankLimit();
        },
        getBankLimit: function () {
            var fetchData = $.ajax({
                url: host + 'bindbankcard/limitPayment.htm',
                type: 'POST',
                data: token_client_data,
                dataType: 'JSON',
            });

            fetchData.done(function (data) {
                var tpl = __inline('bank-limit.tmpl');
                var html = '';
                if (data.code == '0000') {
                    if (data.data.list.length > 0) {
                        html = tpl(data);
                    }
                }
                if (data.code == '4000') {
                    window.location.href = loginUrl;
                }
                if (html) $('#limit-list-wrapper').html(html);
            });
        }
    };

    BankLimit.init();

})();