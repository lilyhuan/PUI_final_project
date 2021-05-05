import csv

path = r'C:\College Stuff\Junior Year\Semester 2\05430 Programmable User Interfaces\test\final_project\books.csv'

def remove_country_name(s):
    for i in range(0, len(s)):
        s = s.replace(u'\xa0', u' ')
        if s[i] == " ":
            return s[i+1:]

def separate_books(s):
    splitted = s.split('/')
    print(splitted)

with open(path, 'r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        books = row[1]
        # print(books)
        # print(remove_country_name(books))
        separate_books(books)
        line_count += 1

    print(line_count)