echo "Removing old files..."
rm -rf public/*
echo "Putting in new ones..."
cp -rv app/* public/
echo "Correcting paths..."
cd public
sed -i -e 's/bower_components\/jquery\/dist\/jquery.js/https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/jquery\/3.2.1\/jquery.js/g' index.html
sed -i -e 's/bower_components\/angular\/angular.js/https:\/\/ajax.googleapis.com\/ajax\/libs\/angularjs\/1.6.4\/angular.min.js/g' index.html
sed -i -e 's/bower_components\/bootstrap\/dist\/js\/bootstrap.js/https:\/\/maxcdn.bootstrapcdn.com\/bootstrap\/3.3.7\/js\/bootstrap.min.js/g' index.html
sed -i -e 's/bower_components\/angular-animate\/angular-animate.js/https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/angular.js\/1.6.4\/angular-animate.js/g' index.html
sed -i -e 's/bower_components\/angular-cookies\/angular-cookies.js/https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/angular.js\/1.6.4\/angular-cookies.js/g' index.html
sed -i -e 's/bower_components\/angular-resource\/angular-resource.js/https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/angular.js\/1.6.4\/angular-resource.js/g' index.html
sed -i -e 's/bower_components\/angular-route\/angular-route.js/https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/angular.js\/1.6.4\/angular-route.js/g' index.html
sed -i -e 's/bower_components\/angular-sanitize\/angular-sanitize.js/https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/angular.js\/1.6.4\/angular-sanitize.js/g' index.html
sed -i -e 's/bower_components\/angular-touch\/angular-touch.js/https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/angular.js\/1.6.4\/angular-touch.js/g' index.html
sed -i -e 's/bower_components\/bootstrap\/dist\/css\/bootstrap.css/https:\/\/maxcdn.bootstrapcdn.com\/bootstrap\/3.3.7\/css\/bootstrap.min.css/g' index.html
cd ..
echo "And deploying..."
firebase deploy
