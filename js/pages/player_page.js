(function () {
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


    function PlayerPage(player) {
        var that = this;

        this.player = player;

        var pro_mode = $('.protext .checkbox_yes').length > 0;
        var is_position_set = $('.gray_box_profile strong').length > 0;
        var player_id = parseInt($('.h1_add_info').first().text().trim().substr(4));

        this.player.setExpirience($('#experience').text());
        this.player.setCareer(parseInt($('#life_time span').text()));
        this.player.setAge($('#age').text());

        var is_at = $('.table').first().find('tr').last().find('td').first().attr('title') !== undefined;
        if (is_at) {
            var $table = $('.table:first');
            $table.find('thead tr').first().find('td').first().remove();
            $table.find('tbody tr').first().find('td').first().remove();
            $table.find('tbody tr').last().find('td').first().remove();
        }

        var energy = '';
        if (pro_mode) {
            this.player.setTeamValue(parseInt($('#table-2 tr:last-child td:nth-child(6)').text()));
            energy = $('#table-2 tr:last-child td:nth-child(7)').text();
        }
        else {
            this.player.setTeamValue(parseInt($('#table-1 tr:nth-child(5) td:last-child').text()));
            energy = $('#table-1 tr:nth-child(6) td:last-child').text();
        }
        energy = energy.substr(energy.indexOf('/') + 1);
        this.player.setEnergy(parseInt(energy));

        this.player.is_my_player = $('.profile_player_right a').length >6;

        this.parseSkills = function () {

            var $skill_value, $skill_quality;
            var $table = $('.table:first tbody');

            var skill_levels = {};

            if (pro_mode) {
                var td_count = $table.find('tr').first().find('td').length;

                $table.find('tr').first().find('td').each(function (index, cell) {
                    if (index >= td_count - 1) {
                        return;
                    }

                    var skill_id = that.player.getSkillsList().getSkillIdByNum(index);

                    that.player.getSkillsList().setSkill(skill_id, $(cell).find('*').first().text(), $(cell).find('*').last().text());

                    $skill_value = $(this).find('*').first();
                    var level = 0;
                    if ($skill_value.find('strong').length > 0 || $skill_value.css('font-weight') == 'bold') {
                        level = 1;
                    }
                    else if ($skill_value.css('color') == 'rgb(178, 34, 34)') {
                        level = 2;
                    }
                    else if ($skill_value.css('color') == 'rgb(0, 0, 187)') {
                        level = 3;
                    }
                    else if ($skill_value.css('color') == 'rgb(0, 153, 0)') {
                        level = 4;
                    }

                    skill_levels[skill_id] = level;
                });
            }

            if (is_position_set) {
                var positions = that.player.getPositionLevels();
                var position_result = null;

                for (var position_id in positions) {
                    if (positions.hasOwnProperty(position_id)) {
                        var found = true;
                        var position_data = positions[position_id];
                        for (var skill_id in position_data) {
                            if (position_data.hasOwnProperty(skill_id)) {
                                if (skill_levels[skill_id] != position_data[skill_id]) {
                                    found = false;
                                    break;
                                }
                            }
                        }
                        if (found) {
                            position_result = position_id;
                            break;
                        }
                    }
                }

                if (position_result) {
                    that.player.setPosition(position_result);
                }
                else {
                    that.player.setPositionBySkills();
                }
            }
            else {
                that.player.setPositionBySkills();
            }
        };

        this.printUse = function () {

            var params = {
                'ПКВС': player.getUseQuality(),
                'ПОР': player.getUseOr(),
                'ПОР с опытом': player.getUseOr(true),
                'ПОР в команде': player.getUseOr(true, true),
            };

            var html = '';
            var ind = 0;
            for (var label in params) {
                ind++;
                if (params.hasOwnProperty(label)) {
                    html += '<div style="width: 25%; float: left;' + (ind == 4 ? 'text-align:right' : '') + '"><span style="font-size: 13px; font-weight: normal">' + label + ':</span> <span style="font-size: 15px">' + params[label] + '</span></div>';
                }
            }

            $('.player_info').first().append('<div style="margin-top: 15px;overflow: hidden;">' + html + '</div>');
        };

        this.loadCareerHistory = function () {
            PPM.Datapoint.GetCareerHistory({player_id: player_id}, {
                success: function (response) {

                    var html = '<ul class="ppm_career_history">';
                    for (var age in response) {
                        html += '<li><span class="ppm_career_history_age">' + age + '</span>: <span class="ppm_career_history_career">' + response[age] + '</span></li>';
                    }
                    html += '</ul>';


                    $('#life_time').html($('#life_time').html() + '<br>' + html);
                }
            });
        };

        this.loadTransfers = function () {
            var or = this.player.getOr();
            var expirience = this.player.getExpirience();
			
			var skill_ids = this.player.getSkillIds();
			var visible_skills = this.player.getKeySkills();
			var skill_values = {};
			for(var i = 0; i < visible_skills.length; i++){
				skill_values[skill_ids.indexOf(visible_skills[i]) + 1] = this.player.skills_list.getSkillValue(visible_skills[i]);
			}
			
            PPM.Datapoint.GetTransfers({
                age: this.player.getAge(),
                career: this.player.getCareer(),
				skills: skill_values,
                expirience: expirience
            }, {
                success: function (response) {

                    var $transfer_block = $('.table_profile');

                    var $block = $('<table id="transfers_last"><thead><tr><th>ID</th><th>Возраст</th><th>Карьера</th><th>Опыт</th><th>Цена</th><th>ОР</th><th>Скиллы</th></tr></thead><tbody></tbody></table>');
					
					$transfer_block.after($block);

                    var skill_ids = that.player.getVisibleSkills();
                    for (var i = 0; i < response.length; i++) {
                        var row = response[i];

                        var skills_html = '';
                        for (var j in row.skills) {
                            if (row.skills.hasOwnProperty(j)) {
								
								var skill_id = that.player.getSkillsList().getSkillIdByNum(j - 1);
								if(skill_ids.indexOf(skill_id) != -1){
									skills_html +=skill_id + ': ' + row.skills[j][0] + '(' + row.skills[j][1] + ')<br>';
								}
                            }
                        }

                        var price_formatted = '';
                        var z = 1;
                        for (var j = row.price.length - 1; j >= 0; j--, z++) {
                            price_formatted = row.price[j] + price_formatted;
                            if (z == 3) {
                                price_formatted = ' ' + price_formatted;
                                z = 0;
                            }
                        }
                        price_formatted = price_formatted.trim();


                        $block.find('tbody').append('<tr><td>' + row.id + '</td><td>' + row.age + '</td><td>' + row.career + '</td><td>' + row.expirience +
                        '</td><td>' + price_formatted + '</td><td>' + row.or + '</td>' +
                        '<td style="font-size: 9px; text-align: left;">' + skills_html + '</td>' +
                        '</tr>');
                    }
                }
            });
        };

        this.hideHiddenSkills = function () {

            var position = this.player.getPosition();
            if (!position) {
                return;
            }
            var visible = this.player.getVisibleSkills();

            var $table = $('.table').first();

            $table.find('tr').each(function () {
                var td_count = $(this).find('td').length;
                $(this).find('td:visible').each(function (index) {
                    if (index == td_count - 1)return;
                    var skill_id = player.getSkillsList().getSkillIdByNum(index);
                    $(this).toggleClass('hidden', visible.indexOf(skill_id) === -1);
                });
            });

            $table.find('.hidden').hide();

            $table.after('<a href="#" onclick="$(\'.table\').first().find(\'.hidden\').show();$(this).hide();return false;">показать все скиллы</a>');

        };

        this.printSkillProportions = function () {
            var position = this.player.getPosition();

            if (!position) {
                return;
            }

            var visible = this.player.getVisibleSkills();
            var total = 0;
            var skills = {};
            var max_skill = 0;

            for (var i = 0; i < visible.length; i++) {

                for (var j = 0; j < player.getSkillsCount(); j++) {
                    var skill_id = player.getSkillsList().getSkillIdByNum(j);
                    if (skill_id == visible[i]) {
                        var skill_value = player.getSkillsList().getSkillValue(skill_id);
                        total += skill_value;

                        skills[skill_id] = skill_value;
                        max_skill = Math.max(skill_value, max_skill);
                    }
                }
            }

            var k = 100 / max_skill;

            for (var skill_id in skills) {
                if (skills.hasOwnProperty(skill_id)) {
                    skills[skill_id] *= k;
                }
            }


            var html = '<tr>';

            for (var i = 0; i < player.getSkillsCount(); i++) {
                html += '<td class="tr' + (i % 2) + 'td1">';

                var skill_id = player.getSkillsList().getSkillIdByNum(i);
                if(skill_id in skills){
                    html += Math.round(skills[skill_id]);
                }

                html += '</td>';
            }

            html += '<td class="tr' + (player.getSkillsCount() % 2) + 'td1"></td></tr>';

            $('.table').first().append(html);


            /*
             $table.find('tr').each(function () {
             var td_count = $(this).find('td').length;
             $(this).find('td:visible').each(function (index) {
             if (index == td_count - 1)return;
             var skill_id = player.getSkillsList().getSkillIdByNum(index);
             $(this).toggleClass('hidden', visible.indexOf(skill_id) === -1);
             });
             });*/
        };
    }

    var page = new PlayerPage(player);

    page.parseSkills();
    page.printUse();

    if (player.is_my_player == false) {
        page.printSkillProportions();
    }

    page.hideHiddenSkills();

    page.loadCareerHistory();
    page.loadTransfers();

}());