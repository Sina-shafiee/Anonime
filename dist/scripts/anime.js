const searchParams = new URLSearchParams(window.location.search);
const animeId = searchParams.get('animeId');

const mainEl = document.getElementById('main');
const loadingSkeleton = document.getElementById('loading');
const detailsWrapper = document.getElementById('detail-content');
const tableBody = document.getElementById('table-body');
const paginationNumbers = document.getElementById('pagination-numbers');
const paginatedList = document.getElementById('paginated-list');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const episodeLinkEls = document.querySelectorAll('#episode-link');

async function fetchAnimeDetails() {
  try {
    const response = await fetch(
      `https://api.consumet.org/anime/gogoanime/info/${animeId}`
    );
    const data = await response.json();
    loadingSkeleton.remove();
    if (data && response.status <= 299 && response.status >= 200) {
      renderAnimeDetails(data);
      renderLinks(data.episodes);
    } else {
      throw '404 Content not found';
    }
  } catch (error) {
    renderFetchError(error);
  }
}

/**
 *
 * @param {Anime info object} animeInfo
 */
function renderAnimeDetails({ image, title, status, description, genres }) {
  let template = `
    <section
    class="flex min-h-[70vh] gap-20 px-4 md:px-8 flex-wrap lg:flex-nowrap container mx-auto items-start">
        <section class="w-full lg:w-2/5 rounded-3xl overflow-hidden h-[60vh] bg-gray-200">
            <img src='${image}' alt='${title}' class='object-bottom object-cover w-full h-full'/>
        </section>
        <section class="w-full lg:w-3/5 min-h-[60vh] flex flex-col gap-8">
          <div>
              <div class="flex justify-between items-baseline">
                <h2 class="rounded-2xl text-2xl font-bold">
                ${title}
                </h2>
                <p>${status}</p>
              </div>
               <p class='mt-8'>Genres: </p>
              <div class="flex justify-center lg:justify-start mt-4 flex-wrap gap-4">
                ${(() => {
                  let genresEls = '';
                  genres.forEach((genre, index) => {
                    if (index < 7) {
                      genresEls += `<p class='bg-gray-50 rounded-lg text-gray-900 py-1 px-2 text-sm hover:bg-gray-100'>${genre}</p>`;
                    }
                  });
                  return genresEls;
                })()}
              </div>
          </div>
          <div>
             <p class='mt-4'>${
               description.length > 500
                 ? description.substring(0, 500) + ' ...'
                 : description
             }</p>
          </div>
        </section>
    </section>
    `;
  detailsWrapper.innerHTML = template;
}

/**
 *
 * @param {array of anime episodes} data
 * render table rows and pagination logic
 */
function renderLinks(data) {
  const paginationLimit = 20;
  const pageCount = Math.ceil(data.length / paginationLimit);
  let currentPage;

  const appendPageNumber = (index) => {
    const pageNumber = document.createElement('button');
    pageNumber.className = 'pagination-number px-2';
    pageNumber.innerHTML = index;
    pageNumber.setAttribute('page-index', index);
    pageNumber.setAttribute('aria-label', 'Page ' + index);
    paginationNumbers.appendChild(pageNumber);
  };
  const getPaginationNumbers = () => {
    for (let i = 1; i <= pageCount; i++) {
      appendPageNumber(i);
    }
  };

  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;

    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;

    tableBody.innerHTML = '';
    data.forEach(({ number, id }, index) => {
      if (index >= prevRange && index < currRange) {
        tableBody.innerHTML += `
          <tr class="border-b" id='episode-link'>
              <td class="px-6 py-4">Episode ${number}</td>
              <td class="px-6 cursor-pointer py-4"><a target='_blank' href='/watch.html?episodeId=${id}' class='underline'>Watch</a></td>
          </tr>
        `;
      }
    });
  };

  getPaginationNumbers();
  setCurrentPage(1);

  document.querySelectorAll('.pagination-number').forEach((button) => {
    const pageIndex = Number(button.getAttribute('page-index'));
    if (pageIndex) {
      button.addEventListener('click', () => {
        setCurrentPage(pageIndex);
      });
    }
  });

  const handleActivePageNumber = () => {
    document.querySelectorAll('.pagination-number').forEach((button) => {
      button.classList.remove('active');

      const pageIndex = Number(button.getAttribute('page-index'));
      if (pageIndex == currentPage) {
        button.classList.add('active');
      }
    });
  };
  handleActivePageNumber();
  prevButton.addEventListener('click', () => {
    console.log('bye');
    if (currentPage > 1) {
      console.log('hi');
      setCurrentPage(currentPage - 1);
    }
  });
  nextButton.addEventListener('click', () => {
    console.log('bye');
    if (currentPage < pageCount) {
      console.log('hi');
      setCurrentPage(currentPage + 1);
    }
  });
}

function renderFetchError(err) {
  let template = `
    <div class='rounded-xl mx-auto min-h-[70vh] flex flex-col items-center justify-center'>
        <p>Sorry, it seems we have a problem</p>
        <p class='text-gray-500 text-sm mt-4'>'${err}'</p>
    </div>
    `;

  mainEl.innerHTML = template;
}

document.addEventListener('DOMContentLoaded', () => {
  if (animeId) {
    fetchAnimeDetails();
    document.title = `Anonime | ${animeId}`;
  } else {
    renderFetchError('404 Content not found');
  }
});
