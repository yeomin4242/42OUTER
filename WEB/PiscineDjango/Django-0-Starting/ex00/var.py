def my_var() :
    a = 42
    b = "42"
    c = "quarante-deux"
    d = 42.0
    e = True
    f = [42]
    g = {42: 42}
    h = (42,)
    i = set()
    print(f"{a} has a type {type(a)}")
    print(f"{b} has a type {type(b)}")
    print(f"{c} has a type {type(c)}")
    print(f"{d} has a type {type(d)}")
    print(f"{e} has a type {type(e)}")
    print(f"{f} has a type {type(f)}")
    print(f"{g} has a type {type(g)}")
    print(f"{h} has a type {type(h)}")
    print(f"{i} has a type {type(i)}")

if __name__ == '__main__':
    my_var()