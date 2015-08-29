(function () {

    function HockeyPlayerPage(player) {
        var that = this;

		this.createPlayer = function(){
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
			
			return player;
		};
		
        this.run = function(){
			$('.table').each(function(table_index){
				var $table = $(this);
				
				$table.find('thead tr').append('<td class="th th1"><span>ПОР</span></td><td class="th th1"><span>ПОР + опыт</span></td><td class="th th2"><span>ПОР</span></td>');
				
				
				var indexes = {
					exp: 0,
					energy: 0,
					team: 0,
					skills: 0,
					position: 0,
				};
				
				$table.find('thead:first-child td').each(function(index){
					var header = $(this).text().trim().toLowerCase();
					
					if(header == 'эне'){
						indexes.energy = index;
					}
					else if(header == 'сгр'){
						indexes.team = index;
					}
					else if(header == 'опт'){
						indexes.exp = index;
					}
					else if(header == 'врт'){
						indexes.skills = index;
					}
					else if(header == 't'){
						indexes.position = index;
					}
				});
				
				$table.find('tbody tr').each(function(row_index){
					var $line = $(this);
				
					var $cells = $(this).find('td');
					if($cells.length < 10)return;
				
					var player = that.createPlayer();
					
					
					for(i = 0; i < player.getSkillsCount(); i++){
						var skill_id = player.getSkillsList().getSkillIdByNum(i);
						player.getSkillsList().setSkill(skill_id, $($cells.get(i + indexes.skills)).text(), 0);
					}
					player.setPositionBySkills();
					
					if(indexes.position != 0){
						if($($cells.get(indexes.position)).text().length == 0)
							$($cells.get(indexes.position)).text(player.getPositionShortName());
					}
					
					var errors = player.getSkillsErrors();
					for(var skill_id in errors){
						if(errors.hasOwnProperty(skill_id)){
							var error = errors[skill_id];
							var color = error < 0 ? 'green' : 'red';
							var skill_ind = player.getSkillInd(skill_id);
							
							var $cell = $($cells.get(skill_ind + indexes.skills));
							//$cell.html($cell.text() + '<span style="font-size:10px;display:block;color: '+color+';">' + error + '</span>');
						}
					}	
					
					player.setExpirience(parseInt($($cells.get(indexes.exp)).text()));
					
					var energy = $($cells.get(indexes.energy)).text().trim();
					player.setEnergy(parseInt(energy.substr(energy.indexOf('/') + 1)));
					player.setTeamValue(parseInt($($cells.get(indexes.team)).text()));
					
					$line.append('<td class="tr1td1">' + player.getUseOr() + '</td>');
					$line.append('<td class="tr1td2">' + player.getUseOr(true) + '</td>');
					$line.append('<td class="tr1td1">' + player.getUseOr(true, true) + '</td>');
				});
				
			});
		}
    }

    var page = new HockeyPlayerPage();
	page.run();

}());