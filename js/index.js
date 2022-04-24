import MovieReviews from "./MovieReviews.mjs";
import Utilities from "./utilities.mjs";
import Filter from "./Filter.mjs";
import ModalCreator from "./ModalCreator.mjs";
import Cards from "./Cards.mjs";

const movieReviews = new MovieReviews();
const utilities = new Utilities();
const filter = new Filter();
const modalCreator = new ModalCreator();
const cards = new Cards();
const dropdownWraps = document.getElementsByClassName("dropdown-wrap");


// Add all event listeners
const addEvents = () => {
  [...dropdownWraps].forEach((dropdownWrap) => {
    dropdownWrap.addEventListener("click", (e) => {
      filter.updateDropdown(e);
      if (e.target.tagName === "LI") filter.showFormBasedOnUserOption(e);
    });
  });

  cards.cardsElement.addEventListener("click", (e) => {
    if (e.target.tagName !== "UL") {
      const card =
        filter.data.results[e.target.closest("li").getAttribute("data-index")];
      modalCreator.updateModalContent(card);
    }
  });

  filter.forms.keyword.addEventListener("submit", filter.handleKeywordFormSubmit);
  filter.forms.critic.addEventListener("submit", filter.handleCriticFormSubmit);

  modalCreator.closeBtn.addEventListener("click", () =>
    utilities.addClass(modalCreator.modal, "hide")
  );
};

const getInitialData = () => {
  movieReviews.getReviewsByQueryAndOpeningDate().then((res) => {
    filter.data.results = [...res];
    cards.populateDataInCards([...res]);
  });
};


function init() {
  getInitialData();
  window.addEventListener("load", () => {
    addEvents();
  });
}

init();