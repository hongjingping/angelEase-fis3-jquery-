var SmartAlertSeed = 0;

var SmartAlert = function (options) {
  this.alertId = SmartAlertSeed++;
  this.options = options;
  this.createAlert();
};

SmartAlert.prototype.createAlert = function () {
  var alertTmpl = this.createAlertTmpl(this.options);
  $(alertTmpl).appendTo('body');
  this.$alert = $((".smartAlert#smartAlert-" + (this.alertId)));
  this.$body = $('body');
  this.alertInitEvents();
};

SmartAlert.prototype.open = function () {
  var self = this;
  this.$alert.css('display', 'table');
  // this.$alert.show();
  // setTimeout(function () {
  //   self.$alert.addClass('in');
  // }, 10);
  this.$body.addClass('smartAlert-open');
};

SmartAlert.prototype.close = function () {
  var self = this;
  // this.$alert.removeClass('in');
  // setTimeout(function () {
  //   self.$alert.hide();
  // }, 200);
  this.$alert.hide();
  this.$body.removeClass('smartAlert-open');
};

SmartAlert.prototype.destroy = function () {
  this.$alert.remove();
};

SmartAlert.prototype.createAlertTmpl = function () {
  var ref = this.options;
  var title = ref.title;
  var content = ref.content;
  var header = '<div class="smartAlert-header cmn-clearfix"><div class="smartAlert-title">'
    + (title ? title : '') + '</div><i class="ae-icon ae-icon-close close"></i></div>';
  var body = '<div class="smartAlert-body cmn-clearfix"><p>' + content + '</p></div>';
  var footer = '<div class="smartAlert-footer">' + this.createFooterFooter() + '</div>';
  var TMPL = '<div class="smartAlert fade" id="smartAlert-'
    + this.alertId
    +'"><div class="smartAlert-dialog"><div class="smartAlert-content">'
    + header + body + footer
    + '</div></div></div>';

  return $.trim(TMPL);
};

SmartAlert.prototype.createFooterFooter = function () {
  var ref = this.options;
  var type = ref.type;
  var okText = ref.okText;
  var cancelText = ref.cancelText;
  var footer = ref.footer;

  var defaultFooter = '<button type="button" class="cmn-btn-gold-w12 save">'
    + (okText ? okText : '确定')
    + '</button>';
  if (type !== 'confirm') {
    defaultFooter += '<button type="button" class="btn btn-default cmn-btn-white-w12 cancel">'
      + (cancelText ? cancelText : '取消')
      + "</button>";
  }
  // set custom footer to override defaultFooter
  if (footer) defaultFooter = footer;
  return defaultFooter;
};

SmartAlert.prototype.handleOK = function handleOK () {
  var ref = this.options;
  var onOk = ref.onOk;
  onOk && onOk();
  this.close();
};

SmartAlert.prototype.handleCancel = function handleCancel () {
  var ref = this.options;
  var onCancel = ref.onCancel;
  onCancel && onCancel();
  this.close();
};

SmartAlert.prototype.alertInitEvents = function alertInitEvents () {
  var self = this;
  if (this.options.maskClosable) {
    this.$alert.on('click', function (e) {
      var $alertContent = self.$alert.find('.smartAlert-content');
      if (!$.contains($alertContent[0], e.target)) self.handleCancel();
    });
  }

  this.$alert.on('click', 'button.save', function (e) {
    self.handleOK();
  }).on('click', 'button.cancel', function (e) {
    self.handleCancel();
  }).on('click', '.close', function (e) {
    self.handleCancel();
  });
};
