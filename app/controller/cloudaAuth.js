sumeru.router.add(
	{
		pattern: '/auth',
		action: 'App.cloudaAuth',
        server_render:false
	}
);

//sumeru.router.setDefault('App.cloudaAuth');

App.cloudaAuth = sumeru.controller.create(function(env, session){

	env.onrender = function(doRender){
		doRender("cloudaAuth", ['push','left']);
	};

	var myAuth = sumeru.auth.create(env);

	env.onready = function(){
		document.getElementById('login').addEventListener('click',login);
        document.getElementById('backToIndex2').addEventListener('click',goToHome);
        document.getElementById('toRegister').addEventListener('click',goToRegister);

		//定义用户事件，这是一个全局的事件
		var statusChangeHandle = function(err,status){
		    if(err){
		        // err.code | err.msg
                //document.getElementById('popup').style.display = "none";
		        //alert("登录失败！错误信息："+err.msg+"  ----"+status);
                alert("登录失败！用户名或密码不正确？");
		        return;
		    };

		    switch(status){
		        case "not_login" :
		            // 未登录
		            break;
		        case "logined" :
		            // 已登录
		            //document.getElementById('popup').style.display = "none";
		            userInfo = myAuth.getUserInfo();
		          	//document.getElementById('show_userinfo').innerHTML = "username:"+userInfo.token+"  email:"+userInfo.info.email+"  userid:"+userInfo.userId;
                    window.localStorage.setItem('currentUserName',userInfo.token);
                    window.sessionStorage.setItem('currentUserName',userInfo.token);
                    //alert('登录成功！');
                    //window.location.href = '/';
                    env.redirect('/',{},true);return;
		            break;
		        case "doing_login" :
		            // 登录中
		            //document.getElementById('popup').style.display = "block";
		            break;
		        default:
		            // do something
		    }
		}
		//增加用户时间监听器，包括已登录、未登录、登录中等等，执行后就会根据当前的状态触发一次绑定用户事件
		myAuth.on('statusChange',statusChangeHandle);
	};

	//完成登陆验证
	var login = function(){
		var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

		//登录，登陆过程中每一次状态改变都会触发用户“statusChange”
		myAuth.login(username,password,{},'local');
	};
    
    //首页
    var goToHome = function(){
		env.redirect('/');
	};
    
    //注册
    var goToRegister = function(){
		env.redirect('/register');
	};

});