(function () {

    function DraftPage() {
        var that = this;

        this.$button = null;

        this.addButton = function () {
            var $form = $('form').last();

            var $buttons_row = $form.find('>div > div > div').first();

            $buttons_row.find('button').hide();

            this.$button = $('<button>Изучить всех</button>').appendTo($buttons_row);
        };

        this.run = function () {
            this.addButton();

            this.$button.on('click', function () {
                $(this).hide();
                that.start();
                return false;
            });
        };

        this.start = function () {
            var $table = $('table').last();
            var $rows = $table.find('tbody').find('tr');
            var data = [];

            $rows.each(function () {
                var $career = $(this).find('span');
                var potential = $career.parents('td').next().next().text();

                data.push({
                    $row: $(this),
                    id: +$(this).attr('id').substr(2),
                    scouted: $(this).find('td').last().find('div').length > 2,
                    career: parseInt($career.text()),
                    potential: potential
                });
            });

            data.sort(function (a, b) {
                if (a.potential != b.potential) {
                    a.potential = a.potential == '?' ? 'Z' : a.potential;
                    b.potential = b.potential == '?' ? 'Z' : b.potential;
                    return a.potential < b.potential ? -1 : 1;
                }

                if (a.career == b.career) {
                    return a.scouted < b.scouted ? 1 : -1;
                }
                return a.career < b.career ? 1 : -1;
            });

            $table.find('tbody').html('');

            data.forEach(function (row) {
                $table.append(row.$row);
            });

            var fieldValue = data.map(function (row) {
                return 'p[]=' + row.id
            }).join('&');

            $table.find('.scouting_button_free').each(function () {
                $(this).trigger('click');
            });

            $('#order').val(fieldValue).parents('form').submit();
        };
    }

    var page = new DraftPage();
    page.run();

}());