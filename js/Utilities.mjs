class Utilities {
  addClass(element, className) {
    if (!element.classList.contains(className))
      element.classList.add(className);
  }

  removeClass(element, className) {
    element.classList.remove(className);
  }

  toggleClass(element, className) {
    element.classList.toggle(className);
  }

  buildElement(elementName, attributes = null, text = null) {
    const element = document.createElement(elementName);
    const { classes, id, others } = attributes;

    if (classes) {
      classes.forEach((className) => {
        this.addClass(element, className);
      });
    }
    if (id) {
      element.setAttribute("id", id);
    }

    if (others) {
      Object.keys(others).forEach((key) =>
        element.setAttribute(key, others[key])
      );
    }

    if (text !== null) {
      element.innerText = text;
    }
    return element;
  }

  getImageElement(multimedia) {
    if (multimedia) {
      const { src, resource } = multimedia;
      let imageSrc;
      if (src) {
        imageSrc = src;
      } else if (resource && resource.src) {
        imageSrc = resource.src;
      } else imageSrc = "./public/images/clapboard.png";

      return this.buildElement("img", {
        classes: [],
        others: { src: imageSrc, alt: "Book cover" },
      });
    }
    else {
        return this.buildElement("img", {
            classes: [],
            others: { src: "./public/images/clapboard.png", alt: "Book cover" },
          });
    }
  }
}

export default Utilities;
