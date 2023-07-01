import { color_from_type, get_colors } from '../colors/colors.js';
// Fix name variations to match database pattern
export function fixPokemonName(pokemonName) {
  /**
   * Fix name variations to match database pattern
   * MEGA, PRIMAL, GALARIAN, ALOLAN, HISUIAN, PALDEAN => POKEMONNAME_1
   * MEGA Y VERSION => POKEMONNAME_2
   * SPECIFIC NAMES (EXAMPLE: Dialga Origin Forme => DIALGAORIGINFORME)
   */
  let name = pokemonName.toUpperCase();
  name = name.replace('%', '');
  let name_parts = name.split(' ');

  const list = ['MEGA', 'PRIMAL', 'GALARIAN', 'ALOLAN', 'HISUIAN', 'PALDEAN'];

  // Default Case

  if (list.includes(name_parts[0])) {
    name_parts = name_parts.slice(1);
    name_parts.push('_1');
  }

  // Mega X and Mega Y Variations Case

  if (name_parts.includes('X')) {
    name_parts = [name_parts[0], '_1'];
  }

  if (name_parts.includes('Y')) {
    name_parts = [name_parts[0], '_2'];
  }

  // Meowth is the only Pokémon to have more than one regional form
  // Fix Meowth error
  if (pokemonName == 'Alolan Meowth') {
    name_parts = ['MEOWTH', '_1'];
  } else if (pokemonName == 'Galarian Meowth') {
    name_parts = ['MEOWTH', '_2'];
  }

  return name_parts.join('').toUpperCase();
}

// Convert data to tr elements
export function createPokemonListElements(pokemonData, fixPokemonNameFunction) {
  /**
   * <tr class="pokedex_list_element">
          <td>
            <img class="pokedex_img" src="./assets/pokemon_img/name.png" alt="">
          </td>
          <td>
            <p class="pkmn_name">Name</p>
          </td>
        </tr>
  */

  const actualPokedexList = document.getElementById('pokedex_list');
  actualPokedexList.innerHTML = '';

  const notFoundImgs = [];

  if (pokemonData.length == 0) {
    alert(`A Pokemon with that criteria wasn't found!! Try Again!`);
    location.reload(true);
  }

  if (pokemonData.length == 1) {
    alert(`Your Pokemon is ${pokemonData[0]['name']}!!`);
    document.getElementById('guess_button').style.display = 'none';
  }

  for (let i = 0; i < pokemonData.length; i++) {
    const pokemon = pokemonData[i];
    var tr = document.createElement('tr');
    tr.className = 'pokedex_list_element';
    tr.id = `pokemon_${i}`;

    var td1 = document.createElement('td');
    var img = document.createElement('img');
    img.className = 'pokedex_img';
    img.loading = 'lazy';

    /* Fix name variations to match database pattern */
    const fixed_name = fixPokemonNameFunction(pokemon.name);
    img.src = `../../assets/sprites/000.png`;
    img.src = `../../assets/sprites/${fixed_name}.png`;

    img.onerror = function () {
      // If the image keep failing to load, use '000' as the fixed name
      // '000' stands for "?" icon
      notFoundImgs.push(pokemon.name);
      img.src = `../../assets/sprites/000.png`;
    };

    img.alt = pokemon.name;
    td1.appendChild(img);

    var td2 = document.createElement('td');
    var p = document.createElement('p');
    p.className = 'pkmn_name';
    p.textContent = pokemon.name;

    td2.appendChild(p);

    tr.appendChild(td1);
    tr.appendChild(td2);

    actualPokedexList.appendChild(tr);
  }

  // Fix margin to first and last pokedex list elements, to center then while scrolling.
  const items = actualPokedexList.getElementsByTagName('tr');

  const firstItem = document.getElementById('pokemon_0');
  const lastItem = document.getElementById(`pokemon_${items.length - 1}`);

  firstItem.style.marginTop = '35px';
  lastItem.style.marginBottom = '35px';

  // Hide loading bar when loaded
  // window.addEventListener('load', () => (document.getElementById('loading').style.display = 'none'));
  document.getElementById('loading').style.display = 'none';

  console.log('MISSING IMAGES:' + (notFoundImgs.length == 0 ? '[]' : notFoundImgs));
}

// Find a pokemon on list (td) based on yout name
export function findByName(text) {
  const names = document.querySelectorAll('.pkmn_name');

  for (const name of names) {
    if (name.textContent === text) {
      return name.parentElement;
    }
  }

  return null;
}


