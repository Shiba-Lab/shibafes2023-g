FROM python:3.11-bullseye

RUN apt update && apt install -y \
    vim less locales \
    && apt clean

RUN localedef -f UTF-8 -i ja_JP ja_JP.UTF-8

ENV LANG ja_jp.UTF-8
ENV LANGUAGE ja_jp:ja
ENV LC_ALL ja_jp.UTF-8
ENV TZ JST-9

# ワーキングディレクトリを作成 & ファイルコピー
RUN mkdir -p /root/src
COPY requirements.txt /root/src
WORKDIR /root/src

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN pip install -r requirements.txt


RUN mkdir -p /root/hotreload
COPY hotreload.py /root/hotreload

CMD ["python", "/root/hotreload/hotreload.py"]