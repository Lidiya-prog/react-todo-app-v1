# Используйте Node.js image как базовый образ
FROM node:18

# Установка зависимостей для Puppeteer
RUN apt-get update && \
    apt-get install -y \
    chromium \
    libgtk-3-0 \
    libgbm1

WORKDIR /usr/src/app

COPY . .

RUN npm install -g lighthouse

# проверка на ошибки — отключена
RUN export DOCKER_SCAN_SUGGEST=false
# порт для внешнего доступа
EXPOSE ${PORT}

CMD npm run dev && npm run test