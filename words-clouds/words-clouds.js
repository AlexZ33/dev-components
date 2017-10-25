var $ = require('jquery');
exports.WordsCloud = WordsCloud;

function WordsCloud(container) {
    var container = $(container);
    if (!chart) {
        chart = container.append('div')
            .attr('id', 'tagsList');
    }
    this.container = container;
    this.chart = chart;
}

WordsCloud.prototype.render = function(data, cfg) {
    var container = this.container;
    var chart = this.chart;
    var width = parseInt(container.css('width'));
    var height = parseInt(container.css('height'));

    var globals = cfg.globals;
    //var fontSize = globals.fontSize;
    // chart.attr('width', width)
    // chart.attr('height', height);

    //html
    var html;

    // var g = $('.container');
    // if(g) {
    //     g = chart.append()
    // }
    // ceate a function to render tabs dynamically
    html += data.map(function(d) {
        return '<span><a href=' + d.url + '>' + d.content + '</a></span>'
    }).join('');
    container.append(html);

    function formatHTML(template, data) {
        var string = String(template);
        if ($.isPlainObject(data)) {
            var placeholder = /\$\{\s*([^\{\}\s]+)\s*\}/g;
            var matches = string.match(placeholder) || [];
            matches.forEach(function(str) {
                var key = str.replace(placeholder, "$1");
                var value = data[key];
                if (!$.isPlainObject(value)) {
                    string = string.replace(str, function() {
                        return value;
                    });
                }
            });
        }
        return string;
    }
}