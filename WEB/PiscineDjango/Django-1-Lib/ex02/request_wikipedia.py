import requests, json, dewiki, sys

def request_wikipeadia(page: str):
    URL = "https://en.wikipedia.org/w/api.php"

    PARAMS = {
        "action": "parse",
        "page": page,
        "format": "json",
        "redirects": "true",
        "prop": "wikitext",
    }

    try:
        response = requests.Session().get(url=URL, params=PARAMS)
        response.raise_for_status()
    except requests.HTTPError as e:
        raise e
    try:
        data = response.json()
    except json.decoder.JSONDecodeError as e:
        raise e
    if data.get("error") is not None:
        raise Exception(data["error"]["info"])
    return (dewiki.from_string(data["parse"]["wikitext"]["*"]))



if __name__ == '__main__':
    if len(sys.argv) == 2:
        try:
            wiki_data = request_wikipeadia(sys.argv[1])
        except Exception as e:
            print(e)
            sys.exit(1)
        try:
            f = open("{}.wiki".format(sys.argv[1]), "w")
            f.write(wiki_data)
            f.close
        except Exception as e:
            print(e)
            sys.exit(1)
    else:
        print("wrong argument count!")

#https://en.wikipedia.org/wiki/Special:ApiSandbox#action=parse&page=Pet_door&prop=text&formatversion=2
        

#파이썬 가상환경 설정
#source myenv/bin/activate
#pip3 install virtualenv
#pip3 install -r requirements.txt
#python3 request_wikipedia.py chocolatine
#deactivate
        
#https://pypi.org/project/