import random
from shared.interfaces.table_interface import (
    IColumn,
    IForeignKey,
    ITable,
)
import wordninja


class BRDescriberService:
    def __init__(self) -> None:
        pass

    def describe(self, value: ITable) -> str:
        return self._describeTable(value)

    def _describeTable(self, value: ITable) -> str:
        descriptions: list[str] = []
        table = (" ".join(wordninja.split(value["name"]))).lower()
        attributes, references, colDict = self._describeColumns(value["columns"])
        tableReferences = self._describeForeignKeys(value["foreignKeys"], colDict)
        references.extend(tableReferences)
        attributes = ", ".join(attributes)
        descriptions.append(f"Each {table} has {attributes}.")
        for reference in references:
            descriptions.append(f"{reference} {table}.")
        random.shuffle(descriptions)
        result = " ".join(descriptions)
        return result

    def _describeColumns(self, value: list[IColumn]):
        attributes: list[str] = []
        references: list[str] = []
        colDict: dict[str, IColumn] = {}
        for col in value:
            name = (" ".join(wordninja.split(col["name"]))).lower()
            attributes.append(name)
            ref = self._describeReference(col)
            if ref:
                references.append(ref)
            colDict[col["name"]] = col
        return attributes, references, colDict

    def _describeReference(self, value: IColumn) -> str | None:
        constraints = value["constraints"]
        reference = constraints["references"]
        if not reference:
            return None
        quantifier = "Some" if constraints["nullable"] else "Each"
        table = (" ".join(wordninja.split(reference["refToTable"]))).lower()
        relationship = "have one" if constraints["unique"] else "have many"
        return f"{quantifier} {table} {relationship}"

    # Need think about composite key, only first value used
    def _describeForeignKeys(self, value: list[IForeignKey], cols: dict[str, IColumn]):
        result: list[str] = []
        for reference in value:
            col = cols.get(reference["refFromColumn"][0])
            if not col:
                continue
            constraints = col["constraints"]
            quantifier = "Some" if constraints["nullable"] else "Each"
            table = (" ".join(wordninja.split(reference["refToTable"]))).lower()
            relationship = "have one" if constraints["unique"] else "have many"
            result.append(f"{quantifier} {table} {relationship}")
        return result
