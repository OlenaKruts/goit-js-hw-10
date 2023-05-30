import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector('#search-box');
const infoCountry = document.querySelector('.country-info');
const listCountry = document.querySelector('.country-list');

inputCountry.addEventListener(
  'input',
  debounce(handlerCountry, DEBOUNCE_DELAY)
);

function handlerCountry(event) {
  event.preventDefault();
  const name = inputCountry.value.trim();
  if (!name) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    return;
  }

  fetchCountries(name)
    .then(countries => {
      infoCountry.innerHTML = ' ';
      listCountry.innerHTML = ' ';
      if (countries.length > 10) {
        Notiflix.Notify.info(
          `Too many matches found. Please enter a more specific name.`
        );
      } else if (countries.length === 1) {
        createCardCountry(countries);
      } else if (name === '') {
        infoCountry.innerHTML = ' ';
        listCountry.innerHTML = ' ';
        inputCountry.style.boxShadow = '5px 5px 5px gray';
        inputCountry.style.color = 'black';
        //Notiflix.Notify.failure('hhhhh');
      } else {
        createFlagCountry(countries);
      }
    })
    .catch(error => {
      console.error(error);

      inputCountry.style.boxShadow = '5px 5px 5px red';
      inputCountry.style.color = 'red';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createCardCountry(countries) {
  const markup = countries
    .map(
      ({
        flags: { svg },
        name: { official },
        capital,
        population,
        languages,
      }) => {
        return `<div class="flag-name-country">
      <img
        src="${svg}"
        alt="Flag of country"
        class = "flag";
        width="50"/>
      <h2 class="country-name">${official}</h2>
    </div>
    <ul class="list-of-properties">
      <li class="property-item"><p><b>Capital: </b>${capital}</p></li>
      <li class="property-item"></l<p><b>Population: </b>${population}</p></li>
      <li class="property-item"><p><b>Languages: </b>${Object.values(
        languages
      )}</p></li>
      </ul>`;
      }
    )
    .join('');
  //console.log(markup);
  infoCountry.innerHTML = markup;
}
function createFlagCountry(countries) {
  const markup = countries
    .map(({ flags: { svg }, name: { official } }) => {
      return `<div class="flag-name-country">
      <img
        src="${svg}"
        class = "flag";
        alt="Flag of country"
        width="40"/>
      <h3 class="country-name">${official}</h3>
    </div>`;
    })
    .join('');
  //console.log(markup);
  listCountry.innerHTML = markup;
}
