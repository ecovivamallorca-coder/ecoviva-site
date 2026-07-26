#!/usr/bin/env python3
"""Generate EN, ES and DE Universal Insulated Flat Roof production PDFs."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import sys
import types
import xml.etree.ElementTree as ET

from PIL import Image, ImageDraw
from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor, white
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
ASSETS = ROOT / "public" / "assets" / "technical-library" / "universal-insulated-flat-roof"
DOWNLOADS = ROOT / "public" / "downloads"
GEOMETRY = json.loads((SCRIPTS / "flat-roof-geometry.json").read_text())
CONTENTS = {
    lang: json.loads((SCRIPTS / f"flat-roof-content-{lang}.json").read_text())
    for lang in ("en", "es", "de")
}

qrcode_stub = types.ModuleType("qrcode")
qrcode_stub.QRCode = object
constants_stub = types.ModuleType("qrcode.constants")
constants_stub.ERROR_CORRECT_H = 2
qrcode_stub.constants = constants_stub
sys.modules.setdefault("qrcode", qrcode_stub)
sys.modules.setdefault("qrcode.constants", constants_stub)

spec = importlib.util.spec_from_file_location(
    "thermowood_production", SCRIPTS / "generate-thermowood-production.py"
)
base = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(base)

GREEN = HexColor("#3E6B20")
TEXT = HexColor("#0B0D0B")
BODY = HexColor("#454A45")
LIGHT = HexColor("#D9DED8")
PALE = HexColor("#F6F8F4")
COMPONENT_FILES = GEOMETRY["componentFiles"]
OPTION_FILES = GEOMETRY["optionFiles"]


def load_rgb(path: Path, max_edge: int) -> Image.Image:
    image = Image.open(path).convert("RGB")
    image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    return image


def technical_library_qr(lang: str) -> Image.Image:
    root = ET.parse(ASSETS / f"qr-{lang}.svg").getroot()
    scale = 20
    qr = Image.new("RGB", (49 * scale, 49 * scale), "white")
    draw = ImageDraw.Draw(qr)
    for rect in root.iter("{http://www.w3.org/2000/svg}rect"):
        if "rgb(24%,41%,12%)" not in rect.attrib.get("style", ""):
            continue
        x, y = float(rect.attrib["x"]), float(rect.attrib["y"])
        width, height = float(rect.attrib["width"]), float(rect.attrib["height"])
        top = 49 - y - height
        draw.rectangle(
            (
                round(x * scale),
                round(top * scale),
                round((x + width) * scale) - 1,
                round((top + height) * scale) - 1,
            ),
            fill=(61, 105, 31),
        )
    return qr


def draw_callout(c: canvas.Canvas, item: dict) -> None:
    path = c.beginPath()
    start = item["path"][0]
    path.moveTo(start[0] * mm, base.top_y(start[1]))
    for x, y in item["path"][1:]:
        path.lineTo(x * mm, base.top_y(y))
    c.setLineCap(1)
    c.setLineJoin(1)
    c.setStrokeColor(TEXT)
    c.setLineWidth(0.82 * mm)
    c.drawPath(path, fill=0, stroke=1)
    c.setStrokeColor(white)
    c.setLineWidth(0.38 * mm)
    c.drawPath(path, fill=0, stroke=1)
    ex, ey = item["endpoint"]
    c.setFillColor(white)
    c.setStrokeColor(TEXT)
    c.setLineWidth(0.34 * mm)
    c.circle(ex * mm, base.top_y(ey), 0.68 * mm, fill=1, stroke=1)
    base.number_circle(c, item["number"], *item["circle"], radius=2.15)


def draw_check(c: canvas.Canvas, x: float, top: float) -> None:
    c.setStrokeColor(GREEN)
    c.setLineWidth(0.42 * mm)
    c.circle((x + 1.6) * mm, base.top_y(top + 1.6), 1.48 * mm, fill=0, stroke=1)
    c.line((x + 0.95) * mm, base.top_y(top + 1.6), (x + 1.4) * mm, base.top_y(top + 2.05))
    c.line((x + 1.4) * mm, base.top_y(top + 2.05), (x + 2.35) * mm, base.top_y(top + 0.95))


def draw_page(c: canvas.Canvas, content: dict, lang: str) -> None:
    logo = base.extract_logo_png(ASSETS / "ecoviva-logo.svg")
    hero = load_rgb(ASSETS / "flat-roof-hero.png", 1600)
    qr = technical_library_qr(lang)
    components = [load_rgb(ASSETS / name, 700) for name in COMPONENT_FILES]
    options = [load_rgb(ASSETS / name, 900) for name in OPTION_FILES]

    c.setFillColor(white)
    c.rect(0, 0, base.PAGE_W_MM * mm, base.PAGE_H_MM * mm, fill=1, stroke=0)
    base.draw_contained_image(c, logo, 7, 5.2, 51.5, 15.5)
    base.draw_text(c, content["library"], 63, 6.2, 86, font="Arial-Bold", size=7.2, color=GREEN, max_lines=1)
    for index, line in enumerate(content["titleLines"]):
        base.draw_text_shrink(c, line, 63, 10.2 + index * 7.8, 105, font="Arial-Bold", size=19.2, min_size=14.0, max_lines=1, color=TEXT)
    base.draw_text_shrink(c, content["subtitle"], 63, 27.0, 108, font="Arial-Bold", size=7.4, min_size=5.8, max_lines=1, color=BODY)
    base.draw_contained_image(c, qr, 184.4, 4.3, 17.5, 17.5)
    c.setFillColor(GREEN)
    c.circle(176.2 * mm, base.top_y(27.7), 4.8 * mm, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Arial-Bold", 7.3)
    c.drawCentredString(176.2 * mm, base.top_y(27.7) - 2.55, content["code"])

    base.draw_box(c, 7, 35, 105, 60)
    image = GEOMETRY["hero"]["image"]
    c.drawImage(base.ImageReader(hero), image["x"] * mm, base.top_y(image["y"] + image["height"]), width=image["width"] * mm, height=image["height"] * mm, mask="auto")
    for callout in GEOMETRY["hero"]["callouts"]:
        draw_callout(c, callout)
    c.setFillColor(white)
    c.setStrokeColor(GREEN)
    c.setLineWidth(0.48 * mm)
    c.roundRect(7 * mm, base.top_y(95), 105 * mm, 60 * mm, 1.5 * mm, fill=0, stroke=1)

    base.draw_box(c, 114, 35, 89, 37)
    base.section_heading(c, content["overviewTitle"], 118, 38, 81)
    used, _ = base.draw_text_shrink(c, content["overview"], 118, 43, 81, font="Arial", size=7.0, min_size=5.7, max_lines=8, color=BODY, leading_factor=1.1)
    base.draw_text_shrink(c, content["overviewNote"], 118, 43 + used + 0.6, 81, font="Arial-Italic", size=6.1, min_size=5.1, max_lines=4, color=BODY, leading_factor=1.07)

    base.draw_box(c, 114, 74, 89, 21)
    base.section_heading(c, content["whyTitle"], 118, 77, 81)
    for index, item in enumerate(content["why"]):
        col, row = index % 2, index // 2
        x, top = 119.2 + col * 40.3, 82.1 + row * 6.0
        base.bullet(c, x, top + 0.8, 0.72)
        base.draw_text_shrink(c, item, x + 2.3, top, 36.3, font="Arial", size=6.8, min_size=5.2, max_lines=2, color=BODY, leading_factor=1.05)

    base.draw_box(c, 7, 97, 196, 37)
    base.section_heading(c, content["layersTitle"], 11, 100.1, 188)
    for index, (title, body) in enumerate(content["layers"]):
        col, row = index % 2, index // 2
        x, top = 11 + col * 95, 106.0 + row * 9.35
        base.number_circle(c, index + 1, x + 1.4, top + 1.4)
        base.draw_text_shrink(c, title, x + 6, top - 0.2, 87, font="Arial-Bold", size=7.7, min_size=5.8, max_lines=1, color=TEXT)
        base.draw_text_shrink(c, body, x + 6, top + 2.7, 87, font="Arial", size=6.8, min_size=5.2, max_lines=2, color=BODY, leading_factor=1.04)

    base.draw_box(c, 7, 136, 196, 26)
    base.section_heading(c, content["principlesTitle"], 11, 139.1, 188)
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.22 * mm)
    c.line(105 * mm, base.top_y(142.6), 105 * mm, base.top_y(160))
    for row_y in (148.4, 154.6):
        c.line(11 * mm, base.top_y(row_y), 199 * mm, base.top_y(row_y))
    for index, (title, body) in enumerate(content["principles"]):
        col, row = index % 2, index // 2
        x, top = 11 + col * 97, 142.7 + row * 6.1
        draw_check(c, x, top)
        base.draw_text_shrink(c, title, x + 4.5, top - 0.2, 88, font="Arial-Bold", size=6.1, min_size=4.5, max_lines=1, color=GREEN)
        base.draw_text_shrink(c, body, x + 4.5, top + 2.35, 88, font="Arial", size=5.35, min_size=4.1, max_lines=2, color=BODY, leading_factor=0.94)

    base.draw_box(c, 7, 164, 196, 37)
    base.section_heading(c, content["componentsTitle"], 11, 167.0, 188)
    base.draw_text_shrink(c, content["componentsIntro"], 11, 170.7, 188, font="Arial", size=5.6, min_size=4.8, max_lines=1, color=BODY)
    comp_w = 23.5
    for divider in range(1, 8):
        x = 11 + divider * comp_w
        c.setStrokeColor(LIGHT)
        c.setLineWidth(0.2 * mm)
        c.line(x * mm, base.top_y(173.3), x * mm, base.top_y(198.7))
    for index, ((title, body), asset) in enumerate(zip(content["components"], components)):
        x = 11 + index * comp_w
        base.draw_contained_image_clipped(c, asset, x + 0.8, 173.4, comp_w - 1.6, 10.8, 1.0)
        base.draw_text_shrink(c, title, x + 0.7, 184.5, comp_w - 1.4, font="Arial-Bold", size=5.7, min_size=4.25, max_lines=2, color=TEXT, align="center", leading_factor=1.0)
        base.draw_text_shrink(c, body, x + 0.7, 190.0, comp_w - 1.4, font="Arial", size=5.1, min_size=3.9, max_lines=3, color=BODY, align="center", leading_factor=1.0)

    base.draw_box(c, 7, 203, 196, 44)
    base.section_heading(c, content["optionsTitle"], 11, 206.0, 188)
    base.draw_text_shrink(c, content["optionsIntro"], 11, 209.8, 188, font="Arial", size=5.5, min_size=4.7, max_lines=2, color=BODY, leading_factor=1.0)
    for index, ((title, body, tag), asset) in enumerate(zip(content["options"], options)):
        col, row = index % 3, index // 3
        x, top, card_w, card_h = 11 + col * 63.0, 214.4 + row * 15.4, 60.0, 14.8
        c.setFillColor(PALE)
        c.setStrokeColor(LIGHT)
        c.setLineWidth(0.18 * mm)
        c.roundRect(x * mm, base.top_y(top + card_h), card_w * mm, card_h * mm, 1.1 * mm, fill=1, stroke=1)
        base.draw_contained_image_clipped(c, asset, x + 0.7, top + 0.7, 20.0, card_h - 1.4, 1.0)
        base.draw_text_shrink(c, title, x + 22.0, top + 0.7, 36.8, font="Arial-Bold", size=5.65, min_size=4.0, max_lines=2, color=GREEN, leading_factor=1.0)
        base.draw_text_shrink(c, body, x + 22.0, top + 5.2, 36.8, font="Arial", size=5.0, min_size=3.8, max_lines=3, color=BODY, leading_factor=1.0)
        if tag:
            base.draw_text_shrink(c, tag, x + 22.0, top + 12.0, 36.8, font="Arial-Bold", size=4.25, min_size=3.2, max_lines=1, color=GREEN)

    base.draw_box(c, 7, 249, 196, 21)
    columns = ((11, 59, "benefitsTitle"), (74, 50, "applicationsTitle"), (128, 71, "serviceLifeTitle"))
    for x, width, key in columns:
        base.section_heading(c, content[key], x, 252.0, width, 8.0)
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.25 * mm)
    c.line(72 * mm, base.top_y(252.3), 72 * mm, base.top_y(267.5))
    c.line(126 * mm, base.top_y(252.3), 126 * mm, base.top_y(267.5))
    for index, item in enumerate(content["benefits"]):
        top = 256.25 + index * 1.68
        base.bullet(c, 11.7, top + 0.65, 0.45)
        base.draw_text_shrink(c, item, 13.1, top, 56.9, font="Arial", size=4.75, min_size=3.9, max_lines=1, color=BODY)
    for index, item in enumerate(content["applications"]):
        top = 256.6 + index * 1.9
        base.bullet(c, 74.7, top + 0.65, 0.45)
        base.draw_text_shrink(c, item, 76.1, top, 47.9, font="Arial", size=5.5, min_size=4.1, max_lines=1, color=BODY)
    base.draw_text_shrink(c, content["serviceLife"], 128, 256.4, 71, font="Arial", size=5.55, min_size=4.2, max_lines=6, color=BODY, leading_factor=1.02)

    base.draw_box(c, 7, 272, 196, 14)
    base.section_heading(c, content["requirementsTitle"], 11, 274.8, 188, 8.0)
    requirements = "; ".join(item.rstrip(".") for item in content["requirements"]) + "."
    base.draw_text_shrink(c, requirements, 11, 278.0, 188, font="Arial", size=4.55, min_size=3.65, max_lines=5, color=BODY, leading_factor=0.9)
    c.setStrokeColor(GREEN)
    c.setLineWidth(0.48 * mm)
    c.line(7 * mm, base.top_y(287.5), 203 * mm, base.top_y(287.5))
    base.draw_text(c, content["footerWeb"], 7, 288.0, 196, font="Arial-Bold", size=6.8, color=GREEN, max_lines=1, align="center")
    base.draw_text(c, content["footerContact"], 7, 290.9, 196, size=6.5, color=BODY, max_lines=1, align="center")
    base.draw_text_shrink(c, content["footerLegal"], 7, 293.9, 196, font="Arial", size=6.4, min_size=5.4, max_lines=1, color=BODY, align="center")


def finalize_pdf(raw: Path, final: Path, content: dict, print_ready: bool) -> None:
    reader = PdfReader(raw)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    page = writer.pages[0]
    if print_ready:
        page.mediabox = base.pdf_box((0, 0, 216, 303))
        page.cropbox = base.pdf_box((0, 0, 216, 303))
        page.trimbox = base.pdf_box((3, 3, 213, 300))
        page.bleedbox = base.pdf_box((0, 0, 216, 303))
        page.artbox = base.pdf_box((3, 3, 213, 300))
    else:
        for name in ("mediabox", "cropbox", "trimbox", "bleedbox", "artbox"):
            setattr(page, name, base.pdf_box((0, 0, 210, 297)))
    base.add_output_intent(writer)
    writer.add_metadata({
        "/Title": content["title"],
        "/Author": "EcoViva Mallorca S.L.",
        "/Subject": "Universal insulated warm flat roof technical sheet",
        "/Keywords": "EcoViva Mallorca, flat roof, PIR insulation, waterproofing",
    })
    with final.open("wb") as stream:
        writer.write(stream)
    raw.unlink()


def generate_pdf(content: dict, lang: str, print_ready: bool) -> Path:
    DOWNLOADS.mkdir(parents=True, exist_ok=True)
    suffix = "_Print_3mmBleed.pdf" if print_ready else "_Download.pdf"
    final = DOWNLOADS / f"{content['pdfStem']}{suffix}"
    raw = DOWNLOADS / f".{final.name}.raw"
    page_size = (216 * mm, 303 * mm) if print_ready else (210 * mm, 297 * mm)
    c = canvas.Canvas(str(raw), pagesize=page_size, pageCompression=1)
    c.setTitle(content["title"])
    c.setAuthor("EcoViva Mallorca S.L.")
    c.setCreator("EcoViva production PDF generator")
    if print_ready:
        c.saveState()
        c.translate(3 * mm, 3 * mm)
        draw_page(c, content, lang)
        c.restoreState()
    else:
        draw_page(c, content, lang)
    c.showPage()
    c.save()
    finalize_pdf(raw, final, content, print_ready)
    return final


def main() -> None:
    base.register_fonts()
    for lang, content in CONTENTS.items():
        for print_ready in (False, True):
            print(generate_pdf(content, lang, print_ready))


if __name__ == "__main__":
    main()
