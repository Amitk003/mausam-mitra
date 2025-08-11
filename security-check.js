#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔒 Running Security Check for Mausam Mitra...\n');

const securityIssues = [];
const warnings = [];

// Check for exposed API keys
function checkForExposedKeys() {
    console.log('🔍 Checking for exposed API keys...');
    
    const sensitivePatterns = [
        /AIzaSy[0-9A-Za-z_-]{33}/g,  // Google API keys
        /sk-[0-9A-Za-z]{48}/g,       // OpenAI API keys
        /xoxb-[0-9A-Za-z-]+/g,       // Slack tokens
        /ghp_[0-9A-Za-z]{36}/g,      // GitHub tokens
    ];
    
    const filesToCheck = [
        'public/script.js',
        'services/geminiService.js',
        'services/weatherService.js',
        'services/mandiService.js',
        'README.md'
    ];
    
    filesToCheck.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            sensitivePatterns.forEach(pattern => {
                const matches = content.match(pattern);
                if (matches) {
                    securityIssues.push(`🚨 Potential API key found in ${file}: ${matches[0].substring(0, 10)}...`);
                }
            });
        }
    });
}

// Check .env files
function checkEnvFiles() {
    console.log('🔍 Checking environment files...');
    
    if (fs.existsSync('.env')) {
        const envContent = fs.readFileSync('.env', 'utf8');
        if (envContent.includes('your_') || envContent.includes('example')) {
            warnings.push('⚠️  .env file contains placeholder values');
        }
        if (envContent.includes('AIzaSy')) {
            securityIssues.push('🚨 Real API key found in .env file');
        }
    }
    
    if (!fs.existsSync('.env.example')) {
        warnings.push('⚠️  .env.example file missing');
    }
}

// Check .gitignore
function checkGitignore() {
    console.log('🔍 Checking .gitignore...');
    
    if (!fs.existsSync('.gitignore')) {
        securityIssues.push('🚨 .gitignore file missing');
        return;
    }
    
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    const requiredEntries = ['.env', 'node_modules/', '*.log'];
    
    requiredEntries.forEach(entry => {
        if (!gitignoreContent.includes(entry)) {
            securityIssues.push(`🚨 .gitignore missing: ${entry}`);
        }
    });
}

// Check for hardcoded secrets
function checkHardcodedSecrets() {
    console.log('🔍 Checking for hardcoded secrets...');
    
    const secretPatterns = [
        /password\s*[:=]\s*["'][^"']+["']/gi,
        /secret\s*[:=]\s*["'][^"']+["']/gi,
        /token\s*[:=]\s*["'][^"']+["']/gi,
    ];
    
    const jsFiles = [
        'public/script.js',
        'server.js',
        'services/geminiService.js',
        'services/weatherService.js',
        'services/mandiService.js'
    ];
    
    jsFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            secretPatterns.forEach(pattern => {
                const matches = content.match(pattern);
                if (matches) {
                    securityIssues.push(`🚨 Potential hardcoded secret in ${file}`);
                }
            });
        }
    });
}

// Check dependencies
function checkDependencies() {
    console.log('🔍 Checking dependencies...');
    
    if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        // Check for known vulnerable packages (basic check)
        const vulnerablePackages = ['lodash@4.17.20', 'axios@0.21.0'];
        
        const allDeps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies
        };
        
        Object.keys(allDeps).forEach(dep => {
            const version = allDeps[dep];
            vulnerablePackages.forEach(vuln => {
                if (vuln.startsWith(dep + '@') && version === vuln.split('@')[1]) {
                    warnings.push(`⚠️  Potentially vulnerable dependency: ${dep}@${version}`);
                }
            });
        });
    }
}

// Check file permissions (basic)
function checkFilePermissions() {
    console.log('🔍 Checking file permissions...');
    
    const sensitiveFiles = ['.env', 'server.js'];
    
    sensitiveFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            const mode = stats.mode & parseInt('777', 8);
            if (mode & parseInt('044', 8)) {
                warnings.push(`⚠️  ${file} is readable by others`);
            }
        }
    });
}

// Run all checks
checkForExposedKeys();
checkEnvFiles();
checkGitignore();
checkHardcodedSecrets();
checkDependencies();
checkFilePermissions();

// Report results
console.log('\n📊 Security Check Results:');
console.log('========================');

if (securityIssues.length === 0) {
    console.log('✅ No critical security issues found!');
} else {
    console.log(`🚨 Found ${securityIssues.length} security issue(s):`);
    securityIssues.forEach(issue => console.log(issue));
}

if (warnings.length > 0) {
    console.log(`\n⚠️  Found ${warnings.length} warning(s):`);
    warnings.forEach(warning => console.log(warning));
}

console.log('\n🔒 Security Recommendations:');
console.log('1. Never commit .env files to version control');
console.log('2. Use environment variables for all API keys');
console.log('3. Regularly update dependencies');
console.log('4. Use HTTPS in production');
console.log('5. Implement rate limiting');
console.log('6. Regular security audits');

console.log('\n🎉 Security check complete!');

// Exit with error code if critical issues found
if (securityIssues.length > 0) {
    process.exit(1);
} else {
    process.exit(0);
}