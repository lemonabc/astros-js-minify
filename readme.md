# astros-js-minify

发布时，对JS进行压缩和混淆

若要在开发环境开启压缩，在项目配置中加入 `compress:true` 即可

```
    middlewares: [
        {
            name:'astros-js-minify',
            config:{
                compress: true
            }
        }
    ]
```

在正常开发时，开启了内存缓存，如果文件内容没有变化，会直接从缓存读取

发布时，进行文件缓存，只会针对和上次发布的时的内容有差异的文件进行压缩，大大提高发布进度

针对部分JS文件较大，压缩效率低的情况，可提前手动压缩，并在文件开头加上`/*astros-js-minify:ignore*/`标记，压缩时会忽略该文件