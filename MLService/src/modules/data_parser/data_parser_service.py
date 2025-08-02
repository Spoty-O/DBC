from typing import final
from sqlglot import ErrorLevel, parse, expressions, Dialects
from modules.data_parser.parsers.index_parser import IndexParser
from modules.data_parser.parsers.table_parser import TableParser
from shared.interfaces.table_interface import ITable, ITableIndex


@final
class DataParserService:
    def __init__(self, tableParser: TableParser, indexParser: IndexParser) -> None:
        self._tableParser = tableParser
        self._indexParser = indexParser

    def _sortExpressions(self, astList: list[expressions.Expression | None]):
        tables: list[expressions.Create] = []
        indices: list[expressions.Create] = []
        for ast in astList:
            if not isinstance(ast, expressions.Create):
                continue
            if isinstance(ast.this, expressions.Schema):
                tables.append(ast)
            if isinstance(ast.this, expressions.Index):
                indices.append(ast)
        return tables, indices

    def _indicesToDict(self, indices: list[expressions.Create]):
        indicesDict: dict[str, list[ITableIndex]] = {}
        for index in indices:
            indexObj = self._indexParser.parse(index)
            indicesDict.setdefault(indexObj["table"], []).append(indexObj)
        return indicesDict

    def parse(self, value: str) -> list[ITable]:
        tables: list[ITable] = []
        try:
            astList = parse(
                value,
                dialect=Dialects.POSTGRES,
                error_level=ErrorLevel.RAISE,
                error_message_context=20,
            )
            astTables, indices = self._sortExpressions(astList=astList)
            indicesDict = self._indicesToDict(indices)
            for astTable in astTables:
                table = self._tableParser.parse(astTable)
                table["indices"] = indicesDict.get(table["name"], [])
                tables.append(table)
        except Exception as e:
            print(e)
        return tables
