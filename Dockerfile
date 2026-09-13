FROM node:lts-alpine

ADD . /app/
WORKDIR /app

RUN yarn

EXPOSE 8000

CMD ["yarn", "start"]
