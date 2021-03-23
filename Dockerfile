FROM node:14

# Create app directory
WORKDIR /usr/src/app

EXPOSE 4438
EXPOSE 8888

CMD bash /usr/src/app/run.sh

WORKDIR /cigar
COPY . .

RUN npm install -g pm2

RUN cd /cigar/GameStat \
    && npm install

RUN cd /cigar/src \
    && npm install

# Set the default command to execute
# when creating a new container
CMD bash /cigar/run.sh
