Model.articleModel = function(exports){
	exports.config = {
		fields : [
			{name:'title',type:'string',validation:'unique'},
			{name: 'time', type: 'datatime',defaultValue: 'now()'},
            {name:'desc',type:'string',defaultValue:''},
			{name:'content',type:'string',defaultValue:''},
            {name:'username',type:'string',defaultValue:''},
            {name:'pic',type:'string',defaultValue:'/assets/pic/logo.jpg'}
		]
	};
};