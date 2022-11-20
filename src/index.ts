window.Webflow ||= [];
window.Webflow.push(() => {
  
  const portfolioItem = document.querySelectorAll('[bw-element='portfolio-item']')!;

  const mediaPlayer = document.querySelectorAll('[bw-element='media-player']')!;

  const playButton = document.querySelectorAll('[bw-element='play-button']')!;

  playButton?.addEventListener('click', function handleClick() {
    mediaPlayer.style.display = 'block';
  })

});






  
