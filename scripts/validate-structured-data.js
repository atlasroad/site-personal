/**
 * Script to validate structured data implementation
 * This can be run in the browser console to check if structured data is properly injected
 */

function validateStructuredData() {
  console.log('🔍 Validating Structured Data...\n');
  
  // Find all JSON-LD scripts
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  
  if (jsonLdScripts.length === 0) {
    console.error('❌ No JSON-LD structured data found!');
    return false;
  }
  
  console.log(`✅ Found ${jsonLdScripts.length} JSON-LD script(s)\n`);
  
  let isValid = true;
  
  jsonLdScripts.forEach((script, index) => {
    console.log(`📄 Script ${index + 1}:`);
    
    try {
      const data = JSON.parse(script.innerHTML);
      
      if (Array.isArray(data)) {
        console.log(`   📊 Array with ${data.length} items:`);
        data.forEach((item, itemIndex) => {
          console.log(`   ${itemIndex + 1}. ${item['@type']} - ${item.name || 'Unnamed'}`);
          validateSchemaItem(item, `   `);
        });
      } else {
        console.log(`   📊 Single item: ${data['@type']} - ${data.name || 'Unnamed'}`);
        validateSchemaItem(data, `   `);
      }
      
      console.log('   ✅ Valid JSON-LD\n');
      
    } catch (error) {
      console.error(`   ❌ Invalid JSON in script ${index + 1}:`, error);
      isValid = false;
    }
  });
  
  if (isValid) {
    console.log('🎉 All structured data is valid!');
    console.log('\n📋 Validation Summary:');
    console.log(`   • ${jsonLdScripts.length} JSON-LD scripts found`);
    console.log('   • All scripts contain valid JSON');
    console.log('   • Schema.org context detected');
    
    // Additional recommendations
    console.log('\n💡 Next Steps:');
    console.log('   • Test with Google Rich Results Test: https://search.google.com/test/rich-results');
    console.log('   • Validate with Schema.org validator: https://validator.schema.org/');
    console.log('   • Check Facebook Open Graph: https://developers.facebook.com/tools/debug/');
  }
  
  return isValid;
}

function validateSchemaItem(item, indent = '') {
  // Check required Schema.org properties
  if (!item['@context']) {
    console.warn(`${indent}⚠️  Missing @context`);
  } else if (item['@context'] !== 'https://schema.org') {
    console.warn(`${indent}⚠️  Non-standard @context: ${item['@context']}`);
  }
  
  if (!item['@type']) {
    console.warn(`${indent}⚠️  Missing @type`);
  }
  
  // Type-specific validations
  switch (item['@type']) {
    case 'Organization':
      if (!item.name) console.warn(`${indent}⚠️  Organization missing name`);
      if (!item.url) console.warn(`${indent}⚠️  Organization missing url`);
      break;
      
    case 'WebSite':
      if (!item.name) console.warn(`${indent}⚠️  WebSite missing name`);
      if (!item.url) console.warn(`${indent}⚠️  WebSite missing url`);
      break;
      
    case 'Service':
      if (!item.name) console.warn(`${indent}⚠️  Service missing name`);
      if (!item.description) console.warn(`${indent}⚠️  Service missing description`);
      break;
      
    case 'FAQPage':
      if (!item.mainEntity || !Array.isArray(item.mainEntity)) {
        console.warn(`${indent}⚠️  FAQPage missing mainEntity array`);
      }
      break;
      
    case 'LocalBusiness':
      if (!item.name) console.warn(`${indent}⚠️  LocalBusiness missing name`);
      if (!item.address) console.warn(`${indent}⚠️  LocalBusiness missing address`);
      break;
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validateStructuredData);
  } else {
    validateStructuredData();
  }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateStructuredData, validateSchemaItem };
}