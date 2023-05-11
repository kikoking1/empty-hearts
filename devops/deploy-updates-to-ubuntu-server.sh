# rebuild and restart dotnet app
systemctl stop empty-hearts.service

cd /home/ubuntu/apps/empty-hearts-app/empty-hearts/server/
dotnet publish --configuration Release

# rotate signing keys. Careful as this will log everyone out.
appsettingsPath="/home/ubuntu/apps/empty-hearts-app/empty-hearts/server/MTT.API/bin/Release/net7.0/publish/appsettings.json"
echo -E "$(jq --arg secret_key "$(uuidgen)" --arg secret_refresh_key "$(uuidgen)" '.AuthSettings.JwtSigningKey |= $secret_key | .AuthSettings.JwtRefreshTokenSigningKey |= $secret_refresh_key' ${appsettingsPath})" > ${appsettingsPath}

# apply db migrations
/root/.dotnet/tools/dotnet-ef database update --project /home/ubuntu/apps/empty-hearts-app/empty-hearts/server/MTT.API/MTT.API.csproj

systemctl restart empty-hearts.service

# rebuild and restart react app
cd /home/ubuntu/apps/empty-hearts-app/empty-hearts/client
npm i
npm run build

systemctl restart nginx
