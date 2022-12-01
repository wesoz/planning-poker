FROM 061762394754.dkr.ecr.sa-east-1.amazonaws.com/omega-base-images:node-12.14.1

# Copy nginx files
WORKDIR /etc/nginx/conf.d

COPY ./api/deploy/nginx/proxy.conf . 

COPY ./api/deploy/nginx/http.conf .

COPY ./api/deploy/nginx/https.conf .

RUN mkdir -p /home/planning-poker/api/node_modules && chown -R node:node /home/planning-poker/api

WORKDIR /home/planning-poker/api

COPY ./package.json ./
COPY ./lerna.json  ./

COPY api/ ./

RUN npm cache clean --force

RUN npm i

RUN npm run bootstrap

COPY ./api/deploy/docker-entrypoint.sh ./

RUN chmod +x ./docker-entrypoint.sh

RUN npm run build

# Copy node entrypoint and exposes port
EXPOSE 80 443

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["npm", "run", "start:prod"]