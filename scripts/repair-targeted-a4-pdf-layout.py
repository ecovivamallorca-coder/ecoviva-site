#!/usr/bin/env python3
"""Rebuild the six scoped EcoViva A4 PDF pairs without post-render overlays."""

from __future__ import annotations

import base64
import importlib.util
import os
import re
import shutil
import subprocess
import sys
import types
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DecodedStreamObject, NameObject


REPO = Path(__file__).resolve().parents[1]
PROJECT = REPO.parent.parent
OUTPUT_ROOT = (
    PROJECT
    / "output/pdf/EcoViva_Technical_Library_A4_Targeted_Layout_Repair_2026-07-27"
)
PACKAGE_ROOT = (
    PROJECT
    / "output/pdf/EcoViva_Technical_Library_A4_PDF_Harmonisation"
)
A4_ROOT = PACKAGE_ROOT / "A4"
QR_ROOT = PACKAGE_ROOT / "working"
NODE = Path(
    "/Users/markushackenjos/.cache/codex-runtimes/"
    "codex-primary-runtime/dependencies/node/bin/node"
)
NODE_MODULES = PROJECT / "work/final_production/node_modules"
SVG_RENDERER = REPO / "scripts/render-a4-svg-pdf.js"
LOGO_ASSET = (
    PROJECT
    / "outputs/EcoViva_A4_V4_2_Approval_Package/02_source_assets/"
    "ecoviva_mallorca_official_logo_horizontal_darkgreen.svg"
)

ET.register_namespace("", "http://www.w3.org/2000/svg")
SVG_NS = "http://www.w3.org/2000/svg"
XLINK_NS = "http://www.w3.org/1999/xlink"

OLD_SVG_TASKS = {
    "etics": {
        "source": PROJECT
        / "outputs/EcoViva_ETICS_SATE_Phase1_Approval_Package/01_approval/"
        "EcoViva_A4_Sistema_SATE_Aislamiento_Exterior_ES_Approval_V2.3.svg",
        "download": A4_ROOT
        / "etics/es/download/EcoViva_A4_Sistema_SATE_Aislamiento_Exterior_ES_Download.pdf",
        "print": A4_ROOT
        / "etics/es/print/EcoViva_A4_Sistema_SATE_Aislamiento_Exterior_ES_Print_3mmBleed.pdf",
    },
    "natural-stone": {
        "source": PROJECT
        / "outputs/EcoViva_Natural_Stone_V1_2_Production_Artwork/01_approval/"
        "EcoViva_A4_Sistema_Fachada_Piedra_Natural_ES_Approval_V1.2.svg",
        "download": A4_ROOT
        / "natural-stone/es/download/EcoViva_A4_Sistema_Fachada_Piedra_Natural_ES_Download.pdf",
        "print": A4_ROOT
        / "natural-stone/es/print/EcoViva_A4_Sistema_Fachada_Piedra_Natural_ES_Print_3mmBleed.pdf",
    },
    "traditional-roof": {
        "source": PROJECT
        / "outputs/EcoViva_A4_V4_2_Approval_Package/01_approval/"
        "EcoViva_A4_Traditional_Mallorcan_Roof_ES_Approval_V4_2.svg",
        "download": A4_ROOT
        / "traditional-roof/es/download/EcoViva_A4_Traditional_Mallorcan_Roof_ES_Download.pdf",
        "print": A4_ROOT
        / "traditional-roof/es/print/EcoViva_A4_Traditional_Mallorcan_Roof_ES_Print_3mmBleed.pdf",
    },
}

MODERN_TASKS = {
    "thermowood": {
        "script": REPO / "scripts/generate-thermowood-production.py",
        "lang": "es",
        "download": A4_ROOT
        / "thermowood/es/download/EcoViva_A4_Sistema_Fachada_Ventilada_ThermoWood_ES_Download.pdf",
        "print": A4_ROOT
        / "thermowood/es/print/EcoViva_A4_Sistema_Fachada_Ventilada_ThermoWood_ES_Print_3mmBleed.pdf",
    },
    "universal-flat-roof": {
        "script": REPO / "scripts/generate-flat-roof-production.py",
        "lang": "de",
        "download": A4_ROOT
        / "universal-flat-roof/de/download/EcoViva_A4_Universelles_Gedaemmtes_Flachdachsystem_DE_Download.pdf",
        "print": A4_ROOT
        / "universal-flat-roof/de/print/EcoViva_A4_Universelles_Gedaemmtes_Flachdachsystem_DE_Print_3mmBleed.pdf",
    },
    "universal-ventilated-facade": {
        "script": REPO / "scripts/generate-universal-facade-production.py",
        "lang": "es",
        "download": A4_ROOT
        / "universal-ventilated-facade/es/download/EcoViva_A4_Sistema_Universal_Fachada_Ventilada_ES_Download.pdf",
        "print": A4_ROOT
        / "universal-ventilated-facade/es/print/EcoViva_A4_Sistema_Universal_Fachada_Ventilada_ES_Print_3mmBleed.pdf",
    },
}


