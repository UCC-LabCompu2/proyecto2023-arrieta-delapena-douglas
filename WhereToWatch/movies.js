const loadMovies = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=dcfbb1ad76889a2f3af575f398f1ab52&language=es-MX&page=1');
        const data = await response.json();

        let peliculas = '';
        data.results.forEach(pelicula =>{

            let saveMovieId =  (moveid) => {
                localStorage.setItem('movieId', moveid);
                location.href = 'description.html';
            }

            peliculas += `
                <div class ='movie-container'>
                    <img class='movie-image' src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="Movie image">
                    <!--aca esta el problema, depende de la funcion saveMovieId que pagina se abre-->
                    <button class="movie-button" onclick="${saveMovieId(pelicula.id)}" target="_self">Ver mas</button>
                </div>
            `;
        })
        document.getElementById('movies-container').innerHTML = peliculas;

    }catch (error){
        console.log(error)
    }
}

loadMovies();
