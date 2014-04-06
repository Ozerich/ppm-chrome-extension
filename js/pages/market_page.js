(function () {

    function MarketPage() {

        var $table = $('#table-1');

        var players = {};

        $table.find('tbody tr').each(function () {
            var link_url = $(this).find('td').first().find('a').last().attr('href');
            var id = parseInt(link_url.substr(link_url.indexOf('?data=') + 6));
            players[id] = $(this);

            $(this)
        });


        this.getCareerHistory = function () {

            for (var player_id in players) {
                if (players.hasOwnProperty(player_id)) {
                    (function (player_id, $row) {

                        var age = +$($row.find('td').get(1)).html();
                        var $career_cell = $($row.find('td').get(4));
                        var career = parseInt($career_cell.text());
                        $career_cell.html($career_cell.html().replace('/6', ''));

                        PPM.Datapoint.GetCareerHistory({player_id: player_id}, {success: function (response) {

                            if ((age - 1) in response && +response[age - 1] == career + 1) {
                                $career_cell.css('color', 'rgb(24, 167, 24)').css('font-weight', 'bold');
                                $career_cell.html($career_cell.html() + '(-1)');
                            }
                            else if ((age - 2) in response && +response[age - 2] == career + 1) {
                                $career_cell.css('font-weight', 'bold');
                                $career_cell.html($career_cell.html() + '(-2)');
                            }
                            else if ((age - 3) in response && +response[age - 3] == career + 1) {
                                $career_cell.html($career_cell.html() + '(-3)');
                            }

                            if (('18' in response && response['18'] == 6) || ('22' in response && response['22'] == 5)) {
                                $career_cell.html($career_cell.html() + 'MAX').css('font-weight', 'bold');
                            }


                        }});
                    })(player_id, players[player_id]);
                }
            }
        }
    }


    var page = new MarketPage();

    page.getCareerHistory();

})();