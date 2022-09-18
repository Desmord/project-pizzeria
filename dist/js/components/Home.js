import { select, templates, classNames } from '../settings.js';

class Home {
  constructor(wrapper) {
    const thisHome = this;

    thisHome.renderInHome(wrapper);
    thisHome.addActionToButtons();
  }

  renderInHome(wrapper) {
    const thisHome = this;
    const generatedHTML = templates.homePage();

    thisHome.dom = {};
    thisHome.dom.wrapper = wrapper;

    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.goOrderCell = thisHome.dom.wrapper.querySelector(select.home.goOrder);
    thisHome.dom.goBookingCell = thisHome.dom.wrapper.querySelector(select.home.goBooking);

    thisHome.pages = document.querySelector(select.containerOf.pages).children;
    thisHome.navLinks = document.querySelectorAll(select.nav.links);

  }

  addActionToButtons() {
    const thisHome = this;


    thisHome.dom.goOrderCell.addEventListener(`click`, (event) => {
      event.preventDefault();

      for (let page of thisHome.pages) {
        page.classList.toggle(classNames.pages.active, page.id == `order`);
      }

      for (let link of thisHome.navLinks) {
        link.classList.toggle(classNames.nav.active, link.getAttribute(`href`) == `#order`);
      }

      window.location.hash = `#/order`;

    });


    thisHome.dom.goBookingCell.addEventListener(`click`, (event) => {
      event.preventDefault();

      for (let page of thisHome.pages) {
        page.classList.toggle(classNames.pages.active, page.id == `booking`);
      }

      for (let link of thisHome.navLinks) {
        link.classList.toggle(classNames.nav.active, link.getAttribute(`href`) == `#booking`);
      }

      window.location.hash = `#/booking`;
    });
  }
}

export default Home;