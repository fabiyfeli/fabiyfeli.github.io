# Configuración de Dominio Personalizado

## 🌐 Información del Dominio

**Dominio Público**: https://fabiyfeli.cl  
**Repositorio GitHub**: fabiyfeli/fabiyfeli.github.io  
**DNS Provider**: Configurado con DNS personalizado apuntando a GitHub Pages

## 📁 Archivos de Configuración

### CNAME
Ubicación: `public/CNAME` y `build/CNAME`

```
fabiyfeli.cl
```

Este archivo es **crucial** para que GitHub Pages sepa cuál es tu dominio personalizado.

## ⚙️ Configuración DNS

Para que el dominio personalizado funcione, debes tener estos registros DNS configurados:

### Opción A: Con subdominios (www)
```
Type: CNAME
Host: www
Value: fabiyfeli.github.io
```

### Opción B: Dominio raíz (apex)
```
Type: A
Host: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

Y para el subdomain www:
```
Type: CNAME
Host: www
Value: fabiyfeli.github.io
```

## 🔒 HTTPS/SSL

GitHub Pages proporciona automáticamente certificados SSL para dominios personalizados.

Para habilitar HTTPS:
1. Ve a: Settings → Pages → Custom domain
2. Verifica que `fabiyfeli.cl` esté configurado
3. Marca "Enforce HTTPS"

## 🔧 Configuración en Firebase

Al configurar Firebase, asegúrate de autorizar el dominio personalizado:

### 1. Firebase Console → Authentication → Settings → Authorized domains
Agrega:
- `fabiyfeli.cl`
- `fabiyfeli.github.io` (para pruebas)
- `localhost` (para desarrollo)

### 2. App Check (si está habilitado)
Registra:
- Dominio principal: `fabiyfeli.cl`
- Dominio GitHub Pages: `fabiyfeli.github.io`

## 📝 Content Security Policy (CSP)

El CSP en `index.html` usa `'self'` que automáticamente incluye el dominio actual:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               img-src 'self' data: https:; 
               font-src 'self' data: https://fonts.gstatic.com; 
               connect-src 'self' https://api.github.com; 
               manifest-src 'self';">
```

Esto funciona tanto para:
- ✅ fabiyfeli.cl
- ✅ fabiyfeli.github.io
- ✅ localhost:5173 (desarrollo)

## 🚀 Deploy Process

Cuando ejecutas `npm run deploy`:

1. Build genera archivos en `build/`
2. CNAME se copia de `public/CNAME` a `build/CNAME`
3. GitHub Actions despliega `build/` a GitHub Pages
4. GitHub Pages sirve el contenido en:
   - fabiyfeli.github.io (URL interna)
   - **fabiyfeli.cl** (dominio público)

## ✅ Verificación

Para verificar que el dominio funciona correctamente:

### 1. DNS Resolution
```bash
nslookup fabiyfeli.cl
# Debería resolver a las IPs de GitHub Pages
```

### 2. HTTPS Certificate
```bash
curl -I https://fabiyfeli.cl
# Debería devolver 200 OK con certificado válido
```

### 3. Redirección
Verifica que estas URLs redirijan a `https://fabiyfeli.cl`:
- http://fabiyfeli.cl → https://fabiyfeli.cl ✅
- http://www.fabiyfeli.cl → https://fabiyfeli.cl ✅
- https://www.fabiyfeli.cl → https://fabiyfeli.cl ✅

## 🔄 Actualizar Dominio

Si necesitas cambiar el dominio:

1. Actualiza `public/CNAME` con el nuevo dominio
2. Actualiza DNS del proveedor
3. Actualiza Firebase Authorized Domains
4. Actualiza referencias en documentación
5. Deploy: `npm run deploy`

## 📞 Troubleshooting

### Problema: "404 - There isn't a GitHub Pages site here"
**Solución**: 
- Verifica que `build/CNAME` exista después del build
- Verifica GitHub Settings → Pages → Custom domain

### Problema: "DNS_PROBE_FINISHED_NXDOMAIN"
**Solución**: 
- Verifica configuración DNS en tu proveedor
- Espera 24-48 horas para propagación DNS

### Problema: "Certificate error" o "Not Secure"
**Solución**:
- Ve a Settings → Pages
- Desmarca y vuelve a marcar "Enforce HTTPS"
- Espera 5-10 minutos para que se genere el certificado

### Problema: Firebase Auth no funciona con dominio personalizado
**Solución**:
- Firebase Console → Authentication → Settings → Authorized domains
- Agrega `fabiyfeli.cl`

## 📚 Referencias

- [GitHub Pages Custom Domain Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Firebase Authorized Domains](https://firebase.google.com/docs/auth/web/redirect-best-practices#proxy-requests)
- [DNS Configuration Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

---

**Última Actualización**: Diciembre 2025  
**Estado**: ✅ Dominio configurado y funcionando  
**Dominio**: https://fabiyfeli.cl
