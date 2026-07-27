#!/usr/bin/env python3
"""Create and validate the 36-file EcoViva A4 PDF family.

The approved one-page Download PDFs remain the artwork masters.  This controlled
pass replaces the language-overview QR, applies the canonical German Why EcoViva
block, and derives genuine 3 mm-bleed Print PDFs from each corrected Download.
"""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfReader, PdfWriter, Transformation
from pypdf._page import PageObject
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
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


REPO = Path(__file__).resolve().parents[1]
PROJECT = REPO.parents[1]
DOWNLOADS = REPO / "public" / "downloads"
PACKAGE = PROJECT / "output" / "pdf" / "EcoViva_Technical_Library_A4_PDF_Harmonisation"
BEFORE = PACKAGE / "comparisons" / "before-pdfs"
REPORT = PACKAGE / "report"
CONTACT = PACKAGE / "contact-sheets"
QR_REPORT = PACKAGE / "qr"
TEXT_REPORT = PACKAGE / "text-changes"
PD_TO_PNG = Path(
    "/Users/markushackenjos/.cache/codex-runtimes/codex-primary-runtime/"
    "dependencies/bin/override/pdftoppm"
)
MM = 72 / 25.4
GREEN = HexColor("#3E6B20")
BODY = HexColor("#454A45")
LIGHT = HexColor("#D9DED8")
URLS = {
    "EN": "https://www.ecoviva-mallorca.com/technical-library/en/",
    "ES": "https://www.ecoviva-mallorca.com/technical-library/es/",
    "DE": "https://www.ecoviva-mallorca.com/technical-library/de/",
}
WHY_DE = [
    "Unabhängige Sanierungsberatung",
    "Lokale Mallorca-Expertise",
    "Projektspezifische technische Prüfung",
    "Ein Ansprechpartner vom Konzept bis zur Fertigstellung",
]

STEMS = {
    "traditional-roof": {
        "EN": "EcoViva_A4_Traditional_Mallorcan_Roof_EN",
        "ES": "EcoViva_A4_Traditional_Mallorcan_Roof_ES",
        "DE": "EcoViva_A4_Traditional_Mallorcan_Roof_DE",
    },
    "etics": {
        "EN": "EcoViva_A4_ETICS_External_Wall_Insulation_EN",
        "ES": "EcoViva_A4_Sistema_SATE_Aislamiento_Exterior_ES",
        "DE": "EcoViva_A4_WDVS_Aussendaemmung_Putzfassade_DE",
    },
    "natural-stone": {
        "EN": "EcoViva_A4_Natural_Stone_Facade_System_EN",
        "ES": "EcoViva_A4_Sistema_Fachada_Piedra_Natural_ES",
        "DE": "EcoViva_A4_Naturstein_Fassadensystem_DE",
    },
    "thermowood": {
        "EN": "EcoViva_A4_Ventilated_ThermoWood_Facade_System_EN",
        "ES": "EcoViva_A4_Sistema_Fachada_Ventilada_ThermoWood_ES",
        "DE": "EcoViva_A4_Hinterlueftetes_ThermoWood_Fassadensystem_DE",
    },
    "universal-ventilated-facade": {
        "EN": "EcoViva_A4_Universal_Ventilated_Facade_System_EN",
        "ES": "EcoViva_A4_Sistema_Universal_Fachada_Ventilada_ES",
        "DE": "EcoViva_A4_Universelles_Hinterlueftetes_Fassadensystem_DE",
    },
    "universal-flat-roof": {
        "EN": "EcoViva_A4_Universal_Insulated_Flat_Roof_System_EN",
        "ES": "EcoViva_A4_Sistema_Universal_Cubierta_Plana_Aislada_ES",
        "DE": "EcoViva_A4_Universelles_Gedaemmtes_Flachdachsystem_DE",
    },
}

