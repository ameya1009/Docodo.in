import fs from 'fs';
import path from 'path';

const baseDir = './src/app/dashboard';
const pages = [
  { file: 'page.tsx', title: 'Dashboard' },
  { file: 'analytics/page.tsx', title: 'Analytics' },
  { file: 'bookings/page.tsx', title: 'Bookings' },
  { file: 'customers/page.tsx', title: 'CRM' },
  { file: 'settings/page.tsx', title: 'Settings' },
  { file: 'website/page.tsx', title: 'Website Builder' },
  { file: 'whatsapp/page.tsx', title: 'WhatsApp Nurturer' },
  { file: 'ai-content/page.tsx', title: 'AI Content Repurposer' }
];

pages.forEach(({file, title}) => {
  const filePath = path.join(baseDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if metadata already exists
    if (!content.includes('export const metadata')) {
      // Find the last import statement
      const importMatches = [...content.matchAll(/^import.*$/gm)];
      if (importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const insertPos = lastImport.index + lastImport[0].length;
        
        const metadataStr = `\n\nexport const metadata = {\n  title: "${title} | Docodo",\n  description: "Manage your business on Docodo."\n};`;
        
        const newContent = content.slice(0, insertPos) + metadataStr + content.slice(insertPos);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Injected metadata into ${file}`);
      }
    } else {
      console.log(`Metadata already exists in ${file}`);
    }
  }
});
