#!/usr/bin/env node

/**
 * Image Optimization Audit Script
 * Audits all images in the project for SEO and performance compliance
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  componentsDir: './components',
  publicDir: './public',
  appDir: './app',
  libDir: './lib',
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif'],
  maxAltTextLength: 125,
  minAltTextLength: 10,
  requiredKeywords: ['personal trainer', 'transformação', 'fitness', 'treino', 'pro trainer'],
};

// Results storage
const auditResults = {
  totalImages: 0,
  imagesWithIssues: 0,
  missingAltText: [],
  poorAltText: [],
  missingLazyLoading: [],
  missingSizes: [],
  missingPriority: [],
  unusedImages: [],
  recommendations: [],
};

/**
 * Recursively find all files with given extensions
 */
function findFiles(dir, extensions, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findFiles(fullPath, extensions, files);
    } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extract image usage from file content
 */
function extractImageUsage(filePath, content) {
  const images = [];
  
  // Match Next.js Image components
  const imageRegex = /<Image[^>]*>/g;
  const matches = content.match(imageRegex) || [];
  
  for (const match of matches) {
    const image = {
      file: filePath,
      component: match,
      src: extractAttribute(match, 'src'),
      alt: extractAttribute(match, 'alt'),
      sizes: extractAttribute(match, 'sizes'),
      priority: match.includes('priority'),
      loading: extractAttribute(match, 'loading'),
      quality: extractAttribute(match, 'quality'),
    };
    
    images.push(image);
  }
  
  // Match regular img tags
  const imgRegex = /<img[^>]*>/g;
  const imgMatches = content.match(imgRegex) || [];
  
  for (const match of imgMatches) {
    const image = {
      file: filePath,
      component: match,
      src: extractAttribute(match, 'src'),
      alt: extractAttribute(match, 'alt'),
      isRegularImg: true,
    };
    
    images.push(image);
  }
  
  return images;
}

/**
 * Extract attribute value from HTML/JSX
 */
