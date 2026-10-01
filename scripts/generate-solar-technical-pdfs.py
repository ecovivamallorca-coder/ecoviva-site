"""EcoViva solar technical sheets. Run after publish-solar-service.mjs."""
from pathlib import Path
import json
from io import BytesIO
from PIL import Image
from xml.sax.saxutils import escape
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import HexColor, Color, white
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
for name,file in [('Body','DejaVuSans.ttf'),('Bold','DejaVuSans-Bold.ttf'),('Display','DejaVuSerif.ttf')]:pdfmetrics.registerFont(TTFont(name,str(F/file)))
W,H=595.276,841.89;M=32;G=HexColor('#3e6b20');INK=HexColor('#171a16');MUTED=HexColor('#62685e');PAPER=HexColor('#f7f8f4')
style=ParagraphStyle('body',fontName='Body',fontSize=9,leading=14,textColor=MUTED)
heading=ParagraphStyle('heading',fontName='Bold',fontSize=10,leading=15,textColor=G)
paths={'en':'solar-panels-battery-system','es':'sistema-fotovoltaico-baterias','de':'photovoltaik-batteriesystem'}
points={'pitched':[(68,76),(77,51),(77,46),(60,28),(13,23),(50,19)],'flat':[(70,76),(80,49),(79,43),(64,27),(18,33),(32,20)]}
def para(cv,text,x,y,w,sty=style,maxh=None):
 p=Paragraph(escape(text),sty);_,h=p.wrap(w,900)
 if maxh is not None and h>maxh:raise ValueError(f'Text overflow: {text[:60]} {h}>{maxh}')
 p.drawOn(cv,x,y-h);return y-h

def box(cv,x,y,w,h):
 cv.setFillColor(white);cv.setStrokeColor(G);cv.setLineWidth(1);cv.roundRect(x,y,w,h,8,fill=1,stroke=1)

def section(cv,title,y):
 para(cv,title.upper(),M+16,y,W-2*M-32,heading);cv.setStrokeColor(HexColor('#d9ded8'));cv.setLineWidth(.5);cv.line(M+16,y-24,W-M-16,y-24)

def image(cv,key,x,y,w,h):
 src=A/(key+'.png') if (A/(key+'.png')).exists() else A/(key+'-v3.webp')
 im=Image.open(src).convert('RGB');im.thumbnail((round(w*2.1),round(h*2.1)),Image.Resampling.LANCZOS);buf=BytesIO();im.save(buf,format='JPEG',quality=82,optimize=True);buf.seek(0)
 cv.drawImage(ImageReader(buf),x,y,w,h,preserveAspectRatio=True,anchor='c')

def base(cv,l,num,subtitle):
 cv.setFillColor(white);cv.rect(0,0,W,H,fill=1,stroke=0)
 cv.setFillColor(HexColor('#11111f'));cv.rect(0,H-88,W,88,fill=1,stroke=0)
 logo=ROOT/'public/assets/logos/ecoviva-horizontal-header.png'
 cv.drawImage(str(logo),M,H-68,135,42,preserveAspectRatio=True,mask='auto')
 cv.setFillColor(white);cv.setFont('Bold',13);cv.drawRightString(W-M,H-41,'ECOVIVA SOLAR')
 cv.setFillColor(HexColor('#b9cea9'));cv.setFont('Body',8);cv.drawRightString(W-M,H-60,'EcoViva × TLS Balear')
 para(cv,P[l]['pdfTitle'],M,H-111,W-2*M,ParagraphStyle('title',fontName='Display',fontSize=21,leading=27,textColor=INK),maxh=60)
 para(cv,subtitle,M,H-150,W-2*M,style,maxh=28)
 cv.setStrokeColor(HexColor('#d9ded8'));cv.line(M,40,W-M,40)
 cv.setFont('Body',7);cv.setFillColor(MUTED);cv.drawString(M,27,'www.ecoviva-mallorca.com   |   info@ecoviva-mallorca.com')
 cv.drawRightString(W-M,27,f'{l.upper()}  ·  01.10.2026  ·  {num}/4')

def roofpage(cv,l,kind,num):
 p=P[l];base(cv,l,num,p['pdfSubtitle'])
 box(cv,M,265,W-2*M,390);section(cv,p[kind+'Title'],638)
 x=M+41;y=300;w=W-2*M-82;h=w*2/3
 image(cv,kind,x,y,w,h)
 for n,(px,py) in enumerate(points[kind],1):
  xx=x+w*px/100;yy=y+h*(1-py/100)
  cv.setFillColor(G);cv.setStrokeColor(white);cv.setLineWidth(1.1);cv.circle(xx,yy,8,fill=1,stroke=1)
  cv.setFillColor(white);cv.setFont('Bold',9);cv.drawCentredString(xx,yy-3,str(n))
 para(cv,p['renderNote'],M+16,287,W-2*M-32,ParagraphStyle('note',parent=style,fontSize=7.2,leading=10),maxh=22)
 box(cv,M,105,W-2*M,145);section(cv,p['layersTitle'],233)
 for i,text in enumerate(p[kind+'Layers']):
  col=i//3;row=i%3;x=M+16+col*250;y=197-row*27
  cv.setFillColor(G);cv.circle(x+7,y-6,7,fill=1,stroke=0);cv.setFillColor(white);cv.setFont('Bold',7);cv.drawCentredString(x+7,y-8.5,str(i+1))
  para(cv,text,x+22,y,220,ParagraphStyle('label',parent=style,fontSize=8,leading=11),maxh=23)
 para(cv,p['layerNote'],M,87,W-2*M,ParagraphStyle('note',parent=style,fontSize=7.5,leading=11),maxh=34)
 cv.showPage()

