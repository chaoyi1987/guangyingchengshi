let lloading = null;
function showLoading() {
  lloading=layer.open({type: 2,shadeClose:false});
}

function hideLoading() {
  layer.close(lloading);
}
export default function move(){


    $(document).ready(function (){


        let [timer,video,num,iNew] = [null,document.querySelector("#video"),0,0];

        /*定义图片数组*/
        let oImgArr = [
            "./common/images/enter_citybg_4.png","./common/images/home_btn1_c.png","./common/images/home_btn2_9.png",
            "./common/images/home_btn3_3.png","./common/images/home_btn4_d.png","./common/images/home_phone_3.png",
            "./common/images/HW_bg_6.png","./common/images/icon_2.png","./common/images/list_bg_d.png",
            "./common/images/logo_5.png","./common/images/return_0.png"
        ];

        for (let i=0;i<oImgArr.length;i++){

            let oImgnew = new Image();

            oImgnew.src = oImgArr[i];

            oImgnew.onload = function (){

                num++;
                iNew = (num/oImgArr.length).toFixed(2)*100;

                if (iNew >= 100){

                    iNew = 100;


                    showLoading();
                    /* 0:速度  function:回调函数 */
                    $("#home").show(0,function (){
                      hideLoading()


                    });


                }

            };

        }

    });

    /*$.ajax({
            url: 'https://api.h5doo.com/jssdk?url=' + encodeURIComponent(location.href.split('#')[0]),
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.code == 200) {
                    var appId = data.data.appId;
                    var timestamp = data.data.timestamp;
                    var nonceStr = data.data.nonceStr;
                    var signature = data.data.signature;
                    wx.config({
                        debug: false,
                        appId: appId,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: [
                            'onMenuShareTimeline', 'onMenuShareAppMessage'
                        ]
                    });
                    wx.error(function(res) {
                        console.log(res);
                    });
                }
            }
        });*/



    // if (isAndroid === true){
    //
    //     setTimeout(function (){
    //
    //         wxReady();
    //
    //     },30);
    //
    // }

    const swiper = new Swiper('.swiper-container-list', {
        direction: 'vertical',
        slidesPerView: 'auto',
        mousewheelControl: true,
        freeMode: true,
        nested: true,
        on:{
        }
    });


};






function EnterCityLink(){
    console.log(1);
}


(function(){

    let [startY,EndY] = [null,null];

    //主页四个按钮
    //城市
    $(".home-btn .vote").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".home-btn .vote").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {
             showLoading();
            $(".mask").show();
            $(".enter-city").show();
            $(".home-contain").hide();

            $.ajax({
                type: "POST",
                url: "http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=area&m=luma_gycs",
                data:{
                    isajax:true
                },
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                success: function(data){
                    let Data = data.data;
                    console.log(Data);
                    let attr = '';

                    if(data.code == "1001")
                    {
                        window.location.href="http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=get_user_login&m=luma_gycs&redirect_url="+
                            encodeURIComponent(window.location.href);
                    }
                    else if(data.code == 1002)
                    {
                        $("#loading").css("opacity",1);
                        $("#loading .load").html("请用微信浏览器打开");
                        $("#loading").show();
                    }
                    else if(data.code == 1)
                    {
                        for(let i = 0;i<Data.length;i++)
                        {
                            console.log(Data[i]);

                            attr +='<button class="city" data-area_name="'+Data[i].area_name+'"  data-cityid="'+Data[i].area_id+'">'+Data[i].area_name+'</button>'

                        }

                        $(".enter-city .city-list").html(attr);
                    }


                },
                error:function(error){
                    console.log(error);
                },
              complete:function () {
                    hideLoading();
              }

            });
        }

    });

    //选择排行榜中的城市，进入作品展示页
    $(document).on("touchstart",'.enter-city .city-list .city',function(e){
        startY = e.changedTouches[0].pageY;
    });

    $(document).on("touchend",'.enter-city .city-list .city',function(e){
        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {
          $("#keyword").show();
          $("#searchBtn").show();
            console.log($(this).data("cityid"));
            console.log($(this).data("area_name"));

            $("#keyword").attr("data-search","city");

          showLoading();
            $.ajax({
                type: "POST",
                url: "http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=reglist&m=luma_gycs",
                data:{
                    page:1,
                    size:1000,
                    area_id:$(this).data("cityid")
                },
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                success: function(data){

                    $("#loading").hide();

                    let Data = data.data;
                    let attr = '';

                    if(data.code == 1)
                    {
                        for(let i = 0;i<Data.length;i++)
                        {
                            console.log(Data[i]);

                            attr +="<li><a href='javascript:;' data-productid='"+Data[i].id+"'>" +
                                "<img src='http://qiniu.h5.xmluma.cn/"+Data[i].reg_img+"'></a>" +
                                "<p align='left'>编号:"+Data[i].reg_id+"<span class='name'>"+Data[i].reg_name+"</span></p>" +
                                "<p align='left'> 票数:"+Data[i].vote_num+"票" +
                                "<button class='vote' data-productid='"+Data[i].id+"' data-area='"+Data[i].area_id+"'>投上一票</button></p></li>"

                        }
                        console.log(attr);
                        $("#keyword").attr("data-cid",Data[0].area_id);
                        $(".info").attr("data-areaID",Data[0].area_id);
                        $(".vote-contain .vote-list .list-ui").html(attr);


                        $(".vote-contain .rank").hide();
                    }
                    else{
                        $(".vote-contain .vote-list .list-ui").html("");
                    }

                },
                error:function(error){

                },
                complete:function () {
                  hideLoading();
                }
            });
            $(".nav span").html($(this).data("area_name"));
            $("#home").hide();
            $("#home .home-contain").show();
            $("#home .enter-city").hide();
            $("#vote").show();
        }
    });


    //作品详情页
