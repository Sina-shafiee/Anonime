const searchParams = new URLSearchParams(window.location.search);
const episodeId = searchParams.get('episodeId');

const mainEl = document.getElementById('main');

async function fetchEpisodeData() {
  try {
    const response = await fetch(
      `https://api.consumet.org/anime/gogoanime/watch/${episodeId}`
    );

    const data = await response.json();
    if (data && response.status <= 299 && response.status >= 200) {
      renderVideoPlayer(data);
    } else {
      throw '404 content not found';
    }
  } catch (error) {
    renderFetchError(error);
  }
}

function renderVideoPlayer({ sources, download }) {
  const hd = sources.find((link) => link.quality === '1080p');
  const sd = sources.find((link) => link.quality === '480p');
  const mobile = sources.find((link) => link.quality === '360p');
  const defaultQ = sources.find((link) => link.quality === 'backup');
  let template = '';
  if (sources) {
    template = `
    <video
      id="my_video_1"
      class="video-js vjs-default-skin rounded-xl w-full md:w-3/4 mx-auto h-[400px] lg:h-[70vh]"
      controls
      preload="auto"
      data-setup="{}"
    >
    
    
    <source src="${
      defaultQ && defaultQ.url
    }" type="application/x-mpegURL" label='Default' res='270'/>
    
    <source
    src="${hd && hd.url}"
    type="application/x-mpegURL"
    label='HD' res='1080'
    />
    
    <source src="${
      sd && sd.url
    }" type="application/x-mpegURL" label='SD' res='480' />
    
    <source src="${
      mobile && mobile.url
    }" type="application/x-mpegURL" label='Mobile' res='360'/>
    </video>
    
    <a target='_blank' href='${download}' class='block w-full mt-4 underline text-center'>Download</a>
    `;
  } else {
    throw '404 Not found';
  }
  mainEl.innerHTML = template;

  const player = videojs('my_video_1');
  player.controlBar.addChild('QualitySelector');
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
  if (episodeId) {
    fetchEpisodeData();
    document.title = `Anonime | watch ${episodeId}`;
  } else {
    renderFetchError('404 content not found');
  }
});
