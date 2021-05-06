import csv

path = r'C:\College Stuff\Junior Year\Semester 2\05430 Programmable User Interfaces\test\final_project\books.csv'

def remove_country_name(s):
    for i in range(0, len(s)):
        s = s.replace(u'\xa0', u' ')
        if s[i] == " ":
            return s[i+1:]

def separate_books(s):
    splitted = s.split('/')
    # print(splitted)
    if len(splitted) < 3:
        return 'None'
    else:
        return splitted[2][1:-1]
    # print(splitted[1][:-1])
    # print(repr(s))

def separate_author(s):
    #first space
    splitted = s.split(' ')
    if len(splitted) < 2:
        return s
    else:
        author = [splitted[0], splitted[1]]
        return ' '.join(author)

def separate_title(s):
    #first space
    splitted = s.split(' ')
    if len(splitted) < 2:
        return 'None'
    else:
        splitted.pop(0)
        splitted.pop(0)
        return ' '.join(splitted)

with open(path, 'r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        books = row[1]
        book = row[5]
        # print(books)
        # print(remove_country_name(books))
        # print(separate_books(books))
        print(separate_author(book))
        # print(separate_title(book))
        line_count += 1

    print(line_count)