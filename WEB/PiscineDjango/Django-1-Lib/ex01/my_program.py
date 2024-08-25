from path import Path

def main():
    try:
        Path.makedirs('newdir')
    except FileExistsError as e:
        print(e)
    Path.touch('newdir/newfile.txt')
    f = Path('newdir/newfile.txt')
    f.write_lines(['hello, world!'])
    print(f.read_text())

if __name__ == '__main__':
    main()