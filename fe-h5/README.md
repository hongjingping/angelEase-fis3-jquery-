#angelease-h5

## using smartToast
path: /static/common/lib/smart_toast.js

### how to use smartToast?
首先在需要用到 smartToast 的html页面引入JS文件
```
@require ../../static/common/lib/smart_toast.js
```

然后再对应的JS文件里，你可以像下面这样使用 smartToast

```
    new SmartToast({
        content: '请输入正确的手机号码',
        type: 'warn',
        duration: 3
        });
```

### 参数解释

content: toast的内容,
type: 一共三种类型，'warn', 'success', 'fail', 如果不传此字段，默认为warn(错误提示)类型； 还可以传 success(成功提示); fail(失败提示)，
duration： toast持续的秒数，不传此字段默认为 3s ；可根据需求传入具体的数字
