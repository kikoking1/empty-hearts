#install node and npm
cd /home/ubuntu/
curl -sL https://deb.nodesource.com/setup_19.x -o /tmp/nodesource_setup.sh
bash /tmp/nodesource_setup.sh
rm /tmp/nodesource_setup.sh
apt-get install -y nodejs
apt-get install jq -y
sudo apt install sqlite3

#build react app
cd /home/ubuntu/apps/empty-hearts-app/empty-hearts/client
npm i
npm run build

#install nginx and configure to serve react app. Also configure nginx to proxy api calls to dotnet app. Then start nginx
apt install nginx -y
systemctl enable nginx
cd /etc/nginx/sites-available
touch empty-hearts.com
cat > empty-hearts.com <<'endmsg'
server {
        listen 80;
        listen [::]:80;

         root /home/ubuntu/apps/empty-hearts-app/empty-hearts/client/build;

        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;

        server_name empty-hearts.com www.empty-hearts.com;

        location / {
                try_files $uri /index.html;
        }

         location /api {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
}
endmsg
ln -s /etc/nginx/sites-available/empty-hearts.com /etc/nginx/sites-enabled/
systemctl restart nginx

#install dotnet 7.0 and build dotnet app. Then configure dotnet app to run locally as a service. Then start dotnet app service
cd /home/ubuntu/apps/empty-hearts-app/empty-hearts/server/
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
apt-get update && apt-get install -y dotnet-sdk-7.0
dotnet publish --configuration Release

# change jwt secret key to random guid
cd /home/ubuntu/apps/empty-hearts-app/empty-hearts/server/MTT.API/bin/Release/net7.0/publish/
appsettingsPath="/home/ubuntu/apps/empty-hearts-app/empty-hearts/server/MTT.API/bin/Release/net7.0/publish/appsettings.json"
echo -E "$(jq --arg secret_key "$(uuidgen)" --arg secret_refresh_key "$(uuidgen)" '.AuthSettings.JwtSigningKey |= $secret_key | .AuthSettings.JwtRefreshTokenSigningKey |= $secret_refresh_key' ${appsettingsPath})" > ${appsettingsPath}

touch /etc/systemd/system/empty-hearts.service

cat > /etc/systemd/system/empty-hearts.service <<'endmsg'
Description=Empty Hearts Dotnet App
[Service]
WorkingDirectory=/home/ubuntu/apps/empty-hearts-app/empty-hearts/server/MTT.API/bin/Release/net7.0/publish/
ExecStart=/usr/bin/dotnet /home/ubuntu/apps/empty-hearts-app/empty-hearts/server/MTT.API/bin/Release/net7.0/publish/MTT.API.dll
Restart=always
# Restart service after 10 seconds if the dotnet service crashes:
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=empty-hearts-dotnet-app
User=root
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
[Install]
WantedBy=multi-user.target
endmsg
systemctl enable empty-hearts.service
systemctl start empty-hearts.service

# install ef core, and run migrations
dotnet tool install --global dotnet-ef
dotnet tool update --global dotnet-ef
dotnet ef database update --project /home/ubuntu/apps/empty-hearts-app/empty-hearts/server/MTT.API/MTT.API.csproj

#install certbot ssl let's encrypt certificate
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
certbot --nginx -d empty-hearts.com