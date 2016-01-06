var uglifyJs = require('uglify-js');

module.exports = new astro.Middleware({
    modType:['page','static'],
    fileType:'js'
}, function(asset, next) {
    if(!asset.data){
        next(asset);
        return
    }
    if (asset.prjCfg.compressJs || astro.evn == 'release') {
        try {
            var code = uglifyJs.minify(asset.data, {
                fromString: true
            }).code;
            asset._data = asset.data;
            asset.data = code;
        } catch (error) {
            console.error('astro-js-minify:asset(%s)', 
                asset.info, '中有JS语法错误');

            var line = 1;
            asset.data = '// message:\t' + error.message + '\n'+
                "// line:\t" + error.line + '\n// input is:\n\n' +
                asset.data.replace(/(.*)\n?/ig, function(a, b) {
                    return '/*' + line++ + '*/  ' + b + '\n';
                });
        }
    }
    next(asset);
});