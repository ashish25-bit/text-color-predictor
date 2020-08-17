from addToCsv import appendToCsv 

def createData(list):
    for item in list:
        combo = []  
        for color in item.values():
            combo.append(color)
        appendToCsv(combo)
