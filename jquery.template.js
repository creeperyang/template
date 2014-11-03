/*
 * name: template
 * version: 1.0.0
 * author: creeper yang
 * description: a jQuery template plugin, extract from underscore.js.
*/

;(function($) {
    if (!$) {
        throw new Error('Dependency Error: jQeury does not exist!');
    }

    $.templateSettings = {
        escape: /<%-([\s\S]+?)%>/g, // 插值变量，请且把字符串转义
        evaluate: /<%([\s\S]+?)%>/g, // 执行js代码
        interpolate: /<%=([\s\S]+?)%>/g // 插值变量
    };
    $.templateUtil = {};

    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function getKeys(obj) {
        if(!isObject(obj)) {
            return [];
        }
        if(Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var key in obj) {
            if(obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    };

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    };
    var unescapeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#x27;': "'",
        '&#x60;': '`'
    };
    var createEscaper = function(map) {
        var escaper = function(match) {
            return map[match];
        };
        var source = '(?:' + getKeys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function(string) {
            string = string == null ? '' : '' + string;
            return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
    };
    $.templateUtil.escape = createEscaper(escapeMap);
    $.templateUtil.unescape = createEscaper(unescapeMap);

    // 不匹配任何字符串
    var noMatch = /(.)^/;

    // 转义特定字符.
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    $.template = function(text, data, settings) {
        var render;
        settings = $.extend({}, settings, $.templateSettings);

        // 把（3种）可选的分隔符组合成正则
        var matcher = new RegExp([
            (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // 编译模板源码, 转义相应的字符串.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function(match) {
                    return '\\' + escapes[match];
                });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':$.templateUtil.escape(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        // 如果settings.variable没有指定, 把data放到本地作用域local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            // 核心，构造一个函数，第一个参数obj，就是我们的data; 第二个参数$，就是jQuery
            render = new Function(settings.variable || 'obj', '$', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, $);
        var template = function(data) {
            return render.call(this, data, $);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };
})(jQuery);
