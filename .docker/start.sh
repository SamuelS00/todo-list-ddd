

#!/bin/bash

echo "----------- Starting @core configs -----------"

if [ ! -f "./src/@core/.env.test" ]; then
    cp ./src/@core/.env.test.example ./src/@core/.env.test
fi

echo "----------- Starting nestjs configs -----------"

if [ ! -f "./src/nestjs/.env" ]; then
    cp ./src/nestjs/.env.example ./src/nestjs/.env
fi

if [ ! -f "./src/nestjs/.env.test" ]; then
    cp ./src/nestjs/.env.test.example ./src/nestjs/.env.test
fi

if [ ! -f "./src/nestjs/.env.e2e" ]; then
    cp ./src/nestjs/.env.e2e.example ./src/nestjs/.env.e2e
fi

npm install

echo "----------- Building @core -----------"

npm run build -w @fc/micro-videos

tail -f /dev/null

#npm run start:dev