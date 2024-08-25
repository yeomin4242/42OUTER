from django.shortcuts import render

def generate_shades():
    shades = 50  # 생성할 색상 음영의 수를 정의합니다.
    color_values = {
        'noir': (0, 0, 0),  # 기본 색상과 해당 RGB 값을 정의합니다.
        'rouge': (255, 0, 0),
        'bleu': (0, 0, 255),
        'vert': (0, 255, 0),
    }
    color_shades = {}  # 각 색상의 음영을 저장할 딕셔너리를 초기화합니다.
    for color, (r, g, b) in color_values.items():  # 기본 색상들을 순회하면서 각 색상에 대한 음영을 생성합니다.
        color_shades[color] = [
            (int(r * i / shades), int(g * i / shades), int(b * i / shades))  # 각 음영은 해당 색상의 RGB 값에 i/shades를 곱하여 계산합니다.
            for i in range(1, shades + 1)  # 1부터 shades(50)까지 음영을 생성합니다.
        ]
    return color_shades  # 생성된 색상 음영 딕셔너리를 반환합니다.

def color_shades_view(request):
    color_shades = generate_shades()  # 색상 음영을 생성하는 함수를 호출합니다.
    #unpacking operator *를 사용하여 딕셔너리의 키와 값들을 분리합니다. 이를 zip 함수를 사용하여 튜플로 만들고 각 색상의 동일한 인덱스를 가진 음영들을 묶어 리스트로 만듭니다.
    color_rows = list(zip(*color_shades.values()))
    return render(request, 'ex03/color_shades.html', {'color_rows': color_rows, 'colors': color_shades.keys()})  # 렌더링 함수를 호출하여 요청된 HTML 페이지를 반환합니다. 이때, 생성된 색상 음영과 색상 이름들을 템플릿에 전달합니다.
