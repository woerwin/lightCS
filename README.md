lightCS（轻客服）
=======

    lightCS(light Customer Service System),轻型跨平台在线客服系统...

###基于

[NodeJs](http://nodejs.org) + [sumeru/clouda](https://github.com/brandnewera/clouda)  ( + [BAE3](http://developer.baidu.com))

###环境需求

    安装nodejs、mongodb（BAE3对应nodejs环境，数据库配置app/server_config/database.js,bae.js）
    
    非IE浏览器

###安装、使用

	npm install -g sumeru
	
### 初始化项目

	sumeru init ./myproject
    
    用lightCS覆盖mypreject下的所有文件
	
### 运行项目

	cd myproject
	
	sumeru start