FROM python:3.6.2
MAINTAINER Ivan Prlić <iprlic@gmail.com>
LABEL Name="airhack app container" \
      Version=0.1.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY Pipfile /usr/src/app/Pipfile
COPY Pipfile.lock /usr/src/app/Pipfile.lock
RUN pip3 install pipenv==8.2.7
RUN cd /usr/src/app
RUN pipenv install --dev --three --system
COPY . /usr/src/app
RUN chmod +x gecko.py
