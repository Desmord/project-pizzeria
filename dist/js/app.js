import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {
  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFormHash = window.location.hash.replace('#/', '');

    // if (idFormHash) {
    //   thisApp.activatePage(idFormHash);
    // } else {
    //   thisApp.activatePage(thisApp.pages[0].id);
    // }
    let pageMatchingHash = false;

    for (let page of thisApp.pages) {
      if (page.id == idFormHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    if (pageMatchingHash) {
      thisApp.activatePage(pageMatchingHash);
    } else {
      thisApp.activatePage(thisApp.pages[0].id);
    }


    for (let link of thisApp.navLinks) {
      link.addEventListener(`click`, function (event) {
        const clickedElement = this;

        event.preventDefault();

        // get page id from herf attribute
        const id = clickedElement.getAttribute(`href`).replace(`#`, ``);

        // run thiApp.activatePage with that id
        thisApp.activatePage(id);

        // change URL hash
        window.location.hash = `#/${id}`;
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;

    // add class "active" to matching pages, remove form non-matching
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    // add class "active" to matching links, remove form non-matching
    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute(`href`) == `#${pageId}`);
    }

  },

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {

        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });

  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener(`add-to-cart`, function (event) {
      app.cart.add(event.detail.product.perpareCartProduct());
    });

  },

  init: function () {
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    this.initCart();
  },
};

app.init();