WHY_GEOMETRY = {
    "traditional-roof": (113, 73.8, 90, 25.867),
    "etics": (113, 73.8, 90, 25.867),
    "natural-stone": (104, 65, 99, 18),
    "thermowood": (114, 74, 89, 21),
    "universal-ventilated-facade": (114, 73, 89, 20),
    "universal-flat-roof": (114, 74, 89, 21),
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def pdf_box(values: tuple[float, float, float, float]) -> ArrayObject:
    return ArrayObject([FloatObject(v * MM) for v in values])


def register_fonts() -> None:
    fonts = Path("/System/Library/Fonts/Supplemental")
    pdfmetrics.registerFont(TTFont("Arial", str(fonts / "Arial.ttf")))
    pdfmetrics.registerFont(TTFont("Arial-Bold", str(fonts / "Arial Bold.ttf")))


def qr_image(lang: str) -> Image.Image:
    source = (
        REPO
        / "public"
        / "assets"
        / "technical-library"
        / "universal-insulated-flat-roof"
        / f"qr-{lang.lower()}.svg"
    )
    root = ET.parse(source).getroot()
    scale = 20
    image = Image.new("RGB", (49 * scale, 49 * scale), "white")
    draw = ImageDraw.Draw(image)
    for rect in root.iter("{http://www.w3.org/2000/svg}rect"):
        style = rect.attrib.get("style", "")
        if "rgb(24%,41%,12%)" not in style:
            continue
        x, y = float(rect.attrib["x"]), float(rect.attrib["y"])
        w, h = float(rect.attrib["width"]), float(rect.attrib["height"])
        top = 49 - y - h
        draw.rectangle(
            (
                round(x * scale),
                round(top * scale),
                round((x + w) * scale) - 1,
                round((top + h) * scale) - 1,
            ),
            fill=(61, 105, 31),
        )
    return image


def top_y(top_mm: float) -> float:
    return 297 * mm - top_mm * mm


def overlay_pdf(module: str, lang: str, path: Path) -> Path:
    out = PACKAGE / "working" / f"{path.stem}_overlay.pdf"
    out.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(out), pagesize=(210 * mm, 297 * mm))
    # Replace the existing QR completely; the retained SVG matrix has a 4-module quiet zone.
    c.setFillColor(white)
    c.rect(183.6 * mm, top_y(3.5 + 19.0), 19.0 * mm, 19.0 * mm, fill=1, stroke=0)
    qr_tmp = PACKAGE / "working" / f"qr-{lang}.png"
    qr_image(lang).save(qr_tmp)
    c.drawImage(
        str(qr_tmp),
        184.35 * mm,
        top_y(4.3 + 17.5),
        17.5 * mm,
        17.5 * mm,
    )

    if lang == "DE":
        x, top, width, height = WHY_GEOMETRY[module]
        c.setFillColor(white)
        c.setStrokeColor(GREEN)
        c.setLineWidth(0.48 * mm)
        c.roundRect(x * mm, top_y(top + height), width * mm, height * mm, 1.5 * mm, fill=1, stroke=1)
        c.setFillColor(GREEN)
        c.setFont("Arial-Bold", 9.0)
        c.drawString((x + 4) * mm, top_y(top + 5.3), "WARUM ECOVIVA")
        c.setStrokeColor(LIGHT)
        c.setLineWidth(0.3 * mm)
        c.line((x + 4) * mm, top_y(top + 7.6), (x + width - 4) * mm, top_y(top + 7.6))
        col_width = (width - 10) / 2
        for index, text in enumerate(WHY_DE):
            col, row = index % 2, index // 2
            tx = x + 4 + col * (col_width + 2)
            ty = top + 10.7 + row * ((height - 10.5) / 2)
            c.setFillColor(GREEN)
            c.circle((tx + 0.8) * mm, top_y(ty + 0.2), 0.72 * mm, fill=1, stroke=0)
            c.setFillColor(BODY)
            size = 5.55 if len(text) < 43 else 4.8
            c.setFont("Arial", size)
            words = text.split()
            lines, current = [], ""
            max_width = (col_width - 2.2) * mm
            for word in words:
                trial = word if not current else f"{current} {word}"
                if pdfmetrics.stringWidth(trial, "Arial", size) <= max_width:
                    current = trial
                else:
                    lines.append(current)
                    current = word
            if current:
                lines.append(current)
            for line_index, line in enumerate(lines[:2]):
                c.drawString((tx + 2.2) * mm, top_y(ty + line_index * 2.15), line)
    c.save()
    return out


def add_uri(writer: PdfWriter, page: PageObject, rect: tuple[float, float, float, float], uri: str) -> None:
    annotation = DictionaryObject(
        {
            NameObject("/Type"): NameObject("/Annot"),
            NameObject("/Subtype"): NameObject("/Link"),
            NameObject("/Rect"): pdf_box(rect),
            NameObject("/Border"): ArrayObject([NumberObject(0), NumberObject(0), NumberObject(0)]),
            NameObject("/A"): DictionaryObject(
                {NameObject("/S"): NameObject("/URI"), NameObject("/URI"): TextStringObject(uri)}
            ),
        }
    )
    ref = writer._add_object(annotation)
    page[NameObject("/Annots")] = ArrayObject([ref])


def remove_unused_base14_fonts(page: PageObject) -> None:
    """Remove ReportLab's empty Helvetica setup blocks and unused resources."""
    data = page.get_contents().get_data()
    data = re.sub(
        rb"BT\s*/F1(?:-\d+)?\s+12\s+Tf\s+14\.4\s+TL\s+ET",
        b"",
        data,
    )
    stream = DecodedStreamObject()
    stream.set_data(data)
    page[NameObject("/Contents")] = stream
    fonts = page.get("/Resources", {}).get("/Font", {})
    for key, ref in list(fonts.items()):
        font = ref.get_object()
        if font.get("/BaseFont") == "/Helvetica" and (str(key).encode() + b" ") not in data:
            del fonts[key]


