FROM node:lts-slim as builder
COPY package.json /opt/app/package.json
COPY yarn.lock /opt/app/yarn.lock
RUN cd /opt/app && yarn install
COPY . /opt/app
RUN cd /opt/app && npm run build -- --configuration production

FROM nginx:stable-alpine
COPY --from=builder /opt/app/dist/obex /usr/share/nginx/html
RUN echo 'server { listen 80; server_name  localhost; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
