// Script pour initialiser la base de données Supabase
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const supabaseUrl = 'https://khcnyegvumgzhkjazsaj.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante dans .env');
    console.log('Ajoutez cette ligne dans votre .env :');
    console.log('SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key');
    return;
  }

  // Lire le script SQL
  const sqlContent = fs.readFileSync(
    path.join(__dirname, 'supabase', 'schema.sql'),
    'utf8'
  );

  try {
    console.log('🔄 Exécution du script SQL...');

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({
        sql: sqlContent
      })
    });

    if (response.ok) {
      console.log('✅ Base de données initialisée avec succès !');
      console.log('Vous pouvez maintenant créer des comptes sur http://localhost:3000');
    } else {
      console.error('❌ Erreur lors de l\'exécution :', await response.text());
    }
  } catch (error) {
    console.error('❌ Erreur :', error.message);
  }
}

// Vérifier si les variables d'environnement sont chargées
require('dotenv').config();
setupDatabase();