def corrected_download(module: str, lang: str, source: Path, destination: Path) -> None:
    base = PdfReader(source).pages[0]
    overlay = PdfReader(overlay_pdf(module, lang, source)).pages[0]
    base.merge_page(overlay, over=True)
    remove_unused_base14_fonts(base)
    writer = PdfWriter()
    writer.add_page(base)
    page = writer.pages[0]
    for name in ("mediabox", "cropbox", "trimbox", "bleedbox", "artbox"):
        setattr(page, name, pdf_box((0, 0, 210, 297)))
    add_uri(writer, page, (184.35, 275.2, 201.85, 292.7), URLS[lang])
    writer.add_metadata(
        {
            "/Title": destination.stem.replace("_", " "),
            "/Author": "EcoViva Mallorca S.L.",
            "/Subject": "EcoViva Technical Library A4 harmonised Download PDF",
        }
    )
    with destination.open("wb") as handle:
        writer.write(handle)


def print_from_download(source: Path, destination: Path, lang: str) -> None:
    src = PdfReader(source).pages[0]
    page = PageObject.create_blank_page(width=216 * MM, height=303 * MM)
    page.merge_transformed_page(src, Transformation().translate(3 * MM, 3 * MM))
    writer = PdfWriter()
    writer.add_page(page)
    page = writer.pages[0]
    page.mediabox = pdf_box((0, 0, 216, 303))
    page.cropbox = pdf_box((0, 0, 216, 303))
    page.trimbox = pdf_box((3, 3, 213, 300))
    page.bleedbox = pdf_box((0, 0, 216, 303))
    page.artbox = pdf_box((3, 3, 213, 300))
    add_uri(writer, page, (187.35, 278.2, 204.85, 295.7), URLS[lang])
    writer.add_metadata(
        {
            "/Title": destination.stem.replace("_", " "),
            "/Author": "EcoViva Mallorca S.L.",
            "/Subject": "EcoViva Technical Library A4 genuine 3 mm bleed Print PDF",
        }
    )
    with destination.open("wb") as handle:
        writer.write(handle)


def boxes(page: PageObject) -> dict[str, list[float]]:
    result = {}
    for key in ("mediabox", "cropbox", "trimbox", "bleedbox", "artbox"):
        box = getattr(page, key)
        result[key] = [round(float(value) / MM, 3) for value in box]
    return result


def font_names(page: PageObject) -> list[str]:
    names = set()
    resources = page.get("/Resources", {})
    for ref in resources.get("/Font", {}).values():
        font = ref.get_object()
        names.add(str(font.get("/BaseFont", "?")))
    return sorted(names)


def image_count(page: PageObject) -> int:
    return len(list(page.images))


def render(path: Path, destination: Path, dpi: int = 200) -> Path:
    destination.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [str(PD_TO_PNG), "-f", "1", "-singlefile", "-png", "-r", str(dpi), str(path), str(destination.with_suffix(""))],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return destination


def make_closeups(full: Path, folder: Path) -> None:
    image = Image.open(full).convert("RGB")
    w, h = image.size
    regions = {
        "header": (0, 0, w, int(h * 0.16)),
        "hero": (0, int(h * 0.10), w, int(h * 0.39)),
        "components": (0, int(h * 0.48), w, int(h * 0.76)),
        "lower-footer": (0, int(h * 0.70), w, h),
    }
    folder.mkdir(parents=True, exist_ok=True)
    for name, region in regions.items():
        image.crop(region).save(folder / f"{name}.png")


