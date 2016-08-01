(function () {

    function NationalTeamPage() {
        var that = this;


        this.run = function () {
            var $table = $('.table tbody');
            if ($table.length === 0) {
                return;
            }

            var $links = [];

            $table.find('tr').each(function () {
                var $td = $($(this).find('td').get(3));
                if ($td.find('a').length === 2) {
                    $links.push($td.find('a').first(), $td.find('a').last());
                }
            });

            if ($links.length === 0) {
                return;
            }

            $('<a href="#" class="button_small" style="color: #fff; margin-bottom: 10px; float: right; margin-right: 150px;"><div>Call All</div></a>').insertBefore($table.parents('table')).on('click', function () {
                $links.forEach(function ($link) {
                    $.get($link.attr('href'));
                    $link.remove();
                });
            });
        }
    }

    var page = new NationalTeamPage();
    page.run();

}());