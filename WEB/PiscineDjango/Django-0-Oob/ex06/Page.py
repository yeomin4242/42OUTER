from elem import Elem, Text
from elements import Html, Head , Body, Title, Meta, Img, Table, Th, Tr, Td, Ul, Ol, Li, H1, H2, P, Div, Span, Hr, Br, Elem, Text

class Page:
    def __init__(self, elem):
        if not isinstance(elem, Elem):
            return print("Invalid HTML")
        self.root = elem

    def is_valid(self):
        return self.__validate(self.root)

    def __validate(self, elem, parent_tag=None):
        valid_tags = {
            'html': ['head', 'body'],
            'head': ['title'],
            'body': ['h1', 'h2', 'div', 'table', 'ul', 'ol', 'span', 'p'],
            'div': ['h1', 'h2', 'div', 'table', 'ul', 'ol', 'span', 'p'],
            'title': ['Text'],
            'h1': ['Text'],
            'h2': ['Text'],
            'p': ['Text'],
            'span': ['Text', 'p'],
            'ul': ['li'],
            'ol': ['li'],
            'li': ['Text'],
            'table': ['tr'],
            'tr': ['th', 'td'],
            'th': ['Text'],
            'td': ['Text']
        }

        if type(elem) == Text:
            return parent_tag in valid_tags and 'Text' in valid_tags[parent_tag]

        if elem.tag not in valid_tags:
            return False

        if parent_tag and elem.tag not in valid_tags[parent_tag]:
            return False

        children_tags = [child.tag if type(child) != Text else 'Text' for child in elem.content]
        if elem.tag == 'html' and children_tags != ['head', 'body']:
            return False

        if elem.tag == 'head' and 'title' not in children_tags:
            return False

        if elem.tag in ['ul', 'ol'] and 'li' not in children_tags:
            return False

        if elem.tag in ['tr'] and not any(tag in children_tags for tag in ['th', 'td']):
            return False

        for child in elem.content:
            if not self.__validate(child, elem.tag):
                return False

        return True

    def __str__(self):
        if isinstance(self.root, Html):
            return "<!doctype html>\n" + str(self.root)
        return str(self.root)

    def write_to_file(self, filename):
        if self.is_valid():
            with open(filename, 'w') as file:
                file.write(str(self))
        else :
            return print("Invalid HTML")

