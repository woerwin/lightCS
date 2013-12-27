module.exports = function(fw){

	fw.publish('articleModel', 'pub-article', function(tag,callback){

		var collection = this;
        var where = {};
        //console.log('222:'+tag + (typeof tag));
        if((typeof tag) == 'string') where.title = tag;
		collection.find(where, {sort:[['time',-1]]}, function(err, items){
			callback(items);
		 });
	},{
		beforeInsert : function(serverCollection, structData, userinfo, callback){
           
            structData.time = (new Date()).valueOf();           // 以服务器时间为准
           
            callback(structData);
       }
	});   
}