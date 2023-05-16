const loadMovie = async () => {
    try {
        let takeData = localStorage.getItem('movieId');

        const response = await fetch(`https://api.themoviedb.org/3/movie/${takeData}?api_key=dcfbb1ad76889a2f3af575f398f1ab52&language=en-US`);
        const data = await response.json();

        let pelicula = '';
        pelicula += `
            <div class ='single-movie-container'>
                <h2 class="single-movie-title">${data.title}</h2> 
                <img class='single-movie-image' src="https://image.tmdb.org/t/p/w500/${data.poster_path}">
                <p class="single-movie-description">${data.overview}</p>
                <button class="single-movie-button"><a href="index.html" target="_self">Regresar</a></button>
            </div> 
        `;
        document.getElementById('single-movie-container').innerHTML = pelicula;
    }catch (error){
        console.log(error)
    }
}


