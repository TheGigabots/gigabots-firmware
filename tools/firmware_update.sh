

mkdir -p ./tmp
curl -s https://api.github.com/repos/TheGigabots/gigabots-firmware/releases/latest \
  | grep tarball_url \
  | cut -d '"' -f 4  \
  | xargs curl -L > ./tmp/src.tgz

tar zxvf ./tmp/src.tgz --strip-components=1 -C ./tmp
cp -r tmp/dist/ ../dist
rm -rf ./tmp
