# 📱 GUÍA COMPLETA PARA GENERAR APK

## ⚠️ REQUISITOS PREVIOS

### 1. Instalar Node.js
1. Descargar desde: https://nodejs.org/
2. Instalar versión LTS (20.x o superior)
3. Verificar instalación:
```bash
node --version
npm --version
```

### 2. Instalar Java JDK 11 o superior
1. Descargar desde: https://adoptium.net/
2. Instalar JDK 11 o 17
3. Configurar JAVA_HOME en variables de entorno

### 3. Instalar Android Studio
1. Descargar desde: https://developer.android.com/studio
2. Durante instalación, incluir:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
3. Configurar variables de entorno:
```
ANDROID_HOME = C:\Users\TU_USUARIO\AppData\Local\Android\Sdk
Path += %ANDROID_HOME%\platform-tools
Path += %ANDROID_HOME%\tools
```

---

## 🚀 OPCIÓN 1: BUILD LOCAL (Más rápido)

### Paso 1: Instalar dependencias
```bash
cd c:\Users\usuar\Auditoria\my-app\apps\mobile
npm install
```

### Paso 2: Generar proyecto Android nativo
```bash
npx expo prebuild --platform android
```

Esto crea la carpeta `android/` con el proyecto nativo.

### Paso 3: Generar APK
```bash
cd android
gradlew assembleRelease
```

### Paso 4: Ubicación del APK
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## ☁️ OPCIÓN 2: EAS BUILD (Más fácil, en la nube)

### Paso 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Paso 2: Login en Expo
```bash
eas login
```
Crear cuenta gratuita en: https://expo.dev/signup

### Paso 3: Configurar proyecto
```bash
cd c:\Users\usuar\Auditoria\my-app\apps\mobile
eas build:configure
```

### Paso 4: Generar APK
```bash
eas build --platform android --profile preview
```

El build se hace en la nube. Recibirás un link para descargar el APK.

**Ventajas:**
- ✅ No necesitas Android Studio
- ✅ No necesitas configurar SDK
- ✅ Build en la nube
- ✅ APK firmado automáticamente

---

## 🔧 OPCIÓN 3: USANDO EXPO GO (Para testing)

Si solo quieres probar la app sin generar APK:

### Paso 1: Instalar Expo Go en tu celular
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent

### Paso 2: Iniciar servidor de desarrollo
```bash
cd c:\Users\usuar\Auditoria\my-app\apps\mobile
npm start
```

### Paso 3: Escanear QR
- Abre Expo Go en tu celular
- Escanea el QR que aparece en la terminal
- La app se carga en tu celular

**Limitación:** No funciona offline completo, solo para testing.

---

## 📋 SCRIPT AUTOMATIZADO (Windows)

Crea un archivo `build-apk.bat`:

```batch
@echo off
echo ========================================
echo  GENERANDO APK - AUDITORIA NUTRICIONAL
echo ========================================

echo.
echo [1/4] Instalando dependencias...
call npm install

echo.
echo [2/4] Generando proyecto Android...
call npx expo prebuild --platform android --clean

echo.
echo [3/4] Compilando APK...
cd android
call gradlew assembleRelease

echo.
echo [4/4] APK generado!
echo Ubicacion: android\app\build\outputs\apk\release\app-release.apk
echo.

pause
```

Ejecutar:
```bash
build-apk.bat
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "npm no se reconoce"
**Solución:** Instalar Node.js desde https://nodejs.org/

### Error: "JAVA_HOME not set"
**Solución:** 
1. Instalar JDK 11+
2. Configurar variable de entorno:
```
JAVA_HOME = C:\Program Files\Java\jdk-11
```

### Error: "Android SDK not found"
**Solución:**
1. Instalar Android Studio
2. Configurar ANDROID_HOME:
```
ANDROID_HOME = C:\Users\TU_USUARIO\AppData\Local\Android\Sdk
```

### Error: "gradlew: command not found"
**Solución:**
```bash
# En Windows usar:
gradlew.bat assembleRelease

# O con ruta completa:
.\gradlew.bat assembleRelease
```

### APK muy grande (>100MB)
**Solución:** Generar APK optimizado:
```bash
cd android
gradlew bundleRelease
```
Esto genera un AAB (Android App Bundle) más pequeño.

---

## 📦 FIRMAR APK (Para producción)

### Paso 1: Generar keystore
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Paso 2: Configurar gradle
Editar `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'TU_PASSWORD'
            keyAlias 'my-key-alias'
            keyPassword 'TU_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### Paso 3: Generar APK firmado
```bash
cd android
gradlew assembleRelease
```

---

## ✅ VERIFICAR APK

### Instalar en dispositivo Android
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Ver información del APK
```bash
aapt dump badging android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 RECOMENDACIÓN

**Para desarrollo/testing:** Usa Expo Go (Opción 3)
**Para distribución interna:** Usa EAS Build (Opción 2)
**Para producción:** Usa Build Local con firma (Opción 1)

---

## 📞 COMANDOS RÁPIDOS

```bash
# Instalar dependencias
npm install

# Desarrollo con Expo Go
npm start

# Build con EAS (recomendado)
npm install -g eas-cli
eas login
eas build --platform android --profile preview

# Build local
npx expo prebuild --platform android
cd android
gradlew assembleRelease
```

