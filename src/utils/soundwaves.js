(function () {
  // Select the first video element with the attribute bw-element='media-player'
  var video = $("[bw-element='media-player'] video")[0];
  // Select the first audio element with the attribute bw-element='media-player'
  var audio = $("[bw-element='media-player'] audio")[0];
  // Select the first video element with the attribute bw-element='media-player'
  var file = $("[bw-element='media-player'] video")[0];

  // Define a color for the line
  var line_color = '#FACC15';

  // Add a mouseenter event listener to elements with the attribute bw-element='portfolio-item'
  $("[bw-element='portfolio-item']").on('mouseenter', function () {
    // Set the opacity of elements with the attribute bw-element='portfolio-item-video-preview' to 0%
    $("[bw-element='portfolio-item-video-preview']").css('opacity', '0%');

    // Select the file URL from the data-src attribute of the first video element within the current element with the attribute bw-element='portfolio-item-video-preview'
    let file_url = '';
    if ($(this).find("[bw-element='portfolio-item-video-preview']").length) {
      file_url = $(this).find("[bw-element='portfolio-item-video-preview'] video").attr('data-src');
    }

    // If no file URL is provided, log a message to the console and return
    if (!file_url) {
      console.log('File URL is not provided in CMS.');
      return;
    }

    // Select the video element within the current element with the attribute bw-element='portfolio-item-video-preview'
    let this_video = $(this).find("[bw-element='portfolio-item-video-preview'] video");

    // Set the opacity of the element with the attribute bw-element='portfolio-item-video-preview' to 100% and set the src attribute of the video element to the file URL
    $(this).find("[bw-element='portfolio-item-video-preview']").css('opacity', '100%');
    $(this_video).attr('src', file_url);

    // After a 100ms delay, play the video
    setTimeout(function () {
      console.log('HALO 2', $(this_video));
      $(this_video)[0].play();
    }, 100);
  });

  // Add a mouseleave event listener to elements with the attribute bw-element='portfolio-item'
  $("[bw-element='portfolio-item']").on('mouseleave', function (e) {
    // Set the src attribute of all elements with the class 'clip' to an empty string
    $('.clip').attr('src', '');
    // Set the opacity of elements with the attribute bw-element='portfolio-item-video-preview' to 0%
    $("[bw-element='portfolio-item-video-preview']").css('opacity', '0%');
  });

  /* Open media player popup on item click  */
  $(document).on('click', "[bw-element='portfolio-item']", function (e) {
    // Get data from DOM
    let file_url = $(this).find(" [bw-element='portfolio-item-url']").text().trim();
    let title = $(this).find(" [bw-element='portfolio-item-title']").text().trim();
    let category = $(this)
      .find("[bw-element='portfolio-item-category']")
      .text()
      .trim()
      .toLowerCase();
    let details = $(this).find(" [bw-element='portfolio-item-details']").html();

    // Hide audio and video elements
    $("[bw-element='media-player'] audio").hide();
    $("[bw-element='media-player'] video").hide();

    // If category is not "tv"
    if (category != 'tv') {
      // Get file element and set to audio
      // eslint-disable-next-line prefer-destructuring
      file = $("[bw-element='media-player'] audio")[0];

      // Get and set poster image in popup
      let poster_url = $(this).find("[bw-element='portfolio-item-poster']").css('background-image');
      poster_url = poster_url.replace('url(', '').replace(')', '').replace(/\"/gi, '');
      $("[bw-element='media-player-poster'] img").attr('src', poster_url);

      // Show audio, hide video and show poster
      $("[bw-element='media-player-video']").show();
      $("[bw-element='media-player-poster']").show();
      $("[bw-element='media-player'] audio").show();

      // Set audio src and trigger play
      $("[bw-element='media-player'] audio").attr('src', file_url);
      $("[bw-element='media-player']").find('audio').trigger('play');
    } else {
      // Get file element and set to video
      // eslint-disable-next-line prefer-destructuring
      file = $("[bw-element='media-player'] video")[0];

      // Show video, hide poster
      $("[bw-element='media-player-video']").show();
      $("[bw-element='media-player-poster']").hide();
      $("[bw-element='media-player'] video").show();

      // Set video src and trigger play
      $("[bw-element='media-player'] video").attr('src', file_url);
      $("[bw-element='media-player']").find('video').trigger('play');
    }
    // Set media player title
    $("[bw-element='media-player-title']").text(title.replaceAll(',', ', '));
    // Set media player details
    $("[bw-element='media-player-details']").html(details);

    // Fade in media player
    $("[bw-element='media-player']").fadeIn();
    // Add overflow hidden class to body element
    $('body').addClass('overflow-hidden');
  });

  /* if clicked anywhere outside of video player, close popup */
  $(document).mouseup(function (e) {
    // Check if video player is visible
    if (!$("[bw-element='media-player']").is(':visible')) {
      return;
    }

    // Check if clicked element has "audio_component" class or is a child of an element with "audio_component" class
    if ($(e.target).hasClass('audio_component') || $(e.target).closest('.audio_component').length) {
      return;
    }

    // Check if clicked element is the video player or a child of the video player
    var container = $("[bw-element='media-player-component']");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      // Clear video and audio sources and hide player
      $("[bw-element='media-player'] video").attr('src', '');
      $("[bw-element='media-player'] audio").attr('src', '');
      $("[bw-element='media-player']").fadeOut();
      $('body').removeClass('overflow-hidden');
    }
  });

  var visualiser_loaded_video = false;
  var visualiser_loaded_audio = false;

  window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

  var start_visualiser = function (source, canvas_id = 'visualiser-canvas') {
    var ctx = new AudioContext();
    ctx.crossOrigin = 'anonymous';
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(source);

    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);

    var canvas = document.getElementById(canvas_id),
      cwidth = canvas.width,
      cheight = canvas.height,
      meterWidth = 10,
      capHeight = 2,
      meterNum = 600 / (10 + 2),
      capYPositionArray = [];
    ctx = canvas.getContext('2d');

    // loop through the array of frequency data and draw the bars on the canvas
    function renderFrame() {
      // create a new Uint8Array to hold the frequency data
      var array = new Uint8Array(analyser.frequencyBinCount);
      // get the frequency data and put it into the array
      analyser.getByteFrequencyData(array);
      // calculate the size of each bar based on the number of bars we want to draw
      var step = Math.round(array.length / meterNum);

      // clear the canvas
      ctx.clearRect(0, 0, cwidth, cheight);
      // set the stroke and fill style for the bars
      ctx.strokeStyle = line_color;
      ctx.fillStyle = line_color;
      // begin a new path on the canvas
      ctx.beginPath();

      if (!source.paused) {
        // loop through the array of frequency data
        for (var i = 0; i < meterNum; i++) {
          // get the current value in the array
          var value = array[i * step];
          // if the capYPositionArray is smaller than the number of bars we want to draw
          // push the current value to the end of the array
          if (capYPositionArray.length < Math.round(meterNum)) {
            capYPositionArray.push(value);
          }
          // if the value is greater than 148, set it to 148
          if (value > 148) {
            value = 148;
          }
          // draw a rectangle on the canvas
          ctx.rect(i * 12, cheight - value + capHeight, meterWidth, cheight, 50);
        }

        // fill the rectangles with the specified fill style
        ctx.fill();
      }

      // request the next animation frame
      requestAnimationFrame(renderFrame);
    }

    // call the renderFrame function to start the visualizer
    renderFrame();
  };

  // when the video starts playing, start the visualizer if it hasn't already been loaded
  video.onplay = function () {
    if (!visualiser_loaded_video) {
      // start the visualizer for the video, using the default canvas element
      start_visualiser(video);
      // set the visualiser_loaded_video flag to true
      visualiser_loaded_video = true;
    }
  };

  // when the audio starts playing, start the visualizer if it hasn't already been loaded
  audio.onplay = function () {
    if (!visualiser_loaded_audio) {
      // start the visualizer for the audio, using the 'visualiser-canvas-audio' canvas element
      start_visualiser(audio, 'visualiser-canvas-audio');
      // set the visualiser_loaded_audio flag to true
      visualiser_loaded_audio = true;
    }
  };

  // when the file (presumably an audio file) has loaded, update the duration text in the player
  file.addEventListener('loadeddata', () => {
    // if the file has finished loading
    if (file.readyState >= 2) {
      // get the duration of the file
      let { duration } = file;

      // update the duration text in the player with the formatted duration of the file
      $("[bw-element='player-total-time']").text(formatTime(duration));
    }
  });

  // when the audio element has loaded, update the duration text in the player
  audio.addEventListener('loadeddata', () => {
    // if the audio element has finished loading
    if (audio.readyState >= 2) {
      // get the duration of the audio
      let { duration } = audio;

      // update the duration text in the player with the formatted duration of the audio
      $("[bw-element='player-total-time']").text(formatTime(duration));
    }
  });

  // when the input value of the "player-time" element changes
  $(document).on('input', "[bw-element='player-time']", function () {
    // get the new value of the input element
    let val = $(this).val();
    // get the duration of the file
    let { duration } = file;
    // calculate the current time of the file based on the value of the input element
    let currentTime = duration * (val / 100);
    // set the current time of the file to the calculated current time
    file.currentTime = currentTime;
  });

  // when the current time of the video element updates
  video.addEventListener('timeupdate', () => {
    // get the current time and duration of the video
    let { currentTime } = video;
    let { duration } = video;
    // calculate the conversion factor from seconds to percent
    let one_prec = 100 / duration;
    // calculate the current time of the video in percent
    let currentTime_in_perc = one_prec * currentTime;
    // update the value of the "player-time" element to the current time of the video in percent
    $('#player-time').val(currentTime_in_perc);

    // update the current time text in the player with the formatted current time of the video
    $("[bw-element='player-current-time']").text(formatTime(currentTime));
  });

  // when the current time of the audio element updates
  audio.addEventListener('timeupdate', () => {
    // get the current time and duration of the audio
    let { currentTime } = audio;
    let { duration } = audio;
    // calculate the conversion factor from seconds to percent
    let one_prec = 100 / duration;
    // calculate the current time of the audio in percent
    let currentTime_in_perc = one_prec * currentTime;
    // update the value of the "player-time" element to the current time of the audio in percent
    $('#player-time').val(currentTime_in_perc);

    // update the current time text in the player with the formatted current time of the audio
    $("[bw-element='player-current-time']").text(formatTime(currentTime));
  });

  /* VOLUME CONTROL */
  // when the value of the "volume" element changes
  $('body').on('input', "[bw-element='volume']", function (e) {
    // get the new value of the "volume" element
    var volume = $(e.currentTarget).val();
    // update the volume icon based on the volume level
    switchVolumeIcon(volume);
    // set the volume of the video and audio elements to the new volume level
    video.volume = volume / 100;
    audio.volume = volume / 100;
  });

  /* MUTE/UNMUTE ICON CLICK */
  // when the "volume-icon" element is clicked
  $('body').on('click', "[bw-element='volume-icon']", function (e) {
    // get the current volume level of the player
    let currentVolume = $("[bw-element='volume-icon']").val();

    // if the volume is currently 0 (muted)
    if (currentVolume == 0) {
      // unmute sound
      // get the previously saved unmuted volume level
      let unmuted_volume = parseInt($(this).attr('unmuted-volume'));
      // if the unmuted volume level is not set or is set to 0, set it to 50
      if (unmuted_volume == 0 || isNaN(unmuted_volume)) {
        unmuted_volume = 50;
      }

      // update the "volume-icon" element with the unmuted volume level
      $("[bw-element='volume-icon']").val(unmuted_volume);
      // set the volume of the audio and video elements to the unmuted volume level
      audio.volume = unmuted_volume / 100;
      video.volume = unmuted_volume / 100;
      // update the volume icon based on the new volume level
      switchVolumeIcon(unmuted_volume);
    } else {
      // mute sound
      // save the current volume level as the unmuted volume level
      $(this).attr('unmuted-volume', currentVolume);
      // update the "volume-icon" element with a volume level of 0
      $("[bw-element='volume-icon']").val(0);
      // set the volume of the audio and video elements to 0
      audio.volume = 0;
      video.volume = 0;
      // update the volume icon to the muted icon
      switchVolumeIcon(0);
    }
  });

  // update the volume icon based on the volume level
  function switchVolumeIcon(volume) {
    // if the volume is 0, set the volume icon to the mute icon
    if (volume == 0) {
      $("[bw-element='volume-icon']").attr(
        'src',
        'https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d0552835ba91e0dbb_IconoirSoundOff.svg'
      );
      // if the volume is less than or equal to 33, set the volume icon to the low volume icon
    } else if (volume <= 33) {
      $("[bw-element='volume-icon']").attr(
        'src',
        'https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39d940b6cc88be3d719_IconoirSoundMin%20(1).svg'
      );
      // if the volume is less than or equal to 66, set the volume icon to the medium volume icon
    } else if (volume <= 66) {
      $("[bw-element='volume-icon']").attr(
        'src',
        'https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dc8dbbf5817253c55_IconoirSoundLow.svg'
      );
      // if the volume is less than or equal to 100, set the volume icon to the high volume icon
    } else if (volume <= 100) {
      $("[bw-element='volume-icon']").attr(
        'src',
        'https://uploads-ssl.webflow.com/637139ed9b96f7e572ff323f/6373b39dfce3c5410108825a_IconoirSoundHigh.svg'
      );
    }
  }

  // format the given number of seconds into a string in the format "mm:ss"
  function formatTime(seconds) {
    // calculate the number of minutes by dividing the total number of seconds by 60
    let minutes = Math.floor(seconds / 60);
    // if the number of minutes is greater than or equal to 10, use it as is, otherwise add a leading 0
    minutes = minutes >= 10 ? minutes : '0' + minutes;
    // calculate the number of seconds by taking the remainder of the total number of seconds divided by 60
    seconds = Math.floor(seconds % 60);
    // if the number of seconds is greater than or equal to 10, use it as is, otherwise add a leading 0
    seconds = seconds >= 10 ? seconds : '0' + seconds;
    // return the formatted time string
    return minutes + ':' + seconds;
  }
})();
