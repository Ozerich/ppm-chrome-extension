function Player() {
    var that = this;

    var sport;
    this.config = null;
    this.setSport = function (_value) {

        if (_value in Config === false) {
            throw "Не найден конфиг для " + _value;
        }

        sport = _value;
        this.config = Config[sport];
    };

    this.pro_mode = false;
    this.is_at = false;
    this.is_position_set = false;

    this.skills_data = {};

    this.skills_ids = [];
    this.setSkillIds = function (_ids) {
        this.skills_ids = _ids;
    };


    this.positions = {};
    this.addPosition = function (_name, _data) {
        this.positions[_name] = _data;
    };

    this.position = '';
    this.position_config = null;
    this.setPosition = function (_position) {
        this.position = _position;
        this.position_config = 'positions' in this.config && _position in this.config['positions'] ? this.config['positions'][_position] : null;

        if (this.is_position_set === false) {
            for (var skill_id in this.positions[this.position]) {
                if (this.positions[this.position].hasOwnProperty(skill_id)) {
                    this.skills_data[skill_id][2] = this.positions[this.position][skill_id];
                }
            }
        }
    };


    this.construct = function () {
        this.pro_mode = $('.protext .checkbox_yes').length > 0;
        this.is_at = $($('.table').first().find('tr').get(1)).find('td').first().attr('title') !== undefined;
        this.is_position_set = $('.gray_box_profile strong').length > 0;

        for (var i = 0; i < this.skills_ids.length; i++) {
            this.skills_data[this.skills_ids[i]] = [0, 0];
        }

    };

    this.getPosition = function () {
        var position_id, skill_id, position_data;

        if (this.is_position_set) {
            for (position_id in this.positions) {
                if (this.positions.hasOwnProperty(position_id)) {
                    var found = true;
                    position_data = this.positions[position_id];
                    for (skill_id in position_data) {
                        if (position_data.hasOwnProperty(skill_id)) {
                            if (this.getSkillLevel(skill_id) != position_data[skill_id]) {
                                found = false;
                                break;
                            }
                        }
                    }
                    if (found) {
                        this.setPosition(position_id);
                        return true;
                    }
                }
            }
        }
        else {
            var position = null, position_max = 0, position_sum;

            for (position_id in this.positions) {
                if (this.positions.hasOwnProperty(position_id)) {
                    position_sum = 0;
                    position_data = this.positions[position_id];
                    for (skill_id in position_data) {
                        if (position_data.hasOwnProperty(skill_id)) {
                            position_sum += this.getSkillValue(skill_id);
                        }
                    }
                    if (position_sum > position_max) {
                        position_max = position_sum;
                        position = position_id;
                    }
                }
            }

            this.setPosition(position);
            return true;
        }

        return false;
    };

    this.addSkill = function (skill_id, value, quality, level) {

        if (skill_id in this.skills_data === false) {
            throw "Неверный ID скилла";
        }

        this.skills_data[skill_id] = [parseInt(value), parseInt(quality), parseInt(level)];
    };

    this.getSkillValue = function (skill_id) {

        if (skill_id in this.skills_data === false) {
            return 0;
        }

        return this.skills_data[skill_id][0];
    };

    this.getSkillQuality = function (skill_id) {

        if (skill_id in this.skills_data === false) {
            return 0;
        }

        return this.skills_data[skill_id][1];
    };

    this.getSkillLevel = function (skill_id) {
        if (skill_id in this.skills_data === false) {
            return 0;
        }

        return this.skills_data[skill_id][2];
    };

    this.parseSkills = function () {


        var $table = $('.table').first().find('tbody'), $skill_value, $skill_quality;
        for (var i = 0; i < this.skills_ids.length; i++) {

            if (this.pro_mode) {
                var $skill_cell = $($table.find('td').get(i + (this.is_at ? 1 : 0)));
                $skill_value = $skill_cell.find('*').first();
                $skill_quality = $skill_cell.find('*').last();
            }
            else {
                var tds = $($('.table').first().find('tr').get(i + 1)).find('td');
                $skill_value = $(tds[1]);
                $skill_quality = $(tds[3]);
            }

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

            that.addSkill(this.skills_ids[i], $skill_value.text(), $skill_quality.text(), level);
        }


    };

    this.getSkillsForHide = function () {
        if (!this.position_config) {
            return false;
        }
        var visible = 'visible' in this.position_config ? this.position_config['visible'] : [];
        var result = [];
        for (var i = 0; i < this.skills_ids.length; i++) {
            if (visible.indexOf(this.skills_ids[i]) === -1) {
                result.push(this.skills_ids[i]);
            }
        }
        return result;
    };


    this.hideHiddenSkills = function () {

        if (!this.pro_mode)return;

        var skills_to_hide = this.getSkillsForHide();

        var $table = $('.table').first();

        for (var i = 0; i < skills_to_hide.length; i++) {
            var skill_id = skills_to_hide[i];
            var pos = this.skills_ids.indexOf(skill_id);

            $table.find('tr').each(function () {
                $($(this).find('td:visible').get(pos + (that.is_at ? 1 : 0))).addClass('hidden');
            });
        }

        $table.find('tr').each(function () {
            $(this).find('.hidden').hide();
        });

        $table.after('<a href="#" onclick="$(\'.table\').first().find(\'.hidden\').show();$(this).hide();return false;">показать все скиллы</a>');

    };


    this.getUseOr = function () {
        var result = 0;

        for (var i = 0; i < this.skills_ids.length; i++) {
            if (this.getSkillLevel(this.skills_ids[i]) > 0) {
                result += this.getSkillValue(this.skills_ids[i]);
            }
        }

        return result;
    };

    this.getUseQuality = function () {

        if (!this.position_config || !this.position_config.skills) {
            return 0;
        }

        var total = 0, result = 0, skill_id;

        for (skill_id in this.position_config.skills) {
            total = total + this.position_config.skills[skill_id];
        }
        for (skill_id in this.position_config.skills) {
            result = result + this.getSkillQuality(skill_id) * (this.position_config.skills[skill_id] / total);
        }

        return Math.round(result * 10) / 10;
    };


	this.getPlayerId = function(){
		return parseInt($('.h1_add_info').first().text().trim().substr(4));
	};

	this.loadCareerHistory = function(){
		PPM.Datapoint.GetCareerHistory({player_id: this.getPlayerId()}, {success: function(response){

			var html = '<ul class="ppm_career_history">';

			for(var age in response){
				html += '<li><span class="ppm_career_history_age">' + age + '</span>: <span class="ppm_career_history_career">' + response[age] + '</span></li>';
			}

			html += '</ul>';


			$('#life_time').html($('#life_time').html() + '<br>' + html);
		}});
	}
}

