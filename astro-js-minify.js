var uglifyJs = require('uglify-js');

module.exports = new astro.Middleware({
    fileType:'js'
}, function(asset, next) {
    if(!asset.data){
        next(asset);
        return
    }
    if (asset.prjCfg.compressJs) {
        try {
            var code = uglifyJs.minify(asset.data, {
                fromString: true
            }).code;
            asset._data = asset.data;
            asset.data = code;
        } catch (error) {
            console.error('astro-js-minify(asset:%s)%s', 
                asset.info, '语法错误');

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