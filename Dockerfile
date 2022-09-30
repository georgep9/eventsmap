FROM node:12

# Expose port to outside world
EXPOSE 3000

# Copy app source
COPY . /src

# Set working directory to /src
WORKDIR /src

# Install app dependencies
RUN npm install

# start command as per package.json
CMD ["npm", "start"]