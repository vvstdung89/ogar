FROM node:15

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE 4438

CMD bash /usr/src/app/run.sh
