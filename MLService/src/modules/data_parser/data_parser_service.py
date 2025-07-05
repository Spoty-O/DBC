import re
import sqlglot


class DataParserService:
    def __init__(self) -> None:
        pass

    def parseSqlText(self, textList: list[str]):
        result: list[str] = []
        for text in textList:
            ast = sqlglot.parse_one(text, dialect=sqlglot.Dialects.POSTGRES)
            # ast.find('')
