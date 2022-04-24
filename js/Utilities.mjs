class Utilities {
    addClass(element, className) {
        if(!element.classList.contains(className))
            element.classList.add(className);
    }

    removeClass(element, className) {
        element.classList.remove(className);
    }

    toggleClass(element, className) {
        element.classList.toggle(className);
    }

    buildElement(elementName, attributes=null, text=null) {
        const element = document.createElement(elementName);
        const { classes, id, others} = attributes;

        if(classes) {
            classes.forEach(className => {
                this.addClass(element, className);
            });
        }
        if(id) {
            element.setAttribute("id", id);
        }

        if(others) {
            Object.keys(others).forEach(key => element.setAttribute(key, others[key]))
        }

        if(text !== null) {
            element.innerText = text;
        }
        return element;
    }

    getImageElement(multimedia) {
        const { src: imageSrc, resource } = multimedia;
        let src;
        if (imageSrc) {
          src = imageSrc;
        } else if (resource && resource.src) {
          src = resource.src;
        } else src = "./public/images/clapboard.png";
    
        return this.buildElement("img", {
          classes: [],
          others: { src, alt: "Book cover" },
        });
      }
}

export default Utilities;