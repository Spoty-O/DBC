from typing import final
from shared.interfaces.table_interface import ITableIndex
from sqlglot import ParseError, expressions


@final
class IndexParser:
    def __init__(self) -> None:
        pass

    def parse(self, value: expressions.Create) -> ITableIndex:
        astIndexNode = value.this
        if not isinstance(astIndexNode, expressions.Index):
            raise ParseError("Create node dont have index node")
        return {
            "unique": self._getUnique(value),
            "name": self._getName(astIndexNode),
            "table": self._getTable(astIndexNode),
            "columns": self._getColumns(astIndexNode),
        }

    def _getUnique(self, astNode: expressions.Create):
        return astNode.args["unique"] == True

    def _getName(self, astIndexNode: expressions.Expression):
        if not isinstance(astIndexNode.this, expressions.Identifier):
            raise ParseError("Index node dont have identifier node")
        return astIndexNode.this.name

    def _getTable(self, astIndexNode: expressions.Index):
        if not isinstance(astIndexNode.args["table"], expressions.Table):
            raise ParseError("Index node dont have table node")
        return self._getName(astIndexNode.args["table"])

    def _getColumns(self, astIndexNode: expressions.Index):
        params = astIndexNode.args["params"]
        if not isinstance(params, expressions.IndexParameters):
            raise ParseError("Index node dont have params node")
        colNames: list[str] = []
        for col in params.args["columns"]:
            if not isinstance(col, expressions.Ordered):
                raise ParseError("Index dont have ordered columns")
            if not isinstance(col.this, expressions.Column):
                raise ParseError("Index dont have ordered columns")
            colNames.append(self._getName(col.this))
        return colNames
