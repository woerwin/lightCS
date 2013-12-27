module.exports = function(fw){

	fw.publish('articleModel', 'pub-getarticle', function(channelName,callback){

		var collection = this;console.log('333:'+channelName);
				
		collection.find({'smr_id':channelName}, {sort:[['time',1]]}, function(err, items){
			callback(items);
		 });
	},{
		beforeInsert : function(serverCollection, structData, userinfo, callback){
           
            structData.time = (new Date()).valueOf();           // 以服务器时间为准
           
            callback(structData);
            
      	}
	});   
}
