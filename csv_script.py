import csv

path = r'C:\College Stuff\Junior Year\Semester 2\05430 Programmable User Interfaces\test\d3_map\books.csv'

with open(path, 'r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        print(row)