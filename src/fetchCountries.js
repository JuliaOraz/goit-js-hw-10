const BUSE_URL = 'https://restcountries.com/v3.1';

function fetchCountries(name) { 
    return fetch(`${BUSE_URL}/name/${name}?fields=name,capital,population,flags,languages`)
        .then(response => {
             if (response.status === 200) {
                return response.json();
            }else if (response.status === 404) {
                return Promise.reject('error' );
            } 
    })
}


export default { fetchCountries }