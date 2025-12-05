#!/usr/bin/env node
// Script para verificar variables de entorno de Supabase
const fs = require('fs');
const path = require('path');

// Función simple para parsear .env.local
function loadEnvFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        content.split('\n').forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    process.env[key.trim()] = valueParts.join('=').trim();
                }
            }
        });
    } catch (err) {
        // Si no existe .env.local, usar solo variables de sistema
    }
}

loadEnvFile(path.join(__dirname, '.env.local'));

const requiredSupabaseVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_JWT_SECRET'
];

const optionalPostgresVars = [
    'POSTGRES_URL',
    'POSTGRES_PRISMA_URL',
    'POSTGRES_URL_NON_POOLING',
    'POSTGRES_USER',
    'POSTGRES_HOST',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE'
];

const otherVars = [
    'GOOGLE_SEARCH_API_KEY',
    'GOOGLE_SEARCH_ENGINE_ID',
    'GEMINI_API_KEY'
];

console.log('🔍 VERIFICACIÓN DE VARIABLES DE ENTORNO\n');
console.log('='.repeat(60));

// Verificar variables de Supabase (requeridas)
console.log('\n📦 VARIABLES DE SUPABASE (Requeridas):\n');
let supabaseOk = true;
requiredSupabaseVars.forEach(varName => {
    const exists = !!process.env[varName];
    const value = process.env[varName];
    const icon = exists ? '✅' : '❌';
    const preview = exists ? (value.substring(0, 20) + '...') : 'FALTANTE';
    console.log(`${icon} ${varName.padEnd(35)} ${preview}`);
    if (!exists) supabaseOk = false;
});

// Verificar variables de Postgres (opcionales en local)
console.log('\n🐘 VARIABLES DE POSTGRESQL (Opcionales en local):\n');
let postgresCount = 0;
optionalPostgresVars.forEach(varName => {
    const exists = !!process.env[varName];
    const value = process.env[varName];
    const icon = exists ? '✅' : '⚪';
    const preview = exists ? (value.substring(0, 20) + '...') : 'No configurada';
    console.log(`${icon} ${varName.padEnd(35)} ${preview}`);
    if (exists) postgresCount++;
});

// Verificar otras variables
console.log('\n🔧 OTRAS VARIABLES (Para funcionalidades adicionales):\n');
otherVars.forEach(varName => {
    const exists = !!process.env[varName];
    const value = process.env[varName];
    const icon = exists ? '✅' : '⚪';
    const preview = exists ? (value.substring(0, 20) + '...') : 'No configurada';
    console.log(`${icon} ${varName.padEnd(35)} ${preview}`);
});

// Resumen
console.log('\n' + '='.repeat(60));
console.log('\n📊 RESUMEN:\n');

if (supabaseOk) {
    console.log('✅ Variables de Supabase: COMPLETAS');
} else {
    console.log('❌ Variables de Supabase: INCOMPLETAS - ¡Revisa las marcadas con ❌!');
}

if (postgresCount > 0) {
    console.log(`✅ Variables de PostgreSQL: ${postgresCount}/${optionalPostgresVars.length} configuradas`);
} else {
    console.log('⚠️  Variables de PostgreSQL: No configuradas (se usarán de Vercel en producción)');
}

console.log('\n💡 SIGUIENTE PASO:');
if (!supabaseOk) {
    console.log('   → Configura las variables faltantes en tu archivo .env.local');
    console.log('   → Copia los valores desde: https://app.supabase.com (Settings → API)');
} else {
    console.log('   → Verifica las variables en Vercel (ver guía en verificacion_env_vars.md)');
    console.log('   → Comando: vercel env ls');
}

console.log('\n' + '='.repeat(60) + '\n');

// Exit code
process.exit(supabaseOk ? 0 : 1);
