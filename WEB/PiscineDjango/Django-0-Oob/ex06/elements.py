from elem import Elem, Text

class Html(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='html', content=content, attr=attr, tag_type='double')

class Head(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='head', content=content, attr=attr, tag_type='double')

class Body(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='body', content=content, attr=attr, tag_type='double')

class Title(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='title', content=content, attr=attr, tag_type='double')

class Meta(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='meta', content=content, attr=attr, tag_type='double')

class Img(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='img', content=content, attr=attr, tag_type='simple')

class Table(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='table', content=content, attr=attr, tag_type='double')

class Th(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='th', content=content, attr=attr, tag_type='double')

class Tr(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='tr', content=content, attr=attr, tag_type='double')

class Td(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='td', content=content, attr=attr, tag_type='double')

class Ul(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='ul', content=content, attr=attr, tag_type='double')

class Ol(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='ol', content=content, attr=attr, tag_type='double')

class Li(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='li', content=content, attr=attr, tag_type='double')

class H1(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='h1', content=content, attr=attr, tag_type='double')

class H2(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='h2', content=content, attr=attr, tag_type='double')

class P(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='p', content=content, attr=attr, tag_type='double')

class Div(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='div', content=content, attr=attr, tag_type='double')

class Span(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='span', content=content, attr=attr, tag_type='double')

class Hr(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='hr', content=content, attr=attr, tag_type='double')

class Br(Elem) :
    def __init__(self, content=None, attr={}):
        super().__init__(tag='br', content=content, attr=attr, tag_type='double')

if __name__ == '__main__':
    print("------------test1------------")
    print(Html([Head(), Body()]))
    print("------------test2------------")
    html_page = Html(content=[
                Head(content=Title(content=Text('"Hello ground!"'))),
                Body(content=[H1(content=Text('"Oh no, not again!"')),
                              Img(attr={'src': 'http://i.imgur.com/pfp3T.jpg'})])])
    print(html_page)


