import { API_KEY, API_KEY_TOKEN } from "./secrets.mjs";
import { categoriesCards, filmDetailContainer, trendingMoviesArticle, movieDetailImg, relatedFilms, filmDetailTitle, filmDetailScore, filmDetailDuration, filmDetailRelease, filmDetailCategories, filmDetailDescription, homeImg, homeImgTitle, popularFilmList, homeExploreImg, moviesGenresBtn, sectionTrailerImg, sectionTrailerTitle, sectionTrailerDescription, sectionTrailerVideo, trailerVideo} from "./nodes.js";
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${API_KEY_TOKEN}`
    }
});


// Utils
const moviesId = [];
async function getGenres(genres, apiUrl) {
    moviesId.splice(0);
    while (categoriesCards.firstChild) {
        categoriesCards.removeChild(categoriesCards.firstChild);
    }
    for (const genre of genres) {
        const {data} = await api.get(`${apiUrl}${genre.id}`);
        let categoryImg;
        for (let i = 0; i < data.results.length; i++) {
            const apiMovie = data.results[i];
            const isRepeated = moviesId.some(movie => {
                return apiMovie.id == movie.id;
            });
            if (!isRepeated) {
                moviesId.push(apiMovie);
                categoryImg = apiMovie.poster_path;
            }
        }
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('categoryCard');
        
        const cardImg = document.createElement('img');
        cardImg.classList.add('categoryCard__img');
        cardImg.src = 'https://image.tmdb.org/t/p/w300' + categoryImg;
        if (!categoryImg) cardImg.src = "../assets/missing-photo.png";
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
    
}
function appendMovies(container, movies, related = false, popular = false) {
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

        if (popular) {
            const movieContentContainer = document.createElement('div');
            movieContentContainer.classList.add('film__container--secondary');

            movieContainer.classList.add('film--secondary')
            movieTitle.classList.add('film-title--secondary');
            movieTitle.classList.remove('inactive')
            movieYear.classList.add('film-year--secondary');
            movieRate.classList.add('film-rate--secondary');

            const movieDescription = document.createElement('p');
            movieDescription.classList.add('film-description');
            movieDescription.innerText = movie.overview;
            movieContentContainer.append(movieTitle,movieDescription ,movieYear, movieRate);
            movieContainer.append(movieImg, movieContentContainer);
        } else {
            movieContainer.append(movieImg, movieTitle, movieYear, movieRate);
        }

        movieContainer.addEventListener('click', () => location.hash = `#movie=${movie.id}-${movie.title}`)
        container.appendChild(movieContainer);
    });
}
async function getRandomMovie() {
    const {data} = await api.get('/trending/all/week');

    const movies = data.results;

    while (true){
        const randomNum = Math.floor(Math.random()*movies.length);
        if (movies[randomNum].media_type !== 'person') {
            return movies[randomNum]
        }
    }
}


// Consuming API
// Home
async function getMovieHome() {
    const movieHome = await getRandomMovie();
    homeImg.src = 'https://image.tmdb.org/t/p/w780' + movieHome.backdrop_path;
    homeImgTitle.innerText = movieHome.media_type == 'tv' ? movieHome.name : movieHome.title ;

    //Image of the explore section
    const movieExplore = await getRandomMovie();
    homeExploreImg.src = 'https://image.tmdb.org/t/p/w780' +movieExplore.backdrop_path;
}
async function getTrendingPreview() {
    const {data} = await api.get('/trending/movie/day');

    const movies = data.results;
    appendMovies(trendingMoviesArticle, movies);
}
async function getPopularPreview() {
    const {data} = await api.get('/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc');

    const movies = data.results;
    movies.splice(3);
    popularFilmList.scrollLeft = 0;
    appendMovies(popularFilmList, movies, false, true);
}
async function getMovieSectionTrailer() {
    const movieTrailer = await getRandomMovie();
    sectionTrailerImg.src = 'https://image.tmdb.org/t/p/w780' + movieTrailer.backdrop_path;
    sectionTrailerTitle.innerText =  movieTrailer.media_type == 'tv' ? movieTrailer.name : movieTrailer.title;
    sectionTrailerDescription.innerText = movieTrailer.overview;
    //
    sectionTrailerVideo.id = `${movieTrailer.id}-${movieTrailer.media_type}`;
    sectionTrailerVideo.addEventListener('click', () => location.hash = `#play=`)
}
async function getMovieTrailer(id, media_type) {
    const {data} = await api.get(`/${media_type}/${id}/videos`);
    const videos = data.results;
    console.log(videos);
    for (const video of videos) {
        if (video.type == 'Trailer') {
            trailerVideo.src = `https://www.youtube.com/embed/${video.key}`
            return
        }
    }
}

//Explore
async function getMoviesGenres() {
    try {
        //get genres
    const { data }= await api.get('/genre/movie/list')
    const genres = data.genres;
    //get a movie photo from a genre
    getGenres(genres, '/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=')
    } catch (err) {
        console.error(err)
    }
}    
async function getSeriesGenres() {
    try {
        //get genres
    const { data }= await api.get('/genre/tv/list')
    const genres = data.genres;
    //get a movie photo from a genre
    getGenres(genres, '/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=')
    } catch (err) {
        console.error(err)
    }
}  
async function getMoviesByCategory(genreId) {
    try {
        const isMoviesActive = moviesGenresBtn.classList.contains('active');
        let movies;
        if (isMoviesActive) {
            const { data } = await api.get(`/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`);
            movies = data.results;
        } else {
            const { data } = await api.get(`/discover/tv?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`);
            movies = data.results;
        }

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

export {getTrendingPreview, getMoviesGenres, getMoviesByCategory, getMoviesBySearch, getTrends, getMovieById, getMovieHome, getPopularPreview, getSeriesGenres, getMovieSectionTrailer, getMovieTrailer} 