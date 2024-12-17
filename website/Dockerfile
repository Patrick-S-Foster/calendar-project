FROM node:23.4.0-alpine3.20 AS build

WORKDIR /usr/src/app

RUN npm install -g @angular/cli@19.0.1
RUN npm install -g @angular-devkit/build-angular@18.2.12

COPY package*.json .

RUN npm install

COPY . .

RUN ng build

FROM nginx:1.27.3

COPY --from=build /usr/src/app/dist/calendar/browser /app
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf