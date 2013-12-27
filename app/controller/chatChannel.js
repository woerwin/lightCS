/**
 * 
 * @author     ganxun(ganxun@baidu.com)
 * @version    1.0 
 * @desc       
 */


sumeru.router.add(
	{
		pattern: '/chatchannel',
		action: 'App.chatchannel',
		server_render:false
	}
);

App.chatchannel = sumeru.controller.create(function(env,session){	
	var username = window.localStorage.getItem('currentUserName');
    var isadmin = 0;
    if(username){
        isadmin = 1;
    }
    if(!username){
        username = session.get('u');
        if(!username){
            env.redirect('/auth',{},true);
            return;
        }
    }
    var getMsgs = function(){
		session.messages = env.subscribe('pub-chatchannel',username, function(msgCollection){
          	session.bind('chatChannel', {
              	data    :   msgCollection.find(),
          	});              
	    });
	}
	
	env.onload = function(){		
		return [getMsgs];
	};
	
	env.onrender = function(doRender){
		doRender('chatchannel',["push","left"]);
	};
	
	env.onready = function(){
		
//		document.getElementById("channel").style.height = document.body.clientHeight - 40 + "px";
//		clearHistory();   
		var event = 'click';		
		session.event('chatChannel', function(){  			                      	       	
        	document.getElementById('chatchannel_list_click').addEventListener(event, function(e){
        		var e = e || window.event,
					target = e.target || e.srcElement;
				
				if(target.tagName.toLowerCase() == 'button' && target.hasAttribute('channelName')){
					var channelName = target.getAttribute('channelName');
                    var channelType = target.getAttribute('channelType');
					if(window.localStorage)
		             {
		             	window.localStorage.setItem("currentChannelName",channelName);			             	
		             }
                     if(channelType == '0' && !isadmin){
                        session.messages.update({'state':1},{'channelname':channelName});
                        session.messages.save();
                        session.messages.releaseHold();
                     }
		             env.redirect("/chatroom",{channel:channelName,u:username},true);
				}
                
                if(target.tagName.toLowerCase() == 'span' && target.hasAttribute('channelName')){
					var channelName = target.getAttribute('channelName');
                    session.messages.update({'state':0},{'channelname':channelName});
                    session.messages.save();
                    session.messages.releaseHold();
				}
                
                if(target.tagName.toLowerCase() == 'span' && target.hasAttribute('delName')){
					var channelName = target.getAttribute('delName');
                    //session.messages.update({'state':2},{'channelname':channelName});
                    session.messages.destroy({'channelname':channelName});
                    session.messages.save();
                    session.messages.releaseHold();
				}
                
        	});	
        	
        	document.getElementById('back').addEventListener(event, back);
        	document.getElementById('create').addEventListener(event, createChannel);
            
            if(!isadmin){
                document.getElementById('create').style.display = 'none';
            }
	    });
		
	};
	
	var back = function(){
		env.redirect("/");
	};
	
	var createChannel = function(){
		env.redirect("/createchannel");
	};
		
	var clearHistory = function(){
		session.messages.destroy();
		session.messages.save();
	};
	
});