// Highlight on Selected ---------------------------------------
export function highlightSelectedPokemon(miniSearch, actualPokemonChoice) {
  const pokedexList = document.getElementById('pokedex_list');

  pokedexList.addEventListener('click', function (event) {
    const clickedElement = event.target.closest('.pokedex_list_element');
    if (!clickedElement) return;

    const highlighted = document.querySelector('.highlight');
    if (highlighted) highlighted.classList.remove('highlight');

    clickedElement.classList.add('highlight');
    clickedElement.scrollIntoView({ behavior: 'smooth' });

    let actualPokemonChoice = getDetails(clickedElement,miniSearch);
    showDetails(actualPokemonChoice);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

    setTimeout(() => {
      const { x, y } = document.getElementById('pokedex').getBoundingClientRect();
      const activeElement = document.querySelector('.highlight');
      if (!activeElement) return;

      document.elementFromPoint(x + 200, y + 100).click();
    }, 250);
  });
}

export function getDetails(clickedElement,miniSearch){
  const name = clickedElement.querySelector('.pkmn_name').textContent;

  let pokemon_fields = miniSearch.search(name);

  pokemon_fields = pokemon_fields.filter((pokemon) => pokemon.id == name)[0];

  // Removing not used json info
  delete pokemon_fields.match;
  delete pokemon_fields.score;
  delete pokemon_fields.terms;
  pokemon_fields.name = pokemon_fields.id;
  delete pokemon_fields.id;

  return pokemon_fields;
}

function showDetails(actualPokemonChoice) {
  // Hide guess_options to avoid guesses from the last pokemon selected
  document.querySelector('#guess').style.display = 'none';

  const details = document.getElementById('details');
  details.innerHTML = '';

  const createParagraph = (label, value) => {
    const p = document.createElement('p');
    p.innerHTML = `${label}: ${value}`;
    return p;
  };

  const info_name = createParagraph('Name', actualPokemonChoice.name);
  const info_height = createParagraph('Height', actualPokemonChoice.height + ' m');
  const info_weight = createParagraph('Weight', actualPokemonChoice.weight + ' kg');
  const info_generation = createParagraph('Generation', actualPokemonChoice.generation);

  const createTypeParagraph = (type) => {
    const p = document.createElement('p');
    p.innerHTML = type;
    p.style.color = color_from_type(p.textContent);
    return p;
  };

  const type1 = actualPokemonChoice.type1;
  const type2 = actualPokemonChoice.type2 || '';

  const info_types = document.createElement('div');
  info_types.style.display = 'flex';

  const typesLabel = document.createElement('p');
  typesLabel.innerHTML = 'Types: ';
  info_types.appendChild(typesLabel);
  info_types.appendChild(createTypeParagraph(type1));

  if (color_from_type(type2)) {
    const p = document.createElement('p');
    p.innerHTML = ',';
    info_types.appendChild(p);

    info_types.appendChild(createTypeParagraph(type2));
  }

  const guess_button = document.createElement('button');
  guess_button.id = 'guess_button';
  guess_button.innerHTML = 'Guess';

  // Show guess options
  guess_button.addEventListener('click', () => {
    if (confirm('Your guess was right?\nPress (Ok) for Yes and (Cancel) for No.')) {
      alert('Congratulations!!! Lets Play Again!');
      location.reload(true);
    } else {
      document.getElementById('guess').style.display = 'table';
    }
  });

  get_colors(actualPokemonChoice.name)
    .then((colors) => {
      const [bgColor, bgColor2, borderColor, textColor, detailsBgColor, detailsTextColor] = colors;

      const guess_info = document.querySelector('#guess');
      const filterButton = document.querySelector('#filter');

      guess_button.style.backgroundColor = `rgb(${bgColor.join(',')})`;

      filterButton.style.backgroundColor = `rgb(${bgColor2.join(',')})`;

      // Multiple assignments to avoid code redundancy

      // Text Color

      filterButton.style.color = guess_button.style.color = `rgb(${textColor.join(',')})`;

      details.style.color = guess_info.style.color = `rgb(${detailsTextColor.join(',')})`;

      // Background Color

      details.style.backgroundColor = guess_info.style.backgroundColor = `rgb(${detailsBgColor.join(
        ','
      )})`;

      // Border Color

      details.style.border =
        guess_button.style.border =
        filterButton.style.border =
        guess_info.style.border =
          `2px solid rgb(${borderColor.join(',')})`;
    })
    .catch((error) => {
      console.error('An error occurred while getting colors:', error);
    });

  details.appendChild(info_name);
  details.appendChild(info_types);
  details.appendChild(info_height);
  details.appendChild(info_weight);
  details.appendChild(info_generation);
  details.appendChild(guess_button);
}
