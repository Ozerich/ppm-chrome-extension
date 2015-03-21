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

    this.getSkillsAmount = function(){
        var result = 0;
        for (var skill_id in skill_ids) {
            if (skill_ids.hasOwnProperty(skill_id)) {
                result += this.getSkillValue(skill_ids[skill_id]);
            }
        }
        return result;
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
    this.skill_ids = null;

    this.is_my_player = false;

    this.setSkillIds = function (_ids) {
        this.skill_ids = _ids;
        this.skills_list = new SkillList(_ids);
    };
    this.getSkillIds = function(){
        return this.skill_ids;
    };
	
	this.getSkillInd = function(skill_name){
		var list = this.getSkillIds();
		for(var i = 0; i< list.length; i++){
			if(list[i] == skill_name){
				return i;
			}
		}
		return -1;
	};

    this.getSkillsList = function () {
        return this.skills_list;
    };

	this.getSkillsCount = function(){
		return this.getSkillIds().length;
	};
	
    var _expirience = 0;
    this.getExpirience = function(){
        return _expirience;
    };
    this.setExpirience = function(value){
        _expirience = parseInt(value);
    };
	
	var _energy = 0;
    this.getEnergy = function(){
        return _energy;
    };
    this.setEnergy = function(value){
        _energy = parseInt(value);
    };
	
	var _team_value = 0;
    this.getTeamValue = function(){
        return _team_value;
    };
    this.setTeamValue = function(value){
        _team_value = parseInt(value);
		_team_value = isNaN(_team_value) ? 0 : _team_value;
    };


    var _career = 0;
    this.getCareer = function(){
        return _career;
    };
    this.setCareer = function(value){
        _career = parseInt(value);
    };

    var _age = 0;
    this.getAge = function(){
        return _age;
    };
    this.setAge = function(value){
        _age = parseInt(value);
    };


    var _position = null;

    this.getPosition = function () {
        return _position;
    };
	
	this.getPositionShortName = function(){
		return 'short' in _positions[_position] ? _positions[_position]['short'] : '';
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

    this.getUseOr = function (calc_exp, calc_total) {
        
		calc_exp = calc_exp || false;
		calc_total = calc_total || false;
		
		var result = 0;

		
        var position = this.getPosition();
        var skills = _positions[position].skills;

        for (var skill_id in skills) {
            if (skills.hasOwnProperty(skill_id)) {
				if(this.getSport() == 'handball' && position != 'goalkeeper' && (skill_id == 'blk' || skill_id == 'sho')){
					continue;
				}
                result += this.getSkillsList().getSkillValue(skill_id);
            }
        }
		
		
		if(this.getSport() == 'handball' && position != 'goalkeeper'){
			result += Math.max(this.getSkillsList().getSkillValue('blk'), this.getSkillsList().getSkillValue('sho'));
		}

		var skills_amount = result;
		
		if(calc_total){
			var tired_percent = 100 - this.getEnergy();
			var tired_value = skills_amount / 100 * tired_percent;
			
			result = result - tired_value;
		}


		if(calc_exp){
			var exp_percent = this.getExpirience() * 0.2;
			var exp_value = skills_amount * (exp_percent / 100);
			
			result = result + exp_value;
		}
		
		if(calc_total){
			var team_percent = this.getTeamValue() * 0.2;
			var team_value = Math.floor(skills_amount * (team_percent / 100));
			
			result = result + team_value;
		}
		
		
        return isNaN(result) ? '-' : Math.floor(result);
    };

    this.getOr = function(){
        return this.getSkillsList().getSkillsAmount();
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
	
	this.getSkillsErrors = function(){
		
		var position = this.getPosition();
		if(!position){
			return [];
		}
		
		var total = 0;
        var skills = _positions[position].skills;

		for (skill_id in skills) {
            if (skills.hasOwnProperty(skill_id)) {
                total += skills[skill_id];
            }
        }
		
		for (skill_id in skills) {
            if (skills.hasOwnProperty(skill_id)) {
                skills[skill_id] = skills[skill_id] / total;
            }
        }
		
		var result = {};
		var main_skill_ind = '';
		var main_skill_val = 0;
		var need_main_skill_val = 0;
		for (skill_id in skills) {
		
			if(main_skill_ind.length == 0){
				main_skill_ind = skill_id;
				main_skill_val = this.getSkillsList().getSkillValue(main_skill_ind);
				need_main_skill_val = main_skill_val;
				continue;
			}
			
			if(skill_id == 'sho')continue;
			
            var skill_diff = skills[skill_id] / skills[main_skill_ind];
			var need_value = main_skill_val * skill_diff;
			var skill_value = this.getSkillsList().getSkillValue(skill_id);
			var error = Math.floor(need_value - skill_value);
			
			if(Math.abs(error) > 5){
				if(error > 0){
					result[skill_id] = Math.floor(error);
				}
				else{
					need_main_skill_val = Math.max(need_main_skill_val, skill_value / skill_diff);
				}
			}
        }
		
		if(need_main_skill_val != main_skill_val){
			result[main_skill_ind] = Math.floor(need_main_skill_val - main_skill_val);
			main_skill_val = need_main_skill_val;
			
			for (skill_id in skills) {
				if(skill_id == main_skill_ind || skill_id == 'sho'){
					continue;
				}
				
				var skill_diff = skills[skill_id] / skills[main_skill_ind];
				var need_value = main_skill_val * skill_diff;
				var skill_value = this.getSkillsList().getSkillValue(skill_id);
				var error = Math.floor(need_value - skill_value);
				
				if(Math.abs(error) > 5){
					result[skill_id] = Math.floor(error);					
				}
			}	
		}
		
		return result;
	},


    this.getVisibleSkills = function () {
        return _positions[this.getPosition()].visible;
    };
	
	this.getKeySkills = function () {
        var skills = _positions[this.getPosition()].skills;
		
		var result = [];
		for(var i in skills){
			if(skills.hasOwnProperty(i)){
				result.push(i);
			}
		}	
		
		return result;
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
