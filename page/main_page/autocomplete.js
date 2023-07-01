import * as pokedex from '../pokedex/pokedex.js';
import { get_colors } from '../colors/colors.js';
// Autocomplete ---------------------------------------
export default function autocomplete(miniSearch) {
  const autocompleteBox = document.querySelector('#autocomplete');

  autocompleteBox.addEventListener('input', () => {
    const results = miniSearch.search(autocompleteBox.value, { prefix: true });

    const list = document.querySelector('#results_list');
    list.innerHTML = '';

    results.forEach((pokemon) => {
      let list_value = document.createElement('p');
      list_value.className = 'result_element';
      list_value.innerHTML = pokemon.id;

      get_colors(pokemon.id)
        .then((colors) => {
          list_value.addEventListener('mouseover', (event) => {
            list_value.style.backgroundColor = `rgb(${colors[0].join(',')})`;
            list_value.style.color = `rgb(${colors[1].join(',')})`;
            list_value.style.border = `2px solid ${colors[2].join(',')}`;
          });
        })
        .catch((error) => {
          console.error('Ocorreu um erro ao obter as cores:', error);
        });

      list_value.addEventListener('mouseout', (event) => {
        list_value.style.backgroundColor = '';
        list_value.style.color = '';
        list_value.style.border = '';
      });

      list_value.addEventListener('click', () => {
        const p = pokedex.findByName(pokemon.id);

        // Clear search list
        document.getElementById('autocomplete').value = '';
        document.getElementById('results_list').innerHTML = '';

        // Click
        p.click();
      });

      list.appendChild(list_value);
    });
  });
}