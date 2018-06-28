var data = require('./home/home');
var page1 = require('./home/recommend1');
var page2 = require('./home/recommend2');
var page3 = require('./home/recommend3');
var searchKey = require('./search1/searchKey');
var searchOne = require('./search1/search');
var dedata = require('./detail/352876');
var menudata = require('./menu1/chapter-list');
//四个章节页
var readdata1 = require('./read1/data1');
var readdata2 = require('./read1/data2');
var readdata3 = require('./read1/data3');
var readdata4 = require('./read1/data4');
var lsdata = require('./logindata/ls');
var obj = {
    '/api/home': data,
    '/api/loadmore?pagenum=1&limit=20': page1,
    '/api/loadmore?pagenum=2&limit=20': page2,
    '/api/loadmore?pagenum=3&limit=20': page3,
    '/api/bookself': page1,
    '/api/searchKey': searchKey,
    '/api/detail?id=352876': dedata,
    // '/api/chap': menudata
    '/api/chap?id=352876': menudata, //小说目录页的数据
    '/api/read?num=1': readdata1,
    '/api/read?num=2': readdata2,
    '/api/read?num=3': readdata3,
    '/api/read?num=4': readdata4,


};
module.exports = function(url) {
    //如果ajax请求/api/result?接口 做数据处理 模糊查询 再将数据返回ajax
    if (/\/api\/result/.test(url)) {
        // var n = url.split('?')[1].split('=')[1];
        // var d = decodeURIComponent(n);
        var n = url.split('?')[1];
        var val = decodeURIComponent(n.split('=')[1])
        var reg = new RegExp(val, 'g');
        var objs = {
            mes: "暂无数据",
            cont: []
        }
        var newarr = searchOne.items.filter(function(v, i) {

            v.authors = v.role[0][1];
            v.summary = v.intro;
            return reg.test(v.title) || reg.test(v.intro) || reg.test(v.role[0][1]);
        })
        if (newarr.length) {

            objs.mes = "success";
            objs.cont = newarr;
        }
        return objs;
    }

    return obj[url]
}