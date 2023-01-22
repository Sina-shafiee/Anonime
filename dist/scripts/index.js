// top rated anime cards container
const topRatedWrapper = document.getElementById('top-rated');
const topRatedLoading = document.getElementById('loading-top-rated');
const newEpisodes = document.getElementById('new-episodes');
const newEpisodesLoading = document.getElementById('new-episodes-loading');
const searchForm = document.getElementById('search-form');

async function fetchTopRated() {
  try {
    const res = await fetch(
      'https://api.consumet.org/anime/gogoanime/top-airing'
    );

    const data = await res.json();

    if (data && res.status <= 299 && res.status >= 200) {
      topRatedLoading.remove();
      sessionStorage.setItem('top-rated', JSON.stringify(data));
      createAnimeCards(data.results, topRatedWrapper);
    } else {
      throw '503 Service Unavailable';
    }
  } catch (error) {
    topRatedLoading.remove();
    createFetchErrorElement(error, topRatedWrapper);
  }
}

async function fetchNewEpisodes() {
  try {
    const res = await fetch(
      `https://api.consumet.org/anime/gogoanime/recent-episodes?type=2`
    );

    const data = await res.json();

    if (data && res.status <= 299 && res.status >= 200) {
      newEpisodesLoading.remove();
      sessionStorage.setItem('new-episodes', JSON.stringify(data));
      createAnimeCards(data.results, newEpisodes);
    } else {
      throw '503 Service Unavailable';
    }
  } catch (error) {
    newEpisodesLoading.remove();
    createFetchErrorElement(error, newEpisodes);
  }
}

/**
 *
 * @param {array of anime objects: array} data
 * @param {cards append location: htmlElement} wrapper
 */
function createAnimeCards(data, wrapper) {
  const cardsWrapper = document.createElement('section');
  cardsWrapper.classList.add('cards-wrapper');
  wrapper.append(cardsWrapper);

  let template = '';

  data.forEach(({ title, image, id }) => {
    template += `
    <article class='relative bg-gray-400 overflow-hidden rounded-lg transition-all duration-150'>
      <img loading='lazy' src='${image}' class='h-[317px] hover:scale-105 duration-1000 transition-all w-full object-cover' />
      <div class='bg-gradient-to-b from-[rgba(0,0,0,0.1)] backdrop-blur-sm to-[rgba(0,0,0,0.4)] text-ellipsis h-20 px-2 flex items-center justify-center absolute z-10 bottom-0 w-full'>
        <a href='/anime.html?animeId=${id}' class='text-center text-sm font-bold'>${
      title.length > 25
        ? title.substring(0, 25).replaceAll('(', '') + '...'
        : title
    }</a>
      </div>
    </article>`;
  });
  cardsWrapper.innerHTML += template;
}

/**
 *
 * @param {error object} error
 */
function createFetchErrorElement(error, wrapper) {
  const template = `
  <div class='min-h-[60vh] flex flex-col items-center justify-center gap-2'>
    <p> Sorry dear visitor it seems we have a problem.. </p>
    <p class='font-mono'> '${error.message}' </p>
  </div>`;

  wrapper.innerHTML += template;
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const search_query = e.target.elements.query.value.trim();
  if (search_query && isNaN(search_query)) {
    window.location.assign(`/search.html?query=${search_query}`);
    e.target.reset();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const topRatedData = sessionStorage.getItem('top-rated');
  const newEpisodesData = sessionStorage.getItem('new-episodes');
  if (topRatedData) {
    topRatedLoading.remove();
    createAnimeCards(JSON.parse(topRatedData).results, topRatedWrapper);
  } else {
    fetchTopRated();
  }
  if (newEpisodesData) {
    newEpisodesLoading.remove();
    createAnimeCards(JSON.parse(newEpisodesData).results, newEpisodes);
  } else {
    fetchNewEpisodes();
  }
});
