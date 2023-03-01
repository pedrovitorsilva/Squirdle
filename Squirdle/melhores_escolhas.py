
'''{ 
  'name' str: ,
  'generation': int,
  'types': [str, str],
  'height': float, 
  'weight': float
}'''

# Os algoritmos de melhor escolha selecionam o elemento central da lista,
# dividindo a lista em 2 partes, e filtrando de modo semelhante a uma
# busca binária.


def bestchoice_gen(lista):
  l = lista
  l.sort(key = lambda x: x['generation'])
  escolha = l[len(l) // 2]
  print("Melhor escolha por geração:", escolha['name'], '\n')
  return (escolha,l.index(escolha))

def bestchoice_height(lista):
  l = lista
  l.sort(key = lambda x: x['height'])
  escolha = l[len(l) // 2]
  print("Melhor escolha por altura:", escolha['name'], '\n')
  return (escolha,l.index(escolha))

def bestchoice_weight(lista):
  l = lista
  l.sort(key = lambda x: x['weight'])
  escolha = l[len(l) // 2]
  print("Melhor escolha por peso:", escolha['name'], '\n')
  return (escolha,l.index(escolha))
