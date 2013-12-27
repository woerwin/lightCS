Library.getUsername = sumeru.Library.create(function(exports){	
	
	exports.getUsername = function(){
		
		if(window.localStorage.getItem("currentUserName")){
			return window.localStorage.getItem("currentUserName");
		}else{
			if(window.localStorage.getItem("customerName")){
    			return window.localStorage.getItem("customerName");
    		}
		}
		
	};
    
    exports.getChannelName = function(){
		if(window.localStorage.getItem("currentChannelName")){
			return window.localStorage.getItem("currentChannelName");
		}else{}
	};
    
    exports.getDisplay = function(){
        if(window.localStorage.getItem("currentUserName") == "lightCS"){
			return ' style="display: block;" '; 
		}else{
		    return ' style="display: none;" ';  
		}
    };
    
    exports.getStateDisplay = function(username,state){
        if(window.localStorage.getItem("currentUserName") != username){
			return ' style="display: none;" '; 
		}else{
		    if(state == 0){
		      return ' style="display: none;" '; 
		    }else{
		      return ' style="display: block;" '; 
		    } 
		}
    };
    
    exports.getDelDisplay = function(username,state){
        if(window.localStorage.getItem("currentUserName") != username){
			return ' style="display: none;" '; 
		}else{
            return ' style="display: block;" ';
		}
    };
    
    exports.getAccessDisplay = function(username,state,channeltype){
        if(window.localStorage.getItem("currentUserName") == username){
			return ' style="display: block;" '; 
		}else{
		    if(channeltype){
		      return ' style="display: block;" ';
		    }else{
		      if(state){
		          return ' style="display: none;" ';
		      }else{
		          return ' style="display: block;" ';
		      }
		    }
		}
    };
	
	return exports;
});