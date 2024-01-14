// page router
const global = {
    currentPage: window.location.pathname,
    searchParams:{
        type:'',
        term:'',
        page:1,
        totalPages:1,
        totalResults:0
    }
}
const API_URL='https://api.themoviedb.org/3/';
const API_KEY='40f89cb6649d9c2c2f211976030a3f17';
//spinner
function showSpinner(){
    document.querySelector('.spinner').classList.add('show');
}

function hideSpinner(){
    document.querySelector('.spinner').classList.remove('show');
}

async function displaySlider(){
    const {results}=await fetchDetailsAPI('movie/now_playing');
    console.log(results);
    results.forEach((movie)=>{
        const div=document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML=`
              <a href="movie-details.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
              </a>
              <h4 class="swiper-rating">
                <i class="fa fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
              </h4>`;
        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();

    })
}

function initSwiper(){
    const swiper = new Swiper('.swiper', {
        slidesPerView:1,
        speed: 400,
        spaceBetween: 30,
        freeMode:true,
        loop:true,
        autoplay:{
            delay:4000,
            disableOnInteraction:false
        },
        breakpoints:{
            500:{
                slidesPerView:2
            },
            700:{
                slidesPerView:3
            },
            1200:{
                slidesPerView:4
            }

        }
      });
}

function addBackgroundImage(type, bg_image){
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${bg_image})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.3';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
      } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
      }
  

}
// fetch movies data
async function displayMovieData(){
    showSpinner();
    const {results}= await fetchDetailsAPI('movie/popular');
    hideSpinner();
    results.forEach((movie)=>{
        const div=document.createElement('div');
        div.classList.add('card');
        div.innerHTML=`<a href="movie-details.html?id=${movie.id}">
        ${movie.poster_path? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
      />` : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${movie.title}"
    />`}
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>`;
      document.querySelector('#popular-movies').appendChild(div);

    })
}

// fetch shows data
async function displayShowsData(){
    showSpinner();
    const {results}= await fetchDetailsAPI('tv/popular');
    hideSpinner();
    results.forEach((show)=>{
        const div=document.createElement('div');
        div.classList.add('card');
        div.innerHTML=`<a href="tv-details.html?id=${show.id}">
        ${show.poster_path? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
      />` : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${show.name}"
    />`}
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date: ${show.first_air_date}</small>
        </p>
      </div>`;
      document.querySelector('#popular-shows').appendChild(div);

    })
}

async function displayMovieDetail(){
    const id = window.location.search.split('=')[1];
    const movie=await fetchDetailsAPI(`movie/${id}`);
    console.log(movie);
    addBackgroundImage('movie',movie.backdrop_path);
    const div=document.createElement('div');
    
    div.innerHTML=` 
    <div class="details-top">
    <div>
    ${movie.poster_path? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
      />` : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${movie.title}"
    />`}
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fa fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre)=>`<li>${genre.name}</li>`
      ).join('')}
    </ul>
    <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${numberWithCommas(movie.budget)}</li>
    <li><span class="text-secondary">Revenue:</span> $${numberWithCommas(movie.revenue)}</li>
    <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${movie.production_companies.map(company=>`<span>${company.name}</span>`).join(', ')}</div>`;
  document.querySelector('#movie-details').appendChild(div);
   

}

async function displayShowDetail(){
    const id = window.location.search.split('=')[1];
    const tv=await fetchDetailsAPI(`tv/${id}`);
    console.log(tv);
    addBackgroundImage('tv',tv.backdrop_path);
    const div=document.createElement('div');
    div.innerHTML=`
    <div class="details-top">
    <div>
    ${tv.poster_path? `<img
        src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
        class="card-img-top"
        alt="${tv.name}"
      />` : `<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${tv.name}"
    />`}
  </div>
  <div>
    <h2>${tv.name}</h2>
    <p>
      <i class="fa fa-star text-primary"></i>
      ${tv.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Air Date: ${tv.first_air_date}</p>
    <p>
      ${tv.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${tv.genres.map((genre)=>`<li>${genre.name}</li>`).join(' ')}
    </ul>
    <a href="${tv.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${tv.number_of_episodes}</li>
    <li>
      <span class="text-secondary">Last Episode To Air:</span> ${tv.last_episode_to_air.name}
    </li>
    <li><span class="text-secondary">Status:</span> ${tv.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${tv.production_companies.map((company)=>`<span>${company.name}</span>`).join(', ')}</div>
</div>
    
    `;
    document.querySelector('#show-details').appendChild(div);
    
}