function extractAttribute(html, attr) {
  const regex = new RegExp(`${attr}=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

/**
 * Validate alt text quality
 */
function validateAltText(alt, context = {}) {
  const issues = [];
  const suggestions = [];
  
  if (!alt) {
    issues.push('Missing alt text');
    suggestions.push('Add descriptive alt text');
    return { issues, suggestions, score: 0 };
  }
  
  if (alt.length < config.minAltTextLength) {
    issues.push('Alt text too short');
    suggestions.push('Expand alt text to be more descriptive');
  }
  
  if (alt.length > config.maxAltTextLength) {
    issues.push('Alt text too long');
    suggestions.push('Shorten alt text while keeping essential information');
  }
  
  // Check for redundant phrases
  const redundantPhrases = ['image of', 'picture of', 'photo of', 'graphic of'];
  if (redundantPhrases.some(phrase => alt.toLowerCase().includes(phrase))) {
    issues.push('Contains redundant phrases');
    suggestions.push('Remove phrases like "image of" or "picture of"');
  }
  
  // Check for SEO keywords (fitness context)
  const hasKeywords = config.requiredKeywords.some(keyword => 
    alt.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (!hasKeywords) {
    suggestions.push('Consider adding relevant fitness/training keywords for SEO');
  }
  
  // Calculate score
  let score = 100;
  score -= issues.length * 20;
  if (!hasKeywords) score -= 10;
  
  return { issues, suggestions, score: Math.max(0, score) };
}

/**
 * Check if image needs lazy loading
 */
function shouldBeLazyLoaded(image, context = {}) {
  // Hero images and above-the-fold content should not be lazy loaded
  const eagerLoadingContexts = ['hero', 'logo', 'header'];
  const filePath = image.file.toLowerCase();
  
  if (eagerLoadingContexts.some(ctx => filePath.includes(ctx))) {
    return false;
  }
  
  if (image.priority) {
    return false;
  }
  
  return true;
}

/**
 * Audit individual image
 */
function auditImage(image) {
  const issues = [];
  const suggestions = [];
  let score = 100;
  
  // Check alt text
  const altValidation = validateAltText(image.alt);
  issues.push(...altValidation.issues);
  suggestions.push(...altValidation.suggestions);
  score = Math.min(score, altValidation.score);
  
  // Check for regular img tags (should use Next.js Image)
  if (image.isRegularImg) {
    issues.push('Using regular <img> tag instead of Next.js Image component');
    suggestions.push('Replace with Next.js Image component for optimization');
    score -= 30;
  }
  
  // Check lazy loading
  if (shouldBeLazyLoaded(image) && image.loading !== 'lazy' && !image.loading) {
    issues.push('Missing lazy loading');
    suggestions.push('Add loading="lazy" for better performance');
    score -= 15;
  }
  
  // Check sizes attribute for responsive images
  if (!image.sizes && !image.priority) {
    issues.push('Missing sizes attribute');
    suggestions.push('Add sizes attribute for responsive optimization');
    score -= 10;
  }
  
  // Check priority for above-the-fold images
  const isAboveFold = image.file.toLowerCase().includes('hero') || 
                     image.file.toLowerCase().includes('header');
  if (isAboveFold && !image.priority) {
    suggestions.push('Consider adding priority={true} for above-the-fold images');
    score -= 5;
  }
  
  return {
    image,
    issues,
    suggestions,
    score,
    hasIssues: issues.length > 0
  };
}

/**
 * Find unused images in public directory
 */
function findUnusedImages(usedImages, publicDir) {
  const unused = [];
  
  if (!fs.existsSync(publicDir)) return unused;
  
  const publicImages = findFiles(publicDir, config.imageExtensions);
  const usedSrcs = usedImages.map(img => img.src).filter(Boolean);
  
  for (const imagePath of publicImages) {
    const relativePath = imagePath.replace('./public', '');
    const isUsed = usedSrcs.some(src => src.includes(relativePath));
    
    if (!isUsed) {
      unused.push(relativePath);
    }
  }
  
  return unused;
}

/**
 * Generate recommendations
 */
function generateRecommendations(results) {
  const recommendations = [];
  
  if (results.missingAltText.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'Accessibility',
      title: 'Add missing alt text',
      description: `${results.missingAltText.length} images are missing alt text`,
      impact: 'SEO and accessibility compliance'
    });
  }
  
  if (results.poorAltText.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'SEO',
      title: 'Improve alt text quality',
      description: `${results.poorAltText.length} images have poor quality alt text`,
      impact: 'Better search engine visibility'
    });
  }
  
  if (results.missingLazyLoading.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'Performance',
      title: 'Implement lazy loading',
      description: `${results.missingLazyLoading.length} images should use lazy loading`,
      impact: 'Faster initial page load'
    });
  }
  
  if (results.missingSizes.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'Performance',
      title: 'Add responsive sizes',
      description: `${results.missingSizes.length} images missing sizes attribute`,
      impact: 'Better responsive image optimization'
    });
  }
  
  if (results.unusedImages.length > 0) {
    recommendations.push({
      priority: 'low',
      category: 'Optimization',
      title: 'Remove unused images',
      description: `${results.unusedImages.length} unused images found`,
      impact: 'Reduced bundle size'
    });
  }
  
  return recommendations;
}

/**
 * Main audit function
 */
function auditImages() {
  console.log('🔍 Starting image optimization audit...\n');
  
  // Find all component files
  const componentFiles = [
    ...findFiles(config.componentsDir, config.extensions),
    ...findFiles(config.appDir, config.extensions),
    ...findFiles(config.libDir, config.extensions),
  ];
  
  const allImages = [];
  
  // Extract images from each file
  for (const filePath of componentFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const images = extractImageUsage(filePath, content);
      allImages.push(...images);
    } catch (error) {
      console.warn(`⚠️  Could not read file: ${filePath}`);
    }
  }
  
  auditResults.totalImages = allImages.length;
  
  // Audit each image
  const imageAudits = allImages.map(auditImage);
  
  // Categorize issues
  for (const audit of imageAudits) {
    if (audit.hasIssues) {
      auditResults.imagesWithIssues++;
    }
    
    if (audit.issues.includes('Missing alt text')) {
      auditResults.missingAltText.push(audit.image);
    }
    
    if (audit.issues.some(issue => issue.includes('alt text'))) {
      auditResults.poorAltText.push(audit.image);
    }
    
    if (audit.issues.includes('Missing lazy loading')) {
      auditResults.missingLazyLoading.push(audit.image);
    }
    
    if (audit.issues.includes('Missing sizes attribute')) {
      auditResults.missingSizes.push(audit.image);
    }
  }
  
  // Find unused images
  auditResults.unusedImages = findUnusedImages(allImages, config.publicDir);
  
  // Generate recommendations
  auditResults.recommendations = generateRecommendations(auditResults);
  
  // Print results
  printResults(auditResults, imageAudits);
}

/**
 * Print audit results
 */
function printResults(results, audits) {
  console.log('📊 IMAGE OPTIMIZATION AUDIT RESULTS');
  console.log('=====================================\n');
  
  // Summary
  console.log('📈 SUMMARY');
  console.log(`Total images found: ${results.totalImages}`);
  console.log(`Images with issues: ${results.imagesWithIssues}`);
  console.log(`Success rate: ${Math.round(((results.totalImages - results.imagesWithIssues) / results.totalImages) * 100)}%\n`);
  
  // Issues breakdown
  if (results.imagesWithIssues > 0) {
    console.log('🚨 ISSUES FOUND');
    console.log(`Missing alt text: ${results.missingAltText.length}`);
    console.log(`Poor alt text quality: ${results.poorAltText.length}`);
    console.log(`Missing lazy loading: ${results.missingLazyLoading.length}`);
    console.log(`Missing sizes attribute: ${results.missingSizes.length}`);
    console.log(`Unused images: ${results.unusedImages.length}\n`);
  }
  
  // Detailed issues
  if (results.imagesWithIssues > 0) {
    console.log('🔍 DETAILED ISSUES');
    console.log('==================');
    
    for (const audit of audits) {
      if (audit.hasIssues) {
        console.log(`\n📁 ${audit.image.file}`);
        console.log(`🖼️  ${audit.image.src || 'No src'}`);
        console.log(`📝 Alt: "${audit.image.alt || 'Missing'}"`);
        console.log(`⭐ Score: ${audit.score}/100`);
        
        if (audit.issues.length > 0) {
          console.log('❌ Issues:');
          audit.issues.forEach(issue => console.log(`   • ${issue}`));
        }
        
        if (audit.suggestions.length > 0) {
          console.log('💡 Suggestions:');
          audit.suggestions.forEach(suggestion => console.log(`   • ${suggestion}`));
        }
      }
    }
  }
  
  // Recommendations
  if (results.recommendations.length > 0) {
    console.log('\n🎯 RECOMMENDATIONS');
    console.log('==================');
    
    for (const rec of results.recommendations) {
      const priorityEmoji = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`\n${priorityEmoji} ${rec.title} (${rec.category})`);
      console.log(`   ${rec.description}`);
      console.log(`   Impact: ${rec.impact}`);
    }
  }
  
  // Success message
  if (results.imagesWithIssues === 0) {
    console.log('✅ All images are properly optimized! Great job!');
  } else {
    console.log(`\n📋 Fix ${results.imagesWithIssues} images to achieve 100% optimization.`);
  }
  
  console.log('\n🏁 Audit complete!');
}

// Run the audit
if (require.main === module) {
  auditImages();
}

module.exports = { auditImages, validateAltText };