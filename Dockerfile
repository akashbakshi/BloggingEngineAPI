FROM node:12 AS build
WORKDIR /app

ENV NODE_ENV=Production
COPY . /app
RUN npm install
RUN npm run build


FROM node:12
WORKDIR /app
COPY --from=build /app ./
RUN ls
CMD ./scripts/start.sh
