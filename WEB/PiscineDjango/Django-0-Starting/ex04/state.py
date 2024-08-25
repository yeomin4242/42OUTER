import sys

def checkArgNum() :
    if len(sys.argv) != 2:
        sys.exit()

def getState(city) :
    states = {
    "Oregon" : "OR",
    "Alabama" : "AL",
    "New Jersey": "NJ",
    "Colorado" : "CO"
    }
    for idx in states : 
        if states[idx] == city :
            return print(idx)
    return print("Error")
            
def getCapitalCity() :
    capital_cities = {
    "OR": "Salem",
    "AL": "Montgomery",
    "NJ": "Trenton",
    "CO": "Denver"
    }
    city = sys.argv[1]
    for idx in capital_cities :
        if capital_cities[idx] == city :
            return idx
    return None


if __name__ == '__main__':
    checkArgNum()
    city = getCapitalCity()
    if city is None :
        print("Unknown capital city")
    else :
        getState(city)