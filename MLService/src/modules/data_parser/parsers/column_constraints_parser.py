from typing import Any, Callable, final
from sqlglot import expressions
from modules.data_parser.parsers.reference_parser import ReferenceParser
from shared.interfaces.table_interface import IColumnConstraints


@final
class ColumnConstraintsParser:
    def __init__(self, referenceParser: ReferenceParser) -> None:
        self._referenceParser = referenceParser
        self._CONSTRAINT_HANDLERS: dict[
            type, Callable[[IColumnConstraints, Any], None]
        ] = {
            expressions.UniqueColumnConstraint: self._handleUniqueConstraint,
            expressions.NotNullColumnConstraint: self._handleNullableConstraint,
            expressions.PrimaryKeyColumnConstraint: self._handlePrimaryKeyConstraint,
            expressions.DefaultColumnConstraint: self._handleDefaultConstraint,
            expressions.CheckColumnConstraint: self._handleCheckConstraint,
            expressions.Reference: self._handleReferenceConstraint,
        }

    def _handleUniqueConstraint(self, constr: IColumnConstraints, _):
        constr["unique"] = True

    def _handleNullableConstraint(self, constr: IColumnConstraints, _):
        constr["nullable"] = False

    def _handlePrimaryKeyConstraint(self, constr: IColumnConstraints, _):
        constr["nullable"] = False
        constr["unique"] = True
        constr["primaryKey"] = True

    def _handleDefaultConstraint(
        self, constr: IColumnConstraints, value: expressions.DefaultColumnConstraint
    ):
        constr["default"] = value.name

    def _handleCheckConstraint(
        self, constr: IColumnConstraints, value: expressions.CheckColumnConstraint
    ):
        predicate = value.this
        if not isinstance(predicate, expressions.Predicate):
            return
        constr["check"] = str(predicate)

    def _handleReferenceConstraint(
        self, constr: IColumnConstraints, value: expressions.Reference
    ):
        constr["references"] = self._referenceParser.parse(value)

    def parse(self, value: list[expressions.ColumnConstraint]) -> IColumnConstraints:
        colConstraints: IColumnConstraints = {
            "unique": False,
            "nullable": True,
            "primaryKey": False,
            "check": None,
            "default": None,
            "references": None,
        }
        for c in value:
            constr = c.kind
            if not isinstance(constr, expressions.Expression):
                return colConstraints
            key = type(constr)
            handler = self._CONSTRAINT_HANDLERS.get(key)
            if handler:
                handler(colConstraints, constr)
        return colConstraints
