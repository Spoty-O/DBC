from modules.data_parser.data_parser_service import DataParserService
from modules.data_parser.parsers.column_constraints_parser import (
    ColumnConstraintsParser,
)
from modules.data_parser.parsers.column_parser import ColumnParser
from modules.data_parser.parsers.column_type_parser import ColumnTypeParser
from modules.data_parser.parsers.reference_parser import ReferenceParser
from modules.data_parser.parsers.index_parser import IndexParser
from modules.data_parser.parsers.table_constraints_parser import TableConstraintsParser
from modules.data_parser.parsers.table_parser import TableParser


class DataParserModule:
    def __init__(self) -> None:
        self.__columnTypeParser = ColumnTypeParser()
        self.__referenceParser = ReferenceParser()
        self.__columnConstraintsParser = ColumnConstraintsParser(self.__referenceParser)
        self.__columnParsper = ColumnParser(
            self.__columnTypeParser, self.__columnConstraintsParser
        )
        self.__tableConstraintsParser = TableConstraintsParser(self.__referenceParser)
        self.__tableParser = TableParser(
            self.__columnParsper, self.__tableConstraintsParser
        )
        self.__indexParser = IndexParser()
        self.__dataParserService = DataParserService(
            self.__tableParser, self.__indexParser
        )

    @property
    def service(self) -> DataParserService:
        return self.__dataParserService
