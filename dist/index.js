"use strict";(()=>{var l=$("[bw-element='media-player'] video")[0],o=$("[bw-element='media-player'] audio")[0],a=$("[bw-element='media-player'] video")[0];$("[bw-element='portfolio-item']").mouseenter(function(){$("[bw-element='portfolio-item-video-preview']").css("opacity","0%");let e="";if($(this).find("[bw-element='portfolio-item-video-preview']").length&&(e=$(this).find("[bw-element='portfolio-item-video-preview'] video").attr("data-src")),!e){console.log("File URL is not provided in CMS.");return}$(this).find("[bw-element='portfolio-item-video-preview']").css("opacity","100%"),$(this).find("[bw-element='portfolio-item-video-preview'] video").attr("src",e)});$("[bw-element='portfolio-item']").mouseleave(function(e){$(".clip").attr("src",""),$("[bw-element='portfolio-item-video-preview']").css("opacity","0%")});$(document).on("click","[bw-element='portfolio-item']",function(e){let i=$(this).find(" [bw-element='portfolio-item-url']").text().trim(),t=$(this).find(" [bw-element='portfolio-item-title']").text().trim(),r=$(this).find("[bw-element='portfolio-item-category']").text().trim().toLowerCase();if($("[bw-element='media-player'] audio").hide(),$("[bw-element='media-player'] video").hide(),r!="tv"){a=$("[bw-element='media-player'] audio")[0];let n=$(this).find("[bw-element='portfolio-item-poster']").css("background-image");n=n.replace("url(","").replace(")","").replace(/\"/gi,""),$("[bw-element='media-player-poster'] img").attr("src",n),$("[bw-element='media-player-video']").hide(),$("[bw-element='media-player-poster']").show(),$("[bw-element='media-player'] audio").show(),$(".portfolio_item-player-time").show(),$("[bw-element='media-player'] audio").attr("src",i),$("[bw-element='media-player']").find("audio").trigger("play")}else a=$("[bw-element='media-player'] video")[0],$("[bw-element='media-player-video']").show(),$("[bw-element='media-player-poster']").hide(),$("[bw-element='media-player'] video").show(),$(".portfolio_item-player-time").hide(),$("[bw-element='media-player'] video").attr("src",i),$("[bw-element='media-player']").find("video").trigger("play");$("[bw-element='media-player-title']").text(t),$("[bw-element='media-player']").fadeIn()});$(document).mouseup(function(e){if(!!$("[bw-element='media-player']").is(":visible")&&!($(e.target).hasClass("audio_component")||$(e.target).closest(".audio_component").length)){var i=$("[bw-element='media-player-component']");!i.is(e.target)&&i.has(e.target).length===0&&($("[bw-element='media-player'] video").attr("src",""),$("[bw-element='media-player'] audio").attr("src",""),$("[bw-element='media-player']").fadeOut())}});var h=!1,g=!1;window.AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;var _=function(e,i="visualiser-canvas"){var t=new AudioContext;t.crossOrigin="anonymous";var r=t.createAnalyser(),n=t.createMediaElementSource(e);n.connect(r),r.connect(t.destination);var A=new Uint8Array(r.frequencyBinCount),s=document.getElementById(i),x=s.width,d=s.height,C=10,T=1,v=2,I="transparent",p=600/(10+2),b=[];t=s.getContext("2d"),line_color="#FACC15";function y(){var f=new Uint8Array(r.frequencyBinCount);r.getByteFrequencyData(f);var S=Math.round(f.length/p);if(t.clearRect(0,0,x,d),t.strokeStyle=line_color,t.fillStyle=line_color,t.beginPath(),!e.paused){for(var u=0;u<p;u++){var m=f[u*S];b.length<Math.round(p)&&b.push(m),m>148&&(m=148);let L=d-m+v;t.rect(u*12,d-m+v,C,d,50)}t.fill()}requestAnimationFrame(y)}y()};l.onplay=function(){h||(_(l),h=!0)};o.onplay=function(){g||(_(o,"visualiser-canvas-audio"),g=!0)};a.addEventListener("loadeddata",()=>{if(a.readyState>=2){let e=a.duration;$("[bw-element='player-total-time']").text(c(e))}});o.addEventListener("loadeddata",()=>{if(o.readyState>=2){let e=o.duration;$("[bw-element='player-total-time']").text(c(e))}});$(document).on("input","[bw-element='player-time']",function(){let e=$(this).val(),t=a.duration*(e/100);a.currentTime=t});l.addEventListener("timeupdate",e=>{let i=l.currentTime,t=l.duration,n=100/t*i;$("#player-time").val(n),$("[bw-element='player-current-time']").text(c(i))});o.addEventListener("timeupdate",e=>{let i=o.currentTime,t=o.duration,n=100/t*i;$("#player-time").val(n),$("[bw-element='player-current-time']").text(c(i))});$("body").on("input","[bw-element='volume']",function(e){var i=$(e.currentTarget).val();w(i),l.volume=i/100,o.volume=i/100});$("body").on("click","[bw-element='volume-icon']",function(e){let i=$("[bw-element='volume-icon']").val();if(i==0){let t=parseInt($(this).attr("unmuted-volume"));(t==0||isNaN(t))&&(t=50),$("[bw-element='volume-icon']").val(t),o.volume=t/100,l.volume=t/100,w(t)}else $(this).attr("unmuted-volume",i),$("[bw-element='volume-icon']").val(0),o.volume=0,l.volume=0,w(0)});function w(e){e==0?$("[bw-element='volume-icon']").attr("src","https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d0552835ba91e0dbb_IconoirSoundOff.svg"):e<=33?$("[bw-element='volume-icon']").attr("src","https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d940b6cc88be3d719_IconoirSoundMin%20(1).svg"):e<=66?$("[bw-element='volume-icon']").attr("src","https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dc8dbbf5817253c55_IconoirSoundLow.svg"):e<=100&&$("[bw-element='volume-icon']").attr("src","https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dfce3c5410108825a_IconoirSoundHigh.svg")}function c(e){return minutes=Math.floor(e/60),minutes=minutes>=10?minutes:"0"+minutes,e=Math.floor(e%60),e=e>=10?e:"0"+e,minutes+":"+e}})();
