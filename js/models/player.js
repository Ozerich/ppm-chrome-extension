function Skill() {

    var _value = 0;

    this.setValue = function (_val) {
        this._value = parseInt(_val);
    };

    this.getValue = function () {
        return this._value;
    };


    var _quality = 0;

    this.setQuality = function (_val) {
        this._quality = parseInt(_val);
    };

    this.getQuality = function () {
        return this._quality;
    }
}

function SkillList(skill_ids) {
    var _data = {}, _skill_pos = {};

    var i = 0;
    for (var skill_id in skill_ids) {
        if (skill_ids.hasOwnProperty(skill_id)) {
            _data[skill_ids[skill_id]] = new Skill();
            _skill_pos[i++] = skill_ids[skill_id];
        }
    }


    this.getSkillIdByNum = function (skill_num) {
        return skill_num in _skill_pos ? _skill_pos[skill_num] : null;
    };

    this.setSkill = function (skill_id, skill_value, skill_quality) {

        _data[skill_id].setValue(skill_value);
        _data[skill_id].setQuality(skill_quality);

        return true;
    };

    this.getSkillValue = function (skill_id) {
        return skill_id in _data ? _data[skill_id].getValue() : 0;
    };

    this.getSkillQuality = function (skill_id) {
        return skill_id in _data ? _data[skill_id].getQuality() : 0;
    };

}

function Player() {
    var that = this;

    var _sport = '';
    var _positions = null;

    this.setSport = function (_value) {
        _sport = _value;
        _positions = Config.get(_sport, 'positions');
    };

    this.getSport = function () {
        return _sport;
    };

    this.skills_list = null;

    this.setSkillIds = function (_ids) {
        this.skills_list = new SkillList(_ids);
    };

    this.getSkillsList = function () {
        return this.skills_list;
    };


    var _position = null;

    this.getPosition = function () {
        return _position;
    };

    this.setPosition = function (_val) {
        _position = _val;
    };


    var _position_levels = {};

    this.addPositionLevel = function (position_id, levels) {
        _position_levels[position_id] = levels;
    };

    this.getPositionLevels = function () {
        return _position_levels;
    };

    this.setPositionBySkills = function () {
        var position_sum, position_data, position_result, position_max = 0;

        for (var position_id in _positions) {
            if (_positions.hasOwnProperty(position_id)) {

                var total_qualities = 0;
                var skills = _positions[position_id].skills;
                for (skill_id in skills) {
                    if (skills.hasOwnProperty(skill_id)) {
                        total_qualities += skills[skill_id];
                    }
                }

                position_data = _positions[position_id];

                position_sum = 0;
                for (var skill_id in position_data.skills) {
                    if (position_data.skills.hasOwnProperty(skill_id)) {
                        position_sum += this.getSkillsList().getSkillValue(skill_id) * (skills[skill_id] / total_qualities);
                    }
                }

                if (position_sum > position_max) {
                    position_max = position_sum;
                    position_result = position_id;
                }
            }
        }

        this.setPosition(position_result);
    };

    this.getUseOr = function () {
        var result = 0;

        var position = this.getPosition();
        var skills = _positions[position].skills;

        for (var skill_id in skills) {
            if (skills.hasOwnProperty(skill_id)) {
                result += this.getSkillsList().getSkillValue(skill_id);
            }
        }

        return result;
    };

    this.getUseQuality = function () {

        var position = this.getPosition();
        var skills = _positions[position].skills;


        var total = 0, result = 0, skill_id;

        for (skill_id in skills) {
            if (skills.hasOwnProperty(skill_id)) {
                total += skills[skill_id];
            }
        }

        for (skill_id in skills) {
            if (skills.hasOwnProperty(skill_id)) {
                result += this.getSkillsList().getSkillQuality(skill_id) * (skills[skill_id] / total);
            }
        }

        return Math.round(result * 10) / 10;
    };


    this.getVisibleSkills = function () {
        return _positions[this.getPosition()].visible;
    };
}

function HockeyPlayer() {
    HockeyPlayer.superclass.constructor.apply(this, arguments);

    this.setSport('hockey');
    this.setSkillIds(['goa', 'def', 'off', 'sho', 'pas', 'tec', 'agr']);

    this.addPositionLevel('goalkeeper', {goa: 1, pas: 2, tec: 2});
    this.addPositionLevel('deffender', {def: 1, pas: 2, agr: 2});
    this.addPositionLevel('winger', {off: 1, tec: 2, agr: 2});
    this.addPositionLevel('center', {off: 1, tec: 2, pas: 2});

}
extend(HockeyPlayer, Player);


function SoccerPlayer() {
    SoccerPlayer.superclass.constructor.apply(this, arguments);

    this.setSport('soccer');
    this.setSkillIds(['goa', 'def', 'mid', 'off', 'sho', 'pas', 'tec', 'spe', 'hea']);

    this.addPositionLevel('goalkeeper', {goa: 1, tec: 2, spe: 2, pas: 4, hea: 4});
    this.addPositionLevel('side_defender', {def: 1, spe: 2, pas: 3, tec: 3, hea: 4});
    this.addPositionLevel('center_defender', {def: 1, pas: 3, tec: 3, spe: 3, hea: 3});
    this.addPositionLevel('side_midfielder', {mid: 1, spe: 2, pas: 3, tec: 3, hea: 4});
    this.addPositionLevel('center_midfielder', {mid: 1, pas: 2, tec: 2, spe: 4, hea: 4});
    this.addPositionLevel('side_forward', {off: 1, spe: 2, tec: 2, pas: 3, hea: 4});
    this.addPositionLevel('center_forward', {off: 1, spe: 2, tec: 3, pas: 4, hea: 4});
}
extend(SoccerPlayer, Player);


function HandballPlayer() {
    HandballPlayer.superclass.constructor.apply(this, arguments);

    this.setSport('handball');
    this.setSkillIds(['goa', 'fip', 'sho', 'blk', 'pas', 'tec', 'spe', 'agr']);

    this.addPositionLevel('goalkeeper', {goa: 1, blk: 2, pas: 3, tec: 4, spe: 4});
    this.addPositionLevel('back', {fip: 1, pas: 2, tec: 3, spe: 4, agr: 4});
    this.addPositionLevel('pivot', {fip: 1, agr: 2, tec: 3, pas: 4, spe: 4});
    this.addPositionLevel('wing', {fip: 1, spe: 2, tec: 3, pas: 4, agr: 4});

}
extend(HandballPlayer, Player);
