"use strict";(()=>{(function(){var a=$("[bw-element='media-player'] video")[0],o=$("[bw-element='media-player'] audio")[0],l=$("[bw-element='media-player'] video")[0],v="#FACC15";$("[bw-element='portfolio-item']").mouseenter(function(){$("[bw-element='portfolio-item-video-preview']").css("opacity","0%");let e="";if($(this).find("[bw-element='portfolio-item-video-preview']").length&&(e=$(this).find("[bw-element='portfolio-item-video-preview'] video").attr("data-src")),!e){console.log("File URL is not provided in CMS.");return}$(this).find("[bw-element='portfolio-item-video-preview']").css("opacity","100%"),$(this).find("[bw-element='portfolio-item-video-preview'] video").attr("src",e)}),$("[bw-element='portfolio-item']").mouseleave(function(e){$(".clip").attr("src",""),$("[bw-element='portfolio-item-video-preview']").css("opacity","0%")}),$(document).on("click","[bw-element='portfolio-item']",function(e){let t=$(this).find(" [bw-element='portfolio-item-url']").text().trim(),i=$(this).find(" [bw-element='portfolio-item-title']").text().trim(),r=$(this).find("[bw-element='portfolio-item-category']").text().trim().toLowerCase();if($("[bw-element='media-player'] audio").hide(),$("[bw-element='media-player'] video").hide(),r!="tv"){l=$("[bw-element='media-player'] audio")[0];let n=$(this).find("[bw-element='portfolio-item-poster']").css("background-image");n=n.replace("url(","").replace(")","").replace(/\"/gi,""),$("[bw-element='media-player-poster'] img").attr("src",n),$("[bw-element='media-player-video']").show(),$("[bw-element='media-player-poster']").show(),$("[bw-element='media-player'] audio").show(),$("[bw-element='media-player'] audio").attr("src",t),$("[bw-element='media-player']").find("audio").trigger("play")}else l=$("[bw-element='media-player'] video")[0],$("[bw-element='media-player-video']").show(),$("[bw-element='media-player-poster']").hide(),$("[bw-element='media-player'] video").show(),$("[bw-element='media-player'] video").attr("src",t),$("[bw-element='media-player']").find("video").trigger("play");$("[bw-element='media-player-title']").text(i),$("[bw-element='media-player']").fadeIn(),$("body").addClass("overflow-hidden")}),$(document).mouseup(function(e){if(!!$("[bw-element='media-player']").is(":visible")&&!($(e.target).hasClass("audio_component")||$(e.target).closest(".audio_component").length)){var t=$("[bw-element='media-player-component']");!t.is(e.target)&&t.has(e.target).length===0&&($("[bw-element='media-player'] video").attr("src",""),$("[bw-element='media-player'] audio").attr("src",""),$("[bw-element='media-player']").fadeOut(),$("body").removeClass("overflow-hidden"))}});var b=!1,y=!1;window.AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext;var h=function(e,t="visualiser-canvas"){var i=new AudioContext;i.crossOrigin="anonymous";var r=i.createAnalyser(),n=i.createMediaElementSource(e);n.connect(r),r.connect(i.destination);var T=new Uint8Array(r.frequencyBinCount),p=document.getElementById(t),C=p.width,u=p.height,S=10,I=1,g=2,L="transparent",f=600/(10+2),_=[];i=p.getContext("2d");function x(){var w=new Uint8Array(r.frequencyBinCount);r.getByteFrequencyData(w);var A=Math.round(w.length/f);if(i.clearRect(0,0,C,u),i.strokeStyle=v,i.fillStyle=v,i.beginPath(),!e.paused){for(var c=0;c<f;c++){var m=w[c*A];_.length<Math.round(f)&&_.push(m),m>148&&(m=148);let M=u-m+g;i.rect(c*12,u-m+g,S,u,50)}i.fill()}requestAnimationFrame(x)}x()};a.onplay=function(){b||(h(a),b=!0)},o.onplay=function(){y||(h(o,"visualiser-canvas-audio"),y=!0)},l.addEventListener("loadeddata",()=>{if(l.readyState>=2){let e=l.duration;$("[bw-element='player-total-time']").text(d(e))}}),o.addEventListener("loadeddata",()=>{if(o.readyState>=2){let e=o.duration;$("[bw-element='player-total-time']").text(d(e))}}),$(document).on("input","[bw-element='player-time']",function(){let e=$(this).val(),i=l.duration*(e/100);l.currentTime=i}),a.addEventListener("timeupdate",e=>{let t=a.currentTime,i=a.duration,n=100/i*t;$("#player-time").val(n),$("[bw-element='player-current-time']").text(d(t))}),o.addEventListener("timeupdate",e=>{let t=o.currentTime,i=o.duration,n=100/i*t;$("#player-time").val(n),$("[bw-element='player-current-time']").text(d(t))}),$("body").on("input","[bw-element='volume']",function(e){var t=$(e.currentTarget).val();s(t),a.volume=t/100,o.volume=t/100}),$("body").on("click","[bw-element='volume-icon']",function(e){let t=$("[bw-element='volume-icon']").val();if(t==0){let i=parseInt($(this).attr("unmuted-volume"));(i==0||isNaN(i))&&(i=50),$("[bw-element='volume-icon']").val(i),o.volume=i/100,a.volume=i/100,s(i)}else $(this).attr("unmuted-volume",t),$("[bw-element='volume-icon']").val(0),o.volume=0,a.volume=0,s(0)});function s(e){e==0?$("[bw-element='volume-icon']").attr("src","https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d0552835ba91e0dbb_IconoirSoundOff.svg"):e<=33?$("[bw-element='volume-icon']").attr("src","https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d940b6cc88be3d719_IconoirSoundMin%20(1).svg"):e<=66?$("[bw-element='volume-icon']").attr("src","https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dc8dbbf5817253c55_IconoirSoundLow.svg"):e<=100&&$("[bw-element='volume-icon']").attr("src","https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dfce3c5410108825a_IconoirSoundHigh.svg")}function d(e){let t=Math.floor(e/60);return t=t>=10?t:"0"+t,e=Math.floor(e%60),e=e>=10?e:"0"+e,t+":"+e}})();})();
