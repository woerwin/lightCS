Model.chatChannelModel = function(exports){
	exports.config = {
		fields : [
			{name:'channelname',type:'string',validation:'unique'},
            {name:'username',type:'string'},
			{name: 'time', type: 'datatime',defaultValue: 'now()'},
			{name:'describe',type:'string',defaultValue:''},
            {name:'state',type:'int',defaultValue:0},
            {name:'channeltype',type:'int',defaultValue:0}
		]
	};
};