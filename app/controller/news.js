/**
 * Created with JetBrains WebStorm.
 * User: yunlong
 * Date: 13-8-17
 * Time: 下午5:52
 * To change this template use File | Settings | File Templates.
 */
sumeru.router.add(

    {
        pattern: '/news',
        action: 'App.news'
    }

);

//sumeru.router.setDefault('App.news');

App.news = sumeru.controller.create(function(env, session){

    var view = 'news';
    var page = 1;

    var getNews = function(){
        if(session.get('page')){
            page = session.get('page');
        }
        session.news = env.subscribe('pubnews',page, function(newsCollection){

            var obj = newsCollection.getData()[0];
            session.bind('newsBlock', {
                'topNews' : obj['topnews']
            });
        });
    };


    env.onload = function(){
        return [getNews];
    }

    env.onrender = function(doRender){
        doRender(view, ['push','left']);
    };
    
    env.onready = function(){
        page = parseInt(page);
        document.getElementById('prePage').addEventListener('click',function(e){
            page = page - 1;
            if(page == 0) page = 1;
            session.set('page',page);
            session.commit();
            //env.redirect('/news',{page:page},true);
        });
        document.getElementById('nextPage').addEventListener('click',function(e){
            page++;
            session.set('page',page);
            session.commit();
            //env.redirect('/news',{page:page},true);
        });
    };

});