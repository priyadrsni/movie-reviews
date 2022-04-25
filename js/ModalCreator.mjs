import Utilities from "./utilities.mjs";

class ModalCreator extends Utilities {
  constructor() {
    super();
    this.utilities = new Utilities();
    this.modal = document.querySelector(".modal");
    this.modalBody = document.querySelector(".modal-body");
    this.closeBtn = document.querySelector(".close-btn");
  }

  getBylineElement = (byline) => {
    const span = this.utilities.buildElement("span", { classes: [] }, "Byline");
    const p = this.utilities.buildElement("p", { classes: ["author"] });
    const text = document.createTextNode(byline);

    p.appendChild(span);
    p.appendChild(text);
    return p;
  }

  getSummaryElement = (summary) => {
    const span = this.utilities.buildElement(
      "span",
      { classes: [] },
      "Summary: "
    );
    const p = this.utilities.buildElement("p", { classes: ["descp"] });
    const text = document.createTextNode(summary);

    p.appendChild(span);
    p.appendChild(text);

    return p;
  }

  getReviewLinkElement = (link) => {
    const span = this.utilities.buildElement(
      "span",
      { classes: [] },
      "Review:"
    );
    const a = this.utilities.buildElement(
      "a",
      {
        classes: [],
        others: { href: link.url, target: "_blank", rel: "noreferrer" },
      },
      link.suggested_link_text
    );
    const p = this.utilities.buildElement("p", { classes: ["buy-links"] });

    p.appendChild(span);
    p.appendChild(a);

    return p;
  }

  getOpeningDateElement = (date) => {
    const b = this.utilities.buildElement(
      "b",
      { classes: [] },
      "Opening date:"
    );
    const span = this.utilities.buildElement("span", { classes: [] });
    const p = this.utilities.buildElement("p", { classes: ["date"] });
    const text = document.createTextNode(date);

    span.appendChild(b);
    p.appendChild(span);
    p.appendChild(text);
    return p;
  }

  getModalProfile = (title, multimedia) => {
    const div = this.utilities.buildElement("div", { classes: ["left"] });
    const h2 = this.utilities.buildElement("h2", { classes: [] }, title);
    const picture = this.utilities.buildElement("picture", { classes: [] });
    const img = this.utilities.getImageElement(multimedia);

    picture.appendChild(img);
    div.appendChild(h2);
    div.appendChild(picture);

    return div;
  }

  getModalDescription = (byline, summary, link, opening_date) => {
    const div = this.utilities.buildElement("div", { classes: ["right"] });

    if (byline) div.appendChild(this.getBylineElement(byline));
    div.appendChild(this.getSummaryElement(summary));
    if (link) div.appendChild(this.getReviewLinkElement(link));
    if (opening_date) div.appendChild(this.getOpeningDateElement(opening_date));

    return div;
  }

  updateModalContent = (modalData) => {
    this.modalBody.innerHTML = "";
    this.modalBody.appendChild(this.createModal(modalData));
    this.utilities.toggleClass(this.modal, "hide");
  };

  createModal = (modalData) => {
    const {
      display_title,
      display_name,
      multimedia,
      byline,
      summary_short,
      bio,
      link,
      opening_date,
    } = modalData;
    const title = display_title ? display_title : display_name;
    const summary = summary_short ? summary_short : bio;

    const modalBodyElement = this.utilities.buildElement("article", {
      classes: ["book-details"],
    });

    const modalProfile = this.getModalProfile(title, multimedia);
    const modalDescription = this.getModalDescription(
      byline,
      summary,
      link,
      opening_date
    );

    modalBodyElement.appendChild(modalProfile);
    modalBodyElement.appendChild(modalDescription);

    return modalBodyElement;
  }
}

export default ModalCreator;
