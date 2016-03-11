'use strict';

var uglifyJs    = require('uglify-js');
var crypto      = require('crypto');
var fs          = require('fs');
var path        = require('path');
var fsPlus      = require('file-plus');
var cache       = {};

// 读取缓存
function getCache(asset){
    var hash = crypto.createHash('md5').update(asset.data + ' ').digest('hex');
    if(asset.status == 'release'){
        let cache_path = path.join(asset.prjCfg.cache,'astros-js-minify',asset.name.replace(/[^a-zA-Z0-9]/ig,'_')+ hash+'.js');

        if(fs.existsSync(cache_path)){
            return fs.readFileSync(cache_path).toString();
        }
    }
    // 命中缓存
    if(cache[asset.filePath] && cache[asset.filePath].hash === hash){
        return cache[asset.filePath].data;
    }

    return null;
}
function setCache(asset, data){
    var hash = crypto.createHash('md5').update(asset.data + ' ').digest('hex');
    if(asset.status === 'release'){
        let cache_path = path.join(asset.prjCfg.cache,'astros-js-minify',asset.name.replace(/[^a-zA-Z0-9]/ig,'_')+ hash+'.js');
        fsPlus.createFileSync(cache_path)
        fs.writeFileSync(cache_path, data);
        return;    
    }
    cache[asset.filePath] = {
        data: data,
        hash: hash
    }
}

module.exports = new astro.Middleware({
    modType: ['page','static'],
    fileType: 'js'
}, function(asset, next) {
    // 是否压缩
    var iscompress = asset.prjCfg.compressJs || this.config.compress;
    if (!asset.data || !iscompress) {
        next(asset);
        return
    }
    try {
        // 读取缓存
        var code = getCache(asset);;

        if (!code) {
            if(asset.data.indexOf('/*astros-js-minify:ignore*/') !== 0){
                require('process').stdout.write('正在压缩'+ asset.info + '... ');
                let t1 = Date.now();
                code = uglifyJs.minify(asset.data, {
                    fromString: true
                }).code;
                console.info('\t耗时',((Date.now()-t1)/1000)+'s');
            }else{
                code = asset.data
            }

            setCache(asset, code);
        }
        asset._data = asset.data;
        asset.data = code;

    } catch (error) {

        console.error('astro-js-minify：JS(asset:%s)有语法错误，info:\n%s',
            asset.info, error);

        var line = 1;
        asset.data = '// message:\t' + error.message + '\n' +
            "// line:\t" + error.line + '\n// input is:\n\n' +
            asset.data.replace(/(.*)\n?/ig, function(a, b) {
                return '/*' + line++ + '*/  ' + b + '\n';
            });
    }
    next(asset);
});