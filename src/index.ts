window.Webflow ||= [];
window.Webflow.push(() => {
  
  const portfolioItem = document.querySelector('[bw-element='portfolio-item']')!;

  const mediaPlayer = document.querySelector('[bw-element='media-player']')!;

  portfolioItem.onmouseenter = function() {
    mediaPlayer.style.display = flex;

  };

});






  
