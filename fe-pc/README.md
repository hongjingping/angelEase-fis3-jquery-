#fe-pc

## using smartAlert
path: /static/common/lib/smart_alert.js

### how to use smartAlert?
首先在需要用到 smartAlert 的html页面引入JS文件
```
@require ../../static/common/lib/smart_alert.js
```

然后再对应的JS文件里，你可以像下面这样使用 smartAlert

```
var readSmartAlert = new SmartAlert({
    title: '报错',
    content: '<i class="ae-icon ae-icon-attention notice-attention"></i><span class="content-txt">您还未看完所有的协议，请拉动滚动条看完所有的协议才可以进行下一步投资步骤。</span>',
    type: 'confirm',
    okText: '我知道了',
    maskClosable: false,
});
readSmartAlert.open();
```

### 参数解释

title: 弹框的title
content: 弹框的内容,
type: 如果不传此字段，默认弹出confirm类型的； 如果传入'confirm', 弹出的是alert类型的，
okText: 对应确认按钮文字 ，
onCancel: 取消回调，
onOk: 确认回调，
cancelText: 取消按钮文字，
maskClosable: 是否可以点击外层mask关闭弹框，默认值为false,即不可点击。


## 公用头部引入规则
现有三种头部导航
- cmn-header-main/main.tpl 有顶部状态栏，有 X 个 nav 导航
- cmn-header/header.tpl 有顶部状态栏， 无 nav 导航
- cmn-header-simple/simple.tpl 无顶部状态栏，只有 AngelEase logo

引入以上头部目前有两个可选参数（hitIndex，processName）传入

如：
```
<link rel="import" href="../../widget/component/header/cmn-header-main/main.tpl?__inline" hitIndex="2" processName="添加银行卡">
```

### 参数解释
hitIndex: 数字(可选)，对应头部导航栏的激活栏位，从1开始，没有的不传此字段(1: 投资; 2: 投资指南; 3: 天使研究; 4: 我要融资;)
processName: 字符串(可选)，对应的流程名，例如 找回密码，签约， 下单，.etc

### 上面两个参数传不传，传什么，依照具体情况而定



