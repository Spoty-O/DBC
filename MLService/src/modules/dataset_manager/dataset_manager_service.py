import csv
from pathlib import Path
from shared.types.file_type import TFiles, TSaveMode
import pandas as pd


class DatasetManagerService:
    _dataDirPath: Path

    def __init__(self) -> None:
        self._dataDirPath = Path(__file__).resolve().parents[3] / "data"
        Path.mkdir(self=self._dataDirPath, exist_ok=True)

    def save(self, file: TFiles, data: dict, mode: TSaveMode):
        df = pd.DataFrame(data)
        write_header = not (self._dataDirPath / file).exists() or mode != "a"
        df.to_csv(
            path_or_buf=self._dataDirPath / file,
            mode=mode,
            index=False,
            header=write_header,
            quoting=csv.QUOTE_ALL,
            lineterminator="\n",
        )

    def read(self, file: TFiles):
        df = pd.read_csv(filepath_or_buffer=file)
        return df
