from typing import final
from sqlglot import ParseError, expressions
from shared.interfaces.table_interface import IColumnType


@final
class ColumnTypeParser:
    def __init__(self) -> None:
        pass

    def parse(self, value: expressions.DataType) -> IColumnType:
        return {
            "name": self._getName(value),
            "parameters": self._getParameters(value),
        }

    def _getName(self, astNode: expressions.DataType):
        if not isinstance(astNode.this, expressions.DataType.Type):
            raise ParseError("Error parsing name of column type")
        return astNode.this.name

    def _getParameters(self, astNode: expressions.DataType):
        paramValues: list[str] = []
        for p in astNode.expressions:
            if not isinstance(p, expressions.DataTypeParam):
                continue
            paramValues.append(p.name)
        return paramValues
