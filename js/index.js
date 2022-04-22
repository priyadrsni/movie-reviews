import MovieReviews from "./MovieReviews.mjs";

const movieReviews = new MovieReviews();
const movieList = document.querySelector(".movie-list");
const dropdown = {
  all: document.getElementsByClassName("dropdown"),
  values: document.querySelectorAll(".dropdown .value"),
  categories: document.querySelectorAll(".dropdown .category"),
  menus: document.getElementsByClassName("dropdown-menu"),
};
const buttons = {
  resetBtns: document.querySelectorAll(".resetBtn"),
  submitBtns: document.querySelectorAll(".submitBtn"),
  closeBtn: document.querySelector(".closeBtn"),
};
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal-body");
const searchComponents = {
  searchByKeywordOrCritic: document.getElementById("searchByKeywordOrCritic"),
  searchByTypeOrReviewer: document.getElementById("searchByTypeOrReviewer"),
  searchByType: document.getElementById("searchByType"),
  searchByReviewer: document.getElementById("searchByReviewer"),
  searchByKeywordAndDate: document.getElementById("searchByKeywordAndDate"),
};
const filters = {
  reviewer: "",
  query: "",
  startDate: "",
  endDate: "",
  type: "",
};
const isSearchBy = {
  keyword: false,
  critic: false,
  type: false,
  reviewer: false,
};
const data = {
  reviews: [],
  previousCategory: "",
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

const resetAllDropdownValues = () => {
  dropdown.values.forEach((dropdownValue) => {
    dropdownValue.innerText = dropdownValue.getAttribute("data-default");
  });
};

const resetAllCategoryValues = () => {
  [...dropdown.categories].forEach((dropdownCategory) => {
    dropdownCategory.innerText = "Category:";
  });
};

const resetAllFilterValues = () => {
  Object.keys(filters).forEach((key) => (filters[key] = ""));
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
    resetAllDropdownValues();
    resetAllCategoryValues();
    resetAllFilterValues();
    removeHideClass(searchComponents.searchByKeywordOrCritic);
  }
};

const populateMovieData = (response) => {
    movieList.innerHTML = "";

    response.forEach((movie, index) => {
    const image = movie.multimedia
        ? movie.multimedia.src
        : "./public/images/clapboard.png";
    movieList.innerHTML += `<li class="card" data-key=${index}><img src="${image}"><p class="title">${movie.display_title}</p></li>`;
    });
}

const getAndPopulateMovieListByFilter = () => {
  if (filters.reviewer !== "") {
    movieReviews.getCriticsByReviewer(filters.reviewer).then((res) => {
      data.reviews = [...res];
      movieList.innerHTML = "";

      res.forEach((movie, index) => {
        const image = movie.multimedia
          ? movie.multimedia.resource.src
          : "./public/images/person.png";
        const title = movie.display_title
          ? movie.display_title
          : movie.display_name;
        movieList.innerHTML += `<li class="card" data-key=${index}><img src="${image}"><p class="title">${title}</p></li>`;
      });
    });
  } else if (filters.type !== "") {
    movieReviews.getCriticPicksReviewsByType(filters.type).then((res) => {
      data.reviews = [...res];
      populateMovieData(res);
    });
  } else {
    movieReviews
      .getReviewsByQueryAndOpeningDate(
        filters.query,
        filters.startDate,
        filters.endDate
      )
      .then((res) => {
        data.reviews = [...res];
        populateMovieData(res);
      });
  }
};

const resetSearchBy = () => {
  Object.keys(isSearchBy).forEach((v) => (isSearchBy[v] = false));
};

const updateDropdownValue = (e, value) => {
  e.target.parentElement.previousElementSibling.querySelector(
    ".value"
  ).innerText = value;
  if (value.toLowerCase() in isSearchBy) {
    resetSearchBy();
    isSearchBy[value.toLowerCase()] = true;
    showComponentsBasedOnSearchByOption();
  }
};

