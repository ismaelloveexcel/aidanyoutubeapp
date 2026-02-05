import jsPDF from 'jspdf';

// Export text content to various formats
export function exportToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function exportToTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToPDF(content: string, filename: string, title?: string) {
  const doc = new jsPDF();
  
  // Add title
  if (title) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
  }
  
  // Split content into lines that fit the page width
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxLineWidth = pageWidth - (margin * 2);
  
  const lines = doc.splitTextToSize(content, maxLineWidth);
  
  let y = title ? 35 : 20;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.getHeight();
  
  lines.forEach((line: string) => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });
  
  doc.save(`${filename}.pdf`);
}

// Format script for export
export function formatScriptForExport(title: string, steps: { stepId: number; content: string }[]): string {
  let output = `${title}\n`;
  output += '='.repeat(title.length) + '\n\n';
  
  steps.forEach((step, index) => {
    output += `STEP ${index + 1}:\n`;
    output += `${step.content}\n\n`;
  });
  
  output += '\n---\n';
  output += 'Created with TubeStar Creator Studio\n';
  
  return output;
}

// Format idea for export
export function formatIdeaForExport(idea: { title: string; description: string; category: string }): string {
  let output = `📽️ VIDEO IDEA: ${idea.title}\n\n`;
  output += `Category: ${idea.category}\n\n`;
  output += `Description:\n${idea.description}\n\n`;
  output += '---\n';
  output += 'Created with TubeStar Creator Studio\n';
  
  return output;
}
