import Cards from "./Cards.mjs";
import MovieReviews from "./MovieReviews.mjs";

class Filter extends Cards {
  constructor() {
    super();
    this.movieReviews = new MovieReviews();
    this.filterBy = {
      keyword: true,
      critic: false,
    };

    this.userData = {
      keyword: null,
      startDate: null,
      endDate: null,
      reviewer: null,
      type: null,
    };

    this.filterCriticsBy = {
      type: false,
      reviewer: false,
    };

    this.filterCriticsTypeBy = {
      all: false,
      picks: false,
    };

    this.data = {
      results: null,
      critic: ["Type", "Reviewer"],
      type: ["all", "picks"],
    };

    this.filterByCriticDropdown = document.getElementById("filterByCritic");
    this.filterByCriticReview = document.getElementById("filterByCriticReview");

    this.forms = {
      keyword: document.getElementById("keywordForm"),
      critic: document.getElementById("criticForm"),
    };

    this.currentForm = "keyword";
    this.currentFilter = [];
    this.currentlyOpenedDropdown = null;
  }

  handleResponseData = (res) => {
    if (res !== null) {
      this.data.results = [...res];
      this.populateDataInCards([...res]);
    }
    else {
      this.data.results = null;
      this.populateDataInCards(null);
    }
  }

  getDataBasedOnFilter = (filterOption) => {
    if (filterOption === "reviewer") {
      this.toggleLoader();
      this.movieReviews
        .getCriticsByReviewer(this.userData.reviewer)
        .then((res) => {
          this.handleResponseData(res);
          this.toggleLoader();
        });
    } else if (filterOption === "type") {
      this.toggleLoader();
      this.movieReviews
        .getCriticPicksReviewsByType(this.userData.type)
        .then((res) => {
          this.handleResponseData(res);
          this.toggleLoader();
        });
    } else {
      this.toggleLoader();
      this.movieReviews
        .getReviewsByQueryAndOpeningDate(
          this.userData.keyword,
          this.userData.startDate,
          this.userData.endDate
        )
        .then((res) => {
          this.toggleLoader();
          this.handleResponseData(res);
        });
    }
  };

  removePreviousFilter = () => {
    this.currentFilter.forEach((filter) => {
      this.userData[filter] = null;
    });
    this.currentFilter = [];
  };

  handleKeywordFormSubmit = (e) => {
    e.preventDefault();
    this.removePreviousFilter();
    this.userData.keyword = e.target.querySelector("#query").value;
    this.userData.startDate = e.target.querySelector("#startDate").value;
    this.userData.endDate = e.target.querySelector("#endDate").value;
    this.currentFilter.push("keyword");
    this.currentFilter.push("startDate");
    this.currentFilter.push("endDate");
    this.getDataBasedOnFilter("keyword");
  };

  handleCriticFormSubmit = (e) => {
    e.preventDefault();
    if (e.target.querySelector("#reviewer").value !== "") {
      this.userData.reviewer = e.target.querySelector("#reviewer").value;
      this.removePreviousFilter();
      this.currentFilter.push("reviewer");
      this.getDataBasedOnFilter("reviewer");
      this.getDataBasedOnFilter("reviewer");
    } else {
      this.getDataBasedOnFilter("type");
    }
    this.populateDataInCards(this.data.results);
  };

  handleFormReset = () => {
    this.forms.keyword.reset();
    this.forms.critic.reset();
    this.removePreviousFilter();
    this.getDataBasedOnFilter("keyword");
  };

  updateDropdown = (e) => {
    e.stopPropagation();
    const targetParent = e.currentTarget;
    const selectedOption = e.target.innerText;
    this.currentlyOpenedDropdown = targetParent.querySelector(".dropdown-menu");


    if (e.target.className === "dropdown" || e.target === targetParent) {
      this.toggleClass(targetParent.querySelector(".dropdown-menu"), "hide");
    }
    if(e.target.tagName === "LI") {
      this.toggleClass(targetParent.querySelector(".dropdown-menu"), "hide");
      this.showFormBasedOnUserOption(e);
    }
    targetParent.querySelector(".dropdown").innerText = selectedOption;
  };

  showDropdown = (value) => {
    const dropdownMenu =
      this.filterByCriticDropdown.querySelector(".dropdown-menu");

    this.filterByCriticDropdown.querySelector(
      ".dropdown"
    ).innerText = `Choose from ${this.data[value][0]} or ${this.data[value][1]}`;
    dropdownMenu.innerHTML = "";
    this.data[value].forEach((item) => {
      dropdownMenu.appendChild(this.buildElement("li", {}, item));
    });
  };

  showKeywordForm = () => {
    this.filterBy.critic = false;
    this.filterBy.keyword = true;
    this.showForm("keyword");
  };

  showCriticForm = (selectedOptionInLowerCase) => {
    this.filterBy.critic = true;
    this.filterBy.keyword = false;
    this.showDropdown(selectedOptionInLowerCase);
    this.addClass(this.filterByCriticReview, "hide");
    this.addClass(this.forms.critic.querySelector(".submit-btns"), "hide");
    this.showForm("critic");
  };

  showReviewerForm = () => {
    this.removeClass(this.filterByCriticReview, "hide");
    this.removeClass(this.forms.critic.querySelector(".submit-btns"), "hide");
  };

  showTypeForm = (selectedOptionInLowerCase) => {
    this.addClass(this.filterByCriticReview, "hide");
    this.showDropdown(selectedOptionInLowerCase);
    this.removeClass(this.forms.critic.querySelector(".submit-btns"), "hide");
  };

  showFormBasedOnUserOption = (e) => {
    e.stopPropagation();
    const selectedOption = e.target.innerText;
    const selectedOptionInLowerCase = selectedOption.toLowerCase();

    if (selectedOptionInLowerCase === "keyword") this.showKeywordForm();
    else if (selectedOptionInLowerCase === "critic")
      this.showCriticForm(selectedOptionInLowerCase);
    else if (selectedOptionInLowerCase === "reviewer") this.showReviewerForm();
    else if (selectedOptionInLowerCase === "type")
      this.showTypeForm(selectedOptionInLowerCase);
    else {
      this.removePreviousFilter();
      this.userData.type = selectedOptionInLowerCase;
      this.currentFilter.push("type");
    }
  };

  showForm = (formName) => {
    if (this.currentForm !== formName) {
      this.toggleClass(this.forms.keyword, "hide");
      this.toggleClass(this.forms.critic, "hide");
      this.currentForm = formName;
    }
  };
}

export default Filter;
