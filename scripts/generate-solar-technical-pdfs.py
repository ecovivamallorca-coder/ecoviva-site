"""Solar A4 sheets in the approved EcoViva Technical Library family.
Run after publish-solar-service.mjs. Only the supplied Pedro product assets are used.
"""
from pathlib import Path
from io import BytesIO
import base64, json, re
from xml.sax.saxutils import escape
from PIL import Image
import fitz
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import Font
from reportlab.lib.utils import ImageReader
ROOT=Path(__file__).resolve().parent.parent
A=ROOT/'public/assets/technical-library/solar'
P=json.loads((ROOT/'scripts/solar-premium-content.json').read_text())
C=json.loads((ROOT/'scripts/solar-pdf-content.generated.json').read_text())
# Arial-compatible PDF standard metrics; the original header marks and footer
# are copied as vector content from the approved facade templates below.
W,H=595.276,841.89;M=20;G=HexColor('#3e6b20');INK=HexColor('#0b0d0b');MUTED=HexColor('#454a45');PALE=HexColor('#f6f8f4');LINE=HexColor('#d9ded8')
style=ParagraphStyle('body',fontName='Helvetica',fontSize=9,leading=12.5,textColor=MUTED)
heading=ParagraphStyle('heading',fontName='Helvetica-Bold',fontSize=10,leading=13,textColor=G)
paths={'en':'solar-panels-battery-system','es':'sistema-fotovoltaico-baterias','de':'photovoltaik-batteriesystem'}
services={'en':'solar-panels-mallorca','es':'placas-solares-mallorca','de':'photovoltaik-mallorca'}
points={'pitched':[(68,76),(77,51),(80,40),(60,28),(13,23),(50,19)],'flat':[(70,76),(80,49),(79,43),(64,27),(18,33),(32,20)]}
labels={
 'en':['Technical fiche','Technical Library','Solar service','System overview','Technical principles','Equipment supplied','Illustrative integration'],
 'es':['Ficha técnica','Biblioteca técnica','Servicio solar','Resumen del sistema','Principios técnicos','Equipos previstos','Integración ilustrativa'],
 'de':['Technisches Datenblatt','Technische Bibliothek','Solarservice','Systemübersicht','Technische Grundsätze','Vorgesehene Technik','Schematische Integration']}

def para(cv,text,x,y,w,sty=style,maxh=None):
 p=Paragraph(escape(text),sty);_,h=p.wrap(w,900)
 if maxh is not None and h>maxh:raise ValueError(f'Text overflow: {text[:60]} {h}>{maxh}')
 p.drawOn(cv,x,y-h);return y-h

def box(cv,x,y,w,h):
 cv.setFillColor(white);cv.setStrokeColor(G);cv.setLineWidth(.75);cv.roundRect(x,y,w,h,7,fill=1,stroke=1)

def section(cv,title,y,x=M,w=W-2*M):
 para(cv,title.upper(),x+12,y,w-24,heading,maxh=27)
 cv.setStrokeColor(LINE);cv.setLineWidth(.4);cv.line(x+12,y-30,x+w-12,y-30)

def image(cv,key,x,y,w,h):
 src=A/(key+'.png') if (A/(key+'.png')).exists() else A/(key+'-v3.webp')
 im=Image.open(src).convert('RGB');im.thumbnail((round(w*2.5),round(h*2.5)),Image.Resampling.LANCZOS)
 buf=BytesIO();im.save(buf,format='JPEG',quality=86,optimize=True);buf.seek(0)
 cv.drawImage(ImageReader(buf),x,y,w,h,preserveAspectRatio=True,anchor='c')

TEMPLATES={
 'en':'EcoViva_A4_Universal_Ventilated_Facade_System_EN_Download.pdf',
 'es':'EcoViva_A4_Sistema_Universal_Fachada_Ventilada_ES_Download.pdf',
 'de':'EcoViva_A4_Universelles_Hinterlueftetes_Fassadensystem_DE_Download.pdf',
}
TITLE_LINES={
 'en':['SOLAR PANELS &','BATTERY SYSTEM'],
 'es':['SISTEMA FOTOVOLTAICO','Y BATERÍAS'],
 'de':['PHOTOVOLTAIK- &','BATTERIESYSTEM'],
}

def base(cv,l,num,subtitle):
 cv.setFillColor(white);cv.rect(0,0,W,H,fill=1,stroke=0)
 # The positions and sizes follow the approved A4 facade header.
 cv.setFillColor(G);cv.setFont('Helvetica-Bold',7.2)
 # Library label is copied from the language-specific approved PDF.
 cv.setFillColor(INK);cv.setFont('Helvetica-Bold',20.2)
 for i,line in enumerate(TITLE_LINES[l]):cv.drawString(178.5827,H-49.1131-i*22.11035,line)
 cv.setFillColor(MUTED);cv.setFont('Helvetica-Bold',8.4)
 cv.drawString(178.5827,H-84.9351,subtitle.upper())

