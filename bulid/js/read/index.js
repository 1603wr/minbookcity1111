"use strict";define(["jquery","temp","getUrl","base64"],function(a,l,u){a(function(){var e=window.localStorage,n=e.getItem("fontSize")||16,t=["orange","pink","blue","green"],o=t[1*e.getItem("color")]||"black";a(".cont").css("color",o),a(".cont").css("fontSize",n+"px"),a(".tfont").on("click",function(){return a(".font-config").toggle(),!1});var i=u("index")||1*e.getItem("nums")||1,r=u("chater");s(),a(".nextbtn").on("click",function(){return i=r<=++i?r:i,s(),!1}),a(".prevbtn").on("click",function(){return i=--i<=1?1:i,s(),!1}),a(".cont").on("click",function(){a(".mask").show()}),a(".mask").on("click",function(){a(this).hide()});var c=u("id");function s(){a.ajax({url:"/api/read",data:{num:i},dataType:"json",success:function(n){var t,o,c;e.setItem("nums",i),a(".cid").html(i),a(".tit").html(r),t=n.jsonp,o=function(n){var t=JSON.parse(a.base64().decode(n));console.log(t),l(a(".text").html(),t,a(".cont"))},c=document.createElement("script"),window.duokan_fiction_chapter=function(n){o(n),document.head.removeChild(c)},c.src=t,document.head.appendChild(c)}})}a(".ml").on("click",function(){window.location.href="/page/menu.html?id="+c+"&active="+i}),a("button").on("click",function(){return n=parseInt(a(".cont").css("fontSize")),"大"==a(this).html()?a(".cont").css("fontSize",++n):a(".cont").css("fontSize",--n),e.setItem("fontSize",n),!1}),a(".color").on("click","span",function(){for(var n=0;n<t.length;n++)t[n]==a(this).data("color")&&(a(".cont").css("color",t[n]),e.setItem("color",n));return!1})})});