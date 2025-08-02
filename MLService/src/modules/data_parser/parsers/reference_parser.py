from typing import final
from sqlglot import ParseError, expressions
from shared.interfaces.table_interface import IForeignKey, IReference


@final
class ReferenceParser:
    def __init__(self) -> None:
        pass

    def parse(self, value: expressions.Reference) -> IReference:
        astSchemaNode = value.this
        if not isinstance(astSchemaNode, expressions.Schema):
            raise ParseError("Reference node dont have schema node")
        return {
            "refToTable": self._getName(astSchemaNode),
            "refToColumn": self._getColumns(astSchemaNode),
        }

    def _getName(self, astSchemaNode: expressions.Schema):
        if not isinstance(astSchemaNode.this, expressions.Table):
            raise ParseError("Schema dont have table node")
        return astSchemaNode.this.name

    def _getColumns(self, astSchemaNode: expressions.Schema):
        refToColumn: list[str] = []
        for identifier in astSchemaNode.expressions:
            if not isinstance(identifier, expressions.Identifier):
                continue
            refToColumn.append(identifier.name)
        return refToColumn
