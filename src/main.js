import { API_KEY } from "./secrets.mjs";
const API = 'https://api.themoviedb.org/3';

const searchBtn = document.getElementById('search-btn');
function adjustActionAccordingToScreen() {
    const screenWidth = window.innerWidth;
    console.log('hel');
    if(screenWidth) {
        console.log(screenWidth);
        searchBtn.addEventListener('click', goToExplorePage)
    }
}
window.addEventListener('load', adjustActionAccordingToScreen);
window.addEventListener('resize', adjustActionAccordingToScreen);

function goToExplorePage() {
    const sectionImage = document.querySelector('.section-image');
    sectionImage.classList.add('inactive');
    const sectionTrending = document.querySelector('.section-trending');
    sectionTrending.classList.add('inactive');
    const sectionTrailer = document.querySelector('.section-trailer');
    sectionTrailer.classList.add('inactive');
    const sectionPopular = document.querySelector('.popular');
    sectionPopular.classList.add('inactive');
    const sectionExplore = document.querySelector('.explore');
    sectionExplore.classList.add('inactive');
    
    const categories = document.querySelector('.categories');
    categories.classList.remove('inactive');
}

const moviesId = [];
function getMoviePhotoGenre(dataMovieResults) {
    for (let i = 0; i < dataMovieResults.length; i++) {
        const apiMovie = dataMovieResults[i];
        const isRepeated = moviesId.some(movie => {
            return apiMovie.id == movie.id;
        });
        if (!isRepeated) {
            moviesId.push(apiMovie);
            return apiMovie.poster_path;
        }
    }
    
}
async function getMoviesGenres() {
    try {
        //get genres
    const res = await fetch(`${API}/genre/movie/list?api_key=${API_KEY}`);
    const data = await res.json();
    const genres = data.genres;
    console.log(genres);
    //get a movie photo from a genre
    for (const genre of genres) {
        const resMovie = await fetch(`${API}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre.id}&api_key=${API_KEY}`);
        const dataMovie = await resMovie.json();
        const categoryImg = getMoviePhotoGenre(dataMovie.results);

        const categoriesCards = document.querySelector('.categories__cards');

        const categoryCard = document.createElement('div');
        categoryCard.classList.add('categoryCard');
        
        const cardImg = document.createElement('img');
        cardImg.classList.add('categoryCard__img');
        cardImg.src = 'https://image.tmdb.org/t/p/w300' + categoryImg;
        cardImg.setAttribute('alt', genre.name);
        
        const cardTitle = document.createElement('h2');
        cardTitle.classList.add('categoryCard__title');
        cardTitle.innerText = genre.name;

        categoryCard.append(cardImg, cardTitle);
        categoriesCards.appendChild(categoryCard);
    }
    
    } catch (err) {
        console.error(err);
    }
}
getMoviesGenres();
async function getTrendingPreview() {
    const res = await fetch(`${API}/trending/movie/day?api_key=${API_KEY}`);
    const data = await res.json();
    console.log(data);

    const movies = data.results;
    movies.forEach(movie => {
        const trendingMoviesArticle = document.querySelector('.section-trending__filmList');

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('film');

        const movieImg = document.createElement('img');
        movieImg.classList.add('film-img');
        movieImg.src = 'https://image.tmdb.org/t/p/w300' + movie.poster_path;
        movieImg.setAttribute('alt', movie.title);

        const movieTitle = document.createElement('h3');
        movieTitle.innerText = movie.title;
        movieTitle.classList.add('film-title');
        movieTitle.classList.add('inactive');

        const movieYear = document.createElement('p');
        movieYear.classList.add('film-year');
        movieYear.innerText = 2023;
        
        const movieRate = document.createElement('p');
        movieRate.classList.add('film-rate');
        movieRate.innerText = `${movie.vote_average.toFixed(1)} ⭐`

        movieContainer.append(movieImg, movieTitle, movieYear, movieRate);
        trendingMoviesArticle.appendChild(movieContainer);
    });
}
getTrendingPreview()