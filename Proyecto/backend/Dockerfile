FROM python:3.9
WORKDIR /code

# Configura el PYTHONPATH
ENV PYTHONPATH=/code/app

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt python-dotenv

COPY ./.env /code/.env

COPY ./app /code/app
EXPOSE 8000	
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]