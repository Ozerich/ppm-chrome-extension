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
    };

    this.skills_data = {};

    this.construct = function () {
        this.pro_mode = $('.protext .checkbox_yes').length > 0;

        for (var i = 0; i < this.skills_ids.length; i++) {
            this.skills_data[this.skills_ids[i]] = [0, 0];
        }

    };

    this.getPosition = function () {

        for (var position_id in this.positions) {
            var found = true;
            var position_data = this.positions[position_id];
            for (var skill_id in position_data) {
                if (this.getSkillLevel(skill_id) != position_data[skill_id]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                this.setPosition(position_id);
                return true;
            }
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
        throw "Abstract method";
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
        throw "Abstract method";
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
            result = result + this.getSkillValue(skill_id) * (this.position_config.skills[skill_id] / total);
        }

        return Math.round(result * 10) / 10;
    };
}

function HockeyPlayer() {
    var that = this;


    HockeyPlayer.superclass.constructor.apply(this, arguments);

    this.setSport('hockey');
    this.setSkillIds(['goa', 'def', 'off', 'sho', 'pas', 'tec', 'agr']);

    this.addPosition('goalkeeper', {'goa': 1, 'pas': 2, 'tec': 2});
    this.addPosition('deffender', {def: 1, pas: 2, agr: 2});
    this.addPosition('winger', {off: 1, tec: 2, agr: 2});
    this.addPosition('center', {off: 1, tec: 2, pas: 2});

    this.construct();


    this.parseSkills = function () {

        var _skills_map = {
            goa: 'goalie',
            def: 'defense',
            off: 'attack',
            sho: 'shooting',
            pas: 'passing',
            tec: 'technique_attribute',
            agr: 'aggressive'
        };

        if (this.pro_mode) {

            for (var skill_id in _skills_map) {
                if (_skills_map.hasOwnProperty(skill_id)) {
                    var $skill_value = $('#' + _skills_map[skill_id]);

                    var level = 0;
                    if ($skill_value.get(0).tagName.toUpperCase() == 'STRONG') {
                        level = 1;
                    }
                    else if ($skill_value.css('color') == 'rgb(178, 34, 34)') {
                        level = 2;
                    }

                    that.addSkill(skill_id, $skill_value.text(), +$skill_value.parents('td').find('span').last().text(), level);
                }
            }
        }

        else {
            var ind = 1;
            for (var skill_id in _skills_map) {
                if (_skills_map.hasOwnProperty(skill_id)) {
                    var tds = $($('.table').first().find('tr').get(ind)).find('td');
                    that.addSkill(skill_id, $(tds[1]).text(), $(tds[3]).text());
                    ind++;
                }
            }
        }

    };


    this.hideHiddenSkills = function () {

        var skills_to_hide = this.getSkillsForHide();


        for (var i = 0; i < skills_to_hide.length; i++) {
            var skill_id = skills_to_hide[i];
            var pos = this.skills_ids.indexOf(skill_id);

            if (this.pro_mode) {
                $('.table').first().find('tr').each(function () {
                    $($(this).find('td:visible').get(pos)).addClass('hidden');
                });
            }
        }
        $('.table').first().find('tr').each(function () {
            $(this).find('.hidden').hide();
        });

        $('.table').first().after('<a href="#" onclick="$(\'.table\').first().find(\'td.hidden\').show();$(this).hide();return false;">показать все скиллы</a>');

    };


}
extend(HockeyPlayer, Player);


function SoccerPlayer() {

}
extend(SoccerPlayer, Player);


function HandballPlayer() {

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

if (player.position != '') {
    player.hideHiddenSkills();

    $('.player_info').first().append('<div style="float: right">ПОР: ' + player.getUseOr() + ', ПКВС: ' + player.getUseQuality() + '</div>');
}

