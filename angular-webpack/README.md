## angular-webpack

### steps

#### step1
a. init
```shell
npm init
npm install webpack webpack-dev-server --save-dev
```

b. add and edit webpack.config.js 
```ecmascript 6

module.exports = {
    context : __dirname + '/app',
    entry : './index.js',
    output : {
        path : __dirname + '/app',
        filename : 'bundle.js'
    }
};
```
c. add index.html and index.js;   
d. run `webpack` to generate bundle.js;   
e. edit package.json like below:
```json
{
  "name": "angular-webpack",
  "version": "1.0.0",
  "description": "angular webpack demo",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node node_modules/.bin/webpack-dev-server --content-base app",
    "build": "NODE_ENV=production node node_modules/.bin/webpack && cp app/index.html dist/index.html"
  },
  "author": "wefine",
  "license": "MIT",
  "devDependencies": {
    "webpack": "^2.2.1",
    "webpack-dev-server": "^2.3.0"
  }
}
```
f. run `npm start`.

#### step2

```bash
npm install --save-dev angular
```