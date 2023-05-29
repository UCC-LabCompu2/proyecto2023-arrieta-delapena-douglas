let saveMovieId = (moveid) => {
    localStorage.setItem('movieId', moveid);
    window.location.href = 'description.html';
    window.location.target = '_self';
    loadMovie();
}

const loadMovies = async (movieName) => {
    try {
        const key = 'dcfbb1ad76889a2f3af575f398f1ab52';
        let url = ''

        if (movieName === undefined || movieName === '') {
            url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=es-MX&page=1`;
        } else {
            url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${movieName}&include_adult=false&language=es-MX&page=1`;
        }

        const response = await fetch(url)
        const data = await response.json();


        if (noResults(data)) {
            document.getElementById('search-bar').value = '';
            alert('No se encontraron resultados');
            document.getElementById('search-bar').innerHTML = ``;
        } else {
            let peliculas = '';
            data.results.forEach(pelicula => {
                peliculas += `
                <div class ='movie-container'>
                    <img class='movie-image' src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="movie image">
                    <button class="movie-button"  onclick="saveMovieId(${pelicula.id})" >Ver mas</button>
                </div>
            `;
            })
            document.getElementById('movies-container').innerHTML = peliculas;
        }
    } catch (error) {
        console.log(error)
    }

}

loadMovies();

const lookMovie = async () => {
    const inputField = document.getElementById("search-bar");
    let inputValue = inputField.value;
    loadMovies(inputValue);
}

const noResults = (data) => {
    if (data.results.length === 0) {
        if (data.results.title !== document.getElementById("search-bar").value && document.getElementById("search-bar").value !== '') {
            return true;
        }
    }
}