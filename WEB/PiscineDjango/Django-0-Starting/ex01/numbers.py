def openfile() :
    file = open("./numbers.txt", 'r')
    if file is None :
        return None
    totalLine = file.readlines()
    arr = []
    for line in totalLine :
        if line is None : break
        split_line = line.split(',')
        for check in split_line :
            check = delWhiteSpace(check)
            if check is None :
                break 
            elif check.isdigit() :
                arr.append(check)
            else :
                return None
    return arr

def delWhiteSpace(check) :
    return check.strip()


def printLines(list) :
    if list is None: return None
    for idx in list :
        print(idx)
    return list

if __name__ == '__main__':
    arr = openfile()
    if arr is None :
        print("error\n")
    check = printLines(arr)
    if check is None :
        print("error\n")
