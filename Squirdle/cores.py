# Imprimir textos em cores diferentes

vermelho = '\033[31m'
verde = '\033[32m'
azul = '\033[34m'
normal = '\033[0m'

def imprimir_vermelho(texto):
    return "{}{}{}".format(vermelho, texto,'\033[0m')

def imprimir_verde(texto):
    return "{}{}{}".format(verde,texto,'\033[0m')

def imprimir_azul(texto):
    return "{}{}{}".format(azul,texto,'\033[0m')