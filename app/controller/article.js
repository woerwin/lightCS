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
            
            var myUploader = Library.fileUploader.init({
                routerPath:"/files",
                form:document.getElementById("upload_form"),
                // target:document.getElementById("myfile1"),
                onSuccess:function(urlLink){//成功之后的处理，此处有保存文件的逻辑  
                    document.getElementById('article_pic').value = urlLink;//用于用户使用/保存
                },
                fileSelect:function(e){//用户选择文件之后的处理
                    var oFile = e.target.files[0];
                    var oImage = document.getElementById('preview');
                    // prepare HTML5 FileReader
                    //console.log('File Info : ' + oFile);
                    var oReader = new FileReader();
                    oReader.onload = function(e){
                        if (oFile.type){
                            oImage.src = e.target.result;
                            oImage.onload = function () { // binding onload event
                                console.log(oFile,oReader);
                            };
                            oReader.readAsDataURL(oFile);
                        }
                    };
                },
                onProgress:function(e){//进度更新
                    
                },
                onError:function(e){//出错
                    alert('上传错误！');
                },
                onAbort:function(e){//中断
                    alert('上传中断！');
                },
            });
            
            document.getElementById("startupload").addEventListener("click",function(){
                myUploader.startUpload();
                return false;
            });
						                
        	document.getElementById('backToIndex4').addEventListener('click',goToHome);
        	document.getElementById('submit_article').addEventListener(event, addArticle);	    			    		
	    });
	};
    
    var addArticle = function(){
		var input = document.getElementById('article_title'),
	        inputVal = input.value.trim();
        
        var desc = document.getElementById('article_desc').value;
	    var content = document.getElementById('article_content').value;
        var article_username = document.getElementById('article_username').value;
        var article_pic = document.getElementById('article_pic').value;
        if(!article_pic){
            article_pic  = '/assets/pic/logo.jpg';
        }
	  	if (inputVal == '' || content == '') {
	  	    alert('标题或内容不能为空！');
	  		return false; 
	  	};
	
	  	session.articles.add({
		  	title: inputVal, 
		  	time : (new Date()).valueOf() ,
            desc : desc,
		  	content : content,
            username : article_username,
            pic : article_pic
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