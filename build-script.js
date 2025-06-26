const fs = require('fs');

console.log('🚀 Starting build script...');

// Read the original script
let scriptContent;
try {
    scriptContent = fs.readFileSync('script.js', 'utf8');
    console.log('✅ Read script.js successfully');
    console.log('📄 File size:', scriptContent.length, 'characters');
} catch (error) {
    console.error('❌ Failed to read script.js:', error);
    process.exit(1);
}

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Build script - SUPABASE_URL:', supabaseUrl);
console.log('🔍 Build script - SUPABASE_ANON_KEY length:', supabaseKey ? supabaseKey.length : 'undefined');

// Count placeholders before replacement
const urlPlaceholderCount = (scriptContent.match(/YOUR_SUPABASE_URL_HERE/g) || []).length;
const keyPlaceholderCount = (scriptContent.match(/YOUR_SUPABASE_ANON_KEY_HERE/g) || []).length;
console.log('🔍 Found', urlPlaceholderCount, 'URL placeholders');
console.log('🔍 Found', keyPlaceholderCount, 'key placeholders');

if (supabaseUrl && supabaseKey) {
    // Replace placeholders
    const originalContent = scriptContent;
    scriptContent = scriptContent.replace(/YOUR_SUPABASE_URL_HERE/g, supabaseUrl);
    scriptContent = scriptContent.replace(/YOUR_SUPABASE_ANON_KEY_HERE/g, supabaseKey);
    
    console.log('✅ Replacement attempted');
    console.log('📄 Content changed:', originalContent !== scriptContent);
    
    // Verify replacement worked
    if (scriptContent.includes('YOUR_SUPABASE_URL_HERE')) {
        console.log('❌ URL placeholder still found after replacement');
        // Show context around remaining placeholder
        const lines = scriptContent.split('\n');
        lines.forEach((line, index) => {
            if (line.includes('YOUR_SUPABASE_URL_HERE')) {
                console.log(`Line ${index + 1}: ${line.trim()}`);
            }
        });
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
    console.log('SUPABASE_URL exists:', !!supabaseUrl);
    console.log('SUPABASE_ANON_KEY exists:', !!supabaseKey);
}

// Write the built script
try {
    fs.writeFileSync('build/script.js', scriptContent);
    console.log('✅ Built script.js written to build directory');
    
    // Verify written file
    const writtenContent = fs.readFileSync('build/script.js', 'utf8');
    console.log('✅ Written file size:', writtenContent.length, 'characters');
    console.log('🔍 Written file contains URL placeholder:', writtenContent.includes('YOUR_SUPABASE_URL_HERE'));
    console.log('🔍 Written file contains key placeholder:', writtenContent.includes('YOUR_SUPABASE_ANON_KEY_HERE'));
} catch (error) {
    console.error('❌ Failed to write build/script.js:', error);
    process.exit(1);
}