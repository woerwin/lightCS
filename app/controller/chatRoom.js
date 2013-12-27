sumeru.router.add(
	{
		pattern: '/chatroom',
		action: 'App.chatroom',
		server_render:false
	}
);

App.chatroom = sumeru.controller.create(function(env, session){	
	var username = window.localStorage.getItem("currentUserName");
    var iscustomer = 0;
    if(!username){
        iscustomer = 1;
        if(window.localStorage.getItem("customerName")){
            username = window.localStorage.getItem("customerName");
        }else{
            username = (new Date()).valueOf();
            window.localStorage.setItem("customerName",username);
        }
    }
    var channelname = window.localStorage.getItem("currentChannelName");
    if(session.get('channel')){
        window.localStorage.setItem("currentChannelName",session.get('channel'));
    }
    if(!window.localStorage.getItem("currentChannelName")){
        env.redirect('/',{},true);
        return;
    }
    var getMsgs = function(){				
        channelname = window.localStorage.getItem("currentChannelName");
        session.chatMessages = env.subscribe('pub-chatRoom',channelname, function(msgCollection){
       	    session.bind('chatroom_container', {
          		data    :   msgCollection.find(),
       	    });
        });	
	};
	
	//onload is respond for handle all data subscription
	env.onload = function(){            
		return [getMsgs];            
	};
	
	//sceneRender is respond for handle view render and transition
	env.onrender = function(doRender){
		doRender('chatRoom', ['push', 'right']);
	};
	
	//onready is respond for event binding and data manipulate
	env.onready = function(){		
//		clearHistory();	
	
		var event = 'click';
		var keyboardMap = {
        	'enter' : 13
        };
			
		session.event('chatroom_container', function(){
			
            //back
            document.getElementById('roomBackTochannel').addEventListener(event, roomBackTochannel);

            //logout 
    		//document.getElementById("logout").addEventListener(event,logout);
            if(iscustomer){
                //document.getElementById('roomBackTochannel').style.display = 'none';
            }
			
			document.getElementById("messages").style.height = document.body.clientHeight - 80 + "px";
			document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
			                                                
	   	});
	   
	   	window.onresize = function(){
	   		document.getElementById("messages").style.height = document.body.clientHeight - 80 + "px";
			document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
	   	};
	    
		session.eventMap('#inputMessage', {
            'keydown' : function(e){
                if(e.keyCode == keyboardMap.enter){
                    sendMessage();
                }   
            },
            
            'focus' : function(e){
            },
            
            'blur' : function(e){
                if (this.value.trim() == '') {
                };    
            }
    	});
    	    	
        //send message
        document.getElementById("send").addEventListener(event,sendMessage);
	    
	};
	
	var sendMessage = function(){
		var input = document.getElementById('inputMessage'),
	        inputVal = input.value.trim();
	
	  	if (inputVal == '') {
	  		return false; 
	  	};
	  		  	
	  	if(window.localStorage){
	  		username = username;//window.localStorage.getItem("currentUserName");
	        tag = window.localStorage.getItem("tag");
	        channelname = window.localStorage.getItem("currentChannelName");
	    }
	
	  	session.chatMessages.add({
		  	username: username,
            iscustomer: iscustomer,
		  	content : inputVal, 
		  	time : (new Date()).valueOf() ,
		  	tag: tag ,
		  	channelname: channelname
	  	});
	
	  	session.chatMessages.save();
	  	input.value = '';
	  	input.focus();	  	
//	  	 session.chatMessages.releaseHold();        
	};
	
	var clearHistory = function(){
		session.chatMessages.destroy();
		session.chatMessages.save();
	};
	
	var roomBackTochannel = function(){
		env.redirect("/chatchannel",{u:session.get('u')},true);
	};
	
	var logout = function(){				
    	if(window.localStorage){   	
	    	if(window.localStorage.getItem("tag") == "baiduer"){  		
	    		//use connect.js(OAuth2.0 js SDK), logout
	            baidu.require('connect', function(connect){
		       		connect.init( 'ajD7G3MvCAff4hHSd6B7VM6U',{
		            	status:true
		       		});
		       				       		
		       		connect.getLoginStatus(function(info){		       			 
						connect.logout(function(info){
							if(window.localStorage){
								window.localStorage.removeItem("currentUserName");
								window.localStorage.removeItem("currentUserId");
							}							
							env.redirect("/login");
						});
		       		});
		       	});		       	 
	    	}else{					
				if(window.localStorage){
					window.localStorage.removeItem("currentUserName");
					window.localStorage.removeItem("currentUserId");
				}				
				env.redirect("/login");
	    	}
	    }
	};
	
});

