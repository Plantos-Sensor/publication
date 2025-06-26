const fs = require('fs');

// Read the original script
let scriptContent = fs.readFileSync('script.js', 'utf8');

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Build script - SUPABASE_URL:', supabaseUrl);
console.log('🔍 Build script - SUPABASE_ANON_KEY length:', supabaseKey ? supabaseKey.length : 'undefined');

if (supabaseUrl && supabaseKey) {
    // Replace placeholders
    scriptContent = scriptContent.replace(/YOUR_SUPABASE_URL_HERE/g, supabaseUrl);
    scriptContent = scriptContent.replace(/YOUR_SUPABASE_ANON_KEY_HERE/g, supabaseKey);
    
    console.log('✅ Placeholders replaced');
    
    // Verify replacement worked
    if (scriptContent.includes('YOUR_SUPABASE_URL_HERE')) {
        console.log('❌ URL placeholder still found after replacement');
    } else {
        console.log('✅ URL placeholder successfully replaced');
    }
    
    if (scriptContent.includes('YOUR_SUPABASE_ANON_KEY_HERE')) {
        console.log('❌ Key placeholder still found after replacement');
    } else {
        console.log('✅ Key placeholder successfully replaced');
    }
} else {
    console.log('❌ Missing environment variables');
}

// Write the built script
fs.writeFileSync('build/script.js', scriptContent);
console.log('✅ Built script.js written to build directory');