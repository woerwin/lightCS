sumeru.router.add(
	{
		pattern: '/index',
		action: 'App.index',
        server_render:false
	}
);

sumeru.router.setDefault('App.index');

App.index = sumeru.controller.create(function(env, session){

    var getMsgs = function(){
		session.articles = env.subscribe('pub-article', function(msgCollection){
			msgCollection.addSorters("time","DESC");
          	session.bind('lightIndex', {
              	data    :   msgCollection.find(),
                isadmin : 1
          	});              
	    });
	}
	
	env.onload = function(){		
		return [getMsgs];
	};

	env.onrender = function(doRender){
		doRender("index", ['push','left']);
	};
    
    var myAuth = sumeru.auth.create(env);

	env.onready = function(){
        var event = 'click';		
        session.event('lightIndex', function(){
	   
    	    document.getElementById('chatchannel_bar').addEventListener('click',goToChatchannel); 
    	    document.getElementById('login_bar').addEventListener('click',goToAuth); 
    		document.getElementById('register_bar').addEventListener('click',goToRegister);
            document.getElementById('logout_bar').addEventListener('click',doLogout);
    
    		//定义用户事件，这是一个全局的事件
    		var statusChangeHandle = function(err,status){
    		    if(err){
    		        // err.code | err.msg
    		        return;
    		    };
    
    		    switch(status){
    		        case "not_login" :
    		            // 未登录
                        document.getElementById('chatchannel_bar').style.display = "none";
                        document.getElementById('logout_bar').style.display = "none";
                        document.getElementById('login_bar').style.display = "block";
                        document.getElementById('register_bar').style.display = "block";
    		            break;
    		        case "logined" :
    		            // 已登录
                        document.getElementById('login_bar').style.display = "none";
                        document.getElementById('register_bar').style.display = "none";
                        document.getElementById('chatchannel_bar').style.display = "block";
                        document.getElementById('logout_bar').style.display = "block";
    		            break;
    		        default:
    		            // do something
    		    }
    		}
    		//增加用户时间监听器，包括已登录、未登录、登录中等等，执行后就会根据当前的状态触发一次绑定用户事件
    		myAuth.on('statusChange',statusChangeHandle);
        
            //var event = 'click';		
		    //session.event('lightIndex', function(){ 	       	
        	document.getElementById('index_list_click').addEventListener(event, function(e){
        		var e = e || window.event,
					target = e.target || e.srcElement;
				//console.log(target.tagName.toLowerCase() + target.getAttribute('id'));
				if(target.tagName.toLowerCase() == 'span' && target.hasAttribute('title')){
					var title = target.getAttribute('title');
                    var article_username = target.getAttribute('username');
                    if(article_username){
                        env.redirect("/chatchannel",{u:article_username},true);
                    }else{
                        env.redirect("/act",{title:title},true);
                    }
				}
                
                if(target.tagName.toLowerCase() == 'button' && target.hasAttribute('title')){
					var title = target.getAttribute('title');
                    var smr_id = target.getAttribute('data-id');
                    session.articles.destroy({smr_id:smr_id});
                    session.articles.save();
                    session.articles.releaseHold();
				}			
        	});
            			    		
	    });	
	};
	//跳转到注册页面
	var goToRegister = function(){
		env.redirect('/register');
	};

	var doLogout = function(){
		myAuth.logout();
        window.localStorage.removeItem('currentUserName');
        window.sessionStorage.removeItem('currentUserName');
        env.refresh();
        session.articles.releaseHold();
		//alert("退出成功！");
        if(confirm("退出成功！")){
            //window.location.href = '/';
            env.redirect('/',{},true);
            //env.refresh();
        }
	};

	//登录
	var goToAuth = function(){
		env.redirect('/auth');
	};
    
    //客服
	var goToChatchannel = function(){
		env.redirect('/chatchannel',{},true);
	};

});