def import_module(path: Path, name: str):
    qrcode_stub = types.ModuleType("qrcode")
    qrcode_stub.QRCode = object
    constants_stub = types.ModuleType("qrcode.constants")
    constants_stub.ERROR_CORRECT_H = 2
    qrcode_stub.constants = constants_stub
    sys.modules.setdefault("qrcode", qrcode_stub)
    sys.modules.setdefault("qrcode.constants", constants_stub)
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(module)
    return module


def image_data_uri(path: Path) -> str:
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode("ascii")


def replace_logo(tree: ET.ElementTree) -> None:
    source = LOGO_ASSET.read_text()
    match = re.search(r'href="(data:image/png;base64,[^"]+)"', source)
    if not match:
        raise RuntimeError("Could not extract the official EcoViva logo PNG")
    root = tree.getroot()
    logo = next(
        (
            item
            for item in root.iter()
            if item.tag == f"{{{SVG_NS}}}image"
            and item.attrib.get("x") == "7"
            and float(item.attrib.get("y", "0")) < 7
        ),
        None,
    )
    if logo is None:
        raise RuntimeError("Could not locate the EcoViva logo in the source SVG")
    logo.attrib["href"] = match.group(1)


def replace_qr(tree: ET.ElementTree, qr_path: Path) -> None:
    root = tree.getroot()
    qr_image = ET.Element(
        f"{{{SVG_NS}}}image",
        {
            "x": "183",
            "y": "5.2",
            "width": "20",
            "height": "20",
            "preserveAspectRatio": "xMidYMid meet",
            "href": image_data_uri(qr_path),
        },
    )
    for parent in root.iter():
        children = list(parent)
        for index, child in enumerate(children):
            if child.attrib.get("id") == "language-specific-qr":
                parent.remove(child)
                parent.insert(index, qr_image)
                return
    header = next((item for item in root.iter() if item.attrib.get("id") == "header"), None)
    if header is None:
        raise RuntimeError("Could not locate a QR container in the source SVG")
    children = list(header)
    for index, child in enumerate(children):
        if child.tag == f"{{{SVG_NS}}}svg" and float(child.attrib.get("x", "0")) > 180:
            header.remove(child)
            header.insert(index, qr_image)
            return
    raise RuntimeError("Could not locate the Natural Stone header QR")


def repair_natural_stone_spacing(tree: ET.ElementTree) -> None:
    root = tree.getroot()
    layer = next((item for item in root.iter() if item.attrib.get("id") == "layer-1"), None)
    if layer is None:
        raise RuntimeError("Natural Stone layer-1 group is missing")
    body = next(
        (
            item
            for item in layer
            if item.tag == f"{{{SVG_NS}}}text"
            and item.attrib.get("class") == "layer-body"
        ),
        None,
    )
    if body is None:
        raise RuntimeError("Natural Stone layer-1 body is missing")
    body.attrib["y"] = "98.65"
    body.attrib["style"] = "font-size:2px"
    spans = list(body)
    if len(spans) != 2:
        raise RuntimeError("Natural Stone layer-1 description no longer has two lines")
    spans[0].text = (
        "Muro mineral o de fábrica evaluado y preparado para soportar el sistema completo."
    )
    body.remove(spans[1])


def make_print_svg(download_svg: Path, print_svg: Path) -> None:
    tree = ET.parse(download_svg)
    root = tree.getroot()
    root.attrib["width"] = "216mm"
    root.attrib["height"] = "303mm"
    root.attrib["viewBox"] = "0 0 216 303"
    original_children = list(root)
    for child in original_children:
        root.remove(child)
    background = ET.Element(
        f"{{{SVG_NS}}}rect",
        {"x": "0", "y": "0", "width": "216", "height": "303", "fill": "#FFFFFF"},
    )
    group = ET.Element(f"{{{SVG_NS}}}g", {"transform": "translate(3 3)"})
    for child in original_children:
        group.append(child)
    root.append(background)
    root.append(group)
    tree.write(print_svg, encoding="utf-8", xml_declaration=True)


def finalize_boxes(path: Path, print_ready: bool) -> None:
    module = import_module(REPO / "scripts/generate-thermowood-production.py", "pdf_box_helpers")
    reader = PdfReader(path)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    page = writer.pages[0]
    values = (
        (0, 0, 216, 303),
        (0, 0, 216, 303),
        (3, 3, 213, 300),
        (0, 0, 216, 303),
        (3, 3, 213, 300),
    ) if print_ready else ((0, 0, 210, 297),) * 5
    for name, box in zip(("mediabox", "cropbox", "trimbox", "bleedbox", "artbox"), values):
        setattr(page, name, module.pdf_box(box))
    module.add_output_intent(writer)
    temporary = path.with_suffix(".boxed.pdf")
    with temporary.open("wb") as handle:
        writer.write(handle)
    temporary.replace(path)


