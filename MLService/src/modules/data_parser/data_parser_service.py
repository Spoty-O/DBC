import re
import sqlglot


class DataParser:
    __pattern: re.Pattern

    def __init__(self) -> None:
        self.__pattern = re.compile(
            r"CREATE\s+TABLE\s+[\w\.]+\s*\((?:[^)(]*|\([^)(]*\))*\)",
            re.IGNORECASE | re.DOTALL,
        )

    def parseSqlTextToObject(self, textList: list[str]):
        result: list[str] = []
        for text in textList:
            clearSQL = re.findall(self.__pattern, text)
            for sqlText in clearSQL:
                parsed = sqlglot.parse_one(sqlText, dialect=sqlglot.Dialects.MYSQL)
                print(parsed.to_py())
