# Jerez°Espinillo - Plataforma Inmobiliaria Premium

Este proyecto representa el sistema web integral para **Jerez°Espinillo**, una distinguida inmobiliaria argentina especializada en propiedades y terrenos residenciales de alta gama en Salta y Buenos Aires.

El sistema consta de:
1. **Portal Público:** Una experiencia web minimalista y lujosa con catálogo refinado, buscadores de palabras clave, galería de imágenes interactivas, vinculación con Google Maps, compartición rápida y redirecciones automáticas a WhatsApp.
2. **Panel de Administración (Control de Mando):** Panel privado protegido por credenciales con vista de métricas, gráfico interactivo de visitas, listado de inventario con cambio de estados rápidos, formulario de creación y edición (CRUD) y bandeja de consultas integrada con respuesta por WhatsApp de un click.

---

## 🛠️ Tecnologías y Estructura

- **Frontend:** React + TypeScript + Vite.
- **Estilos:** Tailwind CSS v4 (Paleta premium: Negro `#0A0A0A` base, Dorado `#C9A84C` acento y HSL).
- **Iconografía:** Lucide React.
- **Rutas:** React Router v6.
- **Base de Datos / Storage / Auth:** Supabase (PostgreSQL + RLS + Storage Buckets).
- **Compresión de Imágenes:** Canvas API nativo integrado en el cliente (`compressImage`).

---

## 📦 Instrucciones de Inicio Rápido

### 1. Clonar e Instalar Dependencias

```bash
# Instalar los módulos declarados en package.json
npm install
```

### 2. Variables de Entorno

Copia el archivo de plantilla `.env.example` como `.env` y rellena tus credenciales oficiales de Supabase.

```bash
cp .env.example .env
```

El archivo `.env` debe configurarse de la siguiente manera:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
VITE_WHATSAPP_NUMBER=5493871234567
```

> **Nota de Robustez (Soporte Fallback):** Si las credenciales de Supabase no están presentes, el sistema activa automáticamente un **motor de simulación local**. Todo el portal público y panel de administración permanecerá 100% interactivo, permitiéndote navegar, filtrar, agregar propiedades, cambiar estados rápidos, subir fotos ficticias y recibir consultas en memoria sin necesidad de configurar una base de datos real inicialmente.

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

### 4. Compilar para Producción

```bash
npm run build
```

---

## 🗄️ Esquema de Base de Datos para Supabase (PostgreSQL)

Para conectar tu instancia oficial de Supabase, ve al editor de consultas **SQL Editor** en tu panel de Supabase y ejecuta los siguientes scripts:

```sql
-- 1. Tabla de Propiedades
CREATE TABLE propiedades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  tipo TEXT CHECK (tipo IN ('venta', 'alquiler', 'terreno', 'tasacion')) NOT NULL,
  estado TEXT CHECK (estado IN ('disponible', 'reservado', 'vendido', 'alquilado')) DEFAULT 'disponible' NOT NULL,
  direccion TEXT NOT NULL,
  metros_cuadrados NUMERIC NOT NULL,
  ambientes INT DEFAULT 0,
  banos INT DEFAULT 0,
  imagenes TEXT[] DEFAULT '{}',
  destacada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Tabla de Consultas (Inquiries)
CREATE TABLE consultas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  propiedad_id UUID REFERENCES propiedades(id) ON DELETE SET NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Tabla de Métricas de Visitas
CREATE TABLE metricas_visitas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  propiedad_id UUID REFERENCES propiedades(id) ON DELETE CASCADE,
  fecha DATE DEFAULT CURRENT_DATE NOT NULL,
  visitas INT DEFAULT 1 NOT NULL,
  UNIQUE(propiedad_id, fecha)
);

-- Habilitar Row Level Security (RLS) en propiedades (Lectura libre, Escritura para autenticados)
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura libre de propiedades" ON propiedades
  FOR SELECT USING (true);

CREATE POLICY "Permitir gestión total a administradores" ON propiedades
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Habilitar RLS en consultas (Escritura libre para formularios, Lectura para autenticados)
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserción libre de consultas" ON consultas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura de consultas a administradores" ON consultas
  FOR SELECT TO authenticated USING (true);
```

### 📁 Configuración de Supabase Storage (Imágenes)

1. Crea un **Storage Bucket** público llamado `propiedades-imagenes`.
2. Habilita el acceso público al bucket para que las URLs generadas sean visualizables.
3. Agrega las políticas RLS correspondientes en Supabase Storage para permitir la subida/modificación de archivos únicamente a usuarios autenticados, manteniendo la descarga pública libre.

---

## 🔒 Credenciales de Acceso al Panel de Administración

Para ingresar al panel de administración (`/admin/login`) puedes utilizar las siguientes opciones:

1. **Si conectaste tu base de datos Supabase:** Crea un usuario administrador en la sección **Authentication** de Supabase.
2. **Si estás usando la simulación local de prueba:**
   - **Correo:** `admin@jerezespinillo.com`
   - **Contraseña:** `admin123`

---

## 📸 Compresión Inteligente de Imágenes en el Cliente

Para proteger el ancho de banda del servidor y acelerar la navegación móvil de tus clientes, el sistema implementa una utilidad nativa `compressImage` en `src/utils/compressImage.ts`:
- Toma los archivos cargados por el administrador (que suelen pesar de 5MB a 12MB desde smartphones).
- Los procesa localmente mediante la API Canvas de HTML5.
- Reduce sus dimensiones a un máximo de `1600px` de ancho/alto manteniendo la relación de aspecto.
- Convierte el formato a `JPEG` con una compresión óptima de calidad del `75%`.
- Sube un archivo limpio de aproximadamente `150KB` a `300KB`, mejorando drásticamente el tiempo de carga en celulares con conexiones 4G/LTE.

---

## 🚀 Despliegue en Vercel

Este proyecto está completamente preparado para desplegarse de manera instantánea en [Vercel](https://vercel.com).
1. Sube tu repositorio a GitHub o GitLab.
2. Crea un nuevo proyecto en Vercel apuntando a dicho repositorio.
3. Agrega las variables de entorno declaradas en tu archivo `.env`.
4. Vercel detectará automáticamente la configuración de Vite y realizará la compilación y distribución global en su red Edge CDN.