// fetch  data
async function fetchDetailsAPI(endpoint){
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data=await response.json();
    return data;
}

// serach /tv show
async function search(){
    const queryString=window.location.search;
    const urlParams=new URLSearchParams(queryString);
    
    global.searchParams.type=urlParams.get('type');
    global.searchParams.term=urlParams.get('search-term');

    if(global.searchParams.term !== '' && global.searchParams.term !==null){
        const {results,total_pages,page,total_results}=await searchAPI();

        if(results.length===0){
            alertMessage('alert-error','No results found');
            return;
        }
        global.searchParams.page=page;
        global.searchParams.totalPages=total_pages;
        global.searchParams.totalResults=total_results;
        displaySearchResults(results);
        document.querySelector('#search-term').value = '';

    }
    else{
        alertMessage('alert-error','Please enter a search term');
    }

}

function displaySearchResults(results) {
    //clear div
    document.querySelector('#search-results').innerHTML='';
    document.querySelector('#pagination').innerHTML='';
    document.querySelector('#search-results-heading').innerHTML='';
    results.forEach((result) => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
            <a href="${global.searchParams.type}-details.html?id=${result.id}">
              ${
                result.poster_path
                  ? `<img
                src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
                class="card-img-top"
                alt="${
                  global.searchParams.type === 'movie' ? result.title : result.name
                }"
              />`
                  : `<img
              src="images/no-image.jpg"
              class="card-img-top"
               alt="${
                 global.searchParams.type === 'movie' ? result.title : result.name
               }"
            />`
              }
            </a>
            <div class="card-body">
              <h5 class="card-title">${
                global.searchParams.type === 'movie' ? result.title : result.name
              }</h5>
              <p class="card-text">
                <small class="text-muted">Release: ${
                  global.searchParams.type === 'movie'
                    ? result.release_date
                    : result.first_air_date
                }</small>
              </p>
            </div>
          `;
      
      document.querySelector('#search-results-heading').innerHTML=`<h2>${results.length} 
      of ${global.searchParams.totalResults} enteries for ${global.searchParams.term}</h2>`;
      document.querySelector('#search-results').appendChild(div);
    });
    displayPagination();
  }
 
function displayPagination(){
    const div=document.createElement('div');
    div.classList.add('pagination');
    console.log(global.searchParams.totalPages)
    div.innerHTML=`
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.searchParams.page} of ${global.searchParams.totalPages}</div>
    `;
    document.querySelector('#pagination').appendChild(div);

    if(global.searchParams.page===1){
        document.getElementById("prev").disabled = true;
    }
    if(global.searchParams.page===global.searchParams.totalPages){
        document.getElementById("next").disabled = true;
    }
    //next
    document.getElementById("next").addEventListener("click",async ()=>{
        global.searchParams.page++;
        const {results,total_pages}=await searchAPI();
        displaySearchResults(results);
        

    });
    // prev
    document.getElementById("prev").addEventListener("click",async ()=>{
        global.searchParams.page--;
        const {results,total_pages}=await searchAPI();
        displaySearchResults(results);
    
    });

}
async function searchAPI(){
    const response = await fetch(`${API_URL}search/${global.searchParams.type}?api_key=${API_KEY}&language=en-US&query=${global.searchParams.term}&page=${global.searchParams.page}`);
    const data=await response.json();
    return data;
}

function alertMessage(className,message){
    const div=document.createElement('div');
    div.classList.add('alert',className);
    div.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(div);

    setTimeout(()=>div.remove(),3000);
}
// highlight active links in yellow

function highlightActiveLinks(){
    const links=document.querySelectorAll('.nav-link');
    links.forEach((link)=>{
        if(global.currentPage.includes(link.getAttribute('href'))){
            link.classList.add("active");
        }
    })
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// initialize function
function init() {
    const path = global.currentPage;
    switch (path) {
        case "/":
        case "/13-Flixx-Movie-App/index.html":
            displaySlider();
            displayMovieData();
            break;
        case "/13-Flixx-Movie-App/shows.html":
            displayShowsData();
            break;
        case "/13-Flixx-Movie-App/movie-details.html":
            displayMovieDetail();
            break;
        case "/13-Flixx-Movie-App/tv-details.html":
            displayShowDetail();
            console.log("TV Details Page");
            break;
        case "/13-Flixx-Movie-App/search.html":
            console.log("Search Page");
            search();
            break;
    }

    highlightActiveLinks();
}

document.addEventListener('DOMContentLoaded',init);