def detailpage(cv,l):
 p=P[l];c=C[l];base(cv,l,3,p['pdfDetails'])
 box(cv,M,330,W-2*M,325);section(cv,p['detailsTitle'],638)
 para(cv,p['detailsIntro'],M+16,602,W-2*M-32,style,maxh=42)
 keys=['promount-hook','promount-rail','promount-middle-clamp','promount-end-clamp','promount-solarspeed-profile','promount-solarspeed-sideplate','promount-ballast-holder']
 colw=(W-2*M-36)/4
 for i,(name,desc) in enumerate(p['details']):
  col=i%4;row=i//4;x=M+14+col*colw
  image(cv,keys[i],x,455 if row==0 else 364,colw-10,98 if row==0 else 60)
  para(cv,f'{i+1}. {name}',x,450 if row==0 else 358,colw-9,ParagraphStyle('component-label',parent=heading,fontSize=7.8,leading=10),maxh=28)
 box(cv,M,120,W-2*M,193);section(cv,c['qualityTitle'],297)
 colw=(W-2*M-46)/3
 for i,(name,desc) in enumerate(c['equipment']):
  x=M+16+i*(colw+7);y=para(cv,name,x,258,colw,heading,maxh=45)
  para(cv,desc,x,y-10,colw,ParagraphStyle('small',parent=style,fontSize=8,leading=12),maxh=105)
 para(cv,p['pdfPrinciples'],M,101,W-2*M,ParagraphStyle('note',parent=style,fontSize=8,leading=12),maxh=48)
 cv.showPage()

def lastpage(cv,l):
 p=P[l];c=C[l];base(cv,l,4,p['pdfApplications']+' · '+p['pdfElectric'])
 box(cv,M,455,W-2*M,200);section(cv,p['galleryTitle'],638)
 w=(W-2*M-44)/3
 for i,key in enumerate(['photo-pitched','photo-flat','photo-ground']):
  x=M+14+i*(w+8);image(cv,key,x,496,w,w*2/3)
  para(cv,c['solutions'][i][0],x,484,w,ParagraphStyle('caption',parent=heading,fontSize=8.5,leading=11),maxh=24)
 para(cv,p['imageNote'],M+14,451,W-2*M-28,ParagraphStyle('note',parent=style,fontSize=7,leading=9),maxh=20)
 box(cv,M,180,W-2*M,258);section(cv,p['electrical'],421)
 colw=(W-2*M-46)/3
 for i,(name,desc) in enumerate(c['components']):
  row=i//3;col=i%3;x=M+16+col*(colw+7);y=381-row*96
  y2=para(cv,name,x,y,colw,ParagraphStyle('smallhead',parent=heading,fontSize=8.1,leading=11),maxh=33)
  para(cv,desc,x,y2-6,colw,ParagraphStyle('smallbody',parent=style,fontSize=7.25,leading=10.1),maxh=72)
 cv.setFillColor(HexColor('#21381e'));cv.roundRect(M,63,W-2*M,99,8,fill=1,stroke=0)
 para(cv,p['pdfContact'],M+16,146,W-2*M-32,ParagraphStyle('ctah',fontName='Display',fontSize=17,leading=22,textColor=white),maxh=30)
 para(cv,'+34 871 53 27 58  ·  info@ecoviva-mallorca.com',M+16,112,W-2*M-32,ParagraphStyle('contact',parent=style,fontSize=9,leading=13,textColor=white))
 url=f'https://www.ecoviva-mallorca.com/technical-library/{l}/{paths[l]}/'
 cv.setFillColor(white);cv.setFont('Body',7.5);cv.drawString(M+16,78,'www.ecoviva-mallorca.com/technical-library/'+l+'/')
 cv.linkURL(url,(M,63,W-M,162),relative=0)
 cv.showPage()

for l in ['en','es','de']:
 out=ROOT/f'public/downloads/EcoViva_Solar_Technical_System_{l.upper()}.pdf'
 cv=Canvas(str(out),pagesize=(W,H),pageCompression=1)
 cv.setTitle(P[l]['pdfTitle']);cv.setAuthor('EcoViva Mallorca SL');cv.setSubject(P[l]['pdfSubtitle'])
 roofpage(cv,l,'pitched',1);roofpage(cv,l,'flat',2);detailpage(cv,l);lastpage(cv,l);cv.save();print(out)
