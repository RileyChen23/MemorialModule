/**
 * app.ts
 * 小程序入口文件
 */
App({
  onLaunch() {
    console.log('小程序启动');
  },

  onShow() {
    console.log('小程序显示');
  },

  onHide() {
    console.log('小程序隐藏');
  },

  onError(err: any) {
    console.error('小程序错误：', err);
  },
});
