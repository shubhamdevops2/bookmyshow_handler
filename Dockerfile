# pulling the docker public image
FROM node:current-alpine3.16

# Changing the working directory to /app location
WORKDIR /app

# Copy the package.json and lock file 
COPY ["package.json", "package-lock.json*" ,  "./"]

# Install the libraries
RUN npm install

# Copy the other configuration files
COPY . .

# start the container
CMD [ "node", "index.js" ]