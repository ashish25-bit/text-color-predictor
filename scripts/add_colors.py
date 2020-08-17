import sys
from createData import createData

if __name__ == "__main__":
    data = sys.argv[1:]
    colorCombos = [eval(combo) for combo in data]
    createData(colorCombos)
    print('Data Added.')