import { API_KEY, API_KEY_TOKEN } from "./secrets.mjs";
import * as Node from "./nodes.js";

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${API_KEY_TOKEN}`
    }
});

//1245
// Utils
//Lazy loading
const observer = new IntersectionObserver(handleIntersect);
observer.observe(sectionTrailerImg)

function handleIntersect(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log(entry.isIntersecting);
            entry.target.src = entry.target.dataset.src;
        }
    })
}
const moviesId = [];
async function getGenres(genres, apiUrl) {
    moviesId.splice(0);
    while (Node.categoriesCards.firstChild) {
        Node.categoriesCards.removeChild(Node.categoriesCards.firstChild);
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

        const screenWidth = window.innerWidth;
        const screenBreakpoint = 716;
        let imgWidth;
        if (screenWidth < screenBreakpoint) {
            imgWidth = 'w342'
        } else {
            imgWidth = 'w500'
        }
        
        const cardImg = document.createElement('img');
        cardImg.classList.add('categoryCard__img');
        cardImg.setAttribute('data-src','https://image.tmdb.org/t/p/' + imgWidth + categoryImg);
        if (!categoryImg) cardImg.src = "../assets/missing-photo.png";
        cardImg.setAttribute('alt', genre.name);
        
        const cardTitle = document.createElement('h2');
        cardTitle.classList.add('categoryCard__title');
        cardTitle.innerText = genre.name;

        categoryCard.append(cardImg, cardTitle);
        
        categoryCard.addEventListener('click', () => {
            const [_ , mediaType] = location.hash.split('=')
            location.hash = `#category=${genre.id}-${genre.name}-${mediaType}`;
        })

        observer.observe(cardImg)
        Node.categoriesCards.appendChild(categoryCard);
    }
    
}
function appendMovies(container, movies, {related = false, popular = false, clean = true} = {}) {
    if (clean) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    const moviesModified = isTrendsPreview(container, movies);
    container.scrollLeft = 0;
    moviesModified.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('film');
        if (related) movieContainer.classList.add('relatedFilms--film');

        const screenWidth = window.innerWidth;
        const screenBreakpoint = 716;
        let imgWidth;
        if (screenWidth < screenBreakpoint) {
            imgWidth = 'w342'
        } else {
            imgWidth = 'w500'
        }

        const movieImg = document.createElement('img');
        movieImg.classList.add('film-img');
        if (movie.poster_path) {
            movieImg.setAttribute("data-src", 'https://image.tmdb.org/t/p/' + imgWidth + movie.poster_path);
        } else {
            console.log(movie);
            movieImg.setAttribute('data-src', '../assets/missing-photo.png')
            const movieTitleImg = document.createElement('span');
            movieTitleImg.innerText = movie.name;
            movieTitleImg.style.position = 'absolute';
            movieTitleImg.style.top = '50%';
            movieTitleImg.style.color = 'black';
            movieTitleImg.style.textAlign = 'center'
            movieContainer.appendChild(movieTitleImg)
        }
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
            movieDescription.innerText = isDescriptionTooLong(movie.overview);
            movieContentContainer.append(movieTitle,movieDescription ,movieYear, movieRate);
            movieContainer.append(movieImg, movieContentContainer);
        } else {
            movieContainer.append(movieImg, movieTitle, movieYear, movieRate);
        }
        observer.observe(movieImg);
        const { title, movieMediaType } = identifyMediaType(movie);
        movieContainer.addEventListener('click', () => location.hash = `#movie=${movie.id}-${title}-${movieMediaType}`)
        container.appendChild(movieContainer);
    });
}
function isTrendsPreview(container, movies) {
    const screenWidth = window.innerWidth;
    const breakpointForLaptop = 1245;
    const breakpointForTablet = 980;
    if (container == Node.trendingMoviesArticle && (location.hash == '#home' || location.hash == '' )) {
        if (screenWidth < breakpointForTablet) {
            return movies
        } else if (screenWidth < breakpointForLaptop) {
            return movies.slice(0, 10)
        } else {
            return movies.slice(0, 12)
        }
    } else {
        return movies
    }
}


function identifyMediaType(movie) {
    let movieMediaType;
    let title;
    if (movie.first_air_date) {
        movieMediaType = 'tv';
        title = movie.name;
    } else {
        movieMediaType = 'movie';
        title = movie.title;
    }
    return { title, movieMediaType };
}

async function getRandomMovieOrSeries() {
    const {data} = await api.get('/trending/all/week');

    const movies = data.results;

    while (true){
        const randomNum = Math.floor(Math.random()*movies.length);
        if (movies[randomNum].media_type !== 'person') {
            return movies[randomNum]
        }
    }
}
function isDescriptionTooLong(string) {
    const maxLength = 140;
    if (string.length > maxLength) {
        return string.substring(0, maxLength) + '...';
    } else {
        return string
    }
}



