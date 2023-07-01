// Express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Read Data
const data = require('./data.json');
let originalpokemonData = data;
let pokemonData = data;

app.use(express.static(path.join(__dirname, '../')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../page/main_page/squirdle.html'));
});

app.get('/all', (req, res) => {
  res.send(originalpokemonData);
});

// Filtering data
function filterPokemons(pokemon, filtro) {
  const filteredData = pokemonData.filter((item) => {
    if (item['name'] == pokemon['name']) {
      return false;
    }

    let valid = true;

    for (const key in filtro) {
      const value = filtro[key];
      const itemValue = item[key];

      if (key === 'type1' || (key === 'type2' && pokemon[key] != undefined)) {
        let set = item['type2'] == undefined ? [item['type1']] : [item['type1'], item['type2']];
        let item_types = new Set(set);

        if (value === '==') {
          if (!item_types.has(pokemon[key])) {
            valid = false;
            break;
          }
        } else {
          if (item_types.has(pokemon[key])) {
            valid = false;
            break;
          }
        }
      } else if (key === 'generation' || key === 'height' || key === 'weight') {
        const expression = `${itemValue} ${value} ${pokemon[key]}`;
        if (!eval(expression)) {
          valid = false;
          break;
        }
      }
    }
    return valid;
  });

  return filteredData;
}

app.get('/filter', (req, res) => {
  const { pokemon_string, generation, type1, type2, height, weight } = req.query;

  const pokemon = JSON.parse(pokemon_string);

  const filter = {
    generation,
    type1,
    type2,
    height,
    weight
  };

  pokemonData = filterPokemons(pokemon, filter);

  res.send(pokemonData);
});

app.get('/best', (req, res) => {
  function findObjectsClosestToMedian(pokemonList) {
    const calculateMedian = (values) => {
      const sortedValues = values.slice().sort((a, b) => a - b);
      const middleIndex = Math.floor(sortedValues.length / 2);
      if (sortedValues.length % 2 === 0) {
        return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
      } else {
        return sortedValues[middleIndex];
      }
    };

    const generations = [];
    const heights = [];
    const weights = [];

    pokemonList.forEach((pokemon) => {
      generations.push(pokemon.generation);
      heights.push(pokemon.height);
      weights.push(pokemon.weight);
    });

    const medianGeneration = calculateMedian(generations);
    const medianHeight = calculateMedian(heights);
    const medianWeight = calculateMedian(weights);

    let closestGeneration = null;
    let closestHeight = null;
    let closestWeight = null;
    let minDiffGeneration = Infinity;
    let minDiffHeight = Infinity;
    let minDiffWeight = Infinity;

    pokemonList.forEach((pokemon) => {
      const diffGeneration = Math.abs(pokemon.generation - medianGeneration);
      const diffHeight = Math.abs(pokemon.height - medianHeight);
      const diffWeight = Math.abs(pokemon.weight - medianWeight);

      if (diffGeneration < minDiffGeneration) {
        closestGeneration = pokemon;
        minDiffGeneration = diffGeneration;
      }

      if (diffHeight < minDiffHeight) {
        closestHeight = pokemon;
        minDiffHeight = diffHeight;
      }

      if (diffWeight < minDiffWeight) {
        closestWeight = pokemon;
        minDiffWeight = diffWeight;
      }
    });

    return { closestGeneration, closestHeight, closestWeight };
  }

  res.send(findObjectsClosestToMedian(pokemonData));
});

app.listen(3000);
