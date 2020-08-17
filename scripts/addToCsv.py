from csv import writer

def appendToCsv(combo):
    with open('./scripts/colors.csv', 'a+', newline='') as write_obj:
        csv_writer = writer(write_obj)
        csv_writer.writerow(combo)