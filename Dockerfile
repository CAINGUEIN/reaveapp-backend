#!/bin/bash
workd="/home/docker/image_creation/back/"

sudo rm -rf "$workd"
sudo mkdir "$workd"
sudo git clone http://172.16.20.11:4000/gazo/web_back.git "$workd"
sudo docker build "$workd" -t reave/app_back
sudo rm -rf "$workd"
echo "--------------------------------------------------------------------------------"
echo "Image 'gazo/web_back' cree avec succes"
echo "Sur Portainer : Stack > web_deploy"
echo "En haut choisir 'Editor'"
echo "Tout en bas de la page : Update the stack"
