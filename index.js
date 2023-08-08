async function fetchForPopularMovies() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2MxODk5Yzc4NjQwYzcyOThlOThjZTc0OTIwNWViYyIsInN1YiI6IjYzYjM3MGFhY2I4MDI4MDBhNzRhMjE3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.87JVpKYSnxYv4OSr925IP2Ml-aW_ygeitkF_CoowlWg'
    }
  };

  try {
    return fetch('https://api.themoviedb.org/3/movie/popular', options)
      .then(response => response.json())
  } catch (error) {
    console.log(error)
  }
}

async function fetchForIndividualMovie(movieId) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Y2MxODk5Yzc4NjQwYzcyOThlOThjZTc0OTIwNWViYyIsInN1YiI6IjYzYjM3MGFhY2I4MDI4MDBhNzRhMjE3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.87JVpKYSnxYv4OSr925IP2Ml-aW_ygeitkF_CoowlWg'
    }
  };

  try {
    return fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options)
      .then(response => response.json())
  } catch (error) {
    console.log(error)
  }
}

function separateByThree(popularMoviesResult) {
  const random = () => Math.floor(Math.random() * popularMoviesResult.length)

  let selectedOnes = new Set()

  while (selectedOnes.size < 3) {
    selectedOnes.add(popularMoviesResult[random()].id)
  }

  return [...selectedOnes]
}

function amountMovieLayout({ id, title, rating, time, date, poster }) {
  return `
    <div class="movie" data-id=${id}>
      <div class="title">
        <span>${title}</span>

        <div class="rating">
          <img src="assets/Star.svg" class="star">
          ${rating.toFixed(1)}
        </div>
      </div>

      <div class="poster">
        <img src="https://image.tmdb.org/t/p/w500${poster}">

        <span class="time-and-date">
          <p>${time}</p>

          <p>${date}</p>
        </span>
      </div>

      <button class="watch"> 
        <img src="assets/Play.svg">

        Assistir trailer
      </button>
    </div>
  `
}

function transform(movieRuntime) {

}

function transformDate(movieDate) {
  const date = new Date(movieDate)
  return date.getFullYear().toString()
}

async function whenRefreshThePage() {
  // search for most popular movies
  const { results } = await fetchForPopularMovies()

  // in this movies, separate these by three
  const threeSelected = separateByThree(results).map(async (movie) => {

    // for each, get more personal informations
    const movieInfo = await fetchForIndividualMovie(movie)

    const editedTitle = movieInfo.title.length > 20 ? movieInfo.title.substring(0, 20).concat('...') : movieInfo.title

    const movieProps = {
      id: movieInfo.id,
      title: editedTitle,
      rating: movieInfo.vote_average,
      time: movieInfo.runtime,
      date: transformDate(movieInfo.release_date),
      poster: movieInfo.poster_path
    }

    return amountMovieLayout(movieProps)
  })

  const result = await Promise.all(threeSelected)
  document.querySelector('.recomendations').innerHTML = result.join("")
}

whenRefreshThePage()