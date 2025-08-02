from typing import TypedDict


class IColumnType(TypedDict):
    name: str
    parameters: list[str]


class IReference(TypedDict):
    refToTable: str
    refToColumn: list[str]


class IForeignKey(IReference):
    refFromColumn: list[str]


class IColumnConstraints(TypedDict):
    unique: bool
    nullable: bool
    primaryKey: bool
    default: str | None
    check: str | None
    references: IReference | None


class ITableConstraints(TypedDict, total=False):
    unique: bool
    nullable: bool
    primaryKey: bool
    default: str | None
    check: str | None
    references: IReference | None


class IColumn(TypedDict):
    name: str
    type: IColumnType
    constraints: IColumnConstraints


class ITableIndex(TypedDict):
    unique: bool
    name: str
    table: str
    columns: list[str]


class ITable(TypedDict):
    name: str
    columns: list[IColumn]
    foreignKeys: list[IForeignKey]
    indices: list[ITableIndex]
