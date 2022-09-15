import { classNames, select, settings, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(wrapper) {
    const thisBooking = this;

    thisBooking.tableSelected = null;

    thisBooking.render(wrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.dataPicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.dataPicker.maxDate);

    const params = {
      booking: [startDateParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam],
    };

    const urls = {
      booking: `${settings.db.url}/${settings.db.booking}?${params.booking.join(`&`)}`,
      eventsCurrent: `${settings.db.url}/${settings.db.event}?${params.eventsCurrent.join(`&`)}`,
      eventsRepeat: `${settings.db.url}/${settings.db.event}?${params.eventsRepeat.join(`&`)}`,
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ]).then(function (allResponses) {
      const bookingResponse = allResponses[0];
      const eventsCurrentResponse = allResponses[1];
      const eventsRepeatResponse = allResponses[2];

      return Promise.all([
        bookingResponse.json(),
        eventsCurrentResponse.json(),
        eventsRepeatResponse.json(),
      ]);
    }).then(function ([bookings, eventsCurrent, eventsRepeat]) {
      thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
    });

  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.dataPicker.minDate;
    const maxDate = thisBooking.dataPicker.maxDate;

    for (let item of eventsRepeat) {

      if (item.repeat == `daily`) {

        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }

      }

    }

    thisBooking.updateDOM();

  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == `undefined`) {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {

      if (typeof thisBooking.booked[date][hourBlock] == `undefined`) {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);

    }

  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.dataPicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == `undefined`
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == `undefined`
    ) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) > -1
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }

    }
  }

  render(wrapper) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = wrapper;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.phone = wrapper.querySelectorAll(`input`)[6];
    thisBooking.dom.address = wrapper.querySelectorAll(`input`)[7];
    thisBooking.dom.waterCheckbox = wrapper.querySelectorAll(`.checkbox`)[0].querySelector(`input`);
    thisBooking.dom.breadCheckbox = wrapper.querySelectorAll(`.checkbox`)[1].querySelector(`input`);

    thisBooking.dom.dataPickerWrapper = wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPickerWrapper = wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(`.booking-form`);

  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dataPicker = new DatePicker(thisBooking.dom.dataPickerWrapper);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPickerWrapper);

    thisBooking.dom.wrapper.addEventListener(`updated`, function () {
      thisBooking.updateDOM();
      thisBooking.removeAllSelectedTables();
    });

    for (let table of thisBooking.dom.tables) {
      table.addEventListener(`click`, function () { thisBooking.initTables(table); });
    }

    thisBooking.dom.form.addEventListener(`submit`, function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });
  }

  initTables(table) {
    const thisBooking = this;
    const isTableReserved = table.classList.contains(`booked`);
    const isSelected = table.classList.contains(`selected`);

    if (isTableReserved) {
      alert(`Stolik zajęty.`);
    } else {

      thisBooking.removeAllSelectedTables();

      if (isSelected) {
        table.classList.remove(`selected`);
        thisBooking.tableSelected = null;
      } else {
        table.classList.add(`selected`);
        thisBooking.tableSelected = table.getAttribute(`data-table`);
      }

    }

  }

  removeAllSelectedTables() {
    const thisBooking = this;

    thisBooking.tableSelected = null;
    for (let table of thisBooking.dom.tables) {
      table.classList.remove(`selected`);
    }
  }


  sendBooking() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      date: thisBooking.dataPicker.value,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.tableSelected,
      duration: parseInt(thisBooking.dom.hoursAmount.children[1].value),
      ppl: parseInt(thisBooking.dom.peopleAmount.children[1].value),
      starters: [],
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
    };

    if (thisBooking.dom.waterCheckbox.checked) {
      payload.starters.push(thisBooking.dom.waterCheckbox.value);
    }

    if (thisBooking.dom.breadCheckbox.checked) {
      payload.starters.push(thisBooking.dom.breadCheckbox.checked.value);
    }


    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log(`parsedResponse`, parsedResponse);
        thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
      });
  }
}

export default Booking;