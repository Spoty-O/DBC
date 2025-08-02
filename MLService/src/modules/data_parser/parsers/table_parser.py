from typing import final
from sqlglot import ParseError, expressions
from modules.data_parser.parsers.column_parser import ColumnParser
from modules.data_parser.parsers.table_constraints_parser import TableConstraintsParser
from shared.interfaces.table_interface import IColumn, ITable, ITableConstraints


@final
class TableParser:
    def __init__(
        self, columnParser: ColumnParser, constraintsParser: TableConstraintsParser
    ) -> None:
        self._columnParser = columnParser
        self._constraintsParser = constraintsParser

    def parse(self, value: expressions.Create) -> ITable:
        astSchemaNode = value.this
        if not isinstance(astSchemaNode, expressions.Schema):
            raise ParseError(("Create node dont have schema node"))
        cols, constr = self._sortExpressions(astSchemaNode.expressions)
        tableConstr, foreignKeys = self._constraintsParser.parse(constr)
        return {
            "name": self._getName(astSchemaNode),
            "columns": self._getColumns(cols, tableConstr),
            "foreignKeys": foreignKeys,
            "indices": [],
        }

    def _getName(self, astSchemaNode: expressions.Schema):
        if not isinstance(astSchemaNode.this, expressions.Table):
            raise ParseError("Schema dont have table node")
        return astSchemaNode.this.name

    def _getColumns(
        self,
        value: list[expressions.ColumnDef],
        tableConstr: dict[str, ITableConstraints],
    ):
        columns: list[IColumn] = []
        for col in value:
            parsedColumn = self._columnParser.parse(value=col)
            constrByTable = tableConstr.get(parsedColumn["name"], {})
            parsedColumn["constraints"].update(constrByTable)
            columns.append(parsedColumn)
        return columns

    def _sortExpressions(self, astExpressions: list[expressions.Expression]):
        cols: list[expressions.ColumnDef] = []
        constr: list[expressions.Expression] = []
        for exp in astExpressions:
            if isinstance(exp, expressions.ColumnDef):
                cols.append(exp)
            else:
                constr.append(exp)
        return cols, constr
