#!/usr/bin/env node

/**
 * Heading Hierarchy Audit Script
 * 
 * This script audits the heading structure across all React components
 * to ensure proper SEO and accessibility compliance.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const COMPONENTS_DIR = path.join(__dirname, '../components');
const APP_DIR = path.join(__dirname, '../app');

// Heading patterns to match
const HEADING_PATTERNS = {
  jsx: /<h([1-6])[^>]*>/gi,
  component: /<H([1-6])[^>]*>/gi,
  selfClosing: /<h([1-6])[^>]*\/>/gi,
  componentSelfClosing: /<H([1-6])[^>]*\/>/gi
};

// Results storage
const auditResults = {
  files: [],
  violations: [],
  summary: {
    totalFiles: 0,
    filesWithHeadings: 0,
    totalHeadings: 0,
    violationsFound: 0,
    h1Count: 0,
    multipleH1Files: []
  }
};

/**
 * Extract headings from file content
 */
function extractHeadings(content, filePath) {
  const headings = [];
  
  // Find all heading patterns
  Object.entries(HEADING_PATTERNS).forEach(([type, pattern]) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const fullMatch = match[0];
      const lineNumber = content.substring(0, match.index).split('\n').length;
      
      headings.push({
        level,
        type: type.includes('component') ? 'component' : 'html',
        match: fullMatch,
        lineNumber,
        filePath
      });
    }
  });
  
  return headings.sort((a, b) => a.lineNumber - b.lineNumber);
}

/**
 * Validate heading hierarchy for a single file
 */
function validateFileHierarchy(headings, filePath) {
  const violations = [];
  let lastLevel = 0;
  let h1Count = 0;
  
  headings.forEach((heading, index) => {
    const { level, lineNumber } = heading;
    
    // Count H1s
    if (level === 1) {
      h1Count++;
    }
    
    // Check for hierarchy violations (skipping levels)
    if (level > lastLevel + 1) {
      violations.push({
        type: 'hierarchy_skip',
        message: `Heading hierarchy violation: H${level} follows H${lastLevel} (skipped H${lastLevel + 1})`,
        filePath,
        lineNumber,
        level,
        previousLevel: lastLevel
      });
    }
    
    lastLevel = level;
  });
  
  // Check for multiple H1s in a single file
  if (h1Count > 1) {
    violations.push({
      type: 'multiple_h1',
      message: `Multiple H1 headings found (${h1Count} total)`,
      filePath,
      count: h1Count
    });
    auditResults.summary.multipleH1Files.push(filePath);
  }
  
  auditResults.summary.h1Count += h1Count;
  
  return violations;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const headings = extractHeadings(content, filePath);
    
    let violations = [];
    
    if (headings.length > 0) {
      auditResults.summary.filesWithHeadings++;
      auditResults.summary.totalHeadings += headings.length;
      
      violations = validateFileHierarchy(headings, filePath);
      auditResults.violations.push(...violations);
      auditResults.summary.violationsFound += violations.length;
    }
    
    auditResults.files.push({
      path: filePath,
      headings,
      violations
    });
    
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

/**
 * Recursively scan directory for React files
 */
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanDirectory(filePath);
    } else if (file.match(/\.(tsx|jsx)$/)) {
      processFile(filePath);
      auditResults.summary.totalFiles++;
    }
  });
}

/**
 * Generate audit report
 */
function generateReport() {
  console.log('\n🔍 HEADING HIERARCHY AUDIT REPORT');
  console.log('=====================================\n');
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log(`   Total files scanned: ${auditResults.summary.totalFiles}`);
  console.log(`   Files with headings: ${auditResults.summary.filesWithHeadings}`);
  console.log(`   Total headings found: ${auditResults.summary.totalHeadings}`);
  console.log(`   Total H1 headings: ${auditResults.summary.h1Count}`);
  console.log(`   Violations found: ${auditResults.summary.violationsFound}\n`);
  
  // Violations
  if (auditResults.violations.length > 0) {
    console.log('⚠️  VIOLATIONS FOUND:');
    auditResults.violations.forEach((violation, index) => {
      console.log(`   ${index + 1}. ${violation.message}`);
      console.log(`      File: ${violation.filePath}`);
      if (violation.lineNumber) {
        console.log(`      Line: ${violation.lineNumber}`);
      }
      console.log('');
    });
  } else {
    console.log('✅ No heading hierarchy violations found!\n');
  }
  
  // Files with multiple H1s
  if (auditResults.summary.multipleH1Files.length > 0) {
    console.log('🚨 FILES WITH MULTIPLE H1 HEADINGS:');
    auditResults.summary.multipleH1Files.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('');
  }
  
  // Detailed file breakdown
  console.log('📋 DETAILED BREAKDOWN:');
  auditResults.files
    .filter(file => file.headings.length > 0)
    .forEach(file => {
      console.log(`\n   📄 ${file.path}`);
      file.headings.forEach(heading => {
        const icon = heading.type === 'component' ? '🔧' : '📝';
        console.log(`      ${icon} H${heading.level} (line ${heading.lineNumber})`);
      });
    });
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('   1. Ensure each page has exactly one H1 heading');
  console.log('   2. Follow logical heading progression (H1 → H2 → H3, etc.)');
  console.log('   3. Use the new Heading components for automatic validation');
  console.log('   4. Consider using HeadingProvider for context-aware heading levels');
  console.log('   5. Test with screen readers to ensure accessibility\n');
  
  // SEO Impact
  if (auditResults.summary.violationsFound > 0) {
    console.log('🔍 SEO IMPACT:');
    console.log('   - Heading hierarchy violations can negatively impact SEO rankings');
    console.log('   - Search engines use heading structure to understand content organization');
    console.log('   - Multiple H1s can confuse search engine crawlers');
    console.log('   - Proper heading structure improves accessibility for screen readers\n');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('Starting heading hierarchy audit...\n');
  
  // Scan components directory
  if (fs.existsSync(COMPONENTS_DIR)) {
    console.log('Scanning components directory...');
    scanDirectory(COMPONENTS_DIR);
  }
  
  // Scan app directory
  if (fs.existsSync(APP_DIR)) {
    console.log('Scanning app directory...');
    scanDirectory(APP_DIR);
  }
  
  // Generate and display report
  generateReport();
  
  // Exit with appropriate code
  process.exit(auditResults.summary.violationsFound > 0 ? 1 : 0);
}

// Run the audit
main();