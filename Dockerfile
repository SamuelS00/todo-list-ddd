FROM node:14

RUN npm install -g @nestjs/cli@8.2.5 npm@8.5.5

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