def render_old_svg_pair(name: str, task: dict, source_dir: Path, generated_dir: Path) -> None:
    tree = ET.parse(task["source"])
    replace_logo(tree)
    replace_qr(tree, QR_ROOT / "qr-ES.png")
    if name == "natural-stone":
        repair_natural_stone_spacing(tree)
    download_svg = source_dir / f"{name}-es-repaired.svg"
    print_svg = source_dir / f"{name}-es-repaired-print-wrapper.svg"
    tree.write(download_svg, encoding="utf-8", xml_declaration=True)
    make_print_svg(download_svg, print_svg)
    for print_ready, svg_path, target in (
        (False, download_svg, generated_dir / task["download"].name),
        (True, print_svg, generated_dir / task["print"].name),
    ):
        environment = dict(os.environ)
        environment["NODE_PATH"] = str(NODE_MODULES)
        subprocess.run(
            [
                str(NODE),
                str(SVG_RENDERER),
                str(svg_path),
                str(target),
                "216" if print_ready else "210",
                "303" if print_ready else "297",
            ],
            check=True,
            env=environment,
        )
        finalize_boxes(target, print_ready)


def repaired_qr(lang: str) -> Image.Image:
    return Image.open(QR_ROOT / f"qr-{lang.upper()}.png").convert("RGB")


def remove_empty_standard_font(path: Path) -> None:
    """Remove ReportLab's empty Helvetica initialization and unused resource."""
    reader = PdfReader(path)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    page = writer.pages[0]
    contents = page.get_contents()
    data = contents.get_data()
    empty_font_setup = b"BT /F1 12 Tf 14.4 TL ET\n"
    if data.startswith(b"1 0 0 1 0 0 cm  " + empty_font_setup):
        data = data.replace(empty_font_setup, b"", 1)
        stream = DecodedStreamObject()
        stream.set_data(data)
        page[NameObject("/Contents")] = writer._add_object(stream)
        fonts = page["/Resources"]["/Font"].get_object()
        fonts.pop(NameObject("/F1"), None)
    temporary = path.with_suffix(".font-clean.pdf")
    with temporary.open("wb") as handle:
        writer.write(handle)
    temporary.replace(path)


def render_modern_pair(name: str, task: dict, generated_dir: Path) -> None:
    module = import_module(task["script"], f"repair_{name.replace('-', '_')}")
    module.DOWNLOADS = generated_dir
    if name == "universal-flat-roof":
        module.technical_library_qr = repaired_qr
        module.base.register_fonts()
        generator = module.generate_pdf
        content = module.CONTENTS[task["lang"]]
        generator(content, task["lang"], False)
        generator(content, task["lang"], True)
    elif name == "universal-ventilated-facade":
        module.base.technical_library_qr = repaired_qr
        module.base.register_fonts()
        content = module.CONTENTS[task["lang"]]
        module.generate_one(content, False)
        module.generate_one(content, True)
    else:
        module.technical_library_qr = repaired_qr
        module.register_fonts()
        content = module.CONTENTS[task["lang"]]
        module.generate_one(content, False)
        module.generate_one(content, True)
    for key in ("download", "print"):
        remove_empty_standard_font(generated_dir / task[key].name)


def install_outputs(
    tasks: dict,
    generated_dir: Path,
    before_dir: Path,
    before_repository_dir: Path,
) -> None:
    for task in tasks.values():
        for key in ("download", "print"):
            target = task[key]
            source = generated_dir / target.name
            if not source.exists():
                raise RuntimeError(f"Expected generated PDF is missing: {source}")
            backup = before_dir / target.name
            if not backup.exists():
                shutil.copy2(target, backup)
            shutil.copy2(source, target)
            repository_target = REPO / "public/downloads" / target.name
            repository_backup = before_repository_dir / target.name
            if not repository_backup.exists():
                shutil.copy2(repository_target, repository_backup)
            shutil.copy2(source, repository_target)


def main() -> None:
    if not NODE.exists():
        raise RuntimeError(f"Node.js is unavailable: {NODE}")
    source_dir = OUTPUT_ROOT / "source"
    generated_dir = OUTPUT_ROOT / "generated-pdfs"
    before_dir = OUTPUT_ROOT / "before-pdfs"
    before_repository_dir = OUTPUT_ROOT / "before-repository-pdfs"
    for directory in (source_dir, generated_dir, before_dir, before_repository_dir):
        directory.mkdir(parents=True, exist_ok=True)
    for name, task in OLD_SVG_TASKS.items():
        render_old_svg_pair(name, task, source_dir, generated_dir)
    for name, task in MODERN_TASKS.items():
        render_modern_pair(name, task, generated_dir)
    install_outputs(
        {**OLD_SVG_TASKS, **MODERN_TASKS},
        generated_dir,
        before_dir,
        before_repository_dir,
    )
    print(OUTPUT_ROOT)


if __name__ == "__main__":
    main()
