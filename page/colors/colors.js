import * as pokedex from '../pokedex/pokedex.js';
import ColorThief from '../../node_modules/colorthief/dist/color-thief.mjs';
// Function to get color from type name

export function color_from_type(type) {
  const typeColors = {
    Normal: '#A8A77A',
    Fire: '#EE8130',
    Water: '#6390F0',
    Electric: '#F7D02C',
    Grass: '#7AC74C',
    Ice: '#96D9D6',
    Fighting: '#C22E28',
    Poison: '#A33EA1',
    Ground: '#E2BF65',
    Flying: '#A98FF3',
    Psychic: '#F95587',
    Bug: '#A6B91A',
    Rock: '#B6A136',
    Ghost: '#735797',
    Dragon: '#6F35FC',
    Dark: '#705746',
    Steel: '#B7B7CE',
    Fairy: '#D685AD'
  };

  return typeColors[type];
}

// Functions to get unique color patters from each pokemon, and return
// to be used on autocomplete buttons

export function get_colors(name) {
  const fixed_name = pokedex.fixPokemonName(name);
  const src = `./assets/sprites/${fixed_name}.png`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 6);

      resolve(reorderColors(palette));
    };
    img.onerror = function() {
      reject('Erro ao carregar a imagem');
    };
    img.src = src;
  });
}

// Credits: https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
function reorderColors(colors) {
  function luminance(rgb) {
    var a = rgb.map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  // Calcular o contraste entre duas cores
  function getContrast(color1, color2) {
    var color1luminance = luminance(color1);
    var color2luminance = luminance(color2);
    var ratio = color1luminance > color2luminance ? ((color2luminance + 0.05) / (color1luminance + 0.05)) : ((color1luminance + 0.05) / (color2luminance + 0.05));
    return ratio;
  }

  // Reordenar a lista de cores de acordo com a ordem desejada
  var reorderedColors = [
    colors[0],  // Cor 1 para guess_button.backgroundColor
    colors[1],  // Cor 2 para guess_button.color
    colors[2],  // Cor 3 para guess_button.border
    colors[3],  // Cor 4 para details.backgroundColor
    colors[4],  // Cor 5 para details.color
    colors[5]   // Cor 6 para details.border
  ];

  // Verificar o contraste entre as cores e fazer ajustes, se necessário
  var backgroundColorContrast = getContrast(reorderedColors[0], reorderedColors[3]);
  var colorContrast = getContrast(reorderedColors[1], reorderedColors[4]);

  if (backgroundColorContrast < colorContrast) {
    // Inverter as cores 1 e 4 para obter maior contraste entre backgroundColor e color
    var tempColor = reorderedColors[0];
    reorderedColors[0] = reorderedColors[3];
    reorderedColors[3] = tempColor;
  }

  return reorderedColors;
}



