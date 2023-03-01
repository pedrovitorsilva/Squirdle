import pandas as pd
from IPython.core.display import HTML
from numpy import *
from melhores_escolhas import *
from cores import *

pokedex = pd.read_csv("pokedex.csv", names=[
                      "Name", "Generation", "Type_1", "Type_2", "Height", "Weight"])
pokedex["Type_2"].fillna("Blank", inplace=True)

pokedex = pokedex.to_numpy()
all_pokemons = []
for p in pokedex:
    all_pokemons.append(
        {'name': p[0],
         'generation': int(p[1]),
         'types': [p[2], p[3]],
         'height': float(p[4]),
         'weight': float(p[5])
         }
    )

options = all_pokemons

while True:  # Loop do Programa
    pkmn = input("Digite um Pokemon: ").lower().capitalize()

    texto = "Digite " + \
        imprimir_verde('(A)') + " se acertou ou " + \
        imprimir_vermelho('qualquer outra tecla') + " se Errou: "

    if input(texto).upper() == "A":
        print("---Acertou!!!---")
        break

    for i in all_pokemons:
        if i['name'] == pkmn:
            print(i)
            generation = i['generation']
            types = i['types']
            height_m = i['height']
            weight_kg = i['weight']
            break

    # -------------------------------------------------------------------------
    # Avaliacao do Tipo-1
    
    evaluation = False

    while (not evaluation):
      
        texto = "Digite " + imprimir_verde('(S)') + " se possui ou " + \
            imprimir_vermelho('(N)') + " se não possui (Tipo-1):"

        type_1_evaluation = input(texto).upper()
        
        if type_1_evaluation == 'S':
            t1 = "types[0] in x['types']"
            evaluation = True
        elif type_1_evaluation == 'N':
            t1 = "types[0] not in x['types']"
            evaluation = True
        else:
            print("Texto inválido! Digite (S) ou (N) !!\n")


    # -------------------------------------------------------------------------
    # Avaliacao do Tipo-2

    evaluation = False

    while (not evaluation):
        texto = "Digite " + imprimir_verde('(S)') + " se possui ou " + \
                imprimir_vermelho('(N)') + " se não possui (Tipo-2):"

        type_2_evaluation = input(texto).upper()

        if type_2_evaluation == 'S':
            t2 = "types[1] in x['types']"
            evaluation = True
        elif type_2_evaluation == 'N':
            t2 = "types[1] not in x['types']"
            evaluation = True
        else:
            print("Texto inválido! Digite (S) ou (N) !!\n")
    # -------------------------------------------------------------------------
    # Avaliacao da Geracao


    evaluation = False

    while (not evaluation):
        texto = "Digite se a " + imprimir_azul('(Geração)') + " é Menor " + imprimir_azul(
        '(<)') + ", Igual" + imprimir_azul('(==)') + " ou Maior" + imprimir_azul('(>)') + ": "

        g = input(texto)
        
        if g not in ["<","==",">"]:
            print("Texto inválido! Digite (<), (==) ou (>) !!\n")
        else:
            evaluation = True
    
    gen_evaluation = f"x['generation'] {g} {generation}"
    # -------------------------------------------------------------------------
    # Avaliacao da Altura



    evaluation = False

    while (not evaluation):
        texto = "Digite se a " + imprimir_azul('(Altura)') + " é Menor " + imprimir_azul(
        '(<)') + ", Igual" + imprimir_azul('(==)') + " ou Maior" + imprimir_azul('(>)') + ": "

        a = input(texto)
        
        if a not in ["<","==",">"]:
            print("Texto inválido! Digite (<), (==) ou (>) !!\n")
        else:
            evaluation = True

    height_evaluation = f"x['height'] {a} {height_m}"

    # -------------------------------------------------------------------------
    # Avaliacao do Peso
 

    evaluation = False

    while (not evaluation):
        texto = "Digite se o " + imprimir_azul('(Peso)') + " é Menor " + imprimir_azul(
        '(<)') + ", Igual" + imprimir_azul('(==)') + " ou Maior" + imprimir_azul('(>)') + ": "
        
        p = input(texto)
        
        if p not in ["<","==",">"]:
            print("Texto inválido! Digite (<), (==) ou (>) !!\n")
        else:
            evaluation = True

    weight_evaluation = f"x['weight'] {p} {weight_kg}"

    # -------------------------------------------------------------------------

    # Fazer as avaliacoes, usando eval()
    new_options = []
    for x in options:
        if eval(gen_evaluation) and eval(height_evaluation) and eval(weight_evaluation):
            if eval(t1) and eval(t2):
                new_options.append(x)

    options = new_options

    # ------------------------------
    if len(options) > 1:
        print(pd.DataFrame(options), '\n')

        # Mostrar possiveis escolhas por geracao, altura e peso
        # Se a altura,geracao e peso ja nao foram descobertos
        if '==' not in gen_evaluation:
            bestchoice_gen(new_options)
        if '==' not in height_evaluation:
            bestchoice_height(new_options)
        if '==' not in weight_evaluation:
            bestchoice_weight(new_options)

    elif len(options) == 1:
        print("O pokemon que deseja é:", options[0]['name'])
