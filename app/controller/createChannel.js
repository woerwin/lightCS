sumeru.router.add(
	{
		pattern: '/createchannel',
		action: 'App.createchannel'
	}
);

App.createchannel = sumeru.controller.create(function(env,session){
    
    var username = window.localStorage.getItem('currentUserName');
	var getMsgs = function(){		
		session.messages = env.subscribe('pub-chatchannel', function(msgCollection){
			msgCollection.addSorters("time","DESC");
			//manipulate synced collection and bind it to serveral view blocks.
          	session.bind('createChannel', {
              	data    :   msgCollection.find(),
          	});              
	    });
	}
	
	env.onload = function(){		
		return [getMsgs];
	};
	
	env.onrender = function(doRender){
		doRender('createchannel',["push","left"]);
	};
	
	env.onready = function(){		
		//document.getElementById("messages").style.height = document.body.clientHeight - 40 + "px";
		var event = 'click';
		var keyboardMap = {
            'enter' : 13
        };
        
		session.event('createChannel', function(){					
			session.eventMap('#channel_describe', {     			
     				//enter on pcs, return on mobile
				'keydown' : function(e){
                    if(e.keyCode == keyboardMap.enter){
                        createChannel();
                    }   
                },
                
                'focus' : function(e){
                    session.messages.hold();
                },
                
                'blur' : function(e){
                    if (this.value.trim() == '') {
                        session.messages.releaseHold();  
                    };    
                }
            });
						                
        	document.getElementById('backTochannel').addEventListener(event, backTochannel);
        	document.getElementById('submit_channel').addEventListener(event, createChannel);
            
            session.messages.onValidation = function(ispass, runat, validationResult){
                if(ispass){
                    //通过验证
                    console.log('ok...');
                }else{
                    //回滚数据
                    alert('添加失败，检查坐席名称是否重复！');
                    console.log('failed...');
                    this.rollback();
                }
                //显示验证结果
                var clientInfo = (runat=='client'?'客户端':'服务端')+(ispass==true?'验证通过':'验证失败')+'<br/>';
                console.log(clientInfo);
    
                //显示详细验证结果
                for(var i = validationResult.length-1; i>=0; i--){
                    console.log((runat=='client'?'客户端':'服务端')+'验证结果：'+validationResult[i].msg);
                }
    
                //ensureSave() 服务端验证通过 后需要 重新渲染一次数据
                //save() 服务端验证失败 后需要 重新渲染一次数据
                if(runat == 'server'){
                    if((ispass&&this.isEnsureSave())
                        ||(!ispass&&!this.isEnsureSave())){
                        this.render();
                    }
                }
    
            };
            	    			    		
	    });
		
	};
	
	var backTochannel = function(){
		env.redirect("/chatchannel");
	};
	
	var createChannel = function(){
		var input = document.getElementById('channel_title'),
	        inputVal = input.value.trim();
        var describe = document.getElementById('channel_describe').value;
        
        var typeValue = document.getElementsByName("channel_type");
        var channelType;
        for(var i=0;i<typeValue.length;i++)
        {
            if(typeValue[i].checked){
                channelType = parseInt(typeValue[i].value);
                break;    
            }              
        }
	
	  	if (inputVal == '') {
	  	    alert('坐席名称不能为空！');
	  		return false; 
	  	};
	
	  	session.messages.add({
		  	channelname: inputVal, 
            username: username,
		  	time : (new Date()).valueOf() ,
		  	describe : describe,
            state : 0,
            channeltype : channelType
	  	});
	
	  	session.messages.save();
	  	input.value = '';   
	  	
	  	session.messages.releaseHold(); 		
		env.redirect("/chatchannel",{},true);
	};	
});
