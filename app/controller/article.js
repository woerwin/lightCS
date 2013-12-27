sumeru.router.add(
	{
		pattern: '/article',
		action: 'App.article',
        server_render:false
	}
);

App.article = sumeru.controller.create(function(env, session){

    var username = window.localStorage.getItem('currentUserName');
    if(username != 'lightCS'){
        env.redirect('/auth',{},true);
        return;
    }
    
    var getMsgs = function(){
		session.articles = env.subscribe('pub-article', function(msgCollection){
			msgCollection.addSorters("time","DESC");
          	session.bind('addArticle', {
              	data    :   msgCollection.find(),
          	});              
	    });
	}
	
	env.onload = function(){		
		return [getMsgs];
	};

	env.onrender = function(doRender){
		doRender("article", ['push','right']);
	};
    

	env.onready = function(){
	    //document.getElementById('backToIndex4').addEventListener('click',goToHome);
        
        var event = 'click';
		var keyboardMap = {
            'enter' : 13
        };
        
		session.event('addArticle', function(){					
			session.eventMap('#article_username', {
			    //enter on pcs, return on mobile
				'keydown' : function(e){
                    if(e.keyCode == keyboardMap.enter){
                        addArticle();
                    }   
                },
                
                'focus' : function(e){
                    session.articles.hold();
                },
                
                'blur' : function(e){
                    if (this.value.trim() == '') {
                        session.articles.releaseHold();  
                    };    
                }
            });
						                
        	document.getElementById('backToIndex4').addEventListener('click',goToHome);
        	document.getElementById('submit_article').addEventListener(event, addArticle);	    			    		
	    });
	};
    
    var addArticle = function(){
		var input = document.getElementById('article_title'),
	        inputVal = input.value.trim();
        
	    var content = document.getElementById('article_content').value;
        var article_username = document.getElementById('article_username').value;
	  	if (inputVal == '' || content == '') {
	  	    alert('标题或内容不能为空！');
	  		return false; 
	  	};
	
	  	session.articles.add({
		  	title: inputVal, 
		  	time : (new Date()).valueOf() ,
		  	content : content,
            username : article_username
	  	});
	
	  	session.articles.save();
	  	input.value = '';   
	  	
	  	session.articles.releaseHold(); 		
		env.redirect("/",{},true);
	};
    
	//跳转到首页
	var goToHome = function(){
		env.redirect('/');
	};

});