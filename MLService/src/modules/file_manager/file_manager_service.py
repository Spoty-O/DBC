from pathlib import Path

from shared.types.file_type import TFiles


class FileManagerService:
    data_dir: Path

    def __init__(self) -> None:
        self.data_dir = Path(__file__).resolve().parents[3] / "data"

    def save(self, file: TFiles, data: str):
        f = open(self.data_dir / file, "a", encoding="utf-8")
        f.write(data)
        f.close()

    def read(self, file: TFiles):
        f = open(self.data_dir / file, "r", encoding="utf-8")
        res = f.read()
        f.close()
        return res