def apply_approved_template(out,l):
 """Reuse the actual PDF artwork, with no reconstructed footer or new QR URLs."""
 doc=fitz.open(out);template=fitz.open(ROOT/'public/downloads'/TEMPLATES[l])
 source=template[0]
 # Remove the unused facade body before grafting PDF resources. This keeps
 # unrelated high-resolution facade images out of the solar download.
 source.add_redact_annot(fitz.Rect(0,96,W,801),fill=None)
 source.apply_redactions(images=2,graphics=2,text=0)
 clean=template.tobytes(garbage=4,deflate=True)
 template.close();template=fitz.open(stream=clean,filetype='pdf')
 # Exact source regions: logo, QR + language badge, and the complete footer.
 # show_pdf_page retains the original fonts, glyphs, colours and vector geometry.
 for page in doc:
  for r in [fitz.Rect(0,0,170,96),fitz.Rect(178,15,300,28),fitz.Rect(520,8,577,65),fitz.Rect(485,64,515,94),fitz.Rect(0,801,595.2756,841.8898)]:
   page.show_pdf_page(r,template,0,clip=r)
  url=f'https://www.ecoviva-mallorca.com/technical-library/{l}/'
  page.insert_link({'kind':fitz.LINK_URI,'from':fitz.Rect(520,12,577,66),'uri':url})
 tmp=out.with_suffix('.template.pdf');doc.save(tmp,garbage=4,deflate=True);doc.close();template.close();tmp.replace(out)

def roofpage(cv,l,kind,num):
 p=P[l];c=C[l];base(cv,l,num,p['pdfSubtitle'])
 box(cv,M,389,W-2*M,345);section(cv,p[kind+'Title'],719)
 x=M+20;y=402;w=330;h=220
 image(cv,kind,x,y,w,h)
 for n,(px,py) in enumerate(points[kind],1):
  xx=x+w*px/100;yy=y+h*(1-py/100)
  cv.setFillColor(G);cv.setStrokeColor(white);cv.setLineWidth(1);cv.circle(xx,yy,7,fill=1,stroke=1)
  cv.setFillColor(white);cv.setFont('Helvetica-Bold',8);cv.drawCentredString(xx,yy-2.8,str(n))
 para(cv,p[kind+'Intro'],M+12,675,W-2*M-24,style,maxh=47)
 xx=M+365;ww=W-2*M-377
 para(cv,labels[l][3].upper(),xx,619,ww,ParagraphStyle('sub',parent=heading,fontSize=8,leading=11),maxh=25)
 para(cv,p['overview'],xx,585,ww,ParagraphStyle('overview',parent=style,fontSize=8.3,leading=11.5),maxh=148)
 para(cv,labels[l][6],x,403,w,ParagraphStyle('note',parent=style,fontSize=6.5,leading=9),maxh=10)
 box(cv,M,236,W-2*M,139);section(cv,p['layersTitle'],361)
 for i,text in enumerate(p[kind+'Layers']):
  col=i//3;row=i%3;x=M+13+col*270;y=320-row*26
  cv.setFillColor(G);cv.circle(x+7,y-6,7,fill=1,stroke=0);cv.setFillColor(white);cv.setFont('Helvetica-Bold',7);cv.drawCentredString(x+7,y-8.5,str(i+1))
  para(cv,text,x+21,y,235,ParagraphStyle('label',parent=style,fontSize=8.5,leading=11),maxh=24)
 box(cv,M,44,W-2*M,179);section(cv,labels[l][4],209)
 para(cv,p['pdfPrinciples'],M+12,170,W-2*M-24,ParagraphStyle('principle',parent=style,fontSize=8,leading=11),maxh=34)
 para(cv,p['layerNote'],M+12,141,W-2*M-24,ParagraphStyle('note',parent=style,fontSize=6.8,leading=9),maxh=20)
 for i,(name,desc) in enumerate(c['checks'][:2]):
  xx=M+12+i*270
  yy=para(cv,name,xx,112,255,ParagraphStyle('roof-check',parent=heading,fontSize=8,leading=11),maxh=24)
  para(cv,desc,xx,yy-4,255,ParagraphStyle('roof-check-copy',parent=style,fontSize=7.3,leading=10),maxh=40)
 cv.showPage()

