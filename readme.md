JS压缩中间件

中间件的默认filter为：

```
{
    modType: ['page','static'],
    fileType: 'js'
}
```
如果需要单独访问web组件和JS组件的JS（如使用AMD模式开发），可在使用中间件时，定义中间件的filter，如：

```
middlewares: [
    {
        name: 'astros-js-minify',
        filter:{
            modType:['page', 'static', 'jsCom', 'webCom'],
            fileType: 'js'
        }
    }
]
```

压缩时会对结果进行缓存，如果代码上次没有差异，会自动返回缓存，这样可以减少大量页面等待时间。

针对部分JS文件特大，压缩时间较长的情况，可提前手动压缩，并在文件开头加上`/*astros-js-minify:ignore*/`标记，压缩时会忽略该文件