(function(win, doc){
    win.lsl = win.lsl || {}

    lsl.ajax = function(options){
        var xhr = null;
        var params = formsParams(options.data);
        //创建对象
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest()
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        // 连接
        if(options.type == "GET"){
            xhr.open(options.type,options.url + "?"+ params,options.async);
            xhr.send(null)
        } else if(options.type == "POST"){
            xhr.open(options.type,options.url,options.async);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send(params);
        }
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                options.success(xhr.responseText);
            }
        }
        function formsParams(data){
            var arr = [];
            for(var prop in data){
                arr.push(prop + "=" + data[prop]);
            }
            return arr.join("&");
        }
     
    }

    lsl.strToObj = function(str){
        return JSON.parse(str)
    }

    lsl.objToStr = function(data){
        return JSON.stringify(data)
    }

    lsl.setSessionstorage = function(key, value){
        if(!window.sessionStorage){
            alert('浏览器不支持sessionStorage')
            return
        }

        if(typeof(value)== 'object'){
            value = lsl.objToStr(value)
        }
        sessionStorage.setItem(key, value);
    }   

    lsl.getSessionstorage = function(key){
        if(!window.sessionStorage){
            alert('浏览器不支持sessionStorage')
            return
        }
        return sessionStorage.getItem(key)    
    }


    lsl.timeFormat = function(timestamp){
                       // 1536283774652 
        if(typeof timestamp == 'string'){
            timestamp = parseInt(timestamp)
        }
        if(timestamp < 1000000000000){
            timestamp *= 1000
        }
        var date = new Date(timestamp);
        var Y = date.getFullYear(),
            M = date.getMonth()+1,
            D = date.getDate(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();

        M = M < 10 ? '0' + M : M
        D = D < 10 ? '0' + D : D
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        
        return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s
    }


    lsl.getUrlParam = function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); return null; 
    }


    lsl.runOnce = function(fn, context){
        var result;
        return function(){
            if(fn){
                result = fn.apply(context || this, arguments);
                fn = null;
            }
            return result;
        }
    }

    
})(window, document);