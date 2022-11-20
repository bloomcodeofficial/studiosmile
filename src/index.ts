


/* get audio player */
var audio = $("#player")[0];

/* when mouse enters embed , play audio and video, audio only if category is not TV */
$(".portfolio_item").mouseenter(function() {
		
    $(".portfolio_item").removeClass("currently-hovering");
    $(this).addClass("currently-hovering");

  	$(this).prepend( $(".portfolio_item-player"));
    $(".portfolio_item-player").removeClass("visible");
    
    setTimeout(function(){
    $(".portfolio_item-player").addClass("visible");	
    }, 50)
    
    let file_url = "";
    let video = false;
  
    /* if we need only audio */
    if ( $(this).find(".portfolio_audio-embed:visible").length ) {
        file_url = $(this).find(".audio-url-holder").attr("data-src");
    } 
    /* if we need both audio & video */
    else if ( $(this).find(".portfolio_video-embed:visible").length ) {
        file_url = $(this).find(".clip").attr("data-src");
        video = true;
    }

    if (!file_url) {
        console.log("File URL is not provided in CMS.");
        return;
    }
    
    
    let title = $(this).find(".portfolio_content-title").eq(0).find("div").eq(0).text();
    $("#now-playing span").text(title);
		$("#now-playing").show();
  
  
    audio.setAttribute('src', file_url);
    audio.play();

    if (video) {
        $(this).find(".clip").attr("src", file_url);
    }
    
});

/* when audio is loaded, update duration text  */
audio.addEventListener('loadeddata', () => {
  if (audio.readyState >= 2) {
    	let duration = audio.duration;
      
  		$(".portfolio_item-player-total-time").text( formatTime(duration) );
  }
});

/* mouse leaves, stop videos and audios  */
$(".portfolio_item").mouseleave(function(e) {
        $(".portfolio_item-player").removeClass("visible");
        $(".portfolio_item").removeClass("currently-hovering");
        $(".clip").attr("src","");
        audio.pause();
        audio.setAttribute('src', '');

        $("#now-playing").hide();
        
});





$(document).on('input','#player-time',function(){
		let val = $(this).val();
    console.log(val,"x");
    let duration = $("#player")[0].duration;
    let currentTime = duration * (val / 100);
    $("#player")[0].currentTime = currentTime;
    
    
    let currentItem = $(".portfolio_item.currently-hovering");
   	if ( $(currentItem).find(".portfolio_video-embed:visible").length ) {
    	$(currentItem).find("video")[0].currentTime = currentTime;
    }
    
    
});



audio.addEventListener('timeupdate', (event) => {
  let currentTime = $("#player")[0].currentTime;
  let duration = $("#player")[0].duration;
  let one_prec = 100/duration;
  let currentTime_in_perc = one_prec * currentTime;
  $("#player-time").val(currentTime_in_perc);
  
  
  $(".portfolio_item-player-current-time").text( formatTime(currentTime) ); 
});


/* VOLUME CONTROL */
$("body").on("input", "#volume", function(e){
  var volume = $(e.currentTarget).val();
	switchVolumeIcon(volume);
  $("#player")[0].volume = volume / 100;
});


/* MUTE/UNMUTE ICON CLICK */
$("body").on("click", "#volume-icon", function(e){
	
  let currentVolume = $("#volume").val();
  
  if (currentVolume == 0) {
  	// unmute sound
    let unmuted_volume = parseInt ( $(this).attr("unmuted-volume") );
    if (unmuted_volume == 0 || isNaN(unmuted_volume) ) {
    	unmuted_volume = 50; 
    }
    
    $("#volume").val(unmuted_volume);
    $("#player")[0].volume = unmuted_volume / 100;
		switchVolumeIcon(unmuted_volume);
  
    
  } else {
  	// mute sound
    $(this).attr("unmuted-volume", currentVolume);
    $("#volume").val(0);
    $("#player")[0].volume = 0;
		switchVolumeIcon(0);
    
  }


});



function switchVolumeIcon(volume) {
  if (volume == 0) {
  	$("#volume-icon").attr("src", "https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d0552835ba91e0dbb_IconoirSoundOff.svg"); 
  } else if ( volume <= 33 ) {
  	$("#volume-icon").attr("src", "https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d940b6cc88be3d719_IconoirSoundMin%20(1).svg"); 
  } else if ( volume <= 66 ) {
  	$("#volume-icon").attr("src", "https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dc8dbbf5817253c55_IconoirSoundLow.svg"); 
  } else if ( volume <= 100 ) {
  	$("#volume-icon").attr("src", "https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dfce3c5410108825a_IconoirSoundHigh.svg");	
  }
}


var visualiser_loaded = false;

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;


var start_visualiser = function() {
    var ctx = new AudioContext();
    ctx.crossOrigin = "anonymous";
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
  

    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);


    var frequencyData = new Uint8Array(analyser.frequencyBinCount);


    var canvas = document.getElementById('visualiser-canvas'),
        cwidth = canvas.width,
        cheight = canvas.height,
        meterWidth = 10, 
        gap = 1, 
        capHeight = 2,
        capStyle = 'transparent',
        meterNum = 600 / (10 + 2),
        capYPositionArray = [];
        ctx = canvas.getContext('2d'),
        line_color = '#FACC15';

    // loop
    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum); 

        ctx.clearRect(0, 0, cwidth, cheight);
        ctx.strokeStyle = line_color;
        ctx.fillStyle = line_color;
        ctx.beginPath();


        var myAudio = document.getElementById('player');

        if (!myAudio.paused) {

            for (var i = 0; i < meterNum; i++) {

                var value = array[i * step];
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                };
								if (value > 148) {value = 148;}
                let pos_y = cheight - value + capHeight;
                
                ctx.roundRect(i * 12, cheight - value + capHeight, meterWidth, cheight, 50);
            }

            ctx.fill();

        }
        

        requestAnimationFrame(renderFrame);

    }

    renderFrame();

};


audio.onplay = function(){
	if (!visualiser_loaded) {
   start_visualiser();
   visualiser_loaded = true;
  }
}


function formatTime(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}


