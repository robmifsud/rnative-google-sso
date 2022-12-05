import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import 'expo-dev-client';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useState, useEffect } from 'react';

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

  const signOut = async () => {
    try{
      await GoogleSignin.revokeAccess();
      await auth().signOut();
    } catch (error){
      console.error(error);
    }
  }

  if (initializing) return null;

  GoogleSignin.configure({
    webClientId: '1077347357364-tngunu9i2ti4dp8m7pt10n9b70k6pad4.apps.googleusercontent.com',
  });

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
          style={{height:200, width:200, borderRadius:100, margin:50}}
        />
        <Button title='Sign Out' onPress={signOut}/>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

