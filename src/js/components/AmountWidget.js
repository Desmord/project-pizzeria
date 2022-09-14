import { settings, select } from '../settings.js';
import BaseWidgets from './BaseWidgets.js';

class AmountWidget extends BaseWidgets {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);

    const thisWidget = this;
    thisWidget.getElements(element);
    // thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();
  }

  getElements() {
    const thisWidget = this;

    // thisWidget.element = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  // setValue(value) {
  //   const thisWidget = this;
  //   let newValue = thisWidget.parseValue(value);

  //   if (thisWidget.value !== newValue && thisWidget.isValid(newValue)) {
  //     // if (newValue < settings.amountWidget.defaultMin) {
  //     //   newValue = settings.amountWidget.defaultMin;
  //     // }
  //     // if (newValue > settings.amountWidget.defaultMax) {
  //     //   newValue = settings.amountWidget.defaultMax;
  //     // }
  //     thisWidget.value = newValue;
  //     thisWidget.announce();
  //   }
  //   //  else {
  //   //   newValue = settings.amountWidget.defaultValue;
  //   // }

  //   // thisWidget.value = newValue;
  //   // thisWidget.announce();
  //   // thisWidget.dom.input.value = thisWidget.value;
  //   thisWidget.renderValue();

  // }

  // parseValue(value) {
  //   return parseInt(value);
  // }

  isValid(value) {
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin
      && value <= settings.amountWidget.defaultMax;
    // if (value < settings.amountWidget.defaultMin) {
    //   value = settings.amountWidget.defaultMin;
    // }
    // if (value > settings.amountWidget.defaultMax) {
    //   value = settings.amountWidget.defaultMax;
    // }
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    // thisWidget.dom.input.addEventListener(`change`, () => thisWidget.setValue(thisWidget.dom.input.value));
    thisWidget.dom.input.addEventListener(`change`, () => thisWidget.value = thisWidget.dom.input.value);
    thisWidget.dom.linkDecrease.addEventListener(`click`, () => thisWidget.setValue(thisWidget.value - 1));
    thisWidget.dom.linkIncrease.addEventListener(`click`, () => thisWidget.setValue(thisWidget.value + 1));
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent(`updated`, {
      bubbles: true,
    });

    thisWidget.dom.wrapper.dispatchEvent(event);
  }

}

export default AmountWidget;