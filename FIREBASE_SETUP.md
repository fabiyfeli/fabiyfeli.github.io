# Guía de Configuración de Firebase

Esta guía te ayudará a configurar Firebase/Firestore para tu sitio web de bodas.

## 📋 Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Add project"
3. Nombre del proyecto: `wedding-rsvp` (o el nombre que prefieras)
4. Desactiva Google Analytics (no es necesario para este proyecto)
5. Haz clic en "Crear proyecto"

## 🌐 Paso 2: Registrar tu App Web

1. En el panel de Firebase, haz clic en el ícono de **Web** (`</>`)
2. Nombre de la app: `Wedding Website`
3. **NO marques** "Also set up Firebase Hosting" (ya usas GitHub Pages)
4. Haz clic en "Registrar app"
5. **Copia las credenciales** que aparecen (las necesitarás en el siguiente paso)

Verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "wedding-rsvp.firebaseapp.com",
  projectId: "wedding-rsvp",
  storageBucket: "wedding-rsvp.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

## 🔑 Paso 3: Configurar Credenciales

1. Abre el archivo `src/config/firebase.js` en tu proyecto
2. Reemplaza los valores `YOUR_*` con tus credenciales reales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUÍ",
  authDomain: "TU_AUTH_DOMAIN_AQUÍ",
  projectId: "TU_PROJECT_ID_AQUÍ",
  storageBucket: "TU_STORAGE_BUCKET_AQUÍ",
  messagingSenderId: "TU_MESSAGING_SENDER_ID_AQUÍ",
  appId: "TU_APP_ID_AQUÍ"
};
```

3. Guarda el archivo

> ⚠️ **Nota de Seguridad**: Estas credenciales pueden ser públicas en tu repositorio. La seguridad se controla mediante las reglas de Firestore (ver Paso 4).

## 🛡️ Paso 4: Configurar Firestore Database

### 4.1 Crear Base de Datos

1. En Firebase Console, ve a **Firestore Database** en el menú lateral
2. Haz clic en "Crear base de datos" o "Create database"
3. Selecciona **"Iniciar en modo de prueba"** (Start in test mode)
4. Elige la ubicación más cercana a tus invitados (ej: `us-central1`, `southamerica-east1`)
5. Haz clic en "Habilitar" o "Enable"

### 4.2 Configurar Reglas de Seguridad

1. En Firestore Database, ve a la pestaña **"Reglas"** (Rules)
2. Reemplaza las reglas por defecto con las siguientes:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para RSVPs
    match /rsvps/{rsvpId} {
      // Cualquiera puede CREAR un RSVP (para formulario público)
      allow create: if request.resource.data.email is string 
                    && request.resource.data.email.size() > 0;
      
      // Solo lectura para RSVPs aprobados (para mostrar contador)
      allow read: if resource.data.approved == true;
      
      // NO se permite actualizar o eliminar sin autenticación
      // (los administradores usarán localStorage + sincronización manual)
      allow update, delete: if false;
    }
    
    // Reglas para Libro de Invitados
    match /guestBook/{messageId} {
      // Cualquiera puede CREAR mensajes (máximo 500 caracteres)
      allow create: if request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 100
                    && request.resource.data.message is string
                    && request.resource.data.message.size() > 0
                    && request.resource.data.message.size() <= 500;
      
      // Todos pueden LEER mensajes aprobados
      allow read: if resource.data.approved == true;
      
      // NO se permite actualizar o eliminar sin autenticación
      allow update, delete: if false;
    }
  }
}
```

3. Haz clic en "Publicar" o "Publish"

### Explicación de las Reglas

- **RSVPs**: Los invitados pueden enviar RSVPs, pero solo los aprobados son visibles públicamente
- **Guest Book**: Los invitados pueden dejar mensajes (máx. 500 caracteres), solo los aprobados son visibles
- **Seguridad**: Nadie puede actualizar o eliminar documentos directamente (solo administradores desde el admin panel)

## 🔐 Paso 5: Configurar App Check (Opcional pero Recomendado)

App Check protege tu base de datos contra tráfico no autorizado:

