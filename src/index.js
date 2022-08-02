import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;


const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.searchInput.addEventListener('input', debounce(onInputCountries, DEBOUNCE_DELAY))

// Получение данных при вводе в инпут
function onInputCountries(e) { 
    const getValueCountry = e.target.value.trim().toLowerCase();
    clearCountries()
    if (getValueCountry === '') { 
        return;
    }
    
    API.fetchCountries(getValueCountry)
        .then(checkCountries)
        .catch(onCountriesError)
}

// Очистка польз. интерфейса
function clearCountries() { 
    refs.countryList.innerHTML = "";
    refs.countryInfo.innerHTML = "";
}

// Проверка количества стран
function checkCountries(countries) { 
    if (countries.length === 1) {
        return renderCardCountry(countries)
    } else if (countries.length > 10) { 
        return Promise.reject('info');
    }
    return renderListCountries(countries)
}

// Добавление разметки для одной страны
function renderCardCountry(country) {
    const cardCountry = markupCardCountry(country);
    return refs.countryInfo.insertAdjacentHTML('beforeend', cardCountry);
}

// Добавление разметки для списка стран
function renderListCountries(countries) { 
    const listCountries = markupListCountry(countries);
    return refs.countryList.insertAdjacentHTML('beforeend', listCountries);
}

// Создание разметки для одной страны
function markupCardCountry(c) { 
    return c.map(c => {
       return `<h1><img src="${c.flags.svg}" alt="${c.name.official}">${c.name.official}</h1>
       <ul>
           <li><span>Capital:</span>${c.capital}</li>
           <li><span>Population:</span>${c.population}</li>
           <li><span>Languages:</span>${Object.values(c.languages)}</li>
           <li></li>
       <ul>`
   }).join('');
}

// Создание разметки для списка стран 
function markupListCountry(c) { 
    return c.map(c => `<li><img src="${c.flags.svg}" alt="${c.name.official}">${c.name.official}</li>`).join('')
}

// Обработка ошибок
function onCountriesError(error) { 
    if (error === 'error') {
        return Notify.failure("Oops, there is no country with that name")
    }else if(error === 'info'){
        return Notify.info("Too many matches found. Please enter a more specific name.")
    }
}

