function PPM_Datapoint(_api_url, _sport) {

    if (_api_url.length === 0) {
        throw "Datapoint API URL is not set";
    }

    this.api_url = _api_url;
    this.sport = _sport;

    this.getCommandUrl = function (command) {
        return this.api_url + command + '?sport=' + this.sport;
    };

    this.parseParams = function (params) {
        var result = {};

        for(var ind in params){
            var value = '';
            var param = params[ind];

            if(param instanceof Array){
                value = param[0] + '-' + param[1];
            }
            else{
                value = param;
            }

            result[ind] = value;
        }


        return result;
    };

    this.Request = function (command, params, callbacks) {

        if (command.length === 0) {
            throw "Datapoint command cannot be empty";
        }

        params = params || {};
        callbacks = callbacks || {};

        if('complete' in callbacks === false){
			callbacks.complete = new Function();
		}
		
		if('error' in callbacks === false){
			callbacks.error = new Function();
		}
		
		if('success' in callbacks === false){
			callbacks.success = new Function();
		}


        $.ajax({
            url: this.getCommandUrl(command),
            method: 'POST',
            dataType: 'json',
            data: this.parseParams(params),
            success: function (data) {
                if (data.success) {
                    callbacks.success(data.data);
                } else {
                    callbacks.error(data.data);
                }
            },
            error: function (jqXHR, textStatus) {
                callbacks.error(textStatus);
            },
            complete: function (data) {
                callbacks.complete(data);
            }
        });

    }

}

PPM_Datapoint.prototype.GetTransfers = function (params, callbacks) {
    this.Request('GetTransfers', params, callbacks);
}

PPM_Datapoint.prototype.GetCareerHistory = function (params, callbacks) {
    this.Request('GetCareerHistory', params, callbacks);
}