// Consuming API
// Home
async function getMovieHome() { 
    const movieHome = await getRandomMovieOrSeries();

    const screenWidth = window.innerWidth;
    const screenBreakpoint = 716;
    const screenBreakpointDesktop = 980;
    let imgWidth;
    if (screenWidth < screenBreakpoint) {
        imgWidth = 'w780'
    } else if (screenWidth < screenBreakpointDesktop) {
        imgWidth = 'w1280'
    } else {
        imgWidth = 'original'
    }

    Node.homeImg.src = 'https://image.tmdb.org/t/p/' + imgWidth + movieHome.backdrop_path;
    Node.homeImgTitle.innerText = movieHome.media_type == 'tv' ? movieHome.name : movieHome.title ;
    const { title, movieMediaType }= identifyMediaType(movieHome);
    Node.homeSectionImg.addEventListener('click', () => location.hash = `#movie=${movieHome.id}-${title}-${movieMediaType}`)
    //Image of the explore section
    const movieExplore = await getRandomMovieOrSeries();
    Node.homeExploreImg.src = 'https://image.tmdb.org/t/p/' + imgWidth + movieExplore.backdrop_path;
}
async function getTrendingPreview() {
    const {data} = await api.get('/trending/movie/day');

    const movies = data.results;
    appendMovies(Node.trendingMoviesArticle, movies);
}
async function getPopularPreview() {
    const {data} = await api.get('/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc');

    const movies = data.results;
    movies.splice(3);
    Node.popularFilmList.scrollLeft = 0;
    appendMovies(Node.popularFilmList, movies, {popular: true});
}
async function getMovieSectionTrailer() {
    const movieTrailer = await getRandomMovieOrSeries();

    const imgSize = getImageSize();

    Node.sectionTrailerImg.src = 'https://image.tmdb.org/t/p/' + imgSize + movieTrailer.backdrop_path;
    Node.sectionTrailerTitle.innerText =  movieTrailer.media_type == 'tv' ? movieTrailer.name : movieTrailer.title;
    Node.sectionTrailerDescription.innerText = movieTrailer.overview;
    Node.sectionTrailerRate.innerText = `${movieTrailer.vote_average.toFixed(1)} ⭐`
    //
    Node.sectionTrailerVideo.addEventListener('click', () => {
        getMovieTrailer(movieTrailer.id, movieTrailer.media_type);
        Node.trailerPlayer.classList.remove('inactive');
    })
    //
    getCastSectionTrailer(movieTrailer.id, movieTrailer.media_type);
}
function getImageSize() {
    const screenWidth = window.innerWidth;
    const screenBreakpointDesktop = 980;
    if (screenWidth < screenBreakpointDesktop) {
        return 'w780'
    } else {
        return 'w1280'
    }
}
async function getMovieTrailer(id, media_type) {
    const {data} = await api.get(`/${media_type}/${id}/videos`);
    const videos = data.results;
    for (const video of videos) {
        if (video.type == 'Trailer') {
            Node.trailerVideo.src = `https://www.youtube.com/embed/${video.key}`
            return
        }
    }
}
async function getCastSectionTrailer(id, media_type) {
    try {
        const {data} = await api.get(`/${media_type}/${id}/credits`);
        const cast = data.cast;

        const imageUrl = 'https://image.tmdb.org/t/p/' + getCastImageSize();
        
        while (Node.sectionTrailerCast.firstChild) {
            Node.sectionTrailerCast.removeChild(Node.sectionTrailerCast.firstChild);
        }
        const firstSixElementsCast = cast.slice(0,6);
        for (let i = 0; i <= firstSixElementsCast.length; i++) {
            const actorImg = document.createElement('img');
            actorImg.classList.add('actor-img');
            actorImg.setAttribute('data-src', `${imageUrl}${cast[i].profile_path}`);
            
            observer.observe(actorImg)
            Node.sectionTrailerCast.appendChild(actorImg);
        }
        return
        console.log('render');
    } catch (err) {
        console.error(err);
    }
}
function getCastImageSize() {
    const screenWidth = window.innerWidth;
    const screenBreakpointDesktop = 980;
    if (screenWidth < screenBreakpointDesktop) {
        return 'w45'
    } else {
        return 'w185'
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
async function getMoviesByCategory(genreId, {page = 1} = {}) {
    try {
        console.log(page);
        const { data } = await api.get(`/discover/movie`,{
            params: {
                include_adult: false,
                include_video: false,
                language: 'en-US',
                sort_by: 'popularity.desc',
                with_genres: genreId,
                page: page
            }
        });
        const movies = data.results;
        console.log(data);
        appendMovies(Node.trendingMoviesArticle, movies, {clean: page == 1});
        return data.total_pages
    } catch (err) {
        console.error(err);
    }
}
async function getSeriesByCategory(genreId, {page = 1} = {}) {
    try {
        const { data } = await api.get(`/discover/tv`, {
            params: { 
                include_adult: false,
                include_video: false,
                language: 'en-US',
                sort_by: 'popularity.desc',
                with_genres: genreId,
                page: page
            }
        });
        const series = data.results;

        appendMovies(Node.trendingMoviesArticle, series, {clean: page == 1})
        return data.total_pages
    } catch (err) {
        throw Error(err)
    }
}
async function getMoviesAndSeriesBySearch(query, {page = 1}={}) {
    try {
        const { data } = await api.get(`/search/multi`, {
            params: {
                query: query,
                page: page
            }
        });
        console.log(data.total_pages);
        console.log(data);
        const multiResults = data.results;
        const multiResultsCleaned = multiResults.filter(element => element.media_type !== 'person');
        appendMovies(Node.trendingMoviesArticle, multiResultsCleaned, {clean: page == 1});

        return data.total_pages
    } catch (err) {
        console.error(err);
    }
}

async function getTrends({page = 1} = {}) {
    const {data} = await api.get('/trending/movie/day', {
        params: {
            page: page
        }
    });

    const movies = data.results;
    appendMovies(Node.trendingMoviesArticle, movies, {clean: page == 1});
    return data.total_pages
}

async function getMovieById(id) {
    try {
        const { data: movie } = await api.get(`/movie/${id}`);
        renderMovieDetail(movie);

        //Related movies
        const { data } = await api.get(`/movie/${id}/similar`);
        const relatedMovies = data.results;
        appendMovies(Node.relatedFilms, relatedMovies, {related: true});
    } catch (err) {
        console.error(err);
    }
}
function renderMovieDetail(movie) {
    const imgDetails = getDetailImageSize(movie);
    Node.movieDetailImg.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url('https://image.tmdb.org/t/p/${imgDetails}')`;
    Node.filmDetailTitle.innerText = movie.original_title;

    Node.filmDetailScore.innerText = '⭐' + movie.vote_average.toFixed(1);

    Node.filmDetailDuration.innerText = movie.runtime; //! PENDIENTE
    Node.filmDetailRelease.innerText = movie.release_date; //! PENDIENTE
    Node.filmDetailCategories.innerText = movie.genres.map(genre => genre.name).join(' - '); //!PENDIENTE - add click event to each genre

    Node.filmDetailDescription.innerText = movie.overview;
}

function getDetailImageSize(movie) {
    const screenWidth = window.innerWidth;
    const screenBreakpoint = 716;
    if (screenWidth < screenBreakpoint) {
        return 'w500' + movie.poster_path;
    } else {
        return 'w1280' + movie.backdrop_path;
    }
}

async function getSerieById(id) {
    const { data: serie } = await api.get(`/tv/${id}`);
    renderSeriesDetail(serie);

    //Related series
    const { data } = await api.get(`/tv/${id}/similar`);
    const relatedSeries = data.results;
    Node.filmDetailSubtitle.innerText = 'Similar Series'
    appendMovies(Node.relatedFilms, relatedSeries, {related: true});
}
function renderSeriesDetail(serie) {
    const imgDetails = getDetailImageSize(serie);

    Node.movieDetailImg.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url('https://image.tmdb.org/t/p/${imgDetails}')`;
    Node.filmDetailTitle.innerText = serie.name;

    Node.filmDetailScore.innerText = '⭐' + serie.vote_average.toFixed(1);
    const season = serie.number_of_seasons < 2 ? 'SEASON' : 'SEASONS'
    Node.filmDetailDuration.innerText = serie.number_of_seasons +' '+ season; //! PENDIENTE
    Node.filmDetailRelease.innerText = serie.first_air_date; //! PENDIENTE
    Node.filmDetailCategories.innerText = serie.genres.map(genre => genre.name).join(' - '); //!PENDIENTE - add click event to each genre

    Node.filmDetailDescription.innerText = serie.overview;
}





export {getTrendingPreview, getMoviesGenres, getMoviesByCategory, getSeriesByCategory, getMoviesAndSeriesBySearch, getTrends, getMovieById, getMovieHome, getPopularPreview, getSeriesGenres, getMovieSectionTrailer, getMovieTrailer, getCastSectionTrailer, getSerieById} 