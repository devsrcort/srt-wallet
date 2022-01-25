# Alpine Linux-based, tiny Node container:
FROM node:12-alpine3.9 as base

ADD ./ /opt/app
WORKDIR /opt/app

USER root

RUN rm -rf node_modules \
 && chown -R node /opt/app

# USER node

FROM base as release

USER root
RUN npm install --only=production \
 #&& apk add --no-cache tini \
 && npm run build \
 && chown -R node /opt/app

# USER node
ENV HOME_DIR=/opt/app \
    NODE_ENV=production \
    PORT=5503

ENTRYPOINT npm run start

FROM base as build

USER root
RUN npm install -g nodemon \
 && npm install \
 && npm run build \
 && chown -R node /opt/app

# USER node

ENTRYPOINT npm run start
