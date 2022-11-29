(function() {


    var video = $("[bw-element='media-player'] video")[0];
    var audio = $("[bw-element='media-player'] audio")[0];
    var file = $("[bw-element='media-player'] video")[0];


    var line_color = '#FACC15';




    /* when mouse enters embed , play audio and video, video only if category is not TV */
    $("[bw-element='portfolio-item']").on( "mouseenter",function() {

        $("[bw-element='portfolio-item-video-preview']").css("opacity", "0%");

        let file_url = "";


        if ( $(this).find("[bw-element='portfolio-item-video-preview']").length ) {
            file_url = $(this).find("[bw-element='portfolio-item-video-preview'] video").attr("data-src");
        }

        if (!file_url) {
            console.log("File URL is not provided in CMS.");
            return;
        }

        let this_video = $(this).find("[bw-element='portfolio-item-video-preview'] video");

        $(this).find("[bw-element='portfolio-item-video-preview']").css("opacity", "100%");
        $(this_video).attr("src", file_url);


        setTimeout(function (){
            console.log("HALO 2", $(this_video));
            $(this_video)[0].play();
        }, 100);


    });



    $("[bw-element='portfolio-item']").on("mouseleave",function(e) {
        $(".clip").attr("src","");
         $("[bw-element='portfolio-item-video-preview']").css("opacity", "0%");
    });




    /* Open media player popup on item click  */
    $(document).on('click',"[bw-element='portfolio-item']",function(e){


      /* get data from DOM */
      let file_url = $(this).find(" [bw-element='portfolio-item-url']").text().trim();
      let title = $(this).find(" [bw-element='portfolio-item-title']").text().trim();
      let category =  $(this).find("[bw-element='portfolio-item-category']").text().trim().toLowerCase();

      let details = $(this).find(" [bw-element='portfolio-item-details']").html();


      $("[bw-element='media-player'] audio").hide();
      $("[bw-element='media-player'] video").hide();

      if ( category != "tv" ) {

        file = $("[bw-element='media-player'] audio")[0];

        /* get and set poster image in popup */
        let poster_url = $(this).find("[bw-element='portfolio-item-poster']").css('background-image');
        poster_url = poster_url.replace('url(','').replace(')','').replace(/\"/gi, "");

        $("[bw-element='media-player-poster'] img").attr("src", poster_url);


        /* if audio, hide video and show poster */
        $("[bw-element='media-player-video']").show();
        $("[bw-element='media-player-poster']").show();
        $("[bw-element='media-player'] audio").show();



        /* set url and trigger play */
        $("[bw-element='media-player'] audio").attr("src", file_url);
        $("[bw-element='media-player']").find("audio").trigger("play");



      } else {

        file = $("[bw-element='media-player'] video")[0];

        /* if video, hide poster and show video */
        $("[bw-element='media-player-video']").show();
        $("[bw-element='media-player-poster']").hide();
        $("[bw-element='media-player'] video").show();


         /* set url and trigger play */
        $("[bw-element='media-player'] video").attr("src", file_url);
        $("[bw-element='media-player']").find("video").trigger("play");





      }


      $("[bw-element='media-player-title']").text(title.replaceAll(",", ", ") );

      $("[bw-element='media-player-details']").html(details);

      $("[bw-element='media-player']").fadeIn();





      $("body").addClass("overflow-hidden");

    });



    /* if clicked anywhere outside of video player, close popup */
    $(document).mouseup(function(e)
    {
        if (! $("[bw-element='media-player']").is(":visible") ) {return;}

        if ( $(e.target).hasClass("audio_component") || $(e.target).closest(".audio_component").length ) {return}

        var container = $("[bw-element='media-player-component']");
        if (!container.is(e.target) && container.has(e.target).length === 0)
        {
          $("[bw-element='media-player'] video").attr("src", "");
          $("[bw-element='media-player'] audio").attr("src", "");
          $("[bw-element='media-player']").fadeOut();
          $("body").removeClass("overflow-hidden");
        }

    });







    var visualiser_loaded_video = false;
    var visualiser_loaded_audio = false;

    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;


    var start_visualiser = function(source, canvas_id = 'visualiser-canvas' ) {
        var ctx = new AudioContext();
        ctx.crossOrigin = "anonymous";
        var analyser = ctx.createAnalyser();
        var audioSrc = ctx.createMediaElementSource(source);


        audioSrc.connect(analyser);
        analyser.connect(ctx.destination);



        var frequencyData = new Uint8Array(analyser.frequencyBinCount);


        var canvas = document.getElementById(canvas_id),
            cwidth = canvas.width,
            cheight = canvas.height,
            meterWidth = 10,
            gap = 1,
            capHeight = 2,
            capStyle = 'transparent',
            meterNum = 600 / (10 + 2),
            capYPositionArray = [];
            ctx = canvas.getContext('2d');


        // loop
        function renderFrame() {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var step = Math.round(array.length / meterNum);

            ctx.clearRect(0, 0, cwidth, cheight);
            ctx.strokeStyle = line_color;
            ctx.fillStyle = line_color;
            ctx.beginPath();





            if (!source.paused) {

                for (var i = 0; i < meterNum; i++) {

                    var value = array[i * step];
                    if (capYPositionArray.length < Math.round(meterNum)) {
                        capYPositionArray.push(value);
                    };
                                    if (value > 148) {value = 148;}
                    let pos_y = cheight - value + capHeight;

                    ctx.rect(i * 12, cheight - value + capHeight, meterWidth, cheight, 50);
                }

                ctx.fill();

            }


            requestAnimationFrame(renderFrame);

        }

        renderFrame();

    };


    video.onplay = function(){
        if (!visualiser_loaded_video) {

       start_visualiser(video);
       visualiser_loaded_video = true;
      }
    }


    audio.onplay = function(){
      if (!visualiser_loaded_audio) {

       start_visualiser(audio, 'visualiser-canvas-audio' );
       visualiser_loaded_audio = true;
      }
    }












    /* when audio is loaded, update duration text  */
    file.addEventListener('loadeddata', () => {
      if (file.readyState >= 2) {
          let duration = file.duration;

          $("[bw-element='player-total-time']").text( formatTime(duration) );
      }
    });

    audio.addEventListener('loadeddata', () => {
      if (audio.readyState >= 2) {
          let duration = audio.duration;

          $("[bw-element='player-total-time']").text( formatTime(duration) );
      }
    });





    $(document).on('input',"[bw-element='player-time']",function(){
        let val = $(this).val();

        let duration = file.duration;
        let currentTime = duration * (val / 100);
        file.currentTime = currentTime;


    });



    video.addEventListener('timeupdate', (event) => {
      let currentTime = video.currentTime;
      let duration = video.duration;
      let one_prec = 100/duration;
      let currentTime_in_perc = one_prec * currentTime;
      $("#player-time").val(currentTime_in_perc);


      $("[bw-element='player-current-time']").text( formatTime(currentTime) );
    });


    audio.addEventListener('timeupdate', (event) => {
      let currentTime = audio.currentTime;
      let duration = audio.duration;
      let one_prec = 100/duration;
      let currentTime_in_perc = one_prec * currentTime;
      $("#player-time").val(currentTime_in_perc);


     $("[bw-element='player-current-time']").text( formatTime(currentTime) );
    });






    /* VOLUME CONTROL */
    $("body").on("input", "[bw-element='volume']", function(e){
      var volume = $(e.currentTarget).val();
      switchVolumeIcon(volume);
      video.volume = volume / 100;
      audio.volume = volume / 100;
    });




    /* MUTE/UNMUTE ICON CLICK */
    $("body").on("click", "[bw-element='volume-icon']", function(e){

      let currentVolume = $("[bw-element='volume-icon']").val();

      if (currentVolume == 0) {
        // unmute sound
        let unmuted_volume = parseInt ( $(this).attr("unmuted-volume") );
        if (unmuted_volume == 0 || isNaN(unmuted_volume) ) {
          unmuted_volume = 50;
        }

        $("[bw-element='volume-icon']").val(unmuted_volume);
        audio.volume = unmuted_volume / 100;
        video.volume = unmuted_volume / 100;
        switchVolumeIcon(unmuted_volume);


      } else {

        // mute sound
        $(this).attr("unmuted-volume", currentVolume);
        $("[bw-element='volume-icon']").val(0);
        audio.volume = 0;
        video.volume = 0;
        switchVolumeIcon(0);

      }


    });





    function switchVolumeIcon(volume) {
      if (volume == 0) {
        $("[bw-element='volume-icon']").attr("src", "https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d0552835ba91e0dbb_IconoirSoundOff.svg");
      } else if ( volume <= 33 ) {
        $("[bw-element='volume-icon']").attr("src", "https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d940b6cc88be3d719_IconoirSoundMin%20(1).svg");
      } else if ( volume <= 66 ) {
        $("[bw-element='volume-icon']").attr("src", "https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dc8dbbf5817253c55_IconoirSoundLow.svg");
      } else if ( volume <= 100 ) {
        $("[bw-element='volume-icon']").attr("src", "https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dfce3c5410108825a_IconoirSoundHigh.svg");
      }
    }





    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }




})();