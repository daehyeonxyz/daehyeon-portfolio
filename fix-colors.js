// 모든 neutral을 gray로 변경하는 스크립트
const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/portfolio/page.tsx',
  'src/app/admin/projects/new/page.tsx',
  'src/app/admin/projects/[id]/edit/page.tsx'
];

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Replace all occurrences of neutral with gray
    content = content.replace(/neutral-/g, 'gray-');
    content = content.replace(/prose-neutral/g, 'prose-gray');
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⏭️ No changes needed: ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('\n✨ All files updated successfully!');