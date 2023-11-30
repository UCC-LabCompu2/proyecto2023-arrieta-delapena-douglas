let movieId = localStorage.getItem('movieId');
const apiKey = 'dcfbb1ad76889a2f3af575f398f1ab52';

let saveMovieId = (moveid) => {
    localStorage.setItem('movieId', moveid);
    window.location.href = 'description.html';
    window.location.target = '_self';
}
/**
 * Encuentra la película por id que se transmite al localStorage cuando se apreta ' Ver mas ' y la muestra en pantalla
 * @loadMovie
 * @param {none} none - no toma parámetros
 * @return no retorna un valor
 */
const loadMovie = async () => {
    try {
        let providerLogo = '';
        let random;
        let video = '';
        let recomm_data = '';
        try {

            const responseProviders = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}&language=en-US`);
            const prov_data = await responseProviders.json();
            // console.log(prov_data.results.AR.flatrate.length)
            // console.log(prov_data.results.AR.flatrate)

            const responseImages = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`);
            const images_data = await responseImages.json();
            const sortedImages = images_data.backdrops.sort((a, b) => b.file_size - a.file_size);
            // console.log(sortedImages.length)

            const responseRecommendations= await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US&page=1`);
            const similar_data = await responseRecommendations.json();
            // order by popularity
            similar_data.results.sort((a, b) => b.popularity - a.popularity);
            for (let i = 0; i < 4; i++) {
                recomm_data += `<button class='single-movie-recommendation-button' onclick="saveMovieId(${similar_data.results[i].id})"><img class='single-movie-recommendation' src='https://image.tmdb.org/t/p/original${similar_data.results[i].backdrop_path }' alt="${similar_data.results[i].title}"></button>`
            }
            localStorage.setItem('recommendations', recomm_data);

            const responseVideo = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`)
            const video_raw_data = await responseVideo.json();
            const video_data = video_raw_data.results.filter(element => element.type === 'Trailer');

            // handle video
            let video = '';
            if (video_data[0] !== undefined || video_data[0] == '') {
                video = `                        <iframe class='single-movie-trailer' width="360" height="203"
                            src="https://www.youtube.com/embed/${video_data[0].key}">
                        </iframe>`
                localStorage.setItem('video', video);
            }
            else{
                video = '';
                localStorage.setItem('video', video);
            }

            // handle backdrops
            if (sortedImages.length === 0 ){
                random = 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80';
            }
            else if (sortedImages.length >= 3) {
                random = Math.floor(Math.random() * 3);
                console.log(random)
            } else {
                random = Math.floor(Math.random() * images_data.backdrops.length);
                console.log(random)
            }
            localStorage.setItem('backdrop', sortedImages[random].file_path);
            // handle providers
            try {
                if(prov_data.results.AR.flatrate.length == 0){
                    throw new Error('No hay proveedores');
                }
                else {
                    for (let i in prov_data.results.AR.flatrate) {
                        providerLogo += `<img class="single-movie-provider-image" src="https://image.tmdb.org/t/p/w500${prov_data.results.AR.flatrate[i].logo_path}" alt="${prov_data.results.AR.flatrate[i].provider_name}">`
                    }
                }
            } catch (error) {
                providerLogo = `<img class="single-movie-provider-image" src="Imagenes/Error.png" alt="No hay proveedores">`;
            }
        } catch (error) {
            console.log(error)
        }

        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=dcfbb1ad76889a2f3af575f398f1ab52&language=en-US`);
        const data = await response.json();

        const responseImdb = await fetch(`https://www.omdbapi.com/?i=${data.imdb_id}&apikey=85b3e24f`);
        const imdbData = await responseImdb.json();

        // handle runtime
        let arr = data.release_date.split('-');
        let runTime = `${Math.floor(data.runtime/60)}h ${data.runtime%60}m`;

        // handle genres
        let genres = '';
        if (data.genres.length !== 0) {
            data.genres.forEach(element => {
               genres+= `<p class='single-movie-smalldata'>${element.name}</p> `;
            });
        }

        let pelicula = `
            <div class="single-movie-backdrop-container">
                <img class='single-movie-backdrop' src="https://image.tmdb.org/t/p/original${localStorage.getItem('backdrop')}" alt="imagen de pelicula">
            </div>
            <h2 class='single-movie-title'>${data.title}</h2>
            <div class='single-movie-container'>
                <img class='single-movie-image' src="https://image.tmdb.org/t/p/w500/${data.poster_path}" alt="imagen de pelicula">
                <div class='single-movie-details'>
                    <div class='single-movie-smalldata-container'>
                        <p class='single-movie-smalldata'>${arr[0]}</p>
                        ${genres}
                        <p class='single-movie-smalldata'>${runTime}</p>
                        <p class='single-movie-smalldata-imdb'>IMDb | ${imdbData.imdbRating}</p>
                    </div>
                    <div class='single-movie-description-container'>
                        <p class='single-movie-sinopsis'>Sinopsis:</p>
                        <p class='single-movie-description'>${data.overview}</p>
                    </div>
                    <hr>
                        <p class='single-movie-sinopsis'>Mirala en:</p>
                    <div class='single-movie-provider_trailer-div' id='single-movie-provider-div'>
                        <div class='single-movie-provider'>${providerLogo}</div>
                        ${localStorage.getItem('video')}
                    </div>
                    <div single-movie-recommendation-container>
                    <p class='single-movie-sinopsis'>Recomendaciones:</p>
                    ${localStorage.getItem('recommendations')}
                    </div>
                </div>
            </div>
<!--            <button class="single-movie-button"><a href="index.html" target="_self">Regresar</a></button>-->
        `;

        document.getElementById('single-movie-page').innerHTML = pelicula;
    } catch (error) {
        console.log(error)
    }
}

function goToHomePage() {
    // Puedes ajustar la ruta según tu estructura de carpetas y nombres de archivos
    window.location.href = 'index.html';
}


