# LifeScope Embed Server

This is a modified version of the self-hosted version of [Iframely's](https://github.com/itteco/iframely) APIs and parsers. It has been changed to only allow authenticated LifeScope users to use its core functionality. 

Iframely gives your fast and simple API for responsive web embeds and semantic meta. The parsers cover well [over 1800 domains](https://iframely.com/domains) through 200+ custom domain plugins and generic support for [oEmbed](http://oembed.com/), [Open Graph](http://ogp.me/) and [Twitter Cards](https://dev.twitter.com/docs/cards), that are powered by Iframely's whitelist. 

The whitelist file is pulled from iframely.com database and is updated automatically. The whitelisting is manual process on our end. You can also [have your own whitelist](https://iframely.com/docs/whitelist-format) file. 

HTTP APIs are available in [oEmbed](https://iframely.com/docs/oembed-api) or [Iframely API](https://iframely.com/docs/iframely-api) formats. To make it simple to understand, Iframely format mimics the `<head>` section of the page with its `meta` and `links` elements.

In response to `url` request, APIs returns you the embeds and meta for a requested web page. Below are data samples from [hosted API](https://iframely.com), just to show you the format:

## Running the server

After installing the required node dependencies with npm or yarn, run

```
npm run serve
```

or, to run in dev mode

```
npm run serve-dev
```

# Building and running LifeScope embed server in a cloud production environment
Once you have a MongoDB cluster running and have set up a BitScoop account, created maps for all of the services, and saved the credentials for that service in its respective Map, you have everything you need to run the API.
The embed server was designed to be uploaded and run via Kubernetes. To date it has only been tested on AWS' Elastic Kubernetes Service (and locally on minikube).
All further instructions will assume AWS technologies since we can speak to them; using another cloud provider should
work similarly, just with appropriate deviations to account for how Google/Microsoft/etc. clouds work in practice. 

## Location of Kubernetes scripts

This guide references Kubernetes configuration scripts. 
These scripts are all located in [a separate repository](https://github.com/lifescopelabs/lifescope-kubernetes).

## Create config file
You'll need to create a new file in the config folder called config.production.js.
The gitignore contains this filename, so there's no chance of accidentally committing it.

This new config file only needs a few lines, because config setup first pulls everything from 'config.js' and then overrides anything that it finds in other config files it uses.
The config file should look like this:

```
module.exports = {
  "mongo": {
	"address": "<insert address>"
  }
}
```

## Obtain SSL certificate
IF you want your server to be secure, you'll need to purchase a domain name and then register the domain or subdomain 
that you want to use for LifeScope with Amazon Certificate Manager.

## Install node_modules
Run npm install or yarn install (npm or yarn must already be installed).

#Set up DockerHub account, containerize embed-server via Docker, and run in a Kubernetes Cluster
The LifeScope embed-server can be run in a Kubernetes Cluster via containerizing the code with Docker and uploading the image to DockerHub.

## Set up DockerHub account and install Docker on your machine
This guide will not cover how to set up a DockerHub account or a local copy of Docker since the instructions provided 
by the makers of those services are more than sufficient.
Once you've created a DockerHub account, you'll need to make a public repository, most easily named ```lifescope-embed```. 
If you use different names, you'll have to change the image names in the various .yaml files in the /kube/* directories.

## Containerize the Embed server with Docker (optional)

*LifeScope has a Docker Hub account with repositories for images of each of the applications that make up the service.
The Kubernetes scripts are coded to pull specific versions from the official repos.
If you want to pull from a repo you control, do the following:*

After installing Docker on your machine, from the top level of this application run ```docker build -t <DockerHub username>/lifescope-embed:vX.Y.Z .```.
X,Y, and Z should be the current version of the embed-server, though it's not required that you tag the image with a version.

You'll then need to push this image to DockerHub so that the Kubernetes deployment can get the proper image.
Within prod/lifescope-embed.yaml, you'll see a few instances of an image name that points to an image name, something along
the lines of lifescope/lifescope-embed:v1.1.0. Each instance of this will need to be changed to <DockerHub username>/<public repo name>:<version name>.
For example, if your username is 'cookiemonstar' and you're building v1.1.3 of the embed server, you'd change the 'image' field 
wherever it occurs in prod/lifescope-embed.yaml to ```cookiemonstar/lifescope-embed:v1.1.3```.
This should match everything following the '-t' in the build command.

Once the image is built, you can push it to DockerHub by running ```docker push <imagename>```, e.g. ```docker push cookiemonstar/lifescope-api:v1.1.3```.
You're now ready to deploy the Kubernetes cluster

## Deploy Kubernetes cluster
This guide is copied almost verbatim in lifescope-app and lifescope-api, so if you've already set up those, you can skip straight to
running the lifescope-embed Kubernetes script.

### Install eksctl and create Fargate cluster
Refer to [this guide](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html) for how to set up
eksctl.

To provision the Fargate cluster, run ```eksctl create cluster -f kube/prod/aws-cluster.yaml```

### Run Nginx script and provision DNS routing to Load Balancer

From the top level of this repo, run ```kubectl apply -f kube/prod/nginx.yaml```.
This will install nginx in your K8s cluster. After a minute or so the Load Balancer that is set up will have provisioned
an external IP, which you can get by running ```kubectl get service -n nginx-ingress``` and looking in the column 'EXTERNAL-IP'.

This external IP will need to be used in a few places.

First, go to [AWS Route53 -> Hosted zones](https://console.aws.amazon.com/route53/home?#hosted-zones:).
Create a Hosted Zone for the top-level domain you're using.
Within that, create a Record Set. The Name can be left blank, Type should be 'A - IPv4 address', set Alias to 'Yes',
and under Alias Target enter 'dualstack.<external-IP>' (if you click on the text box for Alias Target, a prompt scrollable box
should pop up with various resources you have in AWS; the Load Balancer for Nginx should be under 'ELB Classic load balancers'
and if clicked on it should autocomplete everything properly). Click Create when this is all entered.

Next, you'll need to make a CNAMEs with your domain registrar from 'embed' to the external IP.

### Create 'lifescope' namespace

Run the following command to create a namespace called 'lifescope' in the Kubernetes cluster:
```kubectl apply -f kube/prod/lifescope-namespace.yaml```

### Create appropriate secret config

The config files containing credentials for development and production environments are intentionally not committed.
They are also ignored by Docker when building the image so that they don't end up in a publicly-available image.
In order to get these files into the Kubernetes environment, you must package them into a Secret.
This Secret must be created manually instead of being part of the overall deployment in kube/**/lifescope-embed.yaml
and must be applied before running the deployment script.

Your config files should be located in the config/ directory, e.g. config/dev.json or config/production.json.
Run the following command to create the secret:
```kubectl create secret generic lifescope-embed-dev-config -n lifescope --from-file=config.dev.js```
or
```kubectl create secret generic lifescope-embed-prod-config -n lifescope --from-file=config.production.js```

The later deployment script expects those exact names, so if you want to call them something else, you'll have to
change kube/**/lifescope-embed.yaml.

### Run API K8s script

From the top level of this repo, run ```kubectl apply -f kube/prod/lifescope-embed.yaml```.

If this ran properly, you should be able to go to embed.<domain> and be redirected to the main page for iframely. 
