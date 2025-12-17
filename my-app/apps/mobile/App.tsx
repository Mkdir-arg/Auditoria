import React from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview'

// URL del servidor web (cambia si usas otra red)
const WEB_URL = 'http://192.168.1.205:3001'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: WEB_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
})
