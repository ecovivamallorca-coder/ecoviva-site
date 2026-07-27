#!/usr/bin/env python3
"""Validate the definitive 36-file A4 PDF review family."""

from __future__ import annotations

import hashlib
import json
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from pypdf import PdfReader, PdfWriter


REPO = Path(__file__).resolve().parents[1]
PROJECT = REPO.parent.parent
ROOT = (
    PROJECT
    / "output/pdf/EcoViva_Technical_Library_A4_Definitive_Repair_2026-07-27"
)
PDFS = ROOT / "final/pdfs"
DOWNLOAD_RENDERS = ROOT / "final/renders/download"
PRINT_RENDERS = ROOT / "final/renders/print"
PRINT_TRIM_RENDERS = ROOT / "final/renders/print-trim"
REPORT = ROOT / "review/validation-report.md"
PACKAGE_A4 = (
    PROJECT
    / "output/pdf/EcoViva_Technical_Library_A4_PDF_Harmonisation/A4"
)

EXPECTED_QR = {
    "EN": "https://www.ecoviva-mallorca.com/technical-library/en/",
    "ES": "https://www.ecoviva-mallorca.com/technical-library/es/",
    "DE": "https://www.ecoviva-mallorca.com/technical-library/de/",
}
PT_PER_MM = 72 / 25.4
SVG_NS = "http://www.w3.org/2000/svg"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def box_mm(box) -> tuple[float, float, float, float]:
    return tuple(round(float(value) / PT_PER_MM, 3) for value in box)


def language_for(name: str) -> str:
    match = re.search(r"_(EN|ES|DE)_(?:Download|Print_3mmBleed)\.pdf$", name)
    if not match:
        raise AssertionError(f"Cannot determine language: {name}")
    return match.group(1)


def embedded_font_status(reader: PdfReader) -> tuple[int, list[str]]:
    embedded = 0
    failures: list[str] = []
    for page in reader.pages:
        resources = page.get("/Resources", {})
        fonts = resources.get("/Font", {})
        if hasattr(fonts, "get_object"):
            fonts = fonts.get_object()
        for name, reference in fonts.items():
            font = reference.get_object()
            subtype = font.get("/Subtype")
            if subtype == "/Type3":
                embedded += 1
                continue
            descriptor = font.get("/FontDescriptor")
            if descriptor is None and font.get("/DescendantFonts"):
                descendant = font["/DescendantFonts"][0].get_object()
                descriptor = descendant.get("/FontDescriptor")
            if descriptor is not None:
                descriptor = descriptor.get_object()
            if descriptor and any(
                descriptor.get(key) is not None
                for key in ("/FontFile", "/FontFile2", "/FontFile3")
            ):
                embedded += 1
            else:
                failures.append(f"{name}:{font.get('/BaseFont')}:{subtype}")
    return embedded, failures


def decode_qr(render: Path, print_ready: bool) -> str:
    image = cv2.imread(str(render))
    if image is None:
        raise AssertionError(f"Cannot read render: {render}")
    scale = 200 / 25.4
    offset = 3 if print_ready else 0
    x1, y1, x2, y2 = (
        round((178 + offset) * scale),
        round((1 + offset) * scale),
        round((209 + offset) * scale),
        round((31 + offset) * scale),
    )
    crop = image[y1:y2, x1:x2]
    grayscale = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    threshold = cv2.threshold(
        grayscale, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]
    variants = [crop, grayscale, threshold]
    for variant in variants:
        for scale_factor in (1, 2, 3, 4):
            resized = cv2.resize(
                variant,
                None,
                fx=scale_factor,
                fy=scale_factor,
                interpolation=cv2.INTER_NEAREST,
            )
            value, _, _ = cv2.QRCodeDetector().detectAndDecode(resized)
            if value:
                return value
    return ""


def normalize_text(value: str) -> str:
    return " ".join(value.split())


def compare_trim(download: Path, printed: Path) -> tuple[float, float]:
    reference = cv2.imread(str(download))
    bleed = cv2.imread(str(printed))
    if reference is None or bleed is None:
        raise AssertionError("Missing raster for trim comparison")
    if reference.shape != bleed.shape:
        raise AssertionError(
            f"Trim render dimension mismatch: {reference.shape} != {bleed.shape}"
        )
    delta = cv2.absdiff(reference, bleed)
    return float(delta.mean()), float((delta.max(axis=2) > 24).mean() * 100)


