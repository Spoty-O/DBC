FROM python:3.14.0b1-alpine3.21

WORKDIR /app/MLService

EXPOSE 8080

COPY ./MLService/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./MLService .

EXPOSE $ML_PORT

CMD [ "py", "main.py" ]