import { getTrendingPreview, getMoviesGenres, getMoviesByCategory, getMoviesBySearch } from "./main.js";
import * as Node from "./nodes.js";

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

function adjustActionAccordingToScreen() {
    const screenWidth = window.innerWidth;
    if(screenWidth) {
        console.log(screenWidth);
        Node.exploreBtn.addEventListener('click', () => location.hash = '#explore')
    }
}
window.addEventListener('load', adjustActionAccordingToScreen);
window.addEventListener('resize', adjustActionAccordingToScreen);

function smoothScroll(){
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
         window.requestAnimationFrame(smoothScroll);
         window.scrollTo (0,currentScroll - (currentScroll/5));
    }
};
function navigator() {
    /* window.scrollTo({
        top: 0,
        behavior: 'auto'
      }); */
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
    }
     else {
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
    Node.exploreBtn.classList.remove('inactive');
    Node.header.style.backgroundColor = 'transparent';
    getTrendingPreview();
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

    Node.searchResultsHeader.classList.remove('inactive');
    Node.searchResultsHeader.style.marginBottom = '20px';
    Node.searchFormExplore.classList.add('inactive');
    Node.exploreTitle.classList.remove('inactive');
    Node.exploreSubtitle.classList.remove('inactive');

    Node.sectionTrending.classList.remove('inactive');
    Node.trendingFilmList.classList.add('section-trending__filmList--categories');
    Node.trendingTitle.classList.add('inactive');
    Node.header.style.backgroundColor = '#090911';
    
    const hashStr = decodeURI(location.hash);
    const genreId = hashStr.slice(hashStr.indexOf('=')+1, hashStr.indexOf('-'));
    const genreName = hashStr.slice(hashStr.indexOf('-')+1);
    Node.exploreSubtitle.innerText = genreName;
    getMoviesByCategory(genreId);
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

    Node.searchResultsHeader.classList.remove('inactive');
    Node.searchResultsHeader.style.marginBottom = '20px';
    Node.exploreTitle.classList.remove('inactive');
    Node.exploreSubtitle.classList.remove('inactive');
    Node.exploreSubtitle.innerText = `Results for Stranger`

    Node.sectionTrending.classList.remove('inactive');
    Node.trendingFilmList.classList.add('section-trending__filmList--categories');
    Node.trendingTitle.classList.add('inactive');
    Node.header.style.backgroundColor = '#090911';

    const [_, search] = location.hash.split('=');
    const query = decodeURI(search).replace(new RegExp(" ", "g"), "+");
    console.log(query);
    Node.exploreSubtitle.innerText = `Results for ${decodeURI(search)}`;
    getMoviesBySearch(query);
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

    Node.sectionFilmDetail.classList.remove('inactive');
    /* Node.movieDetailImg.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url('${nuevaURL}')`; */
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
    
    Node.sectionCategories.classList.remove('inactive');
    Node.header.style.backgroundColor = '#090911';
    const isGenreNodes = Array.from(Node.categoriesCards.children);
    if (!isGenreNodes.length) {
        console.log('me ejecuto');
        getMoviesGenres();
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
    Node.header.style.backgroundColor = '#090911';
    getTrendingPreview()
}