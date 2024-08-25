import sys

def checkArgNum() :
    if len(sys.argv) != 2:
        sys.exit()

def getState() :
    states = {
    "Oregon" : "OR",
    "Alabama" : "AL",
    "New Jersey": "NJ",
    "Colorado" : "CO"
    }
    state = sys.argv[1]
    for idx in states : 
        if idx == state :
            return states[idx]
    return None
            
def getCapitalCity(state) :
    capital_cities = {
    "OR": "Salem",
    "AL": "Montgomery",
    "NJ": "Trenton",
    "CO": "Denver"
    }
    for idx in capital_cities :
        if idx == state :
            return print(capital_cities[idx])
    return print("Error")


if __name__ == '__main__':
    checkArgNum()
    state = getState()
    if state is None :
        print("Unknown state")
    else :
        getCapitalCity(state)