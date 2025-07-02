from fastapi import FastAPI
from .config.env_config import EnvironmentConfig, get_env
import uvicorn

app = FastAPI()

if __name__ == "__main__":
    env: EnvironmentConfig = get_env()
    uvicorn.run(app=app, port=env.ML_PORT, reload=env.isDevMode)
