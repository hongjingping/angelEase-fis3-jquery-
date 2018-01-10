var SmartToastSeed = 0;

var SmartToast = function(options) {
    this.toastId = SmartToastSeed++;
    this.options = options;
    this.create();
    this.open();
};

SmartToast.prototype.create = function() {
    var tmplate = this.createTmpl(this.options);
    $(tmplate).appendTo('body');
    this.$toast = $(".smartToast#smartToast-" + this.toastId);
    this.$body = $('body');
};

SmartToast.prototype.open = function() {
    if (typeof this.timeoutID === 'number') {
        this.cancelTimeout();
    }
    var duration = this.options.duration || 3;
    this.$toast.css('display', 'table');
    this.$body.addClass('smartToast-open');
    // setTimeout
    var self = this;
    this.timeoutId = setTimeout(function() {
        self.close();
    }, duration * 1000);
};

SmartToast.prototype.close = function() {
    this.$toast.hide();
    this.$toast.remove();
    this.cancelTimeout();
    this.$body.removeClass('smartToast-open');
};

SmartToast.prototype.cancelTimeout = function() {
    window.clearTimeout(this.timeoutID);
    this.timeoutID = undefined;
};

SmartToast.prototype.destroy = function() {
    this.$toast.remove();
};

SmartToast.prototype.createTmpl = function() {
    var typedIcons = {
        success: 'right',
        fail: 'attention',
        warn: 'attention'
    };

    var type = this.options.type || 'warn';

    if (type == 'success') {
        var TMPL = '<div class="smartToast ' +
            type +
            '" id="smartToast-' +
            this.toastId +
            '"><div class="smartToast-dialog"><div class="smartToast-content">' +
            '<i class="ae-mobile ae-mobile-' +
            typedIcons[type] +
            '"></i><p>' +
            this.options.content +
            '</p></div></div></div>';
    }
    if (type == 'warn') {
        var TMPL = '<div class="smartToast ' +
        type +
        '" id="smartToast-' +
        this.toastId +
        '"><div class="smartToast-dialog"><div class="smartToast-content">' +
        '<p>' +
        this.options.content +
        '</p></div></div></div>';
    }
    return $.trim(TMPL);
};