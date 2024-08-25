class Intern :

    class Coffee :
        def __str__(self) -> str:
            return "This is the worst coffee you ever tasted."

    def __init__(self, Name=None) -> None:
        self.Name = "My name? I’m nobody, an intern, I have no name." if Name is None else Name

    def __str__(self) -> str:
        return self.Name
    
    def work(self) -> str:
        raise Exception ("I’m just an intern, I can’t do that...")
    
    def make_coffee(self) -> Coffee():
        return self.Coffee()


def hire():
    intern_a = Intern()
    intern_b = Intern("Mark")
    print(intern_a)
    print(intern_b)
    try:
        intern_a.work()
    except Exception as error:
        print(error)
    print(intern_b.make_coffee())

if __name__ == '__main__':
    hire()