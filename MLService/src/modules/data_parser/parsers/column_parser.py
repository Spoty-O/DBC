from typing import final
from sqlglot import expressions, ParseError
from modules.data_parser.parsers.column_constraints_parser import (
    ColumnConstraintsParser,
)
from modules.data_parser.parsers.column_type_parser import ColumnTypeParser
from shared.interfaces.table_interface import IColumn


@final
class ColumnParser:
    def __init__(
        self, typeParser: ColumnTypeParser, constraintsParser: ColumnConstraintsParser
    ) -> None:
        self._typeParser = typeParser
        self._constraintsParser = constraintsParser

    def parse(self, value: expressions.ColumnDef) -> IColumn:
        if not isinstance(value.kind, expressions.DataType):
            raise ParseError("Column expr dont have DataType node")
        return {
            "name": value.name,
            "type": self._typeParser.parse(value.kind),
            "constraints": self._constraintsParser.parse(value.constraints),
        }