if __name__ == '__main__':
    print("------------테스트 케이스 1: 올바른 html 구조------------")
    valid_html = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([H1(Text("제목")), P(Text("문단"))])]))
    print(valid_html.is_valid())  # True가 출력되어야 함

    invalid_html = Page(Html([Body([H1(Text("제목")), P(Text("문단"))]), Head(Title(Text("잘못된 타이틀")))]))
    print(invalid_html.is_valid())  # False가 출력되어야 함

    print("------------테스트 케이스 2: head 태그 내에 title 외 다른 태그 포함------------")
    valid_head = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([H1(Text("제목"))])]))
    print(valid_head.is_valid())  # True가 출력되어야 함

    invalid_head = Page(Html([Head([Title(Text("타이틀")), Meta()]), Body([H1(Text("제목"))])]))
    print(invalid_head.is_valid())  # False가 출력되어야 함

    print("------------테스트 케이스 3: body 및 div 안에 허용되지 않는 태그 포함------------")
    print("------------body 태그에 대한 테스트: 올바른 태그만 포함------------")
    valid_body = Page(Html([Head(Title(Text("타이틀"))), Body([H1(Text("제목")), P(Text("문단 내용"))])]))
    print(valid_body.is_valid())  # True가 출력되어야 함

    invalid_body = Page(Html([Head(Title(Text("타이틀"))), Body([Img(attr="image.png")])]))
    print(invalid_body.is_valid())  # False가 출력되어야 함

    print("------------div 태그에 대한 테스트: 올바른 태그만 포함------------")
    valid_div = Page(Html([Head(Title(Text("타이틀"))), Body([Div([H1(Text("제목")), Table(), Span(Text("스팬"))])])]))
    print(valid_div.is_valid())  # True가 출력되어야 함

    invalid_div = Page(Html([Head(Title(Text("타이틀"))), Body([Div([Hr()])])]))
    print(invalid_div.is_valid())  # False가 출력되어야 함

    print("------------테스트 케이스 4: title 및 여러 태그 내에 텍스트 외 다른 내용 포함------------")
    print("------------title 태그에 대한 테스트: 오직 텍스트만 포함------------")
    valid_title = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([H1(Text("제목"))])]))
    print(valid_title.is_valid())  # True가 출력되어야 함

    invalid_title = Page(Html([Head(Title([Text("타이틀"), Span(Text("스팬"))])), Body([H1(Text("제목"))])]))
    print(invalid_title.is_valid())  # False가 출력되어야 함

    print("------------h1 태그에 대한 테스트: 오직 텍스트만 포함------------")
    valid_h1 = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([H1(Text("제목"))])]))
    print(valid_h1.is_valid())  # True가 출력되어야 함

    invalid_h1 = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([H1([Text("제목"), Span(Text("스팬"))])])]))
    print(invalid_h1.is_valid())  # False가 출력되어야 함

    print("------------h2 태그에 대한 테스트: 오직 텍스트만 포함------------")
    valid_h2 = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([H2(Text("부제목"))])]))
    print(valid_h2.is_valid())  # True가 출력되어야 함

    invalid_h2 = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([H2([Text("부제목"), Span(Text("스팬"))])])]))
    print(invalid_h2.is_valid())  # False가 출력되어야 함

    print("------------li 태그에 대한 테스트: 오직 텍스트만 포함------------")
    valid_li = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([Ul([Li(Text("항목"))])])]))
    print(valid_li.is_valid())  # True가 출력되어야 함

    invalid_li = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([Ul([Li([Text("항목"), Span(Text("스팬"))])])])]))
    print(invalid_li.is_valid())  # False가 출력되어야 함

    print("------------th 태그에 대한 테스트: 오직 텍스트만 포함------------")
    valid_th = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([Table([Tr([Th(Text("제목"))])])])]))
    print(valid_th.is_valid())  # True가 출력되어야 함

    invalid_th = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([Table([Tr([Th([Text("제목"), Span(Text("스팬"))])])])])]))
    print(invalid_th.is_valid())  # False가 출력되어야 함

    print("------------td 태그에 대한 테스트: 오직 텍스트만 포함------------")
    valid_td = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([Table([Tr([Td(Text("내용"))])])])]))
    print(valid_td.is_valid())  # True가 출력되어야 함

    invalid_td = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([Table([Tr([Td([Text("내용"), Span(Text("스팬"))])])])])]))
    print(invalid_td.is_valid())  # False가 출력되어야 함
    
    print("------------테스트 케이스 5: p 태그 내에 텍스트 외 다른 내용 포함------------")
    valid_p = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([P(Text("단락 텍스트"))])]))
    print(valid_p.is_valid())  # True가 출력되어야 함

    invalid_p = Page(Html([Head(Title(Text("잘못된 타이틀"))), Body([P([Text("단락 텍스트"), Span(Text("스팬"))])])]))
    print(invalid_p.is_valid())  # False가 출력되어야 함

    print("------------테스트 케이스 6: span 태그 내에 텍스트와 p 태그 혼용------------")
    valid_span = Page(Html([Head(Title(Text("타이틀"))), Body([Span([Text("텍스트"), P(Text("문단"))])])]))
    print(valid_span.is_valid())  # True가 출력되어야 함

    invalid_span = Page(Html([Head(Title(Text("잘못된 타이틀"))), Body([Span([Text("텍스트"), Div(Text("잘못된 사용"))])])]))
    print(invalid_span.is_valid())  # False가 출력되어야 함

    print("------------테스트 케이스 7: ul 태그와 ol 태그 내부 규칙 검증------------")
    print("------------ol 태그 내부 규칙 검증------------")
    # 올바른 <ol> 예시
    valid_ol = Page(Html([Head(Title(Text("타이틀"))), Body([Ol([Li(Text("항목1")), Li(Text("항목2"))])])]))
    print(valid_ol.is_valid())  # True가 출력되어야 함

    # 잘못된 <ol> 예시 (<li> 태그 없음)
    invalid_ol = Page(Html([Head(Title(Text("타이틀"))), Body([Ol([P(Text("문단"))])])]))
    print(invalid_ol.is_valid())  # False가 출력되어야 함
    print("------------ul 태그 내부 규칙 검증------------")
    # 올바른 <ul> 예시
    valid_ul = Page(Html([Head(Title(Text("타이틀"))), Body([Ul([Li(Text("항목1")), Li(Text("항목2"))])])]))
    print(valid_ul.is_valid())  # True가 출력되어야 함

    # 잘못된 <ul> 예시 (다른 태그 포함)
    invalid_ul = Page(Html([Head(Title(Text("타이틀"))), Body([Ul([Li(Text("항목1")), P(Text("문단"))])])]))
    print(invalid_ul.is_valid())  # False가 출력되어야 함

    print("------------테스트 케이스 8: <tr> 태그 규칙 검증------------")
    # 유효한 <tr> 예시 (오직 <th>만 포함)
    valid_tr_th = Page(Html([Head(Title(Text("제목"))), Body([Table([Tr([Th(Text("제목1")), Th(Text("제목2"))])])])]))
    print(valid_tr_th.is_valid())  # True 출력 예상

    # 유효한 <tr> 예시 (오직 <td>만 포함)
    valid_tr_td = Page(Html([Head(Title(Text("제목"))), Body([Table([Tr([Td(Text("데이터1")), Td(Text("데이터2"))])])])]))
    print(valid_tr_td.is_valid())  # True 출력 예상

    # 유효하지 않은 <tr> 예시 (<th>와 <td> 혼용)
    invalid_tr_mix = Page(Html([Head(Title(Text("제목"))), Body([Table([Tr([Th(Text("제목1")), Td(Text("데이터1"))])])])]))
    print(invalid_tr_mix.is_valid())  # False 출력 예상

    # 유효하지 않은 <tr> 예시 (비어있음)
    invalid_tr_empty = Page(Html([Head(Title(Text("제목"))), Body([Table([Tr([])])])]))
    print(invalid_tr_empty.is_valid())  # False 출력 예상

    print("------------테스트 케이스 9: 올바른 table 구조------------")
    valid_table = Page(Html([Head(Title(Text("타이틀"))), Body([Table([Tr(Td(Text("데이터"))), Tr(Td(Text("데이터2")))])])]))
    print(valid_table.is_valid())  # True가 출력되어야 함

    invalid_table = Page(Html([Head(Title(Text("타이틀"))), Body([Table([Tr([P(Text("잘못된 태그"))])])])]))
    print(invalid_table.is_valid())  # False가 출력되어야 함

    print("------------테스트 케이스 10: 적절한 인스턴스 프린트------------")
    valid_html = Page(Html([Head(Title(Text("올바른 타이틀"))), Body([H1(Text("제목")), P(Text("문단"))])]))
    print(valid_html.is_valid())  # True가 출력되어야 함

    invalid_html = Page(Body([H1(Text("제목")), P(Text("문단")), Head(Title(Text("잘못된 타이틀")))]))
    print(invalid_html.is_valid()) # False가 출력되어야 함
    
    print("------------테스트 케이스 11: 파일로 출력------------")
    valid_html.write_to_file("valid.html")
    invalid_html.write_to_file("invalid.html")

    print("----------eval test--------------")
    print(Page(Html([Head(), Body()])))
    #<!doctype html>
    #<html>
        #<head></head>
        # body></body>
    #</html>

    # 타이틀이 적어도 하나 있어야함
    print(Page(Html([Head(), Body()])).is_valid()) #False
    print(Page(Html([Head(Title(Text('title'))), Body()])).is_valid()) #True
    print(Page(Html([Head(Title(Text('title'))), Body(Li())])).is_valid()) #False
    print(Page(Html([Head(Title(Text('title'))),Body(Ol(Li(Text('foo'))))])).is_valid()) # True
    print(Page(Html([Head(Title(Text('title'))), Body()])).is_valid()) #True

    