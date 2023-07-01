export default function getImageColors(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = src;

    image.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, image.width, image.height).data;
      const colorCounts = {};

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const color = `rgb(${r}, ${g}, ${b})`;

        if (colorCounts[color]) {
          colorCounts[color] += 1;
        } else {
          colorCounts[color] = 1;
        }
      }

      const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
      const topColors = sortedColors.map((color) => color[0]);

      function getProminentColors(rgbList, numColors) {
        // Create an object to store the frequency of each color
        const colorFrequency = {};
      
        // Iterate over each RGB value
        for (let i = 0; i < rgbList.length; i++) {
          const rgb = rgbList[i];
          const colorKey = rgb.join(',');
      
          // Increment the frequency of the color
          if (colorFrequency[colorKey]) {
            colorFrequency[colorKey]++;
          } else {
            colorFrequency[colorKey] = 1;
          }
        }
      
        // Sort the colors based on frequency
        const sortedColors = Object.keys(colorFrequency).sort((a, b) => {
          return colorFrequency[b] - colorFrequency[a];
        });
      
        // Extract the top 'numColors' colors
        const prominentColors = sortedColors.slice(0, numColors).map(color => {
          return color.split(',').map(Number);
        });
      
        return prominentColors;
      }
    
      resolve(getProminentColors(topColors,5));
    };

    image.onerror = function() {
      reject(new Error('Não foi possível carregar a imagem.'));
    };
  });
}
