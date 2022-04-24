import Cards from "./Cards.mjs";
import MovieReviews from "./MovieReviews.mjs";

class Filter extends Cards {
  constructor() {
    super();
    this.filterBy = {
      keyword: true,
      critic: false,
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

    this.userData = {
      keyword: null,
      startDate: null,
      endDate: null,
      reviewer: null,
      type: null,
    };
    this.currentForm = "keyword";
  }

  getDataBasedOnFilter(filterOption) {
    if (filterOption === "reviewer") {
      new MovieReviews()
        .getCriticsByReviewer(this.userData.reviewer)
        .then((res) => {
          this.data.results = [...res];
        });
    } else if (filterOption === "type") {
      new MovieReviews()
        .getCriticPicksReviewsByType(this.userData.type)
        .then((res) => {
          this.data.results = [...res];
        });
    } else {
      new MovieReviews()
        .getReviewsByQueryAndOpeningDate(
          this.userData.reviewer,
          this.userData.startDate,
          this.userData.endDate
        )
        .then((res) => {
          this.data.results = [...res];
        });
    }
  }

  handleKeywordFormSubmit(e) {
      e.preventDefault();
      this.userData.keyword = e.target.querySelector("#query").value;
      this.userData.startDate = e.target.querySelector("#startDate").value;
      this.userData.endDate = e.target.querySelector("#endDate").value;
      this.getDataBasedOnFilter("keyword");
      this.populateDataInCards(this.data.results);
  }

  handleCriticFormSubmit(e) {
    e.preventDefault();
    console.log(e.target.querySelector("#reviewer").value);
    if(e.target.querySelector("#reviewer").value !== "") {
        this.userData.reviewer = e.target.querySelector("#reviewer").value;
        this.getDataBasedOnFilter("reviewer");
    }
    else {
        this.getDataBasedOnFilter("type");
    }
    this.populateDataInCards(this.data.results);
}

  updateDropdown(e) {
    e.stopPropagation();
    const targetParent = e.currentTarget;
    const selectedOption = e.target.innerText;

    if (e.target.className === "dropdown" || e.target.tagName === "LI") {
      this.toggleClass(targetParent.querySelector(".dropdown-menu"), "hide");
    }
    targetParent.querySelector(".dropdown").innerText = selectedOption;
  }

  showDropdown(value) {
    const dropdownMenu =
      this.filterByCriticDropdown.querySelector(".dropdown-menu");

    this.filterByCriticDropdown.querySelector(
      ".dropdown"
    ).innerText = `Choose from ${this.data[value][0]} or ${this.data[value][1]}`;
    dropdownMenu.innerHTML = "";
    this.data[value].forEach((item) => {
      dropdownMenu.appendChild(this.buildElement("li", {}, item));
    });
  }

  showKeywordForm() {
    this.filterBy.critic = false;
    this.filterBy.keyword = true;
    this.showForm("keyword");
  }

  showCriticForm(selectedOptionInLowerCase) {
    this.filterBy.critic = true;
    this.filterBy.keyword = false;
    this.showDropdown(selectedOptionInLowerCase);
    this.addClass(this.filterByCriticReview, "hide");
    this.addClass(this.forms.critic.querySelector(".submit-btns"), "hide");
    this.showForm("critic");
  }

  showReviewerForm() {
    this.removeClass(this.filterByCriticReview, "hide");
    this.removeClass(this.forms.critic.querySelector(".submit-btns"), "hide");
  }

  showTypeForm(selectedOptionInLowerCase) {
    this.addClass(this.filterByCriticReview, "hide");
    this.showDropdown(selectedOptionInLowerCase);
    this.removeClass(this.forms.critic.querySelector(".submit-btns"), "hide");
  }

  showFormBasedOnUserOption(e) {
    e.stopPropagation();
    const selectedOption = e.target.innerText;
    const selectedOptionInLowerCase = selectedOption.toLowerCase();

    if (selectedOptionInLowerCase === "keyword") this.showKeywordForm();
    else if (selectedOptionInLowerCase === "critic")
      this.showCriticForm(selectedOptionInLowerCase);
    else if (selectedOptionInLowerCase === "reviewer") this.showReviewerForm();
    else if (selectedOptionInLowerCase === "type")
      this.showTypeForm(selectedOptionInLowerCase);
    else this.userData.type = selectedOptionInLowerCase;
  }

  showForm(formName) {
    if (this.currentForm !== formName) {
      this.toggleClass(this.forms.keyword, "hide");
      this.toggleClass(this.forms.critic, "hide");
      this.currentForm = formName;
    }
  }
}

export default Filter;
