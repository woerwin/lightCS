sumeru.router.add(
    {
        pattern    :   '/files', //pattern用于定义匹配上传文件的uri
        type  :   'file',
        max_size_allowed:'500k',//support k,m
        file_ext_allowed:'' ,//allow all use '' , other use js array ["jpg",'gif','png','ico']
        upload_dir:"upload",//default dir is public
        rename:function(filename){//if rename_function is defined,the uploaded filename will be deal with this function.
            return filename+"_"+(new Date()).valueOf();
        }
    },
    {
        pattern    :   '/article',
        action  :   'App.article',
        server_render : true
    }
);
