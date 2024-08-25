import sys

def checkArgNum() :
    if len(sys.argv) != 2:
        sys.exit()

def splitArgs() :
    split_args = sys.argv[1].split(',')
    split_args = [idx.strip() for idx in split_args if idx.strip()]
    return split_args

def getState(arg : str) :
    states = {
    "Oregon" : "OR",
    "Alabama" : "AL",
    "New Jersey": "NJ",
    "Colorado" : "CO"
    }
    for idx in states : 
        if idx.upper() == arg.upper() :
            return idx
    return None
            
def getCapitalCity(arg : str) :
    capital_cities = {
    "OR": "Salem",
    "AL": "Montgomery",
    "NJ": "Trenton",
    "CO": "Denver"
    }
    for idx in capital_cities :
        if arg.upper() == capital_cities[idx].upper() :
            return capital_cities[idx]
    return None

def printByState(state : str) :
    states = {
    "Oregon" : "OR",
    "Alabama" : "AL",
    "New Jersey": "NJ",
    "Colorado" : "CO"
    }
    capital_cities = {
    "OR": "Salem",
    "AL": "Montgomery",
    "NJ": "Trenton",
    "CO": "Denver"
    }
    for idx in states : 
        if idx.upper() == state.upper() :
            city = capital_cities[states[idx]]
            return print(f"{city} is the capital of {state}")
    return None
    
def printByCity(city : str) :
    states = {
    "Oregon" : "OR",
    "Alabama" : "AL",
    "New Jersey": "NJ",
    "Colorado" : "CO"
    }
    capital_cities = {
    "OR": "Salem",
    "AL": "Montgomery",
    "NJ": "Trenton",
    "CO": "Denver"
    }
    for idx in capital_cities :
        if capital_cities[idx].upper() == city.upper() :
            state = [k for k, v in states.items() if v == idx]
            return print(f"{city} is the capital of {state[0]}")
    return None  

if __name__ == '__main__':
    checkArgNum()
    arg = splitArgs()
    for idx in arg :
        state = getState(idx)
        city = getCapitalCity(idx)
        if state :
            printByState(state)
        elif city :
            printByCity(city)
        else :
            print(f"{idx} is neither a capital city nor a state")