from pathlib import Path
from shared.types.file_type import TFiles, TSaveMode


class FileManagerService:
    _dataDirPath: Path

    def __init__(self) -> None:
        self._dataDirPath = Path(__file__).resolve().parents[3] / "data"
        Path.mkdir(self=self._dataDirPath, exist_ok=True)

    def save(self, file: TFiles, data: str | list[str], mode: TSaveMode):
        if isinstance(data, list):
            data = "\n".join(data)
        f = open(file=self._dataDirPath / file, mode=mode, encoding="utf-8")
        f.write(data)
        f.close()

    def read(self, file: TFiles):
        f = open(self._dataDirPath / file, "r", encoding="utf-8")
        res = f.read()
        f.close()
        return res