1. En Firebase Console, ve a **App Check**
2. Haz clic en "Comenzar" o "Get started"
3. Selecciona tu app web
4. Proveedor: **reCAPTCHA Enterprise** o **reCAPTCHA v3**
5. Registra tu dominio: `fabiyfeli.github.io`
6. Haz clic en "Guardar" o "Save"

Luego actualiza las reglas de Firestore para requerir App Check:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función helper para verificar App Check
    function isAppCheckValid() {
      return request.auth != null || request.time < timestamp.date(2026, 2, 1);
      // Permite sin App Check hasta Feb 1, 2026 (para testing)
    }
    
    match /rsvps/{rsvpId} {
      allow create: if isAppCheckValid()
                    && request.resource.data.email is string 
                    && request.resource.data.email.size() > 0;
      
      allow read: if resource.data.approved == true;
      allow update, delete: if false;
    }
    
    match /guestBook/{messageId} {
      allow create: if isAppCheckValid()
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 100
                    && request.resource.data.message is string
                    && request.resource.data.message.size() > 0
                    && request.resource.data.message.size() <= 500;
      
      allow read: if resource.data.approved == true;
      allow update, delete: if false;
    }
  }
}
```

## 📊 Paso 6: Verificar Instalación

Para verificar que todo funciona:

1. Ejecuta `npm run dev` en tu proyecto
2. Abre el navegador en `http://localhost:5173`
3. Abre las DevTools (F12) y ve a la pestaña Console
4. Llena el formulario RSVP y envíalo
5. Deberías ver en la consola:
   ```
   ✓ RSVP synced to Firebase
   ```
6. Ve a Firebase Console → Firestore Database
7. Deberías ver una nueva colección llamada `rsvps` con tu documento

## 🔍 Monitoreo y Administración

### Ver Datos en Firebase Console

- **RSVPs**: Firestore Database → `rsvps` collection
- **Guest Book**: Firestore Database → `guestBook` collection

### Admin Panel Local

Los administradores usan el admin panel local:
- `/rsvp-admin` - Administrar RSVPs
- `/guest-book-admin` - Administrar mensajes

Cambios en el admin panel se sincronizan automáticamente a Firebase.

## ❓ Troubleshooting

### Error: "Firebase not configured"

- Verifica que `src/config/firebase.js` tenga tus credenciales reales
- Asegúrate de que NO hay valores `YOUR_*`

### Error: "Missing or insufficient permissions"

- Ve a Firestore Database → Reglas
- Verifica que las reglas coincidan con las de esta guía
- Haz clic en "Publicar" para aplicar cambios

### RSVPs no aparecen en Firebase Console

- Ve a Firestore Database → `rsvps`
- Si la colección no existe, envía un RSVP de prueba
- Revisa la consola del navegador para errores

### CORS Error

- Asegúrate de que tu dominio esté registrado en Firebase:
  - Settings → General → Your apps → Web app
  - Authorized domains debe incluir `fabiyfeli.github.io`

## 🚀 Deploy

Una vez configurado Firebase:

1. Haz commit de los cambios: `git add . && git commit -m "Configure Firebase"`
2. Push a GitHub: `git push origin main`
3. GitHub Pages desplegará automáticamente
4. Los invitados podrán enviar RSVPs que se guardarán en Firebase

## 📝 Notas Importantes

- **Cuotas Gratuitas**: Firebase Spark (gratis) incluye:
  - 50K lecturas/día
  - 20K escrituras/día
  - 1GB de almacenamiento
  - Suficiente para ~1000 invitados
  
- **Costos**: Si superas las cuotas gratuitas, Firebase te notificará antes de cobrar

- **Backup**: Los datos también se guardan en localStorage como respaldo

- **Privacidad**: Los emails de los invitados NO son públicos. Solo los RSVPs aprobados son visibles en el contador.

## 🎉 ¡Listo!

Tu sitio web ahora usa Firebase/Firestore para almacenamiento persistente. Los datos sobrevivirán refrescos de página y estarán sincronizados entre dispositivos.

---

**Fecha de boda**: 31 de Enero, 2026  
**Repositorio**: fabiyfeli/fabiyfeli.github.io  
**Documentación Firebase**: https://firebase.google.com/docs/firestore
