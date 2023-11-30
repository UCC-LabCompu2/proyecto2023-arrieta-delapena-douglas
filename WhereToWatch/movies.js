/**
 * Guarda el movie id en el localStorage y redirige a la página de descripción de la película
 * @saveMovieId
 * @param {number} movieid - id de la película
 * @return no retorna ningún valor
 */
let saveMovieId = (moveid) => {
    localStorage.setItem('movieId', moveid);
    clearSearchBar(); // Limpia el campo de búsqueda antes de redirigir
    window.location.href = 'description.html';
    window.location.target = '_self';
}


/**
 * Anima el titulo wheretowatch
 * @animateTitle
 * @param{}
 * @return no retorna ningun valor
 */
function animateTitle(){
    const canvas = document.getElementById('title-canvas');
    const ctx = canvas.getContext('2d');
    let text = "WhereToWatch";
    let opacity = 0;
    let interval = setInterval(function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.globalAlpha = opacity;
            ctx.font = "70px Newake";
            ctx.fillStyle = "white";
            ctx.fillText(text, 50, 100);

            opacity += 0.01;

            if (opacity >= 1) clearInterval(interval);

        },
        20);
}

/**
 * Carga las películas en la página principal, si se escribe algo en el input, carga las películas que coincidan con el input, sino busca las pelicula más populares
 * @loadMovies
 * @param {string} movieName - nombre de la película
 * @return no retorna ningún valor
 */
const loadMovies = async (movieName, filterName) => {
    try {
        // primera parte de la url
        const key = 'dcfbb1ad76889a2f3af575f398f1ab52';
        let url = ''

        if (movieName === undefined || movieName === '') {
            url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`;
        }
        else if (movieName === 'rating'){
            url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=1`;
        }
        else if(movieName === 'filter'){
            if (filterName === 'null'){
                url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`;
            }
            else {
                url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&sort_by=popularity.desc&with_genres=${filterName}`
            }
        }
        else {
            url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${movieName}&include_adult=false&language=en-US&page=1&sort_by=popularity.desc`;
        }

        // segunda parte formatear la respuesta
        const response = await fetch(url)
        const data = await response.json();

        if (noResults(data)) {
            document.getElementById('search-bar').value = '';
            alert('No se encontraron resultados');
            document.getElementById('search-bar').innerHTML = ``;
        } else {
            let peliculas = '';
            data.results.forEach(pelicula => {
                if(pelicula.poster_path === null){
                    pelicula.poster_path = 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg';
                }
                else{
                    let temp = pelicula.poster_path;
                    pelicula.poster_path = `https://image.tmdb.org/t/p/w500/${temp}`;
                }
                peliculas += `
                    <button class="movie-button" onclick="saveMovieId(${pelicula.id})"><img class='movie-image' src="${pelicula.poster_path}" alt="movie image"></button>
                    <!--dentro del boton esta el movie id-->
            `;
            })
            document.getElementById('movies-container').innerHTML = peliculas;
        }
    } catch (error) {
        console.log(error)
    }

}

loadMovies();

/**
 * Busca las películas que coincidan con el input
 * @lookMovie
 * @param {none} none- no toma parámetros
 * @return no retorna un valor
 */
const lookMovie = async () => {
    const inputField = document.getElementById("search-bar");
    let inputValue = inputField.value;
    loadMovies(inputValue);
}

/**
 * Si no hay resultados, muestra un alert
 * @noResults
 * @param {object} data - objeto con los datos de la película
 * @return retorna true si no hay resultados
 */
const noResults = (data) => {
    if (data.results.length === 0) {
        if (data.results.title !== document.getElementById("search-bar").value && document.getElementById("search-bar").value !== '') {
            return true;
        }
    }
}
/**
 * Ordena las películas por rating
 * @orderByRating
 * @param {none} none - no toma parámetros
 * @return no retorna un valor
 */
const orderByRating = async () => {
    let heading = document.getElementById("title");
    heading.innerHTML = `<h1 id="new-title">Películas mej<a href="index.html" id="o-tag" target="_self">o<\a>r calificadas<\h1>`;
    loadMovies('rating');
}
/**
 * Ordena las películas por rating y busca una random
 * @randomMovie
 * @param {none} none - no toma parámetros
 * @returns {Promise<void>}
 */
const randomMovie = async () => {
    const key = 'dcfbb1ad76889a2f3af575f398f1ab52';
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=1`;
    const response = await fetch(url)
    const data = await response.json();
    let random = Math.floor(Math.random() * data.results.length);
    let movieId = data.results[random].id;
    saveMovieId(movieId);
}


document.getElementById('genre-finder').addEventListener('change', function() {
    const selectedGenre = this.value;
    // Do something with the selected genre, e.g., call another function or perform actions
    loadMovies('filter', selectedGenre);
});

function clearSearchBar() {
    document.getElementById('search-bar').value = '';
}
