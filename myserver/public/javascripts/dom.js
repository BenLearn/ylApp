function historyBack(){
    window.history.back(-1);
}

//资源页面
//var _type ="memory";
var $resource ={
    _type:null,
    link:function(a){   //存储 使用率类型a
        window.location.href = 'cpuTop5.html?_type='+a;         
    },
    //top5 页面实例化
    top5Init:function(){
        $.ajax({
            type:"GET",
            url:"../javascripts/resource.json",
            //cache:false,
            //async:false, //同步
            dataType : "json",
            success:function(data){
                console.log("top5json传输成功");

                //获取路径传参
                var url = location.search; //获取url中"?"符后的字串 ('?_type=a')  
                var theRequest = new Object();
                //console.log(url);
                if( url.indexOf( "?" ) != -1  ){
                    var str = url.substr(1);//substr()方法返回从参数值开始到结束的字符串；
                    var strs = str.split("&");
                    for (var i=0; i<strs.length; i++){
                        theRequest[ strs[i].split( "=" )[0] ] = (strs[i].split("=")[1]);
                    }  
                    //console.log(theRequest._type); //此时的theRequest就是我们需要的参数； 
                }

                var _data = data;
                var _type = theRequest._type;
                //console.log(_type);
                if(_type=="memory"){
                    $type = _data.memory;
                }else if(_type=="time"){
                    $type = _data.time;
                }else{
                    $type = _data.cpu;  //默认  _type=="cpu"
                }
                var tBar = "";
                var tContent = "";
                for(var i=0; i<$type.length; i++){
                    if($type[i].num>80){
                        tBar +='<li class="clearfix red">';
                    }else if($type[i].num>60 && $type[i].num<=80){
                        tBar +='<li class="clearfix orange">';
                    }else if($type[i].num>40 && $type[i].num<=60){
                        tBar +='<li class="clearfix pink">';
                    }else if($type[i].num>20 && $type[i].num<=40){
                        tBar +='<li class="clearfix yellowPro">';
                    }else if($type[i].num>=0 && $type[i].num<=20){
                        tBar +='<li class="clearfix yellow">';
                    }                   
                         tBar += '<div class="font14">'+(i+1)+'</div>'
                                +'<div>'+$type[i].name+'</div>'
                                +'<div>'
                                    +'<div class="plan_box" style="width:'+$type[i].num+'%">'
                                        +'<div class="plan shine"><span></span></div>'
                                    +'</div>'
                                +'</div>'
                                +'<div>'+$type[i].num+'%</div>'
                            +'</li>'
                }
                for(var j=0; j<$type.length; j++){
                    tContent += '<tr>'
                                    +'<td>'+$type[j].name+'</td>'
                                    +'<td>'+$type[j].ip+'</td>'
                                    +'<td>'+$type[j].num+'%</td>'
                                +'</tr>'
                }
                $("#top5_bar ul").append(tBar);
                $("#top5_content table tbody").append(tContent);
            },
            error:function(){
                console.log("top5json传输不成功");
            }

        })
    },
}