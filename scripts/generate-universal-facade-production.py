#!/usr/bin/env python3
"""Generate EN, ES and DE Universal Ventilated Façade production PDFs."""

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
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
ASSETS = ROOT / "public" / "assets" / "technical-library"
UNIVERSAL = ASSETS / "universal-ventilated-facade"
DOWNLOADS = ROOT / "public" / "downloads"
GEOMETRY = json.loads((SCRIPTS / "universal-facade-geometry.json").read_text())
CONTENTS = {
    lang: json.loads((SCRIPTS / f"universal-facade-content-{lang}.json").read_text())
    for lang in ("en", "es", "de")
}

# The shared drawing template imports qrcode for its own outputs. This generator
# reuses the approved language-specific SVG matrices instead.
qrcode_stub = types.ModuleType("qrcode")
qrcode_stub.QRCode = object
constants_stub = types.ModuleType("qrcode.constants")
constants_stub.ERROR_CORRECT_H = 2
qrcode_stub.constants = constants_stub
sys.modules.setdefault("qrcode", qrcode_stub)
sys.modules.setdefault("qrcode.constants", constants_stub)

spec = importlib.util.spec_from_file_location(
    "thermowood_production",
    SCRIPTS / "generate-thermowood-production.py",
)
base = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(base)

GREEN = HexColor("#3E6B20")
TEXT = HexColor("#0B0D0B")
BODY = HexColor("#454A45")
LIGHT = HexColor("#D9DED8")
PALE = HexColor("#F6F8F4")
TECHNICAL_LIBRARY_URLS = {
    "en": "https://www.ecoviva-mallorca.com/technical-library/en/",
    "es": "https://www.ecoviva-mallorca.com/technical-library/es/",
    "de": "https://www.ecoviva-mallorca.com/technical-library/de/",
}
COMPONENT_FILES = [
    "component-pir.png",
    "component-substructure.png",
    "component-fixing.png",
    "component-ventilation-profile.png",
    "component-joint-profile.png",
]
MATERIAL_FILES = [
    "material-rockpanel.png",
    "material-fibre-cement.png",
    "material-natural-slate.png",
    "material-hpl.png",
    "material-aluminium.png",
    "material-porcelain.png",
]


def load_rgb(path: Path, max_edge: int) -> Image.Image:
    """Load an approved raster and cap it at a print-safe working resolution."""
    image = Image.open(path).convert("RGB")
    image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
    return image


def top_y(top_mm: float) -> float:
    return base.PAGE_H_MM * mm - top_mm * mm


def technical_library_qr(lang: str) -> Image.Image:
    source = UNIVERSAL / f"qr-{lang}.svg"
    root = ET.parse(source).getroot()
    scale = 20
    qr = Image.new("RGB", (49 * scale, 49 * scale), "white")
    draw = ImageDraw.Draw(qr)
    for rect in root.iter("{http://www.w3.org/2000/svg}rect"):
        if "rgb(24%,41%,12%)" not in rect.attrib.get("style", ""):
            continue
        x = float(rect.attrib["x"])
        y = float(rect.attrib["y"])
        width = float(rect.attrib["width"])
        height = float(rect.attrib["height"])
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


def draw_cover_image(
    c: canvas.Canvas,
    image: Image.Image,
    x_mm: float,
    top_mm: float,
    w_mm: float,
    h_mm: float,
) -> None:
    iw, ih = image.size
    scale = max((w_mm * mm) / iw, (h_mm * mm) / ih)
    width, height = iw * scale, ih * scale
    x = x_mm * mm + (w_mm * mm - width) / 2
    y = top_y(top_mm + h_mm) + (h_mm * mm - height) / 2
    c.saveState()
    path = c.beginPath()
    path.rect(x_mm * mm, top_y(top_mm + h_mm), w_mm * mm, h_mm * mm)
    c.clipPath(path, stroke=0, fill=0)
    c.drawImage(ImageReader(image), x, y, width=width, height=height, mask="auto")
    c.restoreState()


def draw_callout(c: canvas.Canvas, callout: dict) -> None:
    path = c.beginPath()
    start = callout["path"][0]
    path.moveTo(start[0] * mm, top_y(start[1]))
    for x, y in callout["path"][1:]:
        path.lineTo(x * mm, top_y(y))
    c.setLineCap(1)
    c.setLineJoin(1)
    c.setStrokeColor(TEXT)
    c.setLineWidth(0.82 * mm)
    c.drawPath(path, fill=0, stroke=1)
    c.setStrokeColor(white)
    c.setLineWidth(0.38 * mm)
    c.drawPath(path, fill=0, stroke=1)
    ex, ey = callout["endpoint"]
    c.setFillColor(white)
    c.setStrokeColor(TEXT)
    c.setLineWidth(0.34 * mm)
    c.circle(ex * mm, top_y(ey), 0.72 * mm, fill=1, stroke=1)
    base.number_circle(c, callout["number"], *callout["circle"], radius=2.15)


def draw_page(c: canvas.Canvas, content: dict) -> None:
    lang = content["lang"]
    logo = base.extract_logo_png(ASSETS / "ecoviva-logo.svg")
    image_geometry = GEOMETRY["hero"]["image"]
    hero = Image.open(UNIVERSAL / "universal-facade-hero.png").convert("RGB")
    hero_crop = hero.crop((0, 0, image_geometry["cropWidth"], image_geometry["cropHeight"]))
    hero_crop.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
    qr = technical_library_qr(lang)
    components = [load_rgb(UNIVERSAL / name, 600) for name in COMPONENT_FILES]
    materials = [load_rgb(UNIVERSAL / name, 900) for name in MATERIAL_FILES]

    c.setFillColor(white)
    c.rect(0, 0, base.PAGE_W_MM * mm, base.PAGE_H_MM * mm, fill=1, stroke=0)
    base.draw_contained_image(c, logo, 7, 5.2, 51.5, 15.5)
    base.draw_text(c, content["library"], 63, 6.2, 116, font="Arial-Bold", size=7.2, color=GREEN, max_lines=1)
    for index, line in enumerate(content["titleLines"]):
        base.draw_text_shrink(
            c,
            line,
            63,
            10.2 + index * 7.8,
            119,
            font="Arial-Bold",
            size=20.2,
            min_size=15.6,
            max_lines=1,
            color=TEXT,
        )
    base.draw_text_shrink(
        c,
        content["subtitle"],
        63,
        27.0,
        116,
        font="Arial-Bold",
        size=8.4,
        min_size=6.6,
        max_lines=1,
        color=BODY,
    )
    base.draw_contained_image(c, qr, 184.4, 4.3, 17.5, 17.5)
    c.setFillColor(GREEN)
    c.circle(176.2 * mm, top_y(27.7), 4.8 * mm, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Arial-Bold", 7.3)
    c.drawCentredString(176.2 * mm, top_y(27.7) - 2.55, content["code"])

    base.draw_box(c, 7, 35, 105, 52)
    base.draw_contained_image_clipped(
        c,
        hero_crop,
        image_geometry["x"],
        image_geometry["y"],
        image_geometry["width"],
        image_geometry["height"],
        1.0,
    )
    for callout in GEOMETRY["hero"]["callouts"]:
        draw_callout(c, callout)
    c.setStrokeColor(GREEN)
    c.setLineWidth(0.48 * mm)
    c.roundRect(7 * mm, top_y(87), 105 * mm, 52 * mm, 1.5 * mm, fill=0, stroke=1)

    base.draw_box(c, 114, 35, 89, 36)
    base.section_heading(c, content["overviewTitle"], 118, 38, 81)
    used, _ = base.draw_text_shrink(
        c,
        content["overview"],
        118,
        43,
        81,
        font="Arial",
        size=6.9,
        min_size=5.8,
        max_lines=7,
        color=BODY,
        leading_factor=1.08,
    )
    base.draw_text_shrink(
        c,
        content["overviewNote"],
        118,
        43 + used + 0.8,
        81,
        font="Arial-Italic",
        size=6.0,
        min_size=5.0,
        max_lines=4,
        color=BODY,
        leading_factor=1.05,
    )

    base.draw_box(c, 114, 73, 89, 14)
    base.section_heading(c, content["whyTitle"], 118, 75.6, 81, 8.6)
    for idx, item in enumerate(content["why"]):
        col, row = idx % 2, idx // 2
        x, top = 119.0 + col * 40.5, 80.0 + row * 2.8
        base.bullet(c, x, top + 0.65, 0.55)
        base.draw_text_shrink(
            c,
            item,
            x + 1.8,
            top,
            37.5,
            font="Arial",
            size=5.1,
            min_size=4.15,
            max_lines=2,
            color=BODY,
            leading_factor=0.9,
        )

    base.draw_box(c, 7, 89, 196, 27)
    base.section_heading(c, content["layersTitle"], 11, 91.8, 188, 8.8)
    layer_layout = [(0, 11, 96.5), (1, 106, 96.5), (2, 11, 103.1), (3, 106, 103.1), (4, 11, 109.7)]
    for idx, x, top in layer_layout:
        title, body = content["layers"][idx]
        base.number_circle(c, idx + 1, x + 1.4, top + 2.0, radius=1.95)
        base.draw_text_shrink(
            c, title, x + 5.6, top - 0.4, 87, font="Arial-Bold",
            size=6.5, min_size=5.0, max_lines=1, color=TEXT,
        )
        base.draw_text_shrink(
            c, body, x + 5.6, top + 2.0, 87, font="Arial",
            size=5.5, min_size=4.55, max_lines=2, color=BODY, leading_factor=1.0,
        )

    base.draw_box(c, 7, 118, 196, 29)
    base.section_heading(c, content["principlesTitle"], 11, 120.8, 188, 8.8)
    for idx, (title, body) in enumerate(content["principles"]):
        col, row = idx % 2, idx // 2
        x, top = 11 + col * 95, 126.1 + row * 6.7
        c.setStrokeColor(GREEN)
        c.setLineWidth(0.35 * mm)
        c.circle((x + 1.45) * mm, top_y(top + 1.2), 1.25 * mm, fill=0, stroke=1)
        c.line((x + 0.9) * mm, top_y(top + 1.2), (x + 1.3) * mm, top_y(top + 1.6))
        c.line((x + 1.3) * mm, top_y(top + 1.6), (x + 2.05) * mm, top_y(top + 0.7))
        base.draw_text_shrink(
            c, title, x + 4.0, top - 0.6, 89, font="Arial-Bold",
            size=5.8, min_size=4.2, max_lines=1, color=GREEN,
        )
        base.draw_text_shrink(
            c, body, x + 4.0, top + 1.8, 89, font="Arial",
            size=5.1, min_size=4.1, max_lines=2, color=BODY, leading_factor=0.97,
        )

    base.draw_box(c, 7, 149, 196, 30)
    base.section_heading(c, content["componentsTitle"], 11, 151.8, 188, 8.5)
    base.draw_text_shrink(
        c, content["componentsIntro"], 11, 156.1, 188, font="Arial",
        size=5.3, min_size=4.4, max_lines=2, color=BODY, leading_factor=1.0,
    )
    comp_w = 37.6
    component_scales = [1.18, 1.12, 1.18, 1.16, 1.14]
    for idx, ((label, _), image) in enumerate(zip(content["components"], components)):
        x = 11 + idx * comp_w
        base.draw_contained_image(c, image, x + 1.2, 160.4, comp_w - 2.4, 12.5, component_scales[idx])
        base.draw_text_shrink(
            c, f"{idx + 1}. {label}", x + 0.6, 173.2, comp_w - 1.2,
            font="Arial", size=5.3, min_size=3.85, max_lines=2,
            color=TEXT, align="center", leading_factor=0.98,
        )

    base.draw_box(c, 7, 181, 196, 63)
    base.section_heading(c, content["materialsTitle"], 11, 183.8, 188, 8.8)
    base.draw_text_shrink(
        c, content["materialsIntro"], 11, 188.1, 188, font="Arial",
        size=5.5, min_size=4.5, max_lines=2, color=BODY, leading_factor=1.0,
    )
    card_w, card_h = 60.2, 23.5
    for idx, ((title, body), image) in enumerate(zip(content["materials"], materials)):
        col, row = idx % 3, idx // 3
        x, top = 11 + col * 62.9, 194.3 + row * 24.1
        c.setFillColor(PALE)
        c.setStrokeColor(LIGHT)
        c.setLineWidth(0.22 * mm)
        c.roundRect(x * mm, top_y(top + card_h), card_w * mm, card_h * mm, 1.2 * mm, fill=1, stroke=1)
        draw_cover_image(c, image, x + 1.0, top + 1.0, card_w - 2.0, 12.0)
        base.draw_text_shrink(
            c, title, x + 1.2, top + 13.5, card_w - 2.4,
            font="Arial-Bold", size=5.8, min_size=4.25, max_lines=2,
            color=GREEN, leading_factor=0.95,
        )
        base.draw_text_shrink(
            c, body, x + 1.2, top + 17.1, card_w - 2.4,
            font="Arial", size=4.85, min_size=3.8, max_lines=4,
            color=BODY, leading_factor=0.94,
        )

    base.draw_box(c, 7, 246, 196, 20)
    columns = [(11, 58), (72.5, 52.5), (128.5, 70.5)]
    for title, (x, width) in zip(
        [content["benefitsTitle"], content["applicationsTitle"], content["appearanceTitle"]],
        columns,
    ):
        base.section_heading(c, title, x, 248.7, width, 7.7)
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.25 * mm)
    c.line(70.5 * mm, top_y(249), 70.5 * mm, top_y(263.8))
    c.line(126.5 * mm, top_y(249), 126.5 * mm, top_y(263.8))
    for idx, item in enumerate(content["benefits"]):
        top = 253.0 + idx * 1.48
        base.bullet(c, 11.7, top + 0.55, 0.42)
        base.draw_text_shrink(
            c, item, 13.2, top, 55.3, font="Arial", size=4.85,
            min_size=3.75, max_lines=1, color=BODY,
        )
    for idx, item in enumerate(content["applications"]):
        top = 253.0 + idx * 1.88
        base.bullet(c, 73.2, top + 0.55, 0.42)
        base.draw_text_shrink(
            c, item, 74.7, top, 49.5, font="Arial", size=4.75,
            min_size=3.65, max_lines=1, color=BODY,
        )
    base.draw_text_shrink(
        c, content["appearance"], 128.5, 253.0, 70.5, font="Arial",
        size=5.0, min_size=3.9, max_lines=7, color=BODY, leading_factor=1.0,
    )

    base.draw_box(c, 7, 267, 196, 15)
    base.section_heading(c, content["requirementsTitle"], 11, 269.7, 188, 8.2)
    base.draw_text_shrink(
        c, content["requirements"], 11, 273.9, 188, font="Arial",
        size=4.95, min_size=3.8, max_lines=5, color=BODY, leading_factor=0.92,
    )

    c.setStrokeColor(GREEN)
    c.setLineWidth(0.48 * mm)
    c.line(7 * mm, top_y(284.1), 203 * mm, top_y(284.1))
    base.draw_text(c, content["footerWeb"], 7, 284.7, 196, font="Arial-Bold", size=6.3, color=GREEN, max_lines=1, align="center")
    base.draw_text(c, content["footerContact"], 7, 287.4, 196, size=5.9, color=BODY, max_lines=1, align="center")
    base.draw_text_shrink(
        c, content["footerLegal"], 7, 290.1, 196, font="Arial",
        size=5.7, min_size=4.8, max_lines=1, color=BODY, align="center",
    )


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
    writer.add_metadata(
        {
            "/Title": content["cardTitle"],
            "/Author": "EcoViva Mallorca S.L.",
            "/Subject": content["metaDescription"],
            "/Keywords": "EcoViva Mallorca, ventilated façade, PIR insulation",
        }
    )
    with final.open("wb") as stream:
        writer.write(stream)
    raw.unlink()


def generate_one(content: dict, print_ready: bool) -> Path:
    suffix = "Print_3mmBleed.pdf" if print_ready else "Download.pdf"
    filename = f"{content['pdfStem']}_{suffix}"
    final = DOWNLOADS / filename
    raw = DOWNLOADS / f".{filename}.raw.pdf"
    page_size = (
        (base.PRINT_W_MM * mm, base.PRINT_H_MM * mm)
        if print_ready
        else (base.PAGE_W_MM * mm, base.PAGE_H_MM * mm)
    )
    c = canvas.Canvas(str(raw), pagesize=page_size, pageCompression=1)
    c.setTitle(content["cardTitle"])
    c.setAuthor("EcoViva Mallorca S.L.")
    c.setSubject(content["metaDescription"])
    c.setCreator("EcoViva shared Technical Library production generator")
    c.setFillColor(white)
    c.rect(0, 0, *page_size, fill=1, stroke=0)
    if print_ready:
        c.saveState()
        c.translate(base.TRIM_OFFSET_MM * mm, base.TRIM_OFFSET_MM * mm)
        draw_page(c, content)
        c.restoreState()
    else:
        draw_page(c, content)
    c.showPage()
    c.save()
    finalize_pdf(raw, final, content, print_ready)
    return final


def main() -> None:
    base.register_fonts()
    DOWNLOADS.mkdir(parents=True, exist_ok=True)
    outputs = []
    for lang in ("en", "es", "de"):
        outputs.append(generate_one(CONTENTS[lang], False))
        outputs.append(generate_one(CONTENTS[lang], True))
    print("\n".join(str(path) for path in outputs))


if __name__ == "__main__":
    main()