const getFilterDataFromUser = (element) => {
  const elementId = element.getAttribute("id");
  const inputElements = {
    textInputElement: document.querySelector(
      `#${elementId} input[type="text"]`
    ),
    startDateInputElement: document.querySelector(
      `#${elementId} input[name="start-date"]`
    ),
    endDateInputElement: document.querySelector(
      `#${elementId} input[name="end-date"]`
    ),
    dropdownInputElement: document.querySelector(`#${elementId} .value`),
  };

  if (isSearchBy.keyword) {
    filters.query = inputElements.textInputElement.value;
    filters.startDate = inputElements.startDateInputElement.value;
    filters.endDate = inputElements.endDateInputElement.value;
  } else if (isSearchBy.type) {
    filters.type = inputElements.dropdownInputElement.innerText;
  } else if (isSearchBy.reviewer) {
    filters.reviewer = inputElements.textInputElement.value;
  }
};

const updateModalContent = (data) => {
  const {
    display_title,
    multimedia,
    byline,
    summary_short,
    link,
    opening_date,
  } = data;
  const title = display_title ? display_title : data.display_name;
  const image = multimedia
    ? multimedia.src
      ? multimedia.src
      : multimedia.resource.src
    : "./public/images/clapboard.png";
  const summary = summary_short ? summary_short : data.bio;

  const movieDetails = `
      <article class="book-details">
      <div class="left">
      <h2>${title}</h2>
      <picture><img src="${image}" alt="Book cover"></picture>
      </div>
      <div class="right">
      ${byline ? `<p class="author"><span>Byline</span>${byline}</p>` : ""}
      <p class="descp"><span>Summary:</span>${summary}</p>
      ${
        link
          ? `<p class="buy-links"><span>Review:</span><a href="${link.url}" target="_blank" rel="noreferrer">${link.suggested_link_text}</a>
      </p>`
          : ""
      }
      ${
        opening_date
          ? `<p class="date"><span><b>Opening date: </b> ${opening_date}</span></p></div></article>`
          : ""
      }`;
  modalBody.innerHTML = movieDetails;
  toggleHideClass(modal);
};

const filterFormSubmit = (event) => {
    getFilterDataFromUser(event.target.parentElement);
    getAndPopulateMovieListByFilter();
}

const addEvents = () => {
  [...dropdown.all].forEach((dropdown) => {
    dropdown.addEventListener("click", () =>
      toggleHideClass(dropdown.nextElementSibling)
    );
  });

  [...dropdown.menus].forEach((dropdownMenu) => {
    dropdownMenu.addEventListener("click", (e) => {
      const item = e.target.closest("li");
      updateDropdownValue(e, item.innerText);
      toggleHideClass(dropdownMenu);
    });
  });

  movieList.addEventListener("click", (e) => {
    if (e.target.tagName !== "UL") {
      const movie =
        data.reviews[e.target.closest("li").getAttribute("data-key")];
      updateModalContent(movie);
    }
  });

  buttons.resetBtns.forEach((resetBtn) => {
    resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resetSearchBy();
      showComponentsBasedOnSearchByOption();
    });
  });

  buttons.submitBtns.forEach((submitBtn) => {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      filterFormSubmit(e);
    });
  });

  buttons.closeBtn.addEventListener("click", (e) => toggleHideClass(modal));
};

const getMovieList = () => {
  movieReviews.getReviewsByQueryAndOpeningDate().then((res) => {
    data.reviews = [...res];

    res.forEach((movie, index) => {
      const image = movie.multimedia
        ? movie.multimedia.src
        : "./public/images/clapboard.png";
      movieList.innerHTML += `<li class="card" data-key=${index}><img src="${image}"><p class="title">${movie.display_title}</p></li>`;
    });
  });
};

window.addEventListener("load", () => {
  addEvents();
});

getMovieList();






// const filterForm = document.querySelector("#filterForm");
// const filterFormInputs = document.querySelectorAll("#filterForm input");
//   [...filterFormInputs].forEach(input => {
//       input.addEventListener('keydown', (e) => {
//       if(e.keyCode === 13) {
//           filterFormSubmit(e);
//       }
//     })
//   })

