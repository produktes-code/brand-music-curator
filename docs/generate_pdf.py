from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.cell(0, 10, 'Studio Pro Suite - Manual de Usuario', 0, 1, 'C')
        self.ln(5)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Página {self.page_no()}', 0, 0, 'C')

pdf = PDF()
pdf.core_fonts_encoding = 'latin-1'
pdf.set_compression(False)
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

with open('USER_MANUAL.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Renderizar secciones en 7 idiomas
# To avoid latin-1 encoding errors from fpdf2 with core fonts, convert text
content = content.encode('latin-1', 'ignore').decode('latin-1')

sections = content.split('## ')
for section in sections[1:]:
    title = section.split('\n')[0]
    pdf.set_font('Helvetica', 'B', 14)
    # Sanitize long words just in case
    safe_title = ' '.join([title[i:i+50] for i in range(0, len(title), 50)])
    pdf.write(10, safe_title)
    pdf.ln(10)
    pdf.set_font('Helvetica', '', 10)
    body = '\n'.join(section.split('\n')[1:])
    safe_body = ' '.join([body[i:i+50] for i in range(0, len(body), 50)])
    pdf.write(5, safe_body[:5000] if len(safe_body) > 5000 else safe_body)
    pdf.ln(10)

pdf.output('USER_MANUAL.pdf')
print("PDF generado con éxito")
