from beverages import HotBeverage, Coffee, Tea, Chocolate, Cappuccino
import random

class CoffeeMachine :

    class EmptyCup(HotBeverage) :
        def __init__(self) :
            self.name = "empty cup"
            self.price = 0.90
        
        def description(self):
            return "An empty cup?! Gimme my money back!"
    
    class BrokenMachineException(Exception) :
        def __init__(self) :
            super().__init__("This coffee machine has to be repaired.")

    def __init__(self) :
        self.cnt = 10

    def repair(self) :
        self.cnt = 10

    def serve(self, beverage : HotBeverage) :
        if self.cnt == 0 :
                raise CoffeeMachine.BrokenMachineException()
        if random.randint(0, 1) == 1 :
            self.cnt -= 1
            return beverage()
        else :
            self.cnt -= 1
            return CoffeeMachine.EmptyCup()
    

if __name__ == "__main__" :
    machine = CoffeeMachine()
    for _ in range(12):
        try:
            print(machine.serve(random.choice(
                [Coffee, Tea, Cappuccino, Chocolate])))
            print(f"reserve cnt: {machine.cnt}\n")
        except CoffeeMachine.BrokenMachineException as e:
            print(e)
            machine.repair()
            print(f"reserve cnt: {machine.cnt}\n")
