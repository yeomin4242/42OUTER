def setDict() :
    d = [
            ('Hendrix' , '1942'),
            ('Allman' , '1946'),
            ('King' , '1925'),
            ('Clapton' , '1945'),
            ('Johnson' , '1911'),
            ('Berry' , '1926'),
            ('Vaughan' , '1954'),
            ('Cooder' , '1947'),
            ('Page' , '1944'),
            ('Richards' , '1943'),
            ('Hammett' , '1962'),
            ('Cobain' , '1967'),
            ('Garcia' , '1942'),
            ('Beck' , '1944'),
            ('Santana' , '1947'),
            ('Ramone' , '1948'),
            ('White' , '1975'),
            ('Frusciante', '1970'),
            ('Thompson' , '1949'),
            ('Burton' , '1939')
        ]
    dictionary = dict()
    for idx in d :
        value = idx[0]
        key = idx[1]
        dictionary[key] = value
    return dictionary
        
def printDict(dictionary) :
    for idx in dictionary :
        print(idx + ' : ' + dictionary[idx])


if __name__ == '__main__':
    dictionary = setDict()
    printDict(dictionary)

#3.6부터 순서를 보장해주게 되며, OrderedDict라는 자료형 또한 생김