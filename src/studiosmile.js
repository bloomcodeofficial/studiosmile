const portfolioItem = document.querySelector('[bw-element="portfolio-item"]');

const mediaPlayer = document.querySelector('[bw-element="media-player"]');

import { greetUser } from '$utils/greet';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'JohnJHasse';
  greetUser(name);
});