from typing import Any, Callable, Self, final
from sqlglot import expressions
from modules.data_parser.parsers.reference_parser import ReferenceParser
from shared.interfaces.table_interface import IForeignKey, ITableConstraints


class DataStore:
    def __init__(self) -> None:
        self.constr: dict[str, ITableConstraints] = {}
        self.foreignKeys: list[IForeignKey] = []

    def addConstraint(self, key: str, value: ITableConstraints):
        constrDict = self.constr.setdefault(key, {})
        constrDict.update(value)

    def addForeignKey(self, value: IForeignKey):
        self.foreignKeys.append(value)


@final
class TableConstraintsParser:
    def __init__(self, referenceParser: ReferenceParser) -> None:
        self._referenceParser = referenceParser
        self._CONSTRAINT_HANDLERS: dict[type, Callable[[Any, DataStore], None]] = {
            expressions.UniqueColumnConstraint: self._parseUniqueConstraint,
            expressions.PrimaryKey: self._parsePrimaryKey,
            expressions.CheckColumnConstraint: self._parseCheckConstraint,
            expressions.ForeignKey: self._parseForeignKey,
        }

    def _parsePrimaryKey(self, value: expressions.PrimaryKey, store: DataStore):
        for expr in value.expressions:
            if not isinstance(expr, expressions.Ordered):
                continue
            col = expr.this
            if not isinstance(col, expressions.Column):
                continue
            identifier = col.this
            if not isinstance(identifier, expressions.Identifier):
                continue
            colName = identifier.name
            constraintDict: ITableConstraints = {
                "nullable": False,
                "unique": True,
                "primaryKey": True,
            }
            store.addConstraint(colName, constraintDict)

    def _parseUniqueConstraint(
        self, value: expressions.UniqueColumnConstraint, store: DataStore
    ):
        schema = value.this
        if not isinstance(schema, expressions.Schema):
            return
        for expr in schema.expressions:
            if not isinstance(expr, expressions.Identifier):
                continue
            colName = expr.name
            store.addConstraint(colName, {"unique": True})

    def _parseCheckConstraint(
        self, value: expressions.CheckColumnConstraint, store: DataStore
    ):
        predicate = value.this
        if not isinstance(predicate, expressions.Predicate):
            return
        col = predicate.this
        if not isinstance(col, expressions.Column):
            return
        identifier = col.this
        if not isinstance(identifier, expressions.Identifier):
            return
        colName = identifier.name
        store.addConstraint(colName, {"check": str(predicate)})

    def _parseForeignKey(self, value: expressions.ForeignKey, store: DataStore):
        colNames: list[str] = []
        for expr in value.expressions:
            if not isinstance(expr, expressions.Identifier):
                continue
            colNames.append(expr.name)
        reference = value.args["reference"]
        if not isinstance(reference, expressions.Reference):
            return
        parsedReference = self._referenceParser.parse(reference)
        res: IForeignKey = {"refFromColumn": colNames, **parsedReference}
        store.addForeignKey(res)

    def parse(
        self, value: list[expressions.Expression]
    ) -> tuple[dict[str, ITableConstraints], list[IForeignKey]]:
        store = DataStore()
        for constraint in value:
            key = type(constraint)
            handler = self._CONSTRAINT_HANDLERS.get(key)
            if handler:
                handler(constraint, store)
        return store.constr, store.foreignKeys
