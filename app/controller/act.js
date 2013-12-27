sumeru.router.add(
	{
		pattern: '/act',
		action: 'App.act',
        server_render:false
	}
);

App.act = sumeru.controller.create(function(env, session){
    
    var title = session.get('title');

    var getMsgs = function(){
        session.articles = env.subscribe('pub-article',title, function(msgCollection){
            msgCollection.addSorters("time","ASC");
       	    session.bind('lightAct', {
          		data    :   msgCollection.find(),
       	    });              						
        });
    };
    
    env.onload = function(){		
		return [getMsgs];
	};

	env.onrender = function(doRender){
		doRender("act", ['push','right']);
	};
    

	env.onready = function(){
	   session.event('lightAct', function(){
	       
	    document.getElementById('backToIndex3').addEventListener('click',goToHome);
        if(window.localStorage.getItem('currentUserName') == 'lightCS'){
            document.getElementById('addArticle').style.display = 'block';
        }
        document.getElementById('addArticle').addEventListener('click',goToAddArticle);
        
       });
	};
    
	//跳转到首页
	var goToHome = function(){
		env.redirect('/');
	};

    var goToAddArticle = function(){
		env.redirect('/article');
	};

});