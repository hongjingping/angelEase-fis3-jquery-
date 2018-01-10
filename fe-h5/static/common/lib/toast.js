// (function () {
//     // 弹窗倒计时用
//     var InterValMsg;
//     var curCount;
//     var doc;
//     var tex;
// })();

// // 弹窗信倒计时
// function countdown() {
//     if (curCount == 0) {
//         window.clearInterval(InterValMsg);
//         $(doc).css('display','none');
//         $('#overlay').remove();
//     } else {
//         curCount--;
//     }
// }

// // 弹窗显示
// function showToast(text,type) {
//     // 获取窗口高度
//     var docHeight = $(document).height();
//     $('body').append('<div id="overlay"></div>');
//     $('#overlay')
//     .height(docHeight)
//     .css({
//       'opacity': .01,
//       'position': 'absolute',
//       'top': 0,
//       'left': 0,
//       'background-color': 'black',
//       'width': '100%',
//       'z-index': 5000
//     });

//     // type：0（失败），1（成功），2（警告）
//     if (type == '0') {
//         doc = '#toastBoxFail';
//         tex = '.modify-suc-text';
//     } else if (type =='1') {
//         doc = '#toastBoxSuc';
//         tex = '.modify-suc-text';
//     } else if (type == '2') {
//         doc = '#toastBoxWarn';
//         tex = '.modify-suc-text';
//     }
//     $(doc).css('display','block');
//     $(tex).html(text);
//     curCount = 2;
//     InterValMsg = window.setInterval(countdown, 1000);
// }