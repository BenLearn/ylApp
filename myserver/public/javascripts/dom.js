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

function mescrollInit(){   //滚动加载实例化
    $(function(){        
        //链接
        
         
        //创建MeScroll对象
        var mescroll = new MeScroll("mescroll", {
            down: {
                use: false,
                auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
                callback: downCallback //下拉刷新的回调
            },
            up: {
                auto: true, //是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
                isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
                callback: upCallback, //上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
                empty: {
                        //icon: "../res/img/mescroll-empty.png", //图标,默认null
                        tip: "暂无相关数据~", //提示
                        //btntext: "去逛逛 >", //按钮,默认""
                        //btnClick: function(){//点击按钮的回调,默认null
                        //	alert("点击了按钮,具体逻辑自行实现");
                        //} 
                    },
                loadFull:{ 
                use : true , 
                delay : 500 
                },    
                toTop:{ //配置回到顶部按钮
                    //src : "../res/img/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                    //offset : 1000
                }
            }
        });
        
        /*下拉刷新的回调 */
        function downCallback(){
            //联网加载数据
            getListDataFromNet(0, 1, function(data){
                
                //联网成功的回调,隐藏下拉刷新的状态
                mescroll.endSuccess();
                //设置列表数据
                setListData(data, false);
            }, function(){
                //联网失败的回调,隐藏下拉刷新的状态
                mescroll.endErr();
            });
        }
        
        /*上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
        function upCallback(page){
            //联网加载数据
            
            $.ajax({
                type:"GET",
                url:"../javascripts/alarm_list.json",
                dataType:"json",
                //async:false, //同步
                success:function(curPageData){
                    setTimeout(function () {
                            var up = curPageData.up;
                            page.size=5;              //一页显示多少条
                            var _pageSize =page.size; //一页显示多少条 (存储)
                            //console.log("page.num="+page.num+", page.size="+page.size+", curPageData.length="+up.length);
                            var newArr=[];
                            var pageNum = page.num;     //当前页数
                            var _maxAll = page.num*page.size;//自定义本来显示的总数量 如20
                            var _preAll = (page.num-1)*page.size; //自定义本来显示的总数量-一页数量 如15
                            if(curPageData.up.length<_maxAll){
                                var pageSize = curPageData.up.length-_preAll;   //一页显示多少条 (特殊，当前页 数量小于平常定义的一页 如curPageData.up是18,平常定义一页5条，在第四页的时候只能显示3条)
                            }else{
                                var pageSize = page.size;   //一页显示多少条
                            }
                            console.log(pageSize);
                            
                            for(var i=0; i<pageSize; i++){ 
                                var upIndex=(pageNum-1)*_pageSize+i;
                                var newObj= up[upIndex];
                                //console.log(newObj);
                                newArr.push(newObj);
                            }
                            
                            var listDom=document.getElementById("alarm-list");
                            for (var i = 0; i < newArr.length; i++) {
                                var newObj=newArr[i];
                                var str='';
                                str+='<div class="alarm_box"><ul>'
                                            +'<li class="clearfix">告警标题：</li>'
                                            +'<li class="clearfix c_blue" onclick="anoutUrl()">'+newObj.title+'</li>'
                                            +'<li class="clearfix"><span>告警来源：</span><a>'+newObj.source+'</a></li>'
                                            +'<li class="clearfix"><span>资源类型：</span><a>'+newObj.type+'</a></li>'
                                            +'<li class="clearfix"><span>处理人：</span><a>'+newObj.user+'</a></li>'
                                            +'<li class="clearfix"><span>重要度：</span><a class="c_orange">'+newObj.important+'</a></li>'
                                            +'<li class="clearfix"><span>状态：</span><a class="c_green">'+newObj.state+'</a></li>'
                                            +'<li class="clearfix"><span>发生时间：</span><a>'+newObj.time+'</a></li>'
                                            +'<li class="clearfix"><span>最后发生时间：</span><a>'+newObj.lastTime+'</a></li>'
                                +'</ul>'
                                +'<div class="alarm_box_button"><button type="button" class="am-btn bt_blue">确认</button><button type="button" class="am-btn bt_orange">忽略</button><button type="button" class="am-btn bt_red">关闭</button></div>'
                                +'</div>';
                                //console.log(newObj.id);
                                var liDom=document.createElement("li");
                                liDom.innerHTML=str;
    
                                //if (isAppend) {
                                    listDom.append(liDom);//加在列表的后面,上拉加载
                                //} else{
                                //	listDom.insertBefore(liDom, listDom.firstChild);//加在列表的前面,下拉刷新
                                //}
                            }
    
                    
                    //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                    //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空,显示empty配置的内容;
                    //列表如果无下一页数据,则提示无更多数据,(注意noMoreSize的配置)
                    
                    //方法一(推荐): 后台接口有返回列表的总页数 totalPage
                    //必传参数(当前页的数据个数, 总页数)
                    //mescroll.endBySize(curPageData.length, totalSize);
                    //mescroll.endByPage(up.length, 5);
                    
                            
                    //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
                    //必传参数(当前页的数据个数, 总数据量)
                    //mescroll.endBySize(curPageData.length, totalSize);
                            
                    //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
                    //必传参数(当前页的数据个数, 是否有下一页true/false)
                    //mescroll.endSuccess(curPageData.length, hasNext);
    
                    //alert(_thisSize);
                    if(page.num>3){
                        mescroll.endSuccess(newArr.length, false);
                    }else{
                        mescroll.endSuccess(newArr.length, true);
                    } 
                    
                            
                    //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
                    //如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
                    //如果传了hasNext,则翻到第二页即可显示无更多数据.
                    //mescroll.endSuccess(curPageData.length);
                    
                    //设置列表数据
                    //setListData(curPageData);//自行实现 TODO
    
                    },1000)
    
                    
                },
                error: function(e) {
                    //联网失败的回调,隐藏下拉刷新和上拉加载的状态
                    mescroll.endErr();
                    alert();
                }
            })
    
    
        }
        
        
    });
    
}

function anoutUrl(){
    window.location.href = "about.html";
}
