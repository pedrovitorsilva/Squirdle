import * as pokedex from '../pokedex/pokedex.js';
import autocomplete from './autocomplete.js';

let actualData = null;
var actualPokemonChoice = null;

// Functions ---------------------------------------------------------------------------------

// Fetch Functions ---------------------------
function data_fetch(url) {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then(async (pokemonData) => {
      actualData = pokemonData;
      pokedex.createPokemonListElements(pokemonData, pokedex.fixPokemonName);

      //
      let miniSearch = new MiniSearch({
        fields: ['name'], // fields to index for full-text search
        storeFields: ['generation', 'type1', 'type2', 'height', 'weight'], // fields to return with search results
        idField: 'name'
      });
      miniSearch.addAll(actualData);

      pokedex.highlightSelectedPokemon(miniSearch, actualPokemonChoice);

      autocomplete(miniSearch);

      // Filter button always filter by selected pokemon
      document.querySelector('#filter').addEventListener('click', () => {
        guess(miniSearch);
      });

      // best_choices();
    })
    .catch((error) => {
      console.error('Ocorreu um erro:', error);
    });
}

function best_choices() {
  fetch('./best')
    .then((response) => {
      return response.json();
    })
    .then(async (pokemonData) => {
      console.log(pokemonData);
    })
    .catch((error) => {
      console.error('Ocorreu um erro:', error);
    });
}

// Change [equal, different, bigger, smaller] images to match selection
function change_select_img(select) {
  const select_gen = document.querySelector(select);
  const selectedOption = select_gen.options[select_gen.selectedIndex];
  const selectedIcon = getComputedStyle(selectedOption).content.slice(1, -1);

  const img = document.querySelector(`${select}_background`);
  img.src = selectedIcon;
}

function guess(miniSearch) {
  // Remove element properties to add to history
  const highlighted_element = document.querySelector('.highlight');

  highlighted_element.classList.remove('highlight');
  highlighted_element.style.padding = '0';
  highlighted_element.style.margin = '0';

  // Add to History
  document.querySelector('#history').appendChild(highlighted_element);
  document.querySelector('#history').style.display = 'block';

  const actualPokemonChoice = pokedex.getDetails(highlighted_element, miniSearch);
  console.log(actualPokemonChoice);

  // Create filter data
  let filter = {
    generation: document.querySelector('#select_gen').value,
    type1: document.querySelector('#select_type1').value,
    type2: document.querySelector('#select_type2').value,
    height: document.querySelector('#select_height').value,
    weight: document.querySelector('#select_weight').value
  };

  const url = new URL('./filter', window.location.origin);
  url.searchParams.append('pokemon_string', JSON.stringify(actualPokemonChoice));
  url.searchParams.append('generation', filter.generation);
  url.searchParams.append('type1', filter.type1);
  url.searchParams.append('type2', filter.type2);
  url.searchParams.append('height', filter.height);
  url.searchParams.append('weight', filter.weight);

  document.getElementById('loading').style.display = 'block';
  data_fetch(url);
}

// Main ---------------------------------------
// Change image from select values
document
  .querySelector('#select_gen')
  .addEventListener('change', () => change_select_img('#select_gen'));
document
  .querySelector('#select_type1')
  .addEventListener('change', () => change_select_img('#select_type1'));
document
  .querySelector('#select_type2')
  .addEventListener('change', () => change_select_img('#select_type2'));
document
  .querySelector('#select_height')
  .addEventListener('change', () => change_select_img('#select_height'));
document
  .querySelector('#select_weight')
  .addEventListener('change', () => change_select_img('#select_weight'));

// First fetch, to get all data
data_fetch('./all');
