# Use an official Node.js runtime as a parent image
#FROM hub.vtcc.vn:8989/node
FROM node:latest as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
#RUN npm config set https-proxy http://proxy.cyberspace.vn:3128
RUN npm install
# copy files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# Build the Vite project
RUN npm run build

# Expose the port if your application runs on a specific port
EXPOSE 4173

# Command to run your application (if it's a server)
# CMD ["npm", "start"]




# For a static site, you might use a simple HTTP server like serve
# Install serve globally: RUN npm install -g serve
# CMD ["serve", "-s", "dist"]

# Or if you are using Vite preview, uncomment and use the following:
CMD ["npm", "run", "preview"]

# Or if your application is just static files, you can use Nginx
# FROM nginx:alpine
# COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]