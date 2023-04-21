# deploying and startup on new ec2 server

REQUIRES: ubuntu 20.04 ec2 t2.small instance (defaults on the rest)

make sure your domain is pointed at the server's ip address before trying to do the certbot let's encrypt ssl step

## Connect to Instance and Download Repo, Then Execute Server Setup Bash File

```
ssh -i "C:\Users\kiko\.ssh\kikos_aws\aws_mth_key.pem" ubuntu@ec2-3-97-206-45.ca-central-1.compute.amazonaws.com

# once connected, execute the following
sudo -u
apt update && apt upgrade -y
cd /home/ubuntu/
mkdir apps
cd apps
mkdir empty-hearts-app
cd empty-hearts-app
git clone https://github.com/kikoking1/empty-hearts.git
bash /home/ubuntu/apps/empty-hearts-app/empty-hearts/devops/new-ubuntu-server-setup.sh
```

NOTE: the only prompts should be the certbot prompts at the very end.

Put in a real email, say yes twice, and it should be live
