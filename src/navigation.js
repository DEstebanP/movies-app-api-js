import { getTrendingPreview, getMoviesGenres, getMoviesByCategory, getSeriesByCategory, getMoviesAndSeriesBySearch, getTrends, getMovieById, getMovieHome, getPopularPreview, getSeriesGenres, getMovieSectionTrailer, getCastSectionTrailer, getSerieById, getMovieTrailer } from "./main.js";
import * as Node from "./nodes.js";

// Add event listener
window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
Node.headerLogo.addEventListener('click', () => location.hash = "#home");
//change
Node.arrowBack.forEach(arrow => {
    arrow.addEventListener('click', () => {
        // Get the URL of the previous page
        const previousUrl = document.referrer;

    // Check if the previous URL belongs to the same application
        if (previousUrl.includes(location.hostname)) {
        // If it does, go back to the previous URL
            history.back();
        } else {
        // If it doesn't belong to the same application, redirect to the application's home
            window.location.href = '#home'; // Replace '/' with the URL of your home page
    }
        Node.searchInputExplore.value = '';
    });
})
Node.trendingBtn.addEventListener('click', () => location.hash = "#trends")
Node.searchBtn.addEventListener('click', () => {
    location.hash ="#search=" + Node.searchInputExplore.value;
});
Node.trendsBtn.addEventListener('click', () => location.hash = '#trends');
// X from trailer player
Node.trailerIcon.addEventListener('click', () => {
    Node.trailerPlayer.classList.add('inactive');
    Node.trailerVideo.src = '';
});
Node.filmDetailTrailer.addEventListener('click', () => {
    const [_, search] = location.hash.split('=');
    const [id, title, media_type] = search.split('-');
    getMovieTrailer(id, media_type);
    Node.trailerPlayer.classList.remove('inactive');
})
Node.sectionExplore.addEventListener('click', () => location.hash = '#explore=movies');

Node.exploreBtn.addEventListener('click', () => location.hash = '#explore=movies');

// Change between movies and series genres
Node.moviesGenresBtn.addEventListener('click', styleExploreMoviesBtn);
function styleExploreMoviesBtn() {
    location.hash = '#explore=movies'

    Node.moviesGenresBtn.style.backgroundColor = '#F1EEF5';
    Node.moviesGenresBtn.style.color = '#000000';

    Node.seriesGenresBtn.style.backgroundColor = 'transparent';
    Node.seriesGenresBtn.style.color = '#F1EEF5';
}
Node.seriesGenresBtn.addEventListener('click', styleExploreSeriesBtn);
function styleExploreSeriesBtn() {
    location.hash = '#explore=tv'
    Node.seriesGenresBtn.style.backgroundColor = '#F1EEF5';
    Node.seriesGenresBtn.style.color = '#000000';

    Node.moviesGenresBtn.style.backgroundColor = 'transparent';
    Node.moviesGenresBtn.style.color = '#F1EEF5';
}


function smoothScroll() {
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
        window.requestAnimationFrame(smoothScroll);
        window.scrollTo (0,currentScroll - (currentScroll/5));
    }
};
function navigator() {
    smoothScroll();
    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#explore')) {
        explorePage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoryPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else {
    homePage();
    }
}


function homePage() {
    console.log('Home!!');

    Node.sectionImg.classList.remove('inactive');
    Node.sectionTrending.classList.remove('inactive');
    Node.sectionTrailer.classList.remove('inactive');
    Node.sectionPopular.classList.remove('inactive');
    Node.sectionExplore.classList.remove('inactive');
    Node.trendingFilmList.classList.remove('section-trending__filmList--categories');
    Node.trendingTitle.classList.remove('inactive');
    Node.trendingBtn.classList.remove('inactive');

    Node.searchResultsHeader.classList.add('inactive');
    Node.sectionCategories.classList.add('inactive');
    Node.sectionFilmDetail.classList.add('inactive');
    Node.trailerPlayer.classList.add('inactive');
    Node.exploreBtn.classList.remove('inactive');
    Node.header.style.backgroundColor = 'rgba(30, 29, 27, 0.25)';
    Node.movieDetailImg.style.backgroundImage = '';
    getMovieHome();
    getTrendingPreview();
    getMovieSectionTrailer();
    getPopularPreview();
}

function categoryPage() {
    console.log('categories!!');
    Node.sectionImg.classList.add('inactive');
    Node.sectionTrailer.classList.add('inactive');
    Node.sectionPopular.classList.add('inactive');
    Node.sectionExplore.classList.add('inactive');
    Node.sectionCategories.classList.add('inactive');
    Node.sectionFilmDetail.classList.add('inactive');
    Node.exploreBtn.classList.add('inactive');
    Node.trendingBtn.classList.add('inactive');
    Node.trailerPlayer.classList.add('inactive');

    Node.searchResultsHeader.classList.remove('inactive');
    Node.searchResultsHeader.style.marginBottom = '20px';
    Node.searchFormExplore.classList.add('inactive');
    Node.exploreTitle.classList.remove('inactive');
    Node.exploreSubtitle.classList.remove('inactive');

    Node.sectionTrending.classList.remove('inactive');
    Node.trendingFilmList.classList.add('section-trending__filmList--categories');
    Node.trendingTitle.classList.add('inactive');
    Node.header.style.backgroundColor = '#090911';
    Node.movieDetailImg.style.backgroundImage = '';
    
    const [_, contentDescription] = location.hash.split('=');
    const [genreId, genreName, media_type] = contentDescription.split('-');
    Node.exploreSubtitle.innerText = decodeURI(genreName);
    if (media_type == 'movies') {
        getMoviesByCategory(genreId);
    } else {
        getSeriesByCategory(genreId);
    }
}

