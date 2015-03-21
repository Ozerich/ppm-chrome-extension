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
        },
		
		this.getAveragePrice = function () {

            for (var player_id in players) {
                if (players.hasOwnProperty(player_id)) {
                    (function (player_id, $row) {
					
						var player = null;
						
						if (sport == 'hockey') {
							player = new HockeyPlayer();
						}
						else if (sport == 'soccer') {
							player = new SoccerPlayer();
						}
						else if (sport == 'handball') {
							player = new HandballPlayer();
						}
						
						player.setCareer($($row.find('td').get(4)).text());
						player.setAge($($row.find('td').get(1)).html());
						player.setExpirience($($row.find('td').get($row.find('td').length - 3)).text());
						
						var skill_list = player.getSkillsList();
						for(var j = 0, i = 5; i < $row.find('td').length - 3; i++, j++){
							var cell_value = $($row.find('td').get(i)).html();
							cell_value = cell_value.substr(0, cell_value.indexOf('<'));
							skill_list.setSkill(player.getSkillsList().getSkillIdByNum(j), cell_value, 0);
						}
						
						player.setPositionBySkills();
						
						var skill_ids = player.getSkillIds();
						var visible_skills = player.getKeySkills();
						var skill_values = {};
						for(var i = 0; i < visible_skills.length; i++){
							skill_values[skill_ids.indexOf(visible_skills[i]) + 1] = player.skills_list.getSkillValue(visible_skills[i]);
						}
						
						PPM.Datapoint.GetTransfers({
							age: player.getAge(),
							career: player.getCareer(),
							skills: skill_values,
							expirience: player.getExpirience()
						}, {
							success: function (response) {
								if(response.length == 0){
									return;
								}
								
								var total = 0;
								for(var i = 0; i < response.length; i++){
									total += +response[i].price;
								}
								
								var average = Math.ceil(total / response.length);
								
								$row.find('td').first().html($row.find('td').first().html() + '<center><b>' + average.formatMoney(0, ' ', ' ') + '</b></center>');
							}
						});
						
                    })(player_id, players[player_id]);
                }
            }
        }
    }


    var page = new MarketPage();

    page.getCareerHistory();
	page.getAveragePrice();

})();