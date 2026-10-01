"""Solar A4 sheets in the approved EcoViva Technical Library family.
Run after publish-solar-service.mjs. Only the supplied Pedro product assets are used.
"""
from pathlib import Path
from io import BytesIO
import base64, json, re
from xml.sax.saxutils import escape
from PIL import Image
import qrcode
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
ROOT=Path(__file__).resolve().parent.parent
A=ROOT/'public/assets/technical-library/solar'
P=json.loads((ROOT/'scripts/solar-premium-content.json').read_text())
C=json.loads((ROOT/'scripts/solar-pdf-content.generated.json').read_text())
F=Path('/usr/share/fonts/truetype/dejavu')
for name,file in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf')]:
 pdfmetrics.registerFont(TTFont(name,str(F/file)))
W,H=595.276,841.89;M=20;G=HexColor('#3e6b20');INK=HexColor('#0b0d0b');MUTED=HexColor('#454a45');PALE=HexColor('#f6f8f4');LINE=HexColor('#d9ded8')
style=ParagraphStyle('body',fontName='Body',fontSize=9,leading=12.5,textColor=MUTED)
heading=ParagraphStyle('heading',fontName='Bold',fontSize=10,leading=13,textColor=G)
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

def qr(cv,url,x,y,size,label=None):
 code=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,box_size=6,border=4)
 code.add_data(url);code.make(fit=True);im=code.make_image(fill_color='#3e6b20',back_color='white').convert('RGB')
 cv.drawImage(ImageReader(im),x,y,size,size);cv.linkURL(url,(x,y,x+size,y+size),relative=0)
 if label:
  cv.setFont('Bold',6.5);cv.setFillColor(G);cv.drawCentredString(x+size/2,y-8,label)

logo_data=re.search(r'data:image/png;base64,([^\"\']+)',(ROOT/'public/assets/technical-library/ecoviva-logo.svg').read_text()).group(1)
logo=ImageReader(BytesIO(base64.b64decode(logo_data)))

def base(cv,l,num,subtitle):
 cv.setFillColor(white);cv.rect(0,0,W,H,fill=1,stroke=0)
 cv.drawImage(logo,M,H-61,144,44,preserveAspectRatio=True,mask='auto',anchor='c')
 para(cv,'TECHNICAL LIBRARY',178,H-18,300,ParagraphStyle('kicker',parent=heading,fontSize=7,leading=9))
 para(cv,P[l]['pdfTitle'],178,H-33,318,ParagraphStyle('title',fontName='Bold',fontSize=17 if l=='en' else 15.5,leading=19,textColor=INK),maxh=39)
 para(cv,subtitle.upper(),178,H-78,320,ParagraphStyle('subtitle',parent=heading,fontSize=7,leading=9,textColor=MUTED),maxh=19)
 qr(cv,f'https://www.ecoviva-mallorca.com/technical-library/{l}/{paths[l]}/',W-M-57,H-68,57)
 cv.setFillColor(G);cv.circle(W-M-79,H-80,13,fill=1,stroke=0)
 cv.setFillColor(white);cv.setFont('Bold',8);cv.drawCentredString(W-M-79,H-83,l.upper())
 # Repeated navigation stays usable when a single page is printed separately.
 cv.setStrokeColor(G);cv.setLineWidth(.7);cv.line(M,110,W-M,110)
 qr(cv,f'https://www.ecoviva-mallorca.com/technical-library/{l}/',M+7,53,49,labels[l][1])
 qr(cv,f'https://www.ecoviva-mallorca.com/{l}/{services[l]}/',W-M-56,53,49,labels[l][2])
 para(cv,P[l]['pdfContact'],M+85,97,W-2*M-170,ParagraphStyle('contact-title',parent=heading,fontSize=10,leading=13,alignment=1),maxh=28)
 para(cv,'EcoViva × TLS Balear',M+85,68,W-2*M-170,ParagraphStyle('partner',parent=style,fontSize=8,leading=10,alignment=1))
 cv.setStrokeColor(LINE);cv.line(M,32,W-M,32)
 cv.setFillColor(G);cv.setFont('Bold',7);cv.drawString(M,20,'www.ecoviva-mallorca.com')
 cv.setFont('Body',7);cv.setFillColor(MUTED);cv.drawCentredString(W/2,20,'info@ecoviva-mallorca.com  ·  +34 871 53 27 58')
 cv.drawRightString(W-M,20,f'{l.upper()} · {num}/4')
 cv.setFont('Body',5.8);cv.drawCentredString(W/2,9,'© EcoViva Mallorca SL · Technical Library · 01.10.2026')

def roofpage(cv,l,kind,num):
 p=P[l];c=C[l];base(cv,l,num,p['pdfSubtitle'])
 box(cv,M,389,W-2*M,345);section(cv,p[kind+'Title'],719)
 x=M+20;y=402;w=330;h=220
 image(cv,kind,x,y,w,h)
 for n,(px,py) in enumerate(points[kind],1):
  xx=x+w*px/100;yy=y+h*(1-py/100)
  cv.setFillColor(G);cv.setStrokeColor(white);cv.setLineWidth(1);cv.circle(xx,yy,7,fill=1,stroke=1)
  cv.setFillColor(white);cv.setFont('Bold',8);cv.drawCentredString(xx,yy-2.8,str(n))
 para(cv,p[kind+'Intro'],M+12,675,W-2*M-24,style,maxh=47)
 xx=M+365;ww=W-2*M-377
 para(cv,labels[l][3].upper(),xx,619,ww,ParagraphStyle('sub',parent=heading,fontSize=8,leading=11),maxh=25)
 para(cv,p['overview'],xx,585,ww,ParagraphStyle('overview',parent=style,fontSize=8.3,leading=11.5),maxh=148)
 para(cv,labels[l][6],x,403,w,ParagraphStyle('note',parent=style,fontSize=6.5,leading=9),maxh=10)
 box(cv,M,236,W-2*M,139);section(cv,p['layersTitle'],361)
 for i,text in enumerate(p[kind+'Layers']):
  col=i//3;row=i%3;x=M+13+col*270;y=320-row*26
  cv.setFillColor(G);cv.circle(x+7,y-6,7,fill=1,stroke=0);cv.setFillColor(white);cv.setFont('Bold',7);cv.drawCentredString(x+7,y-8.5,str(i+1))
  para(cv,text,x+21,y,235,ParagraphStyle('label',parent=style,fontSize=8.5,leading=11),maxh=24)
 box(cv,M,124,W-2*M,99);section(cv,labels[l][4],209)
 para(cv,p['pdfPrinciples'],M+12,170,W-2*M-24,ParagraphStyle('principle',parent=style,fontSize=8,leading=11),maxh=34)
 para(cv,p['layerNote'],M+12,141,W-2*M-24,ParagraphStyle('note',parent=style,fontSize=6.8,leading=9),maxh=20)
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
 box(cv,M,124,W-2*M,78);section(cv,c['checksTitle'],188)
 para(cv,p['pdfPrinciples'],M+12,149,W-2*M-24,ParagraphStyle('checks',parent=style,fontSize=8,leading=11),maxh=25)
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
 box(cv,M,124,W-2*M,108);section(cv,c['checksTitle'],218)
 colw=(W-2*M-38)/2
 for i,(name,desc) in enumerate(c['checks']):
  col=i%2;row=i//2;x=M+12+col*(colw+8);y=181-row*26
  para(cv,name,x,y,colw,ParagraphStyle('checktitle',parent=heading,fontSize=8,leading=11),maxh=24)
 para(cv,p['imageNote'],M+12,139,W-2*M-24,ParagraphStyle('note',parent=style,fontSize=6.5,leading=9),maxh=12)
 cv.showPage()

for l in ['en','es','de']:
 out=ROOT/f'public/downloads/EcoViva_Solar_Technical_System_{l.upper()}.pdf'
 cv=Canvas(str(out),pagesize=(W,H),pageCompression=1)
 cv.setTitle(P[l]['pdfTitle']);cv.setAuthor('EcoViva Mallorca SL');cv.setSubject(P[l]['pdfSubtitle'])
 roofpage(cv,l,'pitched',1);roofpage(cv,l,'flat',2);detailpage(cv,l);lastpage(cv,l);cv.save();print(out)
