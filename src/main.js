import { API_KEY, API_KEY_TOKEN } from "./secrets.mjs";
import { categoriesCards, trendingMoviesArticle } from "./nodes.js";
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
function appendMovies(container, movies) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('film');

        const movieImg = document.createElement('img');
        movieImg.classList.add('film-img');
        movieImg.src = movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : '../assets/missing-photo.png';
        movieImg.setAttribute('alt', movie.title);

        const movieTitle = document.createElement('h3');
        movieTitle.innerText = movie.title;
        movieTitle.classList.add('film-title');
        movie.poster_path ? movieTitle.classList.add('inactive') : movieTitle.classList.remove('inactive') ;

        const movieYear = document.createElement('p');
        movieYear.classList.add('film-year');
        movieYear.innerText = 2023;
        
        const movieRate = document.createElement('p');
        movieRate.classList.add('film-rate');
        movieRate.innerText = `${movie.vote_average.toFixed(1)} ⭐`

        movieContainer.append(movieImg, movieTitle, movieYear, movieRate);
        movieContainer.addEventListener('click', () => location.hash = "#movie=")
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
    console.log(data);

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

export {getTrendingPreview, getMoviesGenres, getMoviesByCategory, getMoviesBySearch} 