import MovieReviews from "./MovieReviews.mjs";

const movieReviews = new MovieReviews();
const dropdowns = document.getElementsByClassName("dropdown");
const dropdownMenus = document.getElementsByClassName("dropdown-menu");
const movieList = document.querySelector(".movie-list");
const modalBody = document.querySelector(".modal-body");
const resetBtns = document.querySelectorAll(".resetBtn");
const submitBtns = document.querySelectorAll(".submitBtn");
const closeBtn = document.querySelector(".closeBtn");
const modal = document.querySelector(".modal");
const filters = {
  reviewer: "",
  query: "",
  date: "",
  type: "",
};
const isSearchBy = {
  keyword: false,
  critic: false,
  type: false,
  reviewer: false,
};
const searchComponents = {
  searchByKeywordOrCritic: document.getElementById("searchByKeywordOrCritic"),
  searchByTypeOrReviewer: document.getElementById("searchByTypeOrReviewer"),
  searchByType: document.getElementById("searchByType"),
  searchByReviewer: document.getElementById("searchByReviewer"),
  searchByKeywordAndDate: document.getElementById("searchByKeywordAndDate"),
};
const data = {
  reviewsOriginal: [],
  reviewsFiltered: [],
};

const toggleHideClass = (element) => {
  element.classList.toggle("hide");
};

const addHideClass = (element) => {
  element.classList.add("hide");
};

const removeHideClass = (element) => {
  element.classList.remove("hide");
};

const hideAllComponents = () => {
  Object.keys(searchComponents).forEach((key) =>
    addHideClass(searchComponents[key])
  );
};

const showComponentsBasedOnSearchByOption = () => {
  hideAllComponents();
  if (isSearchBy.keyword === true) {
    removeHideClass(searchComponents.searchByKeywordAndDate);
  } else if (isSearchBy.type === true) {
    removeHideClass(searchComponents.searchByType);
  } else if (isSearchBy.reviewer === true) {
    removeHideClass(searchComponents.searchByReviewer);
  } else if (isSearchBy.critic === true) {
    removeHideClass(searchComponents.searchByTypeOrReviewer);
  } else {
    removeHideClass(searchComponents.searchByKeywordOrCritic);
  }
};

const getMovieList = () => {
  if (filters.reviewer !== "") {
    movieReviews.getCriticsByReviewer().then((res) => {
      data.reviewsOriginal = [...res];
      data.reviewsFiltered = [...res];

      res.forEach((movie) => {
        movieList.innerHTML += `<li class="card"><img src="${movie.multimedia.resource.src}"></li>`;
      });
    });
  } else if (filters.type !== "") {
    movieReviews.getCriticPicksReviewsByType().then((res) => {
      data.reviewsOriginal = [...res];
      data.reviewsFiltered = [...res];

      res.forEach((movie) => {
        movieList.innerHTML += `<li class="card"><h3>${movie.display_name}</h3></li>`;
      });
    });
  } else {
    movieReviews.getReviewsByQueryAndOpeningDate().then((res) => {
      data.reviewsOriginal = [...res];
      data.reviewsFiltered = [...res];

      res.forEach((movie, index) => {
        movieList.innerHTML += `<li class="card" data-key=${index}><img src="${movie.multimedia.src}"><p class="title">${movie.display_title}</p></li>`;
      });
    });
  }
};

const resetSearchBy = () => {
  Object.keys(isSearchBy).forEach((v) => (isSearchBy[v] = false));
};

const updateDropdownValue = (e, value) => {
  e.target.parentElement.previousElementSibling.innerText = value;
  if (value.toLowerCase() in isSearchBy) {
    resetSearchBy();
    isSearchBy[value.toLowerCase()] = true;
    showComponentsBasedOnSearchByOption();
  }
};

const updateModalContent = (movie) => {
  const movieDetails = `
      <article class="book-details">
      <div class="left">
      <h2>${movie.display_title}</h2>
      <picture><img src="${movie.multimedia.src}" alt="Book cover"></picture>
      </div>
      <div class="right">
      <p class="author"><span>Byline</span>${movie.byline}</p>
      <p class="descp"><span>Summary:</span>${movie.summary_short}</p>
      <p class="buy-links"><span>Review:</span><a href="${movie.link.url}" target="_blank" rel="noreferrer">${movie.link.suggested_link_text}</a>
      </p>
      <p class="date"><span><b>Opening date: </b> ${movie.opening_date}</span></p></div></article>`;
  modalBody.innerHTML = movieDetails;
  toggleHideClass(modal);
};

const addEvents = () => {
  [...dropdowns].forEach((dropdown) => {
    dropdown.addEventListener("click", () =>
      toggleHideClass(dropdown.nextElementSibling)
    );
  });

  [...dropdownMenus].forEach((dropdownMenu) => {
    dropdownMenu.addEventListener("click", (e) => {
      const item = e.target.closest("li");
      updateDropdownValue(e, item.innerText);
      toggleHideClass(dropdownMenu);
    });
  });

  movieList.addEventListener("click", (e) => {
    if (e.target.tagName !== "UL") {
      const movie =
        data.reviewsOriginal[e.target.closest("li").getAttribute("data-key")];
      updateModalContent(movie);
    }
  });

  resetBtns.forEach((resetBtn) => {
    resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resetSearchBy();
      showComponentsBasedOnSearchByOption();
    });
  });

  submitBtns.forEach((submitBtn) => {
    submitBtn.addEventListener("click", (e) => {});
  });

  closeBtn.addEventListener("click", (e) => toggleHideClass(modal));
};

window.addEventListener("load", () => {
  addEvents();
});

getMovieList();
