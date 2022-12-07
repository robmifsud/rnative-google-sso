# cis3186-sso
Resources and code to be used during SSO tutorial (to be held on 07/12/22 14:00)

# Team 2
- Adam Ruggier
- Gerard Coleiro
- Luke Chen
- Robert Mifsud

# Prerequisites
- Verify you have Node.js installed (in cmd/terminal). You can download it from [here](https://nodejs.org/en/download/).
```
node -v
# v14.15.3
npx -v
# 6.14.9
```
- Instal Expo Application Services CLI tool
```
npm install --global eas-cli
```
- Ensure you have an [Expo](https://expo.dev/signup) account. If you attended any of the react-native tutorials with Eman and used Expo Go you should have an account already
- Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) app and log-in with your account. It could be the case that you might not be able to run the project on the University network(eduroam), in which case we suggest you use your phone's hotspot
- This tutorial will only work on an android device. If you do not have access to one we suggest you use an emulator such as [BlueStacks](https://www.bluestacks.com/download.html) which we tested and works as expected (We recommend you get the 'Pie 64-bit' version). If using an emulator please download the [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) app on the emulator itself
# Implementation
The code required to implement this feature is fairly simple however an extensive setup process is involved. All necessary steps are outlined below.

## Project creation and initial setup

Create new expo project with blank template. You can name it 'SSO'
```
npx create-expo-app --template
```

Navigate to project directory
```
cd SSO
```

Install the React Native Firebase app module to the root of your React Native project with npm.
```
npm install --save @react-native-firebase/app
```
Install the React Native Firebase Authentication package
```
npm i @react-native-firebase/auth
```
Install expo-dev-client
```
npx expo install expo-dev-client
```
Import the following in your [App.js](SSO/App.js)

`import 'expo-dev-client';`

`import auth from '@react-native-firebase/auth';`

Build **.apk**. Prompt may ask you to log-in using your Expo account. Select *Y* when prompted to create EAS project and build new keystore.

This process may take 5~10 minutes.

If you get a 'running scripts is diabled' error try running the command on cmd instead of Windows PowerShell
```
eas build --profile development --platform android
```
To test your build, run the following command, and paste the link to your Expo Go app
```
npx expo start --dev-client
```
Install google sign-in package
```
npx expo install @react-native-google-signin/google-signin
```
After installing the package, add it as a plugin under "expo" in your [app.json](SSO/app.json) file as follows
```
{
  "expo": {
    "plugins": ["@react-native-google-signin/google-signin"],
    //
    //
```
Finally, import it to your [App.js](SSO/App.js)

`import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';`

## Setting up Firebase project
- Load up [firebase.google.com](https://firebase.google.com/)
- Click on 'Get Started' and 'Create Project'. You can name your project 'SSOGoogle'
- Add firebase to an Android app

![Create Firebase app](Images/Firebase.png)
- Fetch the package name from the [app.json](SSO/app.json) file and paste it to the site.
- Get SHA-1 credentials in the terminal:
```
eas credentials
# Select default options except when asked for build credentials in which case use the down arrow and select create new build credentails
```
- Copy the SHA-1 key from the new set of credentials (**not default**) and paste to your Firebase project
- **Do not** download the google-services.json file just yet
- Click **next** and continue to your Firebase App console

![Firebase App console](Images/Firebase%20Console.png)
- Click the gear in the top left-hand corner to open up your project settings, scroll to the bottom
- Copy the **default** SHA-1 key from the terminal and add it to your Firebase app using the **Add fingerprint** button
- Now you can go ahead and download the *google-services.json* file
- Select Build/Authentication from the side menu and select 'Get started'
- Select 'Google' toggle it on to enable it and hit **Save**

Now you can add the file in your [app.json](SSO/app.json) under expo/android as such:
```
{
  "expo": {
    //
    //
    "android": {
      "googleServicesFile": "./google-services.json",
       //
       //
       //
```
- Do not forget to paste *google-services.json* file you downloaded earlier into your project directory
- Build the project again
```
eas build --profile development --platform android
```
Run the following command and copy the link to your Expo Go app
```
npx expo start --dev-client
```

## Writing code to implement solution
Unless otherwise stated, write the following code in your [App.js](SSO/App.js) file

Configure webClientId. This can be found in *google-services.json* under **"oauth_client"**. Copy the client_id for client_type : 3.
```
export default function App() {
  GoogleSignin.configure({
    webClientId: '',
  });
  return (
    //
    //
```
Create two states, for when user is logged in and logged out

`import React, { useState, useEffect } from 'react';`

Set initialising state to block app from rendering while Firebase establishes a connection and a functiion to handle state changes.
```
export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  //
  //
  //
```
Implement the *onGoogleButtonPress()* function
```
const onGoogleButtonPress = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    const user_sign_in = auth().signInWithCredential(googleCredential)
    
    user_sign_in.then((user) =>{
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    })
  }
```
Replace the default view with sign in button if user is not logged in and username and image if logged in
```
if(!user){
  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={{width:300, height: 65, marginTop:300, padding: 12}}
        onPress={onGoogleButtonPress}
      />
    </View>
  );
}
// else
return(
  <View style={styles.container}>
    <View style={{marginTop:100, alignItems:'center'}}>
      <Text style={styles.Text}> Welcome, {user.displayName}</Text>
      <Image
        source={{uri: user.photoURL}}
        style={{height:300, width:300, borderRadius:150, margin:50}}
      />
    </View>
  </View>
)
```
Create a function to handle sign-out
```
const signOut = async () => {
    try{
      await GoogleSignin.revokeAccess();
      await auth().signOut();
    } catch (error){
      console.error(error);
    }
  }
```
Finally, add a sign-out button to your view. You may have to import the *Button* module `import { StyleSheet, Text, View, Image, Button } from 'react-native';`
```
#
#
<Image
  source={{uri: user.photoURL}}
  style={{height:200, width:200, borderRadius:100, margin:50}}
/>
<Button title='Sign Out' onPress={signOut}/>
#
#
```
You can view and manage users from your Firebase app

![Firebase Users](Images/Firebase%20Users.png)
# References
- https://www.youtube.com/watch?v=d_Vf41Sb0v0
- https://rnfirebase.io/auth/social-auth
- https://github.com/react-native-google-signin/google-signin