def render_print_trim(pdf: Path, output: Path) -> None:
    reader = PdfReader(pdf)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    page = writer.pages[0]
    trim = page.trimbox
    page.mediabox = trim
    page.cropbox = trim
    page.bleedbox = trim
    page.artbox = trim
    with tempfile.NamedTemporaryFile(suffix=".pdf") as handle:
        writer.write(handle)
        handle.flush()
        subprocess.run(
            [
                "/Users/markushackenjos/.cache/codex-runtimes/"
                "codex-primary-runtime/dependencies/bin/override/pdftoppm",
                "-r",
                "200",
                "-singlefile",
                "-png",
                handle.name,
                str(output.with_suffix("")),
            ],
            check=True,
            capture_output=True,
        )


def outside_trim_is_blank(render: Path) -> bool:
    image = np.array(Image.open(render).convert("RGB"))
    inset = round(3 * 200 / 25.4)
    bands = [
        image[: inset - 3, :, :],
        image[-(inset - 3) :, :, :],
        image[:, : inset - 3, :],
        image[:, -(inset - 3) :, :],
    ]
    return all(int((band < 245).any(axis=2).sum()) == 0 for band in bands)


def verify_etics_geometry() -> bool:
    points = []
    for svg in sorted((ROOT / "final/source").glob("etics-??-definitive.svg")):
        root = ET.parse(svg).getroot()
        group = next(item for item in root.iter() if item.attrib.get("id") == "hero-callout-8")
        path = next(item for item in group if item.tag == f"{{{SVG_NS}}}path")
        circle = next(
            item
            for item in group
            if item.tag == f"{{{SVG_NS}}}circle" and item.attrib.get("cx") == "98"
        )
        points.append((path.attrib["d"], circle.attrib["cx"], circle.attrib["cy"]))
    return len(points) == 3 and len(set(points)) == 1 and points[0] == (
        "M13.55 90.2 L19.5 90 L98 72.8",
        "98",
        "72.8",
    )


def verify_flat_geometry() -> bool:
    geometry = json.loads((REPO / "scripts/flat-roof-geometry.json").read_text())
    callouts = geometry["hero"]["callouts"]
    return (
        len(callouts) == 6
        and [item["number"] for item in callouts] == [1, 2, 3, 4, 5, 6]
        and [item["endpoint"][1] for item in callouts] == sorted(
            item["endpoint"][1] for item in callouts
        )
    )


