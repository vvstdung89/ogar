#rsync -azP --exclude 'node_modules' --exclude '.git' --exclude '.idea' ./ root@167.71.216.224:/root/media-server/
rsync -azP --exclude '.env' --exclude 'package-lock.json' --exclude 'logs/' --exclude 'node_modules' --exclude '.git' --exclude 'var/' --exclude '.idea' ./ root@139.162.54.236:/root/cryptocombat/ogar
#rsync -azP ./.env.dev root@139.162.54.236:/root/cryptocombat/ogar

# docker volume create incogito-cryptocombat-data
# docker stop incognito-cryptocombat-ogar && docker rm incognito-cryptocombat-ogar
# docker build -t incognito/ogar .
# docker run -d --name incognito-cryptocombat-ogar --mount source=incognito-cryptocombat-ogar,target=/data -p 4438:4438 -p 4538:8888 incognito/ogar:latest
