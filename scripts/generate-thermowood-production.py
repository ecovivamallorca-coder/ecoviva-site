#!/usr/bin/env python3
"""Generate the three-language EcoViva ThermoWood download and print PDFs."""

from __future__ import annotations

import base64
import io
import json
import re
from pathlib import Path

from PIL import Image
from pypdf import PdfReader, PdfWriter
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from pypdf.generic import (
    ArrayObject,
    DecodedStreamObject,
    DictionaryObject,
    FloatObject,
    NameObject,
    NumberObject,
    TextStringObject,
)
from reportlab.lib.colors import HexColor, white
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
ASSETS = ROOT / "public" / "assets" / "technical-library"
THERMO = ASSETS / "thermowood"
DOWNLOADS = ROOT / "public" / "downloads"
GEOMETRY = json.loads((SCRIPTS / "thermowood-geometry.json").read_text())
CONTENTS = {
    lang: json.loads((SCRIPTS / f"thermowood-content-{lang}.json").read_text())
    for lang in ("en", "es", "de")
}

PAGE_W_MM = 210
PAGE_H_MM = 297
PRINT_W_MM = 216
PRINT_H_MM = 303
TRIM_OFFSET_MM = 3
MM = 72 / 25.4

GREEN = HexColor("#3E6B20")
DARK_GREEN = HexColor("#244C1B")
TEXT = HexColor("#0B0D0B")
BODY = HexColor("#454A45")
LIGHT = HexColor("#D9DED8")
PALE = HexColor("#F6F8F4")
TECHNICAL_LIBRARY_URL = "https://www.ecoviva-mallorca.com/technical-library/start/"


def register_fonts() -> None:
    font_dir = Path("/System/Library/Fonts/Supplemental")
    pdfmetrics.registerFont(TTFont("Arial", str(font_dir / "Arial.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-Bold", str(font_dir / "Arial Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-Italic", str(font_dir / "Arial Italic.ttf")))


def top_y(top_mm: float) -> float:
    return PAGE_H_MM * mm - top_mm * mm


def technical_library_qr() -> Image.Image:
    qr = qrcode.QRCode(
        error_correction=ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(TECHNICAL_LIBRARY_URL)
    qr.make(fit=True)
    return qr.make_image(fill_color="#3E6B20", back_color="white").convert("RGB")


def split_lines(text: str, width_pt: float, font: str, size: float) -> list[str]:
    words: list[str] = []
    for word in text.split():
        if pdfmetrics.stringWidth(word, font, size) <= width_pt or "-" not in word:
            words.append(word)
            continue
        parts = re.findall(r"[^-]+-?", word)
        words.extend(part for part in parts if part)
    lines: list[str] = []
    current = ""
    for word in words:
        trial = word if not current else f"{current} {word}"
        if pdfmetrics.stringWidth(trial, font, size) <= width_pt:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_text(
    c: canvas.Canvas,
    text: str,
    x_mm: float,
    top_mm: float,
    width_mm: float,
    *,
    font: str = "Arial",
    size: float = 6.0,
    leading: float | None = None,
    color=BODY,
    max_lines: int | None = None,
    align: str = "left",
) -> float:
    leading = leading or size * 1.18
    lines = split_lines(text, width_mm * mm, font, size)
    if max_lines is not None and len(lines) > max_lines:
        raise ValueError(
            f"Text overflow at {x_mm},{top_mm}: {len(lines)} lines exceeds {max_lines}: {text}"
        )
    c.setFont(font, size)
    c.setFillColor(color)
    y = top_y(top_mm) - size
    for line in lines:
        line_width = pdfmetrics.stringWidth(line, font, size)
        if align == "center":
            tx = x_mm * mm + (width_mm * mm - line_width) / 2
        elif align == "right":
            tx = (x_mm + width_mm) * mm - line_width
        else:
            tx = x_mm * mm
        c.drawString(tx, y, line)
        y -= leading
    return len(lines) * leading / mm


def draw_text_shrink(
    c: canvas.Canvas,
    text: str,
    x_mm: float,
    top_mm: float,
    width_mm: float,
    *,
    font: str,
    size: float,
    min_size: float,
    max_lines: int,
    color=BODY,
    align: str = "left",
    leading_factor: float = 1.18,
) -> tuple[float, float]:
    selected = size
    while selected >= min_size:
        lines = split_lines(text, width_mm * mm, font, selected)
        all_lines_fit = all(
            pdfmetrics.stringWidth(line, font, selected) <= width_mm * mm for line in lines
        )
        if len(lines) <= max_lines and all_lines_fit:
            used = draw_text(
                c,
                text,
                x_mm,
                top_mm,
                width_mm,
                font=font,
                size=selected,
                leading=selected * leading_factor,
                color=color,
                max_lines=max_lines,
                align=align,
            )
            return used, selected
        selected = round(selected - 0.1, 2)
    raise ValueError(f"Cannot fit text above {min_size} pt: {text}")


def draw_box(c: canvas.Canvas, x: float, top: float, w: float, h: float, radius: float = 1.5) -> None:
    c.setFillColor(white)
    c.setStrokeColor(GREEN)
    c.setLineWidth(0.48 * mm)
    c.roundRect(x * mm, top_y(top + h), w * mm, h * mm, radius * mm, fill=1, stroke=1)


def draw_rule(c: canvas.Canvas, x: float, top: float, w: float) -> None:
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.35 * mm)
    c.line(x * mm, top_y(top), (x + w) * mm, top_y(top))


def section_heading(c: canvas.Canvas, text: str, x: float, top: float, w: float, size: float = 9.6) -> None:
    draw_text_shrink(
        c,
        text,
        x,
        top,
        w,
        font="Arial-Bold",
        size=size,
        min_size=7.3,
        max_lines=1,
        color=GREEN,
    )
    draw_rule(c, x, top + 3.8, w)


def extract_logo_png(svg_path: Path) -> ImageReader:
    data = svg_path.read_text(encoding="utf-8")
    match = re.search(r"data:image/png;base64,([^\"']+)", data)
    if not match:
        raise ValueError(f"No embedded PNG found in {svg_path}")
    return ImageReader(io.BytesIO(base64.b64decode(match.group(1))))


def draw_contained_image(
    c: canvas.Canvas,
    image: Image.Image | ImageReader,
    x_mm: float,
    top_mm: float,
    w_mm: float,
    h_mm: float,
    scale: float = 1.0,
) -> None:
    if isinstance(image, Image.Image):
        iw, ih = image.size
        reader = ImageReader(image)
    else:
        iw, ih = image.getSize()
        reader = image
    box_w, box_h = w_mm * mm, h_mm * mm
    factor = min(box_w / iw, box_h / ih) * scale
    draw_w, draw_h = iw * factor, ih * factor
    draw_x = x_mm * mm + (box_w - draw_w) / 2
    draw_y = top_y(top_mm + h_mm) + (box_h - draw_h) / 2
    c.drawImage(reader, draw_x, draw_y, width=draw_w, height=draw_h, mask="auto")


def draw_contained_image_clipped(
    c: canvas.Canvas,
    image: Image.Image,
    x_mm: float,
    top_mm: float,
    w_mm: float,
    h_mm: float,
    scale: float,
) -> None:
    c.saveState()
    clip = c.beginPath()
    clip.rect(x_mm * mm, top_y(top_mm + h_mm), w_mm * mm, h_mm * mm)
    c.clipPath(clip, stroke=0, fill=0)
    draw_contained_image(c, image, x_mm, top_mm, w_mm, h_mm, scale)
    c.restoreState()


def number_circle(c: canvas.Canvas, number: int, cx: float, cy_top: float, radius: float = 2.35) -> None:
    c.setFillColor(GREEN)
    c.circle(cx * mm, top_y(cy_top), radius * mm, fill=1, stroke=0)
    c.setFont("Arial-Bold", 7)
    c.setFillColor(white)
    c.drawCentredString(cx * mm, top_y(cy_top) - 2.45, str(number))


def bullet(c: canvas.Canvas, x: float, top: float, radius: float = 0.62) -> None:
    c.setFillColor(GREEN)
    c.circle(x * mm, top_y(top), radius * mm, fill=1, stroke=0)


def draw_page(c: canvas.Canvas, content: dict) -> None:
    lang = content["lang"]
    logo = extract_logo_png(ASSETS / "ecoviva-logo.svg")
    qr = technical_library_qr()
    hero = Image.open(THERMO / GEOMETRY["hero"]["asset"]).convert("RGB")
    component_assets = [
        Image.open(THERMO / item["file"]).convert("RGB")
        for item in GEOMETRY["components"]["assets"]
    ]
    design_assets = [
        Image.open(THERMO / item).convert("RGB")
        for item in GEOMETRY["designOptions"]["files"]
    ]
    ageing_assets = [
        Image.open(THERMO / item).convert("RGB")
        for item in GEOMETRY["ageing"]["files"]
    ]

    c.setFillColor(white)
    c.rect(0, 0, PAGE_W_MM * mm, PAGE_H_MM * mm, fill=1, stroke=0)
    draw_contained_image(c, logo, 7, 5.2, 51.5, 15.5)
    c.setFont("Arial-Bold", 7.2)
    c.setFillColor(GREEN)
    c.drawString(63 * mm, top_y(6.2) - 7.2, content["library"])
    title_size = 21 if lang == "en" else 18.2 if lang == "es" else 17.2
    c.setFont("Arial-Bold", title_size)
    c.setFillColor(TEXT)
    c.drawString(63 * mm, top_y(10.2) - title_size, content["titleLines"][0])
    c.drawString(63 * mm, top_y(18.1) - title_size, content["titleLines"][1])
    subtitle_size = 9 if lang == "en" else 8.0 if lang == "es" else 8.2
    c.setFont("Arial-Bold", subtitle_size)
    c.setFillColor(BODY)
    c.drawString(63 * mm, top_y(27.1) - subtitle_size, content["subtitle"])
    draw_contained_image(c, qr, 184.4, 4.3, 17.5, 17.5)
    c.setFillColor(GREEN)
    c.circle(176.2 * mm, top_y(27.7), 4.8 * mm, fill=1, stroke=0)
    c.setFont("Arial-Bold", 7.3)
    c.setFillColor(white)
    c.drawCentredString(176.2 * mm, top_y(27.7) - 2.55, content["code"])

    # Exact approved V6 annotated hero panel.
    c.drawImage(
        ImageReader(hero),
        7 * mm,
        top_y(95),
        width=105 * mm,
        height=60 * mm,
        mask="auto",
    )

    draw_box(c, 114, 35, 89, 37)
    section_heading(c, content["overviewTitle"], 118, 38.0, 81)
    overview_size = {"en": 7.7, "es": 6.9, "de": 6.8}[lang]
    used, _ = draw_text_shrink(
        c,
        content["overview"],
        118,
        43.0,
        81,
        font="Arial",
        size=overview_size,
        min_size=6.2,
        max_lines=7,
        color=BODY,
        leading_factor=1.13,
    )
    note_size = {"en": 6.8, "es": 6.2, "de": 6.2}[lang]
    draw_text_shrink(
        c,
        content["overviewNote"],
        118,
        43.0 + used + 0.7,
        81,
        font="Arial-Italic",
        size=note_size,
        min_size=5.8,
        max_lines=4,
        color=BODY,
        leading_factor=1.12,
    )

    draw_box(c, 114, 74, 89, 21)
    section_heading(c, content["whyTitle"], 118, 77.0, 81)
    for idx, item in enumerate(content["why"]):
        col, row = idx % 2, idx // 2
        x, top = 119.2 + col * 40.3, 82.1 + row * 6.0
        bullet(c, x, top + 0.8, 0.72)
        draw_text_shrink(
            c,
            item,
            x + 2.3,
            top,
            36.3,
            font="Arial",
            size=6.8,
            min_size=5.8,
            max_lines=2,
            color=BODY,
            leading_factor=1.06,
        )

    draw_box(c, 7, 97, 196, 37)
    section_heading(c, content["layersTitle"], 11, 100.1, 188)
    layout = GEOMETRY["buildUp"]
    for x, width, ids, tops in (
        (11, 91, layout["leftIndices"], layout["leftRowTops"]),
        (106, 93, layout["rightIndices"], layout["rightRowTops"]),
    ):
        for item_idx, top in zip(ids, tops):
            number_circle(c, item_idx + 1, x + 1.4, top + 1.4)
            title, body = content["layers"][item_idx]
            draw_text_shrink(
                c,
                title,
                x + 6,
                top - 0.2,
                width - 6,
                font="Arial-Bold",
                size=7.8,
                min_size=6.6,
                max_lines=1,
                color=TEXT,
            )
            draw_text_shrink(
                c,
                body,
                x + 6,
                top + 2.8,
                width - 6,
                font="Arial",
                size=7.0,
                min_size=5.9,
                max_lines=2,
                color=BODY,
                leading_factor=1.06,
            )

    draw_box(c, 7, 136, 196, 26)
    section_heading(c, content["principlesTitle"], 11, 139.1, 188)
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.25 * mm)
    c.line(105 * mm, top_y(142.8), 105 * mm, top_y(159.5))
    c.line(11 * mm, top_y(151.3), 199 * mm, top_y(151.3))
    positions = [(11, 144.0), (108, 144.0), (11, 152.6), (108, 152.6)]
    for (title, body), (x, top) in zip(content["principles"], positions):
        c.setStrokeColor(GREEN)
        c.setLineWidth(0.42 * mm)
        c.circle((x + 1.7) * mm, top_y(top + 1.7), 1.65 * mm, fill=0, stroke=1)
        c.line((x + 0.95) * mm, top_y(top + 1.7), (x + 1.45) * mm, top_y(top + 2.2))
        c.line((x + 1.45) * mm, top_y(top + 2.2), (x + 2.55) * mm, top_y(top + 0.95))
        draw_text_shrink(
            c,
            title,
            x + 4.8,
            top - 0.1,
            88,
            font="Arial-Bold",
            size=7.2,
            min_size=5.8,
            max_lines=1,
            color=GREEN,
        )
        draw_text_shrink(
            c,
            body,
            x + 4.8,
            top + 2.9,
            88,
            font="Arial",
            size=6.8,
            min_size=5.6,
            max_lines=2,
            color=BODY,
            leading_factor=1.06,
        )

    draw_box(c, 7, 164, 196, 37)
    section_heading(c, content["componentsTitle"], 11, 167.1, 188)
    comp = GEOMETRY["components"]
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.2 * mm)
    for divider_x in comp["dividerXs"]:
        c.line(divider_x * mm, top_y(comp["dividerTop"]), divider_x * mm, top_y(comp["dividerBottom"]))
    for idx, ((title, body), image, asset) in enumerate(
        zip(content["components"], component_assets, comp["assets"])
    ):
        x = comp["columnStartX"] + idx * comp["columnWidth"]
        draw_contained_image_clipped(
            c,
            image,
            comp["imageSlotLefts"][idx],
            comp["imageSlotTop"],
            comp["imageSlotWidth"],
            comp["imageSlotHeight"],
            asset["scale"],
        )
        draw_text_shrink(
            c,
            title,
            x + 1,
            185.6,
            comp["columnWidth"] - 2,
            font="Arial-Bold",
            size=7.3,
            min_size=5.8,
            max_lines=2,
            color=TEXT,
            leading_factor=1.05,
        )
        draw_text_shrink(
            c,
            body,
            x + 1,
            191.9,
            comp["columnWidth"] - 2,
            font="Arial",
            size=6.8,
            min_size=5.6,
            max_lines=3,
            color=BODY,
            leading_factor=1.06,
        )

    draw_box(c, 7, 203, 196, 35)
    section_heading(c, content["designOptionsTitle"], 11, 206.1, 188)
    opt_x, opt_w = 11, 31.33
    for idx, ((title, body), image) in enumerate(zip(content["designOptions"], design_assets)):
        x = opt_x + idx * opt_w
        draw_contained_image(c, image, x + (opt_w - 20) / 2, 210.3, 20, 16.5)
        draw_text_shrink(
            c,
            title,
            x + 0.7,
            227.2,
            opt_w - 1.4,
            font="Arial-Bold",
            size=7.2,
            min_size=5.6,
            max_lines=1,
            color=TEXT,
            align="center",
        )
        draw_text_shrink(
            c,
            body,
            x + 0.7,
            230.4,
            opt_w - 1.4,
            font="Arial",
            size=6.5,
            min_size=5.2,
            max_lines=2,
            color=BODY,
            align="center",
            leading_factor=1.05,
        )

    draw_box(c, 7, 240, 196, 27)
    col1_x, col1_w = 11, 59
    col2_x, col2_w = 74, 50
    col3_x, col3_w = 128, 71
    section_heading(c, content["benefitsTitle"], col1_x, 243.0, col1_w, 9.0)
    section_heading(c, content["applicationsTitle"], col2_x, 243.0, col2_w, 9.0)
    section_heading(c, content["ageingTitle"], col3_x, 243.0, col3_w, 9.0)
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.25 * mm)
    c.line(72 * mm, top_y(243.4), 72 * mm, top_y(264.2))
    c.line(126 * mm, top_y(243.4), 126 * mm, top_y(264.2))
    lower_size = 6.8 if lang == "en" else 6.3
    for idx, item in enumerate(content["benefits"]):
        top = 248 + idx * 3
        bullet(c, col1_x + 0.8, top + 0.8)
        draw_text_shrink(
            c,
            item,
            col1_x + 2.5,
            top,
            col1_w - 2.5,
            font="Arial",
            size=lower_size,
            min_size=5.5,
            max_lines=1,
            color=BODY,
        )
    for idx, item in enumerate(content["applications"]):
        top = 248 + idx * 3
        bullet(c, col2_x + 0.8, top + 0.8)
        draw_text_shrink(
            c,
            item,
            col2_x + 2.5,
            top,
            col2_w - 2.5,
            font="Arial",
            size=lower_size,
            min_size=5.4,
            max_lines=1,
            color=BODY,
        )
    age = GEOMETRY["ageing"]
    label_size = 6.3 if lang == "en" else 5.6
    for idx, (label, image) in enumerate(zip(content["ageingStages"], ageing_assets)):
        x = age["lefts"][idx]
        draw_contained_image(c, image, x, age["top"], age["width"], age["height"])
        draw_text_shrink(
            c,
            label,
            x,
            257.65,
            age["width"],
            font="Arial",
            size=label_size,
            min_size=5.2,
            max_lines=1 if lang == "en" else 2,
            color=TEXT,
            align="center",
            leading_factor=0.95,
        )
    draw_text_shrink(
        c,
        content["ageingNote"],
        col3_x,
        261.0 if lang == "en" else 262.0,
        col3_w,
        font="Arial",
        size=6.3 if lang == "en" else 5.7,
        min_size=5.0,
        max_lines=2,
        color=BODY,
        leading_factor=1.05,
    )

    draw_box(c, 7, 269, 196, 17)
    section_heading(c, content["requirementsTitle"], 11, 272.0, 188, 9.0)
    draw_text_shrink(
        c,
        content["requirements"],
        11,
        276.5,
        188,
        font="Arial",
        size=7.0 if lang == "en" else 6.4,
        min_size=5.8,
        max_lines=4,
        color=BODY,
        leading_factor=0.98,
    )

    c.setStrokeColor(GREEN)
    c.setLineWidth(0.48 * mm)
    c.line(7 * mm, top_y(287.5), 203 * mm, top_y(287.5))
    draw_text(c, content["footerWeb"], 7, 288.0, 196, font="Arial-Bold", size=6.8, color=GREEN, max_lines=1, align="center")
    draw_text(c, content["footerContact"], 7, 290.9, 196, size=6.5, color=BODY, max_lines=1, align="center")
    draw_text_shrink(
        c,
        content["footerLegal"],
        7,
        293.9,
        196,
        font="Arial",
        size=6.4,
        min_size=5.8,
        max_lines=1,
        color=BODY,
        align="center",
    )


def pdf_box(values: tuple[float, float, float, float]) -> ArrayObject:
    return ArrayObject([FloatObject(v * MM) for v in values])


def add_output_intent(writer: PdfWriter) -> None:
    profile_path = Path("/System/Library/ColorSync/Profiles/sRGB Profile.icc")
    if not profile_path.exists():
        return
    profile = DecodedStreamObject()
    profile.set_data(profile_path.read_bytes())
    profile.update({NameObject("/N"): NumberObject(3)})
    profile_ref = writer._add_object(profile)
    intent = DictionaryObject(
        {
            NameObject("/Type"): NameObject("/OutputIntent"),
            NameObject("/S"): NameObject("/GTS_PDFA1"),
            NameObject("/OutputConditionIdentifier"): TextStringObject("sRGB IEC61966-2.1"),
            NameObject("/Info"): TextStringObject("sRGB IEC61966-2.1"),
            NameObject("/DestOutputProfile"): profile_ref,
        }
    )
    writer._root_object.update(
        {NameObject("/OutputIntents"): ArrayObject([writer._add_object(intent)])}
    )


def finalize_pdf(raw: Path, final: Path, content: dict, print_ready: bool) -> None:
    reader = PdfReader(raw)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    page = writer.pages[0]
    if print_ready:
        page.mediabox = pdf_box((0, 0, 216, 303))
        page.cropbox = pdf_box((0, 0, 216, 303))
        page.trimbox = pdf_box((3, 3, 213, 300))
        page.bleedbox = pdf_box((0, 0, 216, 303))
        page.artbox = pdf_box((3, 3, 213, 300))
    else:
        page.mediabox = pdf_box((0, 0, 210, 297))
        page.cropbox = pdf_box((0, 0, 210, 297))
        page.trimbox = pdf_box((0, 0, 210, 297))
        page.bleedbox = pdf_box((0, 0, 210, 297))
        page.artbox = pdf_box((0, 0, 210, 297))
    add_output_intent(writer)
    writer.add_metadata(
        {
            "/Title": content["title"],
            "/Author": "EcoViva Mallorca S.L.",
            "/Subject": "Ventilated ThermoWood façade technical sheet",
            "/Keywords": "EcoViva Mallorca, ThermoWood, ventilated timber façade, PIR insulation, technical library",
        }
    )
    with final.open("wb") as handle:
        writer.write(handle)
    raw.unlink()


def generate_one(content: dict, print_ready: bool) -> Path:
    suffix = "Print_3mmBleed" if print_ready else "Download"
    final = DOWNLOADS / f"{content['pdfStem']}_{suffix}.pdf"
    raw = DOWNLOADS / f".{content['pdfStem']}_{suffix}_raw.pdf"
    page_size = (
        PRINT_W_MM * mm,
        PRINT_H_MM * mm,
    ) if print_ready else (PAGE_W_MM * mm, PAGE_H_MM * mm)
    c = canvas.Canvas(str(raw), pagesize=page_size, pageCompression=1)
    c.setTitle(content["title"])
    c.setAuthor("EcoViva Mallorca S.L.")
    c.setSubject("Production technical sheet")
    c.setCreator("EcoViva shared ThermoWood production generator")
    c.setFillColor(white)
    c.rect(0, 0, page_size[0], page_size[1], fill=1, stroke=0)
    if print_ready:
        c.saveState()
        c.translate(TRIM_OFFSET_MM * mm, TRIM_OFFSET_MM * mm)
        draw_page(c, content)
        c.restoreState()
    else:
        draw_page(c, content)
    c.showPage()
    c.save()
    finalize_pdf(raw, final, content, print_ready)
    return final


def main() -> None:
    register_fonts()
    DOWNLOADS.mkdir(parents=True, exist_ok=True)
    outputs = []
    for lang in ("en", "es", "de"):
        outputs.append(generate_one(CONTENTS[lang], False))
        outputs.append(generate_one(CONTENTS[lang], True))
    print("\n".join(str(path) for path in outputs))


if __name__ == "__main__":
    main()