def main() -> None:
    pdfs = sorted(PDFS.glob("*.pdf"))
    assert len(pdfs) == 36, f"Expected 36 final PDFs, found {len(pdfs)}"
    assert len(list((REPO / "public/downloads").glob("*.pdf"))) == 36
    PRINT_TRIM_RENDERS.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Definitive A4 PDF validation",
        "",
        f"- Final PDF count: **{len(pdfs)}**",
        "- Expected Download size: **210 × 297 mm**",
        "- Expected Print MediaBox/BleedBox: **216 × 303 mm**",
        "- Expected Print TrimBox: **3 mm inset / 210 × 297 mm**",
        "",
        "| PDF | Pages | Boxes | Text | Fonts | QR | Trim parity |",
        "|---|---:|---|---|---|---|---|",
    ]
    text_by_name: dict[str, str] = {}
    failures: list[str] = []
    qr_values: list[str] = []
    trim_stats = []
    for pdf in pdfs:
        ready = "_Print_3mmBleed.pdf" in pdf.name
        reader = PdfReader(pdf)
        if len(reader.pages) != 1:
            failures.append(f"{pdf.name}: page count {len(reader.pages)}")
        page = reader.pages[0]
        media = box_mm(page.mediabox)
        bleed = box_mm(page.bleedbox)
        trim = box_mm(page.trimbox)
        expected_media = (0.0, 0.0, 216.0, 303.0) if ready else (0.0, 0.0, 210.0, 297.0)
        expected_trim = (3.0, 3.0, 213.0, 300.0) if ready else expected_media
        boxes_ok = (
            all(abs(a - b) < 0.02 for a, b in zip(media, expected_media))
            and all(abs(a - b) < 0.02 for a, b in zip(bleed, expected_media))
            and all(abs(a - b) < 0.02 for a, b in zip(trim, expected_trim))
        )
        if not boxes_ok:
            failures.append(f"{pdf.name}: incorrect boxes media={media} bleed={bleed} trim={trim}")
        text = normalize_text(page.extract_text() or "")
        text_by_name[pdf.name] = text
        text_ok = len(text) > 700
        if not text_ok:
            failures.append(f"{pdf.name}: insufficient selectable text ({len(text)})")
        embedded, font_failures = embedded_font_status(reader)
        fonts_ok = embedded > 0 and not font_failures
        if not fonts_ok:
            failures.append(f"{pdf.name}: unembedded fonts {font_failures}")
        render_dir = PRINT_RENDERS if ready else DOWNLOAD_RENDERS
        render = render_dir / f"{pdf.stem}.png"
        qr = decode_qr(render, ready)
        qr_values.append(qr)
        expected_qr = EXPECTED_QR[language_for(pdf.name)]
        qr_ok = qr == expected_qr
        if not qr_ok:
            failures.append(f"{pdf.name}: QR {qr!r}, expected {expected_qr!r}")
        parity = "—"
        if ready:
            download_name = pdf.name.replace("_Print_3mmBleed.pdf", "_Download.pdf")
            download_render = DOWNLOAD_RENDERS / download_name.replace(".pdf", ".png")
            trim_render = PRINT_TRIM_RENDERS / f"{pdf.stem}-TrimBox.png"
            render_print_trim(pdf, trim_render)
            mean, changed = compare_trim(download_render, trim_render)
            trim_stats.append((pdf.name, mean, changed))
            parity = f"mean Δ {mean:.3f}; >24 {changed:.3f}%"
            if mean > 0.01 or changed > 0.01:
                failures.append(f"{pdf.name}: trim raster mismatch {parity}")
            if not outside_trim_is_blank(render):
                failures.append(f"{pdf.name}: nonblank marks detected outside TrimBox")
        lines.append(
            f"| {pdf.name} | {len(reader.pages)} | {'OK' if boxes_ok else 'FAIL'} | "
            f"{'OK' if text_ok else 'FAIL'} ({len(text)}) | "
            f"{'OK' if fonts_ok else 'FAIL'} ({embedded}) | "
            f"{'OK' if qr_ok else 'FAIL'} | {parity} |"
        )
    for print_name in sorted(name for name in text_by_name if "_Print_3mmBleed.pdf" in name):
        download_name = print_name.replace("_Print_3mmBleed.pdf", "_Download.pdf")
        if text_by_name[print_name] != text_by_name[download_name]:
            failures.append(f"{print_name}: selectable text differs from Download")
    obsolete = {
        "Drainage and perimeter detailing",
        "Drenaje y detalles perimetrales",
        "Entwässerung und Randdetails",
    }
    combined = "\n".join(text_by_name.values())
    for phrase in obsolete:
        if phrase in combined:
            failures.append(f"Obsolete wording remains: {phrase}")
    if not verify_etics_geometry():
        failures.append("ETICS callout geometry is not identical/correct in EN/ES/DE")
    if not verify_flat_geometry():
        failures.append("Flat Roof six-callout geometry failed")
    public = REPO / "public/downloads"
    for pdf in pdfs:
        public_pdf = public / pdf.name
        package = list(PACKAGE_A4.rglob(pdf.name))
        if not public_pdf.exists() or sha256(public_pdf) != sha256(pdf):
            failures.append(f"{pdf.name}: repository copy is missing or differs")
        if len(package) != 1 or sha256(package[0]) != sha256(pdf):
            failures.append(f"{pdf.name}: harmonisation package copy is missing or differs")
    changed_a3 = subprocess.run(
        ["git", "diff", "--name-only", "HEAD", "--", ":(icase)*a3*"],
        cwd=REPO,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.splitlines()
    if changed_a3:
        failures.append(f"A3 files changed: {', '.join(changed_a3)}")
    lines += [
        "",
        "## Cross-family checks",
        "",
        f"- QR decodes completed: **{len(qr_values)}/36**",
        f"- Unique decoded targets: **{', '.join(sorted(set(qr_values)))}**",
        f"- Download/Print selectable-text parity: **{'PASS' if not any('selectable text differs' in item for item in failures) else 'FAIL'}**",
        f"- Print bleed area blank / no crop marks: **{'PASS' if not any('outside TrimBox' in item for item in failures) else 'FAIL'}**",
        f"- ETICS EN/ES/DE callout geometry: **{'PASS' if verify_etics_geometry() else 'FAIL'}**",
        f"- Flat Roof shared six-callout geometry: **{'PASS' if verify_flat_geometry() else 'FAIL'}**",
        f"- Repository and harmonisation-package copies: **{'PASS' if not any('copy is missing or differs' in item for item in failures) else 'FAIL'}**",
        f"- A3 source preservation: **{'PASS' if not any('A3 files changed' in item for item in failures) else 'FAIL'}**",
        "",
        "## Result",
        "",
    ]
    if failures:
        lines.append("**FAIL**")
        lines.extend(f"- {failure}" for failure in failures)
    else:
        lines.append("**PASS — technical validation complete; approved for production publication.**")
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    if failures:
        raise SystemExit("\n".join(failures))
    print(REPORT)


if __name__ == "__main__":
    main()