function searchPage() {
    Node.exploreTitle.classList.add('inactive');
    Node.sectionImg.classList.add('inactive');
    Node.sectionTrailer.classList.add('inactive');
    Node.sectionPopular.classList.add('inactive');
    Node.sectionExplore.classList.add('inactive');
    Node.sectionCategories.classList.add('inactive');
    Node.sectionFilmDetail.classList.add('inactive');
    Node.exploreBtn.classList.add('inactive');
    Node.trendingBtn.classList.add('inactive');
    Node.trailerPlayer.classList.add('inactive');

    Node.searchResultsHeader.classList.remove('inactive');
    Node.searchResultsHeader.style.marginBottom = '20px';
    Node.exploreTitle.classList.remove('inactive');
    Node.exploreSubtitle.classList.remove('inactive');
    Node.exploreSubtitle.innerText = `Results for Stranger`

    Node.sectionTrending.classList.remove('inactive');
    Node.trendingFilmList.classList.add('section-trending__filmList--categories');
    Node.trendingTitle.classList.add('inactive');
    Node.header.style.backgroundColor = '#090911';
    Node.movieDetailImg.style.backgroundImage = '';

    const [_, search] = location.hash.split('=');
    const query = decodeURI(search).replace(new RegExp(" ", "g"), "+");
    console.log(query);
    Node.exploreSubtitle.innerText = `Results for ${decodeURI(search)}`;
    getMoviesAndSeriesBySearch(query);
}

function movieDetailsPage() {
    console.log('Movie!!');
    Node.sectionImg.classList.add('inactive');
    Node.searchResultsHeader.classList.add('inactive');
    Node.sectionTrending.classList.add('inactive');
    Node.sectionTrailer.classList.add('inactive');
    Node.sectionPopular.classList.add('inactive');
    Node.sectionExplore.classList.add('inactive');
    Node.sectionCategories.classList.add('inactive');
    Node.searchResultsHeader.classList.add('inactive');
    Node.trailerPlayer.classList.add('inactive');

    Node.sectionFilmDetail.classList.remove('inactive');
    Node.header.style.backgroundColor = '#090911';

    const [_, movieData] = location.hash.split('=');
    const [id, movieName, media_type] = movieData.split('-');
    media_type == 'movie' ? getMovieById(id) : getSerieById(id);
    
}

function explorePage() {
    Node.exploreBtn.classList.add('inactive');
    Node.sectionImg.classList.add('inactive');
    Node.sectionTrending.classList.add('inactive');
    Node.sectionTrailer.classList.add('inactive');
    Node.sectionPopular.classList.add('inactive');
    Node.sectionExplore.classList.add('inactive');
    Node.sectionFilmDetail.classList.add('inactive');

    Node.searchResultsHeader.classList.remove('inactive');
    Node.searchFormExplore.classList.remove('inactive');
    Node.exploreTitle.classList.add('inactive');
    Node.exploreSubtitle.classList.add('inactive');
    Node.trailerPlayer.classList.add('inactive');
    
    Node.sectionCategories.classList.remove('inactive');
    Node.header.style.backgroundColor = '#090911';
    Node.movieDetailImg.style.backgroundImage = '';
    
    const isExploreForMovies = location.hash == '#explore=movies'
    if (isExploreForMovies) {
        getMoviesGenres();
        styleExploreMoviesBtn();
    } else {
        getSeriesGenres();
        styleExploreSeriesBtn();
    }
}

function trendsPage() {
    console.log('TRENDS!!');
    Node.exploreBtn.classList.remove('inactive');
    Node.sectionImg.classList.add('inactive');
    Node.sectionTrailer.classList.add('inactive');
    Node.sectionPopular.classList.add('inactive');
    Node.sectionExplore.classList.add('inactive');
    Node.sectionFilmDetail.classList.add('inactive');
    Node.sectionCategories.classList.add('inactive');

    Node.searchResultsHeader.classList.remove('inactive');
    Node.searchResultsHeader.style.marginBottom = '0';
    Node.exploreTitle.classList.add('inactive');
    Node.exploreSubtitle.classList.add('inactive');
    Node.searchFormExplore.classList.add('inactive');
    
    Node.sectionTrending.classList.remove('inactive');
    Node.trendingFilmList.classList.add('section-trending__filmList--categories');
    Node.trendingTitle.classList.remove('inactive');
    Node.trendingBtn.classList.add('inactive');
    Node.trailerPlayer.classList.add('inactive');
    Node.header.style.backgroundColor = '#090911';
    Node.movieDetailImg.style.backgroundImage = '';
    getTrends();
}
