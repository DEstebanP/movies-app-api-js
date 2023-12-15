import { API_KEY, API_KEY_TOKEN } from "./secrets.mjs";
import { categoriesCards, filmDetailContainer, trendingMoviesArticle, movieDetailImg, relatedFilms, 
    filmDetailTitle, filmDetailScore, filmDetailDuration, filmDetailRelease, filmDetailCategories, filmDetailDescription } from "./nodes.js";
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${API_KEY_TOKEN}`
    }
});


// Utils
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
function appendMovies(container, movies, related = false) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.scrollLeft = 0;
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('film');
        if (related) movieContainer.classList.add('relatedFilms--film'); 

        const movieImg = document.createElement('img');
        movieImg.classList.add('film-img');
        movieImg.src = movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : '../assets/missing-photo.png';
        movieImg.setAttribute('alt', movie.title);

        const movieTitle = document.createElement('h3');
        movieTitle.innerText = movie.title;
        movieTitle.classList.add('film-title');
        movieTitle.classList.add('inactive')
        /* movie.poster_path ? movieTitle.classList.add('inactive') : movieTitle.classList.remove('inactive') ; */

        const movieYear = document.createElement('p');
        movieYear.classList.add('film-year');
        movieYear.innerText = 2023;
        
        const movieRate = document.createElement('p');
        movieRate.classList.add('film-rate');
        movieRate.innerText = `${movie.vote_average.toFixed(1)} ⭐`

        movieContainer.append(movieImg, movieTitle, movieYear, movieRate);
        movieContainer.addEventListener('click', () => location.hash = `#movie=${movie.id}-${movie.title}`)
        container.appendChild(movieContainer);
    });
}

// Consuming API
async function getMoviesGenres() {
    try {
        //get genres
    const { data }= await api.get('/genre/movie/list')
    const genres = data.genres;
    console.log(genres);
    //get a movie photo from a genre
    for (const genre of genres) {
        const {data} = await api.get(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre.id}`);
        const categoryImg = getMoviePhotoGenre(data.results);

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
        
        categoryCard.addEventListener('click', () => {
            location.hash = `#category=${genre.id}-${genre.name}`;
        })
        categoriesCards.appendChild(categoryCard);
    }
    
    } catch (err) {
        console.error(err);
    }
}
async function getTrendingPreview() {
    const {data} = await api.get('/trending/movie/day');

    const movies = data.results;
    appendMovies(trendingMoviesArticle, movies);
}
async function getMoviesByCategory(genreId) {
    try {
        const { data } = await api.get(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`);
        const movies = data.results;
        appendMovies(trendingMoviesArticle, movies);
    } catch (err) {
        console.error(err);
    }
}
async function getMoviesBySearch(query) {
    try {
        const { data } = await api.get(`/search/movie`, {
            params: {
                query: query,
                page: '1'
            }
        });
        const movies = data.results;
        console.log(movies);
        appendMovies(trendingMoviesArticle, movies);
    } catch (err) {
        console.error(err);
    }
}
async function getTrends() {
    const {data} = await api.get('/trending/movie/day');
    console.log(data);

    const movies = data.results;
    appendMovies(trendingMoviesArticle, movies);
}
async function getMovieById(id) {
    try {
        const { data: movie } = await api.get(`/movie/${id}`);
        
        
        movieDetailImg.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url('https://image.tmdb.org/t/p/w500${movie.poster_path}')`;
        filmDetailTitle.innerText = movie.original_title;
        
        filmDetailScore.innerText = '⭐'+movie.vote_average.toFixed(1);
        
        filmDetailDuration.innerText = movie.runtime; //! PENDIENTE
        filmDetailRelease.innerText = movie.release_date; //! PENDIENTE
        filmDetailCategories.innerText = movie.genres.map(genre => genre.name).join(' - '); //!PENDIENTE - add click event to each genre

        filmDetailDescription.innerText = movie.overview;


        //Related movies
        const { data } = await api.get(`/movie/${id}/similar`);
        const relatedMovies = data.results;
        appendMovies(relatedFilms, relatedMovies, true);
    } catch (err) {
        console.error(err);
    }
}

export {getTrendingPreview, getMoviesGenres, getMoviesByCategory, getMoviesBySearch, getTrends, getMovieById} 