const API_URL = "http://localhost:3000";

async function getMovies() {
	try {
	  const response = await fetch(`${API_URL}/movies`);
	  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
	  const movies = await response.json();
  
	  const moviesList = document.getElementById("moviesList");
	  moviesList.innerHTML = "";
  
	  movies.forEach((movie) => {
		const card = createMovieCard(movie);
		const li = document.createElement("li");
		li.appendChild(card);
		moviesList.appendChild(li);
	  });
  
	  const buttons = document.querySelectorAll(".add-favourite-btn");
	  [...buttons].forEach((button) => {
		button.addEventListener("click", () => {
		  const movie = JSON.parse(button.dataset.movie);
		  addFavourite(movie);
		});
	  });
	  
  
	  return movies; // Return the movies array
	} catch (error) {
	  console.error("Error occurred while fetching movies:", error);
	  throw error; // Rethrow the error to be caught by the test
	}
  }
  

  async function getFavourites() {
	try {
	  const response = await fetch(`${API_URL}/favourites`);
	  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
	  const favourites = await response.json();
	  console.log("Favourites: ", favourites);
  
	  const favouritesList = document.getElementById("favouritesList");
	  if (!favouritesList) throw new Error("Element with ID 'favouritesList' not found");
  
	  favouritesList.innerHTML = "";
  
	  favourites.forEach((movie) => {
		const card = createMovieCard(
		  movie,
		  "remove-favourite-btn",
		  "Remove from Favourite"
		);
		const li = document.createElement("li");
		li.appendChild(card);
		favouritesList.appendChild(li);
	  });
  
	  const buttons = document.querySelectorAll(".remove-favourite-btn");
	  [...buttons].forEach((button) => {
		button.addEventListener("click", () => {
		  const movie = JSON.parse(button.dataset.movie);
		  removeFromFavourite(movie);
		});
	  });
  
	  return favourites; // Ensure the function returns the correct data
	} catch (error) {
	  console.error("Error occurred while fetching favourites:", error);
	  throw error; // Ensure errors are properly propagated
	}
  }
  async function addFavourite(movie) {
	try {
	  // Fetch the current list of favourites
	  const response = await fetch(`${API_URL}/favourites`);
	  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
	  const favourites = await response.json();
  
	  // Check if the movie is already in favourites
	  if (!favourites.some((fav) => fav.id === movie.id)) {
		// Add the movie to favourites
		const postResponse = await fetch(`${API_URL}/favourites`, {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(movie),
		});
  
		if (!postResponse.ok) throw new Error(`HTTP error! Status: ${postResponse.status}`);
  
		// Optionally, update the local favourites list
		await getFavourites(); // Ensure the function is awaited
	  } else {
		throw new Error('Movie is already added to favourites');
	  }
	} catch (error) {
	  console.error("Error occurred while adding to favourites:", error);
	  throw error; // Ensure errors are properly propagated
	}
  }
  

async function removeFromFavourite(movie) {
  try {
    await fetch(`${API_URL}/favourites/${movie.id}`, {
      method: "DELETE",
    });
    getFavourites();
  } catch (error) {
    console.error("Error occurred while removing from favourites:", error);
  }
}

function createMovieCard(
  movie,
  buttonClass = "add-favourite-btn",
  buttonText = "Add to Favourite"
) {
  const cardHTML = `
    <div class="card mb-3" style="width: 18rem;">
      <img class="card-img-top" src="${movie.posterPath}" alt="${movie.title}">
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">${movie.overview}</p>
        <p class="card-text"><small class="text-muted">Release Date: ${movie.releaseDate}</small></p>
        <p class="card-text"><small class="text-muted">Vote Count: ${movie.voteCount}</small></p>
        <p class="card-text"><small class="text-muted">Vote Average: ${movie.voteAverage}</small></p>
        <p class="card-text"><small class="text-muted">Popularity: ${movie.popularity}</small></p>
        <p class="card-text"><small class="text-muted">Original Language: ${movie.originalLanguage}</small></p>
        <p class="card-text"><small class="text-muted">Original Title: ${movie.originalTitle}</small></p>
        <p class="card-text"><small class="text-muted">Adult: ${movie.adult}</small></p>
        <button data-movie='${JSON.stringify(movie)}' class='${buttonClass}'>${buttonText}</button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = cardHTML;

  return container.firstElementChild;
}

module.exports = {
  getMovies,
  getFavourites,
  addFavourite,
  removeFromFavourite
};
