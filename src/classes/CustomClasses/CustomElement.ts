class CustomElement {
  element: HTMLElement;
  parent: CustomElement | HTMLElement | Element | undefined;
  children: CustomElement[] = [];
  type: string;
  defaultDisplay: string;
  userdata: {[key: string]: any} = {};

  constructor(elemInfo: ElementInfo, parent: Element | HTMLElement | CustomElement) {
    let element = document.createElement(elemInfo.type);
    this.parent = parent;
    this.type = elemInfo.type;

    this.element = element;

    if (elemInfo.id) {
      element.id = elemInfo.id;
    }

    if (elemInfo.class) {
      elemInfo.class.forEach((className: string) => {
        element.classList.add(className);
      });
    }

    if (elemInfo.innerText) {
      element.innerText = elemInfo.innerText;
    }

    if (elemInfo.attributes) {
      for (const [key, value] of Object.entries(elemInfo.attributes)) {
        element.setAttribute(key, value);
      }
    }

    if (elemInfo.children) {
      elemInfo.children.forEach((childData: ElementInfo) => {
        let childElem = new CustomElement(childData, element);
        this.children.push(childElem);
      });
    }

    if (parent && parent instanceof CustomElement) {
      parent.appendChild(this);
    } else {
      parent
        ? parent.appendChild(element)
        : parent === null
        ? console.log("WARNING! Parent was null for object:", element, elemInfo)
        : null;
    }

    this.defaultDisplay = this.element.style.display;
  }

  set text(newText: string) {
    this.element.innerText = newText;
  }

  set title(newTitle: string) {
    this.element.title = newTitle;
  }

  set id(newId: string) {
    this.element.id = newId
  }

  set visible(newVisibility: boolean) {
    if (newVisibility) {
      this.setStyle("display", this.defaultDisplay);
    } else {
      this.setStyle("display", "none");
    }
  }

  get visible() {
    return this.element.style.display !== "none";
  }

  setStyle(style: string, value: string) {
    this.element.style.setProperty(style, value);
  }

  hasClass(classQuery: string | string[]) {
    let result: boolean = false;

    if (typeof classQuery == "string") {
      result = this.element.classList.contains(classQuery);
    } else {
      let validClasses = 0;
      classQuery.forEach((value) => {
        this.element.classList.contains(value) ? validClasses++ : null;
      });
      result = validClasses === classQuery.length;
    }

    return result;
  }

  hasId(id: string) {
    return this.element.id === id;
  }

  appendChild(otherElement: CustomElement) {
    if (otherElement.findChildWithElement(this)) {
      console.error("ERROR: Attempted to parent a parent to it's child!!!");
      return;
    }
    if (this.findChildWithElement(otherElement)) {
      console.error("ERROR: 'Element' is already a child of element");
      return;
    }
    //console.log(this);
    //console.log(otherElement);
    if(otherElement && otherElement.parent instanceof CustomElement) {
      otherElement.parent.children.sort((a,)=>{
        let value = 0
        if(a === otherElement) {
          value = 999
        }
        return value
      })
      if(otherElement.parent.children[0] === otherElement) {
        otherElement.parent.children.pop()
      } 
    }
    this.element.appendChild(otherElement.element);
    this.children.push(otherElement);
    otherElement.parent = this.element;
  }

  findChild(query: ElementQuery, recursive?: boolean): CustomElement | null {
    let searchResult = null;
    for (let childElem of this.children) {
      let failed = false;

      if (query.classQuery && !childElem.hasClass(query.classQuery)) {
        failed = true;
      }
      if (query.id && !childElem.hasId(query.id)) {
        failed = true;
      }
      if (query.type && query.type !== this.element.nodeName.toLowerCase()) {
        failed = true;
      }

      if (!failed) {
        searchResult = childElem;
        break;
      } else if (childElem.children.length > 0 && recursive) {
        searchResult = childElem.findChild(query, recursive);
      }
    }

    return searchResult;
  }

  findChildWithElement(element: CustomElement, recursive?: boolean) {
    let searchResult: null | CustomElement = null;
    this.children.forEach((childElem) => {
      if (searchResult) {
        return;
      }
      if (childElem === element) {
        searchResult = childElem;
      } else if (childElem.children.length > 0 && recursive) {
        searchResult = childElem.findChildWithElement(element, recursive);
      }
    });
    return searchResult;
  }

  findChildWithClass(className: string | string[], recursive?: boolean): CustomElement | null {
    let searchResult: null | CustomElement = null;
    this.children.forEach((childElem) => {
      if (searchResult) {
        return;
      }
      if (childElem.hasClass(className)) {
        searchResult = childElem;
      } else if (childElem.children.length > 0 && recursive) {
        searchResult = childElem.findChildWithClass(className, recursive);
      }
    });
    return searchResult;
  }

  findChildWithId(id: string, recursive?: boolean): CustomElement | null {
    let searchResult = null;
    this.children.forEach((childElem) => {
      if (childElem.hasId(id)) {
        return childElem;
      } else if (childElem.children.length > 0 && recursive) {
        searchResult = childElem.findChildWithId(id, recursive);
      }
    });
    return searchResult;
  }

  delete(recursiveParent?: CustomElement | HTMLElement | Element | undefined) {
    if (this.parent && this.parent instanceof CustomElement && !recursiveParent) {
      for (let i = 0; i < this.parent.children.length; i++) {
        let child = this.parent.children[i];
        if (child === this) {
          delete this.parent.children[i];
        }
      }
    }

    this.children.forEach((childElem) => {
      childElem.delete(this);
    });

    this.parent = undefined;
    this.element.remove();
  }
}

export default CustomElement;