function HockeyPlayer() {
    var that = this;

    HockeyPlayer.superclass.constructor.apply(this, arguments);

    this.setSport('hockey');
    this.setSkillIds(['goa', 'def', 'off', 'sho', 'pas', 'tec', 'agr']);

    this.addPosition('goalkeeper', {goa: 1, pas: 2, tec: 2});
    this.addPosition('deffender', {def: 1, pas: 2, agr: 2});
    this.addPosition('winger', {off: 1, tec: 2, agr: 2});
    this.addPosition('center', {off: 1, tec: 2, pas: 2});

    this.construct();
}
extend(HockeyPlayer, Player);


function SoccerPlayer() {

    SoccerPlayer.superclass.constructor.apply(this, arguments);

    this.setSport('soccer');
    this.setSkillIds(['goa', 'def', 'mid', 'off', 'sho', 'pas', 'tec', 'spe', 'hea']);

    this.addPosition('goalkeeper', {goa: 1, tec: 2, spe: 2, pas: 4, hea: 4});
    this.addPosition('side_defender', {def: 1, spe: 2, pas: 3, tec: 3, hea: 4});
    this.addPosition('center_defender', {def: 1, pas: 3, tec: 3, spe: 3, hea: 3});
    this.addPosition('side_midfielder', {mid: 1, spe: 2, pas: 3, tec: 3, hea: 4});
    this.addPosition('center_midfielder', {mid: 1, pas: 2, tec: 2, spe: 4, hea: 4});
    this.addPosition('side_forward', {off: 1, spe: 2, tec: 2, pas: 3, hea: 4});
    this.addPosition('center_forward', {off: 1, spe: 2, tec: 3, pas: 4, hea: 4});

    this.construct();
}
extend(SoccerPlayer, Player);


function HandballPlayer() {
    HandballPlayer.superclass.constructor.apply(this, arguments);

    this.setSport('handball');
    this.setSkillIds(['goa', 'fip', 'sho', 'blk', 'pas', 'tec', 'spe', 'agr']);

    this.addPosition('goalkeeper', {goa: 1, blk: 2, pas: 3, tec: 4, spe: 4});
    this.addPosition('back', {fip: 1, pas: 2, tec: 3, spe: 4, agr: 4});
    this.addPosition('pivot', {fip: 1, agr: 2, tec: 3, pas: 4, spe: 4});
    this.addPosition('wing', {fip: 1, spe: 2, tec: 3, pas: 4, agr: 4});

    this.construct();
}
extend(HandballPlayer, Player);


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

player.parseSkills();
player.getPosition();
player.loadCareerHistory();

if (player.position != '') {
    player.hideHiddenSkills();

    $('.player_info').first().append('<div style="float: right">ПОР: ' + player.getUseOr() + ', ПКВС: ' + player.getUseQuality() + '</div>');
}

