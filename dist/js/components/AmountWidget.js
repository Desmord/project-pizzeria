import { settings, select } from '../settings.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;
    let newValue = parseInt(value);

    if (thisWidget.value !== newValue && !isNaN(newValue)) {
      if (newValue < settings.amountWidget.defaultMin) {
        newValue = settings.amountWidget.defaultMin;
      }
      if (newValue > settings.amountWidget.defaultMax) {
        newValue = settings.amountWidget.defaultMax;
      }
    } else {
      newValue = settings.amountWidget.defaultValue;
    }

    thisWidget.value = newValue;
    thisWidget.announce();
    thisWidget.input.value = thisWidget.value;

  }

  initActions() {
    const thisWidget = this;

    thisWidget.input.addEventListener(`change`, () => thisWidget.setValue(thisWidget.input.value));
    thisWidget.linkDecrease.addEventListener(`click`, () => thisWidget.setValue(thisWidget.value - 1));
    thisWidget.linkIncrease.addEventListener(`click`, () => thisWidget.setValue(thisWidget.value + 1));
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent(`updated`, {
      bubbles: true,
    });

    thisWidget.element.dispatchEvent(event);
  }

}

export default AmountWidget;