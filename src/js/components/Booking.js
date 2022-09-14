import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(wrapper) {
    const thisBooking = this;

    thisBooking.render(wrapper);
    thisBooking.initWidgets();
  }

  render(wrapper) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = wrapper;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.dataPickerWrapper = wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPickerWrapper = wrapper.querySelector(select.widgets.hourPicker.wrapper);


  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dataPickerWidget = new DatePicker(thisBooking.dom.dataPickerWrapper);
    thisBooking.hourPickerWidget = new HourPicker(thisBooking.dom.hourPickerWrapper);
  }
}

export default Booking;