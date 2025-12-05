# 🚀 Inicio Rápido - Wedding Website con Firebase

## ⚡ Para empezar inmediatamente (sin Firebase)

El sitio funciona perfectamente con localStorage solamente:

```bash
npm install
npm run dev
```

Abre http://localhost:5173 y listo. Los RSVPs y mensajes se guardan en el navegador.

## ☁️ Para habilitar Firebase (recomendado para producción)

### 1. Crear Proyecto Firebase (5 minutos)

1. Ve a https://console.firebase.google.com/
2. Clic en "Agregar proyecto"
3. Nombre: `wedding-rsvp`
4. Desactiva Google Analytics
5. Clic en "Crear proyecto"

### 2. Registrar App Web (2 minutos)

1. En el panel de Firebase, clic en el ícono Web `</>`
2. Nombre de la app: `Wedding Website`
3. NO marques "Firebase Hosting"
4. Clic en "Registrar app"
5. **COPIA las credenciales** que aparecen

### 3. Configurar Firestore (3 minutos)

1. En Firebase Console → **Firestore Database**
2. Clic en "Crear base de datos"
3. Selecciona **"Modo de prueba"** (Start in test mode)
4. Elige ubicación: `us-central1` o más cercana
5. Clic en "Habilitar"

### 4. Reglas de Seguridad (2 minutos)

1. En Firestore Database → pestaña **"Reglas"**
2. Reemplaza todo el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rsvps/{rsvpId} {
      allow create: if request.resource.data.email is string;
      allow read: if resource.data.approved == true;
      allow update, delete: if false;
    }
    match /guestBook/{messageId} {
      allow create: if request.resource.data.name is string
                    && request.resource.data.message.size() <= 500;
      allow read: if resource.data.approved == true;
      allow update, delete: if false;
    }
  }
}
```

3. Clic en "Publicar"

### 5. Pegar Credenciales (1 minuto)

Abre `src/config/firebase.js` y reemplaza:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",              // ← Pegar tu API Key
  authDomain: "wedding-xxx.firebase...",  // ← Pegar tu Auth Domain
  projectId: "wedding-xxx",          // ← Pegar tu Project ID
  storageBucket: "wedding-xxx...",   // ← Pegar tu Storage Bucket
  messagingSenderId: "123456...",    // ← Pegar tu Messaging Sender ID
  appId: "1:123456..."               // ← Pegar tu App ID
};
```

### 6. Probar (30 segundos)

```bash
npm run dev
```

1. Abre http://localhost:5173
2. Llena el formulario RSVP y envía
3. Abre DevTools (F12) → Console
4. Deberías ver: `✓ RSVP synced to Firebase`
5. Ve a Firebase Console → Firestore Database
6. Verás la colección `rsvps` con tu documento

## ✅ ¡Listo!

Ahora tu sitio guarda datos en:
- ✅ localStorage (rápido, offline)
- ✅ Firebase (persistente, cloud)
- ✅ Sincroniza automáticamente

## 📖 Documentación Completa

- **FIREBASE_SETUP.md** - Guía detallada con App Check, troubleshooting
- **FIREBASE_INTEGRATION_SUMMARY.md** - Detalles técnicos de implementación
- **README.md** - Documentación general del proyecto

## 🔧 Admin Panels

Accede a los paneles de administración:
- http://localhost:5173/rsvp-admin - Gestionar RSVPs
- http://localhost:5173/guest-book-admin - Gestionar mensajes

Contraseña por defecto: `admin123` (cámbiala en `src/utils/rsvpStorage.js`)

## 🚀 Deploy a Producción

```bash
npm run build
git add .
git commit -m "Add Firebase integration"
git push origin main
```

GitHub Pages desplegará automáticamente en:
https://fabiyfeli.github.io

## 💡 Tips

- Las credenciales de Firebase **pueden ser públicas** - la seguridad está en las reglas
- Si no configuras Firebase, el sitio funciona con localStorage solamente
- Los datos de localStorage se sincronizan automáticamente a Firebase cuando esté configurado
- Puedes cambiar reglas de Firestore en cualquier momento sin redesplegar

## ❓ Problemas Comunes

**Error: "Firebase not configured"**
- Verifica que `src/config/firebase.js` tenga tus credenciales reales
- No debe tener valores `YOUR_*`

**RSVPs no aparecen en Firebase**
- Revisa las reglas de Firestore (Paso 4)
- Mira la consola del navegador (F12) para errores

**Build falla**
- Ejecuta `npm install --legacy-peer-deps` si hay conflictos de dependencias

## 📞 Soporte

Ver documentación completa en:
- `FIREBASE_SETUP.md` - Setup detallado y troubleshooting
- `FIREBASE_INTEGRATION_SUMMARY.md` - Detalles técnicos

---

**Tiempo total de setup**: ~15 minutos  
**Proyecto**: Wedding Website para Fabi & Feli  
**Fecha de boda**: 31 de Enero, 2026
