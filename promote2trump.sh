rm -rf ~/Documents/code/Maps/trumpone/js ~/Documents/code/Maps/trumpone/index.html
cp -R ./js ~/Documents/code/Maps/trumpone
cp index.html ~/Documents/code/Maps/trumpone
cd ~/Documents/code/Maps/trumpone
pwd
echo "$1"
git commit -m "$1" .
git push origin master
