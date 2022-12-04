# cis3186-sso
Code to be used during SSO tutorial (to be held on 07/12/22)

## Team 2
- Adam Ruggier
- Gerard Coleiro
- Luke Chen
- Robert Mifsud

## Prerequisites
- Verify you have Node.js installed (in command prompt). You can download it form [here](https://nodejs.org/en/download/).
```
node -v
# v14.15.3
npx -v
# 6.14.9
```
- Install Expo Go app [IOS](https://apps.apple.com/us/app/expo-go/id982107779)/[Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US). It could be the case that you might not be able to run project on the University network(eduroam), in which case we suggest you use your phone's hotspot.
## Implementation
The code required to implement this feature is fairly simple however an extensive setup process is involved. All necessary steps are outlined below.

Create new expo project with blank template. You can name it 'SSO'
```
npx create-expo-app --template
```
Navigate to project directory
```
cd SSO
```
Run project, scan the qr code from your Expo Go app and verify that it works. (Ensure your laptop and phone are on the same network)
```
npx expo start
```
Install the React Native Firebase "app" module to the root of your React Native project with npm.
```
npm install --save @react-native-firebase/app
```
Install expo-dev-client
```
npx expo install expo-dev-client
```
`test`