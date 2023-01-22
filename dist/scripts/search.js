const params = new URLSearchParams(window.location.search);
const searchQuery = params.get('query');

const mainEl = document.getElementById('main');
const searchResultWrapper = document.getElementById('cards-wrapper');
const loadingEl = document.getElementById('loading');

async function fetchTopRated() {
  try {
    const res = await fetch(
      `https://api.consumet.org/anime/gogoanime/${searchQuery}`,
      {
        method: 'GET'
      }
    );

    const data = await res.json();

    if (data && data.results.length && res.status <= 299 && res.status >= 200) {
      loadingEl.remove();
      createAnimeCards(data.results, searchResultWrapper);
    } else {
      throw '404 content not found';
    }
  } catch (error) {
    loadingEl.remove();
    createFetchErrorElement(error);
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
        <a href='/anime.html?animeId=${id}' class='text-center text-sm font-bold'>${title}</a>
      </div>
    </article>`;
  });
  cardsWrapper.innerHTML += template;
}

/**
 *
 * @param {error object} error
 */
function createFetchErrorElement(error) {
  const template = `
  <div class='min-h-[40vh] flex flex-col items-center justify-center gap-2'>
    <p> Sorry dear visitor it seems we have a problem.. </p>
    <p class='font-mono'> '${error}' </p>
  </div>`;

  mainEl.innerHTML += template;
}

document.addEventListener('DOMContentLoaded', () => {
  if (searchQuery) {
    fetchTopRated();
    document.title = `Anonime | search ${searchQuery}`;
  } else {
    loadingEl.remove();
    createFetchErrorElement('404 Content not found');
  }
});
