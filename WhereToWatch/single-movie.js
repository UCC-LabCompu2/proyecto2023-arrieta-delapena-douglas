let takeData = localStorage.getItem('movieId');

const loadMovie = async () => {
    try {
        let providers = '';
        try {

            const responseProviders = await fetch(`https://api.themoviedb.org/3/movie/${takeData}/watch/providers?api_key=dcfbb1ad76889a2f3af575f398f1ab52&language=en-US`);
            const prov_data = await responseProviders.json();
            providers = prov_data.results.AR.flatrate[0].provider_name
        } catch (error) {
            providers = 'No hay proveedores disponibles'
        }
        const response = await fetch(`https://api.themoviedb.org/3/movie/${takeData}?api_key=dcfbb1ad76889a2f3af575f398f1ab52&language=en-US`);
        const data = await response.json();

        let pelicula = '';
        pelicula += `
            <h2 class='single-movie-title'>${data.title}</h2> 
             <div class ='single-movie-container'>
                <img class='single-movie-image' src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="imagen de pelicula">
                <div class='single-movie-description-container'>
                <p class='single-movie-description'>${data.overview}</p>
                </div>
                <div class='single-movie-provider-div' id='single-movie-provider-div'>
                <p class='single-movie-provider'>${providers}</p>
                </div>
            </div> 
            <button class="single-movie-button"><a href="index.html" target="_self">Regresar</a></button>
        `;

        document.getElementById('single-movie-page').innerHTML = pelicula;
    } catch (error) {
        console.log(error)
    }
}


