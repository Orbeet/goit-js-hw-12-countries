import './styles.css';
import countries from './fetchCountries';
import countryTemplate from './country.hbs';
import countryListTemplate from './countryList.hbs';
import { alert, notice, info, success, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const debounce = require('lodash.debounce');

const refs = {
  input: document.querySelector('#js-input'),
  countryInfo: document.querySelector('#country-info'),
  countryList: document.querySelector('#js-counties-list'),
};

function inputHandler(e) {
  const searchQuery = e.target.value;

  countries.fetchCountries(searchQuery).then(data => {
    if (data.length < 2) {
      clearCountryInfo();
      clearCountryList();
      const markup = buildCountryMarkup(data[0]);
      insertCountryInfo(markup);
    } else if (data.length >= 2 && data.length <= 10) {
      clearCountryInfo();
      clearCountryList();
      const listMarkup = buildCountryListMarkup(data);
      insertCountryList(listMarkup);
    } else if (data.length > 10) {
      clearCountryInfo();
      clearCountryList();
      const lenghtError = error({
        text: 'Too many matches found. Please enter a more specific query!',
        delay: 3000,
      });
    }
  });
}

const debouncedInputHandler = debounce(e => {
  inputHandler(e);
}, 500);

refs.input.addEventListener('input', e => {
  debouncedInputHandler(e);
});

function insertCountryInfo(markup) {
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}
function buildCountryMarkup(country) {
  return countryTemplate(country);
}

function buildCountryListMarkup(countryList) {
  return countryListTemplate(countryList);
}
function insertCountryList(markup) {
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}
function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}
function clearCountryList() {
  refs.countryList.innerHTML = '';
}