def detailpage(cv,l):
 p=P[l];c=C[l];base(cv,l,3,p['pdfDetails'])
 box(cv,M,397,W-2*M,337);section(cv,p['detailsTitle'],719)
 para(cv,p['detailsIntro'],M+12,678,W-2*M-24,ParagraphStyle('intro',parent=style,fontSize=8.5,leading=11),maxh=34)
 keys=['promount-hook','promount-rail','promount-middle-clamp','promount-end-clamp','promount-solarspeed-profile','promount-solarspeed-sideplate','promount-ballast-holder']
 colw=(W-2*M-30)/4
 for i,(name,desc) in enumerate(p['details']):
  col=i%4;row=i//4;x=M+12+col*(colw+2);y=570-row*118
  image(cv,keys[i],x,y+18,colw-10,50)
  para(cv,f'{i+1}. {name}',x,y+13,colw-9,ParagraphStyle('component-label',parent=heading,fontSize=8,leading=10),maxh=30)
  para(cv,desc,x,y-16,colw-9,ParagraphStyle('component-description',parent=style,fontSize=6.5,leading=8.5),maxh=34)
 box(cv,M,215,W-2*M,176);section(cv,c['qualityTitle'],377)
 colw=(W-2*M-40)/3
 for i,(name,desc) in enumerate(c['equipment']):
  x=M+12+i*(colw+8);image(cv,['bauer-panel','solis-inverter','marstek-venus'][i],x,290,colw,44)
  y=para(cv,name,x,283,colw,ParagraphStyle('eq-title',parent=heading,fontSize=8.2,leading=11),maxh=24)
  para(cv,desc,x,y-4,colw,ParagraphStyle('eq-copy',parent=style,fontSize=7.4,leading=10),maxh=65)
 box(cv,M,44,W-2*M,158);section(cv,c['checksTitle'],188)
 para(cv,p['pdfPrinciples'],M+12,149,W-2*M-24,ParagraphStyle('checks',parent=style,fontSize=8,leading=11),maxh=25)
 for i,(name,desc) in enumerate(c['checks'][2:]):
  xx=M+12+i*270
  yy=para(cv,name,xx,112,255,ParagraphStyle('equipment-check',parent=heading,fontSize=8,leading=11),maxh=24)
  para(cv,desc,xx,yy-4,255,ParagraphStyle('equipment-check-copy',parent=style,fontSize=7.3,leading=10),maxh=40)
 cv.showPage()

def lastpage(cv,l):
 p=P[l];c=C[l];base(cv,l,4,p['pdfApplications']+' · '+p['pdfElectric'])
 box(cv,M,506,W-2*M,228);section(cv,p['galleryTitle'],719)
 w=(W-2*M-40)/3
 for i,key in enumerate(['photo-pitched','photo-flat','photo-ground']):
  x=M+12+i*(w+8);image(cv,key,x,571,w,110)
  y=para(cv,c['solutions'][i][0],x,560,w,ParagraphStyle('caption',parent=heading,fontSize=8.5,leading=11),maxh=24)
  para(cv,c['solutions'][i][1],x,y-4,w,ParagraphStyle('application',parent=style,fontSize=7,leading=9),maxh=45)
 box(cv,M,245,W-2*M,248);section(cv,p['electrical'],479)
 colw=(W-2*M-40)/3
 for i,(name,desc) in enumerate(c['components']):
  row=i//3;col=i%3;x=M+12+col*(colw+8);y=438-row*92
  y2=para(cv,name,x,y,colw,ParagraphStyle('smallhead',parent=heading,fontSize=8.5,leading=11),maxh=33)
  para(cv,desc,x,y2-5,colw,ParagraphStyle('smallbody',parent=style,fontSize=7.6,leading=10.2),maxh=65)
 box(cv,M,44,W-2*M,188);section(cv,c['checksTitle'],218)
 colw=(W-2*M-38)/2
 for i,(name,desc) in enumerate(c['checks']):
  col=i%2;row=i//2;x=M+12+col*(colw+8);y=181-row*60
  yy=para(cv,name,x,y,colw,ParagraphStyle('checktitle',parent=heading,fontSize=8,leading=11),maxh=24)
  para(cv,desc,x,yy-4,colw,ParagraphStyle('check-description',parent=style,fontSize=7.3,leading=10),maxh=43)
 para(cv,p['imageNote'],M+12,60,W-2*M-24,ParagraphStyle('note',parent=style,fontSize=6.5,leading=9),maxh=12)
 cv.showPage()

for l in ['en','es','de']:
 out=ROOT/f'public/downloads/EcoViva_Solar_Technical_System_{l.upper()}.pdf'
 cv=Canvas(str(out),pagesize=(W,H),pageCompression=1)
 cv.setTitle(P[l]['pdfTitle']);cv.setAuthor('EcoViva Mallorca SL');cv.setSubject(P[l]['pdfSubtitle'])
 roofpage(cv,l,'pitched',1);roofpage(cv,l,'flat',2);detailpage(cv,l);lastpage(cv,l);cv.save();apply_approved_template(out,l);print(out)
