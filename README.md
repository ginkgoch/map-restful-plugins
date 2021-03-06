# Map Plugins
This project is a show case and a plugin template for [Ginkgoch Map Library](https://ginkgoch.com/) and predefined mapping RESTful APIs on KOA framework [koa-map-router](https://github.com/ginkgoch/koa-map-router) project.

Plugins are allowed to load customized map instances with you your plugin file. Follow the steps below to create your own plugins.
This project includes a `workshop` map. Visit [this page](http://ec2-3-135-237-227.us-east-2.compute.amazonaws.com:3000/docs/) that hosts this map on AWS.

> NOTE: [This demo](http://ec2-3-135-237-227.us-east-2.compute.amazonaws.com:3000/docs/) is hosted on `AWS EC2 Free Tier` instance. Should be higher performance locally with multiple cores.

## Launch workshop map server

```bash
git clone https://github.com/ginkgoch/map-restful-plugins.git
cd map-restful-plugins
npm i
npm start serve
```

Visit [http://localhost:3000/docs](http://localhost:3000/docs).

![index.png](docs/index.png)

## Create your own map plugin
Creating a new plugin is easy. Just follow few steps below.
1. Copy the plugin template as your own plugin file. `cp plugin.js.template my-map-plugin.js` 
2. Update the plugin code with your own data and styles
3. Re-boot `map-restful-cli` by command `map-restful serve -e .` 

The server automatically discovers the plugins and load it. The map engine name will be used as the identification in the RESTful route. More API reference could refer [koa-map-router](https://github.com/ginkgoch/koa-map-router) project; and more `map-restful-cli` command options could refer [map-restful-cli](https://github.com/ginkgoch/map-restful-cli) project.

## Next target
Define an easy-to-read JSON schema and support to load maps dynamically from files without writing plugins.
