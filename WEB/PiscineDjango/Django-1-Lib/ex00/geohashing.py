import sys, antigravity

def main():
    if (len(sys.argv) == 4):
        try:
            latitude = float(sys.argv[1])
            longitude = float(sys.argv[2])
            datedow = sys.argv[3].encode('utf-8')
        except:
            return print("Invalid input")
        antigravity.geohash(latitude, longitude, datedow)
    else:
        print("usage: python3 geohashing.py latitude longitude datedow")


if __name__ == '__main__':
    main()


#37.4882145 127.0647887 2024-05-02-37903.29
#https://geohashing.site/geohashing/Main_Page