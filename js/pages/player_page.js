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
        var is_at = $($('.table').first().find('tr').get(1)).find('td').first().attr('title') !== undefined;
        var player_id = parseInt($('.h1_add_info').first().text().trim().substr(4));

        this.parseSkills = function () {

            var $skill_value, $skill_quality;
            var $table = $('.table:first tbody');

            var skill_levels = {};

            if (pro_mode) {
                var td_count = $table.find('tr').first().find('td').length;
                $table.find('tr').first().find('td').each(function (index, cell) {
                    if (index == 0 || index == td_count - 1) {
                        return;
                    }

                    var skill_id = that.player.getSkillsList().getSkillIdByNum(index - 1);

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
            $('.player_info').first().append('<div style="float: right">ПОР: ' + player.getUseOr() + ', ПКВС: ' + player.getUseQuality() + '</div>');
        };


        this.loadCareerHistory = function () {
            PPM.Datapoint.GetCareerHistory({player_id: player_id}, {success: function (response) {

                var html = '<ul class="ppm_career_history">';
                for (var age in response) {
                    html += '<li><span class="ppm_career_history_age">' + age + '</span>: <span class="ppm_career_history_career">' + response[age] + '</span></li>';
                }
                html += '</ul>';


                $('#life_time').html($('#life_time').html() + '<br>' + html);
            }});
        };


        this.hideHiddenSkills = function () {

            var position = this.player.getPosition();
            if (!position) {
                return;
            }
            var visible = this.player.getVisibleSkills();

            var $table = $('.table').first();

            $table.find('tr').each(function () {
                $(this).find('td:visible').each(function (index) {
                    if(index === 0)return;
                    var skill_id = player.getSkillsList().getSkillIdByNum(index - 1);
                    $(this).toggleClass('hidden', visible.indexOf(skill_id) === -1);
                });
            });

            $table.find('.hidden').hide();

            $table.after('<a href="#" onclick="$(\'.table\').first().find(\'.hidden\').show();$(this).hide();return false;">показать все скиллы</a>');

        };
    }

    var page = new PlayerPage(player);

    page.parseSkills();
    page.printUse();
    page.loadCareerHistory();
    page.hideHiddenSkills();


}());