var WritingPad = function () {

    $(function () {
        initSignature();

        $('#saveCanvas').on('click', function () {
            var myImg = $('#myImg').empty();
            var dataUrl = $('.js-signature').jqSignature('getDataURL');
            var img = $('<img>').attr('src', dataUrl);
            $(myImg).append(img);
        });

        $('#myEmpty').on('click', function () {
            $('.js-signature').jqSignature('clearCanvas');
        });

    });
 
    function initSignature() {
        if (window.requestAnimFrame) {
            var signature = $("#mySignature");
            signature.jqSignature({ 
                width: $('#mySignature').width(), 
                height: 200, 
                border: '', 
                background: '#fff', 
                lineColor: '#000', 
                lineWidth: 2, 
                autoFit: true 
            });
        } else {
            alert("请加载jq-signature.js");
            return;
        }
    }

    initSignature();
}