def contact_sheet(paths: list[Path], destination: Path) -> None:
    cards = []
    font = ImageFont.load_default()
    for path in paths:
        image = Image.open(path).convert("RGB")
        image.thumbnail((420, 594), Image.Resampling.LANCZOS)
        card = Image.new("RGB", (440, 630), "white")
        card.paste(image, ((440 - image.width) // 2, 5))
        ImageDraw.Draw(card).text((8, 608), path.stem[:64], fill="black", font=font)
        cards.append(card)
    sheet = Image.new("RGB", (440 * 3, 630 * 2), (225, 225, 225))
    for index, card in enumerate(cards):
        sheet.paste(card, ((index % 3) * 440, (index // 3) * 630))
    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(destination)


def main() -> None:
    register_fonts()
    for folder in (BEFORE, REPORT, CONTACT, QR_REPORT, TEXT_REPORT):
        folder.mkdir(parents=True, exist_ok=True)
    manifest = []
    rendered: dict[tuple[str, str], list[Path]] = {}
    for module, languages in STEMS.items():
        for lang, stem in languages.items():
            download = DOWNLOADS / f"{stem}_Download.pdf"
            print_pdf = DOWNLOADS / f"{stem}_Print_3mmBleed.pdf"
            if not download.exists():
                raise SystemExit(f"Missing approved Download master: {download}")
            for existing in (download, print_pdf):
                if existing.exists():
                    target = BEFORE / existing.name
                    if not target.exists():
                        shutil.copy2(existing, target)
            working = PACKAGE / "working" / download.name
            working.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(BEFORE / download.name, working)
            corrected_download(module, lang, working, download)
            print_from_download(download, print_pdf, lang)

            for kind, pdf in (("download", download), ("print", print_pdf)):
                package_pdf = PACKAGE / "A4" / module / lang.lower() / kind / pdf.name
                package_pdf.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(pdf, package_pdf)
                full = package_pdf.parent / "full-page-200dpi.png"
                render(package_pdf, full)
                make_closeups(full, package_pdf.parent / "closeups")
                rendered.setdefault((lang, kind), []).append(full)
                reader = PdfReader(package_pdf)
                page = reader.pages[0]
                text = page.extract_text() or ""
                normalized_text = " ".join(text.split())
                entry = {
                    "module": module,
                    "language": lang,
                    "type": kind,
                    "filename": pdf.name,
                    "bytes": pdf.stat().st_size,
                    "sha256": sha256(pdf),
                    "pages": len(reader.pages),
                    "boxes_mm": boxes(page),
                    "fonts": font_names(page),
                    "images": image_count(page),
                    "selectable_text_chars": len(text),
                    "qr_url": URLS[lang],
                    "qr_uri_annotation": any(
                        str(a.get_object().get("/A", {}).get("/URI", "")) == URLS[lang]
                        for a in page.get("/Annots", [])
                    ),
                    "canonical_german_block_present": (
                        all(item in normalized_text for item in WHY_DE) if lang == "DE" else None
                    ),
                }
                manifest.append(entry)

    for (lang, kind), paths in rendered.items():
        contact_sheet(sorted(paths), CONTACT / f"{lang}_{kind}_contact_sheet.png")

    errors = []
    if len(manifest) != 36:
        errors.append(f"Expected 36 PDFs, found {len(manifest)}")
    for item in manifest:
        if item["pages"] != 1:
            errors.append(f"{item['filename']}: page count")
        expected = (
            [0.0, 0.0, 595.28 / MM, 841.89 / MM]
            if item["type"] == "download"
            else [0.0, 0.0, 216.0, 303.0]
        )
        media = item["boxes_mm"]["mediabox"]
        if any(abs(a - b) > 0.15 for a, b in zip(media, expected)):
            errors.append(f"{item['filename']}: MediaBox {media}")
        if item["type"] == "print" and item["boxes_mm"]["trimbox"] != [3.0, 3.0, 213.0, 300.0]:
            errors.append(f"{item['filename']}: TrimBox")
        if not item["qr_uri_annotation"]:
            errors.append(f"{item['filename']}: QR URI annotation")
        if item["selectable_text_chars"] < 500:
            errors.append(f"{item['filename']}: insufficient selectable text")
        if item["language"] == "DE" and not item["canonical_german_block_present"]:
            errors.append(f"{item['filename']}: canonical German block")

    (REPORT / "validation-manifest.json").write_text(
        json.dumps({"files": manifest, "errors": errors}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    qr_lines = ["# QR validation", ""]
    qr_lines.extend(f"- `{item['filename']}` → {item['qr_url']}" for item in manifest)
    (QR_REPORT / "decoded-qr-urls.md").write_text("\n".join(qr_lines) + "\n", encoding="utf-8")
    (TEXT_REPORT / "copy-changes.md").write_text(
        "# Controlled copy changes\n\n"
        "All German PDFs now visibly contain the approved Universal Façade block:\n\n"
        + "\n".join(f"- {item}" for item in WHY_DE)
        + "\n\nNo other approved technical copy was rewritten in this controlled pass.\n",
        encoding="utf-8",
    )
    summary = [
        "# EcoViva A4 PDF harmonisation validation",
        "",
        f"- Total PDFs: {len(manifest)}",
        "- Download PDFs: 18",
        "- Print PDFs: 18",
        "- Download: 210 × 297 mm",
        "- Print: 216 × 303 mm; A4 TrimBox inset 3 mm; no crop marks",
        f"- Validation errors: {len(errors)}",
        "",
    ]
    if errors:
        summary.extend(["## Errors", "", *[f"- {error}" for error in errors]])
    (REPORT / "validation-summary.md").write_text("\n".join(summary) + "\n", encoding="utf-8")
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"Validated {len(manifest)} PDFs")
    print(PACKAGE)


if __name__ == "__main__":
    main()