/*    $(document).on("touchstart",'.vote-contain .vote-list .list-ui a',function(e){
        startY = e.changedTouches[0].pageY;
    });*/

    $(document).on("click",'.vote-contain .vote-list .list-ui a',function(e){
        console.log($(this).data("productid"));
     showLoading();
      $("#keyword").hide();
      $("#searchBtn").hide();
        $.ajax({
            type: "POST",
            url: "http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=regdetail&m=luma_gycs",
            data:{
                reg_id:$(this).data("productid")
            },
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            success: function(data){
                $("#loading").hide();
                let Data = data.data;
                let attr = '';
                console.log(data.code);

                if(data.code == 1)
                {
                    attr +=" <p align=\"left\">编号："+Data.reg_id+"&nbsp;&nbsp;&nbsp;名称："+Data.reg_name+"<br />拍摄机型："+Data.reg_model+" <br />作者："+Data.reg_author+" <br />票数："+Data.vote_num+"票</p>"
                    console.log(attr);
                    $(".detail .data .info p").html(attr);
                    $(".detail .detail-img").attr('src','http://qiniu.h5.xmluma.cn/'+Data.reg_img);
                    $(".vote-contain").show();
                    $(".detail").show();
                }
                else return false;


            },
            error:function(error){

                console.log(error);

            },
          complete:function () {
            hideLoading();
          }
        });
        $(".info").attr("data-rem_id",$(this).data("productid"))
        $(".vote-contain .detail").show();
        $(".vote-contain .return").show();
        $(".vote-contain .vote-list").hide();
        $(".nav .return").css("opacity",0);
        $("#vote .rank").hide();
    })


    //投票


    $(document).on("click",'.vote-contain .vote',function(e){
      showLoading();
        $.ajax({
            type: "POST",
            url: "http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=vote&m=luma_gycs",
            data:{
                reg_id:$(this).data("productid"),
                area_id:$(this).data("area")
            },
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            success: function(data){
              layer.open({
                content: data.msg
                ,btn: '我知道了'
              });
            },
            error:function(error){

                console.log(error);

            },
          complete:function () {
            hideLoading();
          }
        });

    })


    $(document).on("click",'.vote-contain .vote-btn',function(e){
      showLoading();
        $.ajax({
            type: "POST",
            url: "http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=vote&m=luma_gycs",
            data:{
                reg_id:$(".info").data("rem_id"),
                area_id:$(".info").data("areaid")
            },
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            success: function(data){
              layer.open({
                content: data.msg
                ,btn: '我知道了'
              });


            },
            error:function(error){

                console.log(error);

            },
          complete:function () {
            hideLoading();
          }
        });

    })

    //排行榜
    $(".home-btn .rank").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".home-btn .rank").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        $("#keyword").attr("data-search","rank");

        if(EndY == startY)
        {
            $(".mask").show();
            $(".rank-city").show();
            $(".home-contain").hide();
          showLoading();
            $.ajax({
                type: "POST",
                url: "http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=area&m=luma_gycs",
                data:{
                    isajax:true
                },
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                success: function(data){


                    let Data = data.data;

                    let attr = '';
                    if(data.code == "1001")
                    {
                        window.location.href="http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=get_user_login&m=luma_gycs&redirect_url="+
                            encodeURIComponent(window.location.href);
                    }
                    else if(data.code == 1002)
                    {
                        $("#loading").css("opacity",1);
                        $("#loading .load").html("请用微信浏览器打开");
                        $("#loading").show();
                    }
                else
                    if(data.msg == "success")
                    {
                        for(let i = 0;i<Data.length;i++)
                        {


                            attr +='<button class="city" data-cityid="'+Data[i].area_id+'">'+Data[i].area_name+'</button>'

                        }

                        $(".rank-city .city-list").html(attr);


                    }


                },
                error:function(error){

                    console.log(error);

                },
              complete:function () {
                hideLoading();
              }
            });



        }

    });

    //选择排行榜中的城市，进入排行页
    $(document).on("touchstart",'.rank-city .city-list .city',function(e){
        startY = e.changedTouches[0].pageY;
    });

    $(document).on("touchend",'.rank-city .city-list .city',function(e){
        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {
          $("#keyword").show();
          $("#searchBtn").show();
          showLoading();
            $.ajax({
                type: "POST",
                url: "http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=ranking&m=luma_gycs",
                data:{
                    page:1,
                    size:50,
                    area_id:$(this).data("cityid")
                },
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                success: function(data){

                    let Data = data.data;
                    console.log(Data);
                    let attr = '';

                    if(data.code == 1)
                    {
                        for(let i = 0;i<Data.length;i++)
                        {
                            console.log(Data[i]);

                            attr +="<li>"+Data[i].rank+"、"+Data[i].id+" "+Data[i].reg_name+"<span class=\"score\">"+Data[i].vote_num+"票</span></li>"

                        }
                        console.log(attr);
                      $("#keyword").attr("data-cid",Data[0].area_id);
                        $(".vote-contain .rank .list").html(attr);

                    }
                    else {
                        $(".vote-contain .rank .list").html("");
                    }

                },
                error:function(error){

                    console.log(error);

                },
              complete:function () {
                hideLoading();
              }
            });

            console.log($(this).data("cityid"));
            $("#home").hide();
            $("#vote").show();
            $(".vote-list").hide();
            $(".vote-contain .rank").show();
            $(".vote-contain .rank-return").show();
            $(".nav .return").css("opacity",0);
        }
    });




    //参与规则
    $(".home-btn .rules").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".home-btn .rules").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {
            $(".mask").show();
            $(".vote-rules").show();
            $(".home-contain").hide();

        }

    });

    //奖项设置
    $(".home-btn .awards").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".home-btn .awards").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {
            $(".mask").show();
            $(".award").show();
            $(".home-contain").hide();

        }

    });


    $(".city-return").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".city-return").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {

            $(".enter-city").hide();
            $(".home-contain").show();
            $(".mask").hide();
        }

    });

    $(".rank-return").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".rank-return").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {

            $(".rank-city").hide();
            $(".home-contain").show();
            $(".mask").hide();
        }

    });

    $(".rules-return").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".rules-return").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {

            $(".vote-rules").hide();
            $(".home-contain").show();
            $(".mask").hide();
        }

    });

    $(".award-return").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".award-return").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {

            $(".award").hide();
            $(".home-contain").show();
            $(".mask").hide();
        }

    });


    // 选择参赛城市,进入投票页
    $(".enter-city .city-list .city").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".enter-city .city-list .city").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {

            console.log($(this).data("cityid"));
            $("#home").hide();
            $("#home .home-contain").show();
            $("#home .enter-city").hide();
            $("#vote").show();
        }

    });



    $(".list a").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".list a").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {

            console.log($(this).data("productid"));
            $(".vote-contain .detail").show();
            $(".vote-contain .return").show();
            $(".vote-contain .vote-list").hide();
            $(".nav .return").css("opacity",0);
            $("#vote .rank").hide();
        }

    });

    $(".vote-contain .return").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".vote-contain .return").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {

            $(".vote-contain .detail").hide();
            $(".vote-contain .return").hide();
            $(".vote-contain .vote-list").show();
            $(".nav .return").css("opacity",1);
            $(".mask").hide();
        }

    });

    $(".nav .return").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".nav .return").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {

            $("#vote").hide();
            $("#home").show();
            $(".mask").hide();

        }

    });


    $(".vote-contain .rank-return").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $(".vote-contain .rank-return").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;

        if(EndY == startY)
        {

            $("#vote").hide();
            $("#vote .rank").hide();
            $("#vote .vote-list").show();
            $("#home").show();
            $(".nav .return").css("opacity",1);
            $("#vote .vote-contain .rank-return").hide();
            $(".mask").hide();

        }

    });

  $(".vote-contain .detail-return").on('touchstart',function(e){

    startY = e.changedTouches[0].pageY;

  });

  $(".vote-contain .detail-return").on('touchend',function(e){

    EndY = e.changedTouches[0].pageY;

    if(EndY == startY)
    {

      $("#keyword").show();
      $("#searchBtn").show();
      $(".detail").hide();
    }

  });
    $("#searchBtn").on('touchstart',function(e){

        startY = e.changedTouches[0].pageY;

    });

    $("#searchBtn").on('touchend',function(e){

        EndY = e.changedTouches[0].pageY;
        let searchName = $("#keyword").val();
        console.log(searchName);

        if(EndY == startY)
        {
            if($("#keyword").data("search") == "city"){
              showLoading();
                $.ajax({
                    type: "POST",
                    url: "http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=reglist&m=luma_gycs",
                    data:{
                        page:1,
                        size:1000,
                        area_id:$("#keyword").attr("data-cid"),
                        keyword:searchName
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    dataType: "json",
                    success: function(data){

                        let Data = data.data;
                        console.log(Data);
                        let attr = '';

                        if(data.code == 1)
                        {
                            for(let i = 0;i<Data.length;i++)
                            {
                                console.log(Data[i]);

                                attr +="<li><a href='javascript:;' data-productid='"+Data[i].id+"'>" +
                                    "<img src='http://qiniu.h5.xmluma.cn/"+Data[i].reg_img+"'></a>" +
                                    "<p align='left'>编号:"+Data[i].reg_id+"<span class='name'>"+Data[i].reg_name+"</span></p>" +
                                    "<p align='left'> 票数:"+Data[i].vote_num+"票" +
                                    "<button class='vote' data-productid='"+Data[i].id+"' data-area='"+Data[i].area_id+"'>投上一票</button></p></li>"

                            }
                            $(".vote-contain .vote-list ul").html(attr);

                            $(".vote-contain .rank").hide();

                        }
                        else {
                            $(".vote-contain .vote-list ul").html("");
                        }

                    },
                    error:function(error){

                        console.log(error);

                    },
                  complete:function () {
                    hideLoading();
                  }
                });
            }
            else  if($("#keyword").data("search") == "rank"){
                showLoading();
                $.ajax({
                    type: "POST",
                    url: "http://h5.xmluma.cn/app/index.php?i=23&c=entry&do=ranking&m=luma_gycs",
                    data:{
                        page:1,
                        size:1000,
                        area_id:$("#keyword").attr("data-cid"),
                        keyword:searchName
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    dataType: "json",
                    success: function(data){
                      let Data = data.data;
                      console.log(Data);
                      let attr = '';

                      if(data.code == 1)
                      {
                        for(let i = 0;i<Data.length;i++)
                        {
                          console.log(Data[i]);

                          attr +="<li>"+Data[i].rank+"、"+Data[i].id+" "+Data[i].reg_name+"<span class=\"score\">"+Data[i].vote_num+"票</span></li>"

                        }
                        console.log(attr);

                        $(".vote-contain .rank .list").html(attr);


                      }
                      else {
                        $(".vote-contain .rank .list").html("");
                      }

                    },
                    error:function(error){

                        console.log(error);

                    },
                  complete:function () {
                    hideLoading();
                  }
                });
            }
        }

    });

})();




/* 生成图片的js */
// let HW = document.querySelector("#HW");
// let a = document.querySelectorAll("a");
// let [parent,starty,Endy] = [function parent(e){e.preventDefault();},null,null];
//
// HW.addEventListener("touchstart",parent,false);
//
// for (let i=0;i<a.length;i++){
//
//     a[i].addEventListener("touchstart",function (e){
//
//         starty = e.changedTouches[0].pageY;
//
//     },false);
//
//     a[i].addEventListener("touchend",function (e){
//
//         Endy = e.changedTouches[0].pageY;
//
//         if (Endy === starty){
//
//             window.location.href = this.href;
//         }
//
//     },false);
//
// }

// function canvasImg (){
//
//     HW.removeEventListener("touchstart",parent,false);
//
//     setTimeout(function (){
//
//         // 选定图层将其画在canvas里面
//         html2canvas(document.querySelector('#home .scene_result')).then(function(canvas) {
//             //将canvas的值保存到#canvas中
//             document.querySelector("#canvas").appendChild(canvas);
//             //将canvas专程url地址赋值给img
//             $("#download_photo .mask").find("img").get(0).src = canvas.toDataURL();
//         });
//
//     },100);
//
// }






