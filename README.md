# Squirdle
Website that performs filtering and helps play the game Squirdle.

Squirdle (https://squirdle.fireblend.com/) is a game based on the game Wordle. 
In this game, based on data about Pokémon (generation, height, weight, types), the objective is to discover which Pokémon it is.

The website receives this data by simple user inputs, and returns to the user a list of possibilities based on the parameters provided.<br/>
The game has a total of 1160 pokemons, including regional forms, alternative forms and mega-evolutions.

# Squirdle 2.0 - The JS Update

The code has been completely ported to the Node.js environment, providing users with a much simpler and visual experience compared to the terminal, all on the web.

The new version features images of **all** Pokémon up to gen 9, a search bar with autocomplete, and customizable color layouts based on the selected Pokémon's color palette.

It accepts inputs from both the mouse and arrow keys.

The page layout is inspired by the layout of the Pokémon Emerald game.

## Image from Squirdle Game:
![image](https://user-images.githubusercontent.com/85745442/222725000-aa2b2e3e-1569-4579-abc8-314d4043b242.png)

## Images from Squirdle Solver:

![image](https://github.com/pedrovitorsilva/SquirdleSolver/assets/85745442/e4bc92fd-026c-4b5f-ae0f-70b65113a02a)
![image](https://github.com/pedrovitorsilva/SquirdleSolver/assets/85745442/b688cf7a-efbc-4104-8058-8e420d634d8f)
![image](https://github.com/pedrovitorsilva/SquirdleSolver/assets/85745442/62f118a6-c0e3-439e-9b6c-894a4b20b39e)
![image](https://github.com/pedrovitorsilva/SquirdleSolver/assets/85745442/c39afaef-cd42-414e-ad6d-3c81018ab001)

## How to Use:
Install project dependences. <br/>
**Npm Install** command in terminal to install node dependences.<br/>
**Nodemon src/server.js** command  in terminal to start app. <br/>
Website is hosted on **localhost:3000**

## Libraries Used:
### MiniSearch (https://lucaong.github.io/minisearch/)
### ColorThief (https://lokeshdhakar.com/projects/color-thief/)

## Credits:

Credits to Pokemon Essentials Project,for using their Gen 1 - Gen 7 Sprites

Credits to KingOfThe-X-Roads, for using his Gen 8 - Gen 9 Sprites : <br/>
https://www.deviantart.com/kingofthe-x-roads/art/Hisui-Pokemon-Sprites-889273130 <br/>
https://www.deviantart.com/kingofthe-x-roads/art/Gen-9-Sprites-Pokemon-Scarlet-and-Violet-908341834
