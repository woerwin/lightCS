sumeru.router.add(
    {
        pattern: '/register',
        action: 'App.register',
        server_render:false
    }
);

//sumeru.router.setDefault('App.register');

App.register = sumeru.controller.create(function(env, session){

    env.onrender = function(doRender){
        doRender("register", ['push','left']);
    };

    var myAuth = sumeru.auth.create(env);
    env.onready = function(){
        document.getElementById('register').addEventListener('click',userRegister);
        document.getElementById('backToIndex').addEventListener('click',goToHome);
        document.getElementById('toAuth').addEventListener('click',goToAuth);
    };

    var userRegister = function(){
        var username = document.getElementById('register_username').value;
        var password = document.getElementById('register_password').value;
        var email = document.getElementById('register_email').value;
        var mobile = document.getElementById('register_mobile').value;
        document.getElementById('register_username').value = '';
        document.getElementById('register_password').value = '';
        
        myAuth.registerValidate({token:username,email:email,mobile:mobile},'local',function(err,isUsefull){
            if(isUsefull){
                // 注册信息验证成功，可以进行注册
                myAuth.register(username,password,{email:email,mobile:mobile},'local',function(err){
                    if(err){
                        // 注册失败
                        alert("注册失败！");
                        return;
                    }
                    env.redirect('/auth');
                });
            }else{
                // 注册信息验证失败
                //err.code || err.msg
                //alert("验证失败，error code:"+err.code+" ,error message："+err.msg);
                alert('验证失败，请正确填写相关信息！');
            }
        });
    };

    //首页
    var goToHome = function(){
		env.redirect('/');
	};
    
    //登录
    var goToAuth = function(){
		env.redirect('/auth');
	};
    
});
