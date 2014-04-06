function extend(Child, Parent) {
    var F = function () {
    };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}


function PPM_Class(_sport) {
    this.sport = _sport;

    this.Datapoint = new PPM_Datapoint('http://ppm.ozis.by/api/', this.sport);

    this.initLayout = function () {

        var $header = $('<div class="ppm-header"></div>');

        var $season_link = $('.top_info_team a').last().clone();

        $header.append($season_link);

        $header.append('<a href="/ru/pro-zone.html" class="btn-pro">PRO</a>');

        $('.top_info_box').after($header);
    };

    this.initLayout();
}

var sport = document.location.href.substr(7);
sport = sport.substr(0, sport.indexOf('.'));
var PPM = new PPM_Class(sport);