#!/usr/bin/env python3
"""Generate the definitive 36-file EcoViva A4 PDF review family.

The retained approval SVGs remain untouched. Corrected review SVGs are written
to the dated output package, and Download/Print PDFs are generated from those
same corrected sources.
"""

from __future__ import annotations

import importlib.util
import os
import shutil
import subprocess
import sys
import types
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image


REPO = Path(__file__).resolve().parents[1]
PROJECT = REPO.parent.parent
OUTPUT_ROOT = (
    PROJECT
    / "output/pdf/EcoViva_Technical_Library_A4_Definitive_Repair_2026-07-27"
)
FINAL_PDF = OUTPUT_ROOT / "final/pdfs"
FINAL_SOURCE = OUTPUT_ROOT / "final/source"
PACKAGE_A4 = (
    PROJECT
    / "output/pdf/EcoViva_Technical_Library_A4_PDF_Harmonisation/A4"
)
QR_ROOT = (
    PROJECT
    / "output/pdf/EcoViva_Technical_Library_A4_PDF_Harmonisation/working"
)
NODE = Path(
    "/Users/markushackenjos/.cache/codex-runtimes/"
    "codex-primary-runtime/dependencies/node/bin/node"
)
NODE_MODULES = PROJECT / "work/final_production/node_modules"
SVG_RENDERER = REPO / "scripts/render-a4-svg-pdf.js"

SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)


LANGS = ("en", "es", "de")

OLD_FAMILIES = {
    "traditional-roof": {
        "source_dir": PROJECT
        / "outputs/EcoViva_A4_V4_2_Approval_Package/01_approval",
        "source": {
            "en": "EcoViva_A4_Traditional_Mallorcan_Roof_EN_Approval_V4_2.svg",
            "es": "EcoViva_A4_Traditional_Mallorcan_Roof_ES_Approval_V4_2.svg",
            "de": "EcoViva_A4_Traditional_Mallorcan_Roof_DE_Approval_V4_2.svg",
        },
        "stem": {
            "en": "EcoViva_A4_Traditional_Mallorcan_Roof_EN",
            "es": "EcoViva_A4_Traditional_Mallorcan_Roof_ES",
            "de": "EcoViva_A4_Traditional_Mallorcan_Roof_DE",
        },
    },
    "etics": {
        "source_dir": PROJECT
        / "outputs/EcoViva_ETICS_SATE_Phase1_Approval_Package/01_approval",
        "source": {
            "en": "EcoViva_A4_ETICS_External_Wall_Insulation_EN_Approval_V2.3.svg",
            "es": "EcoViva_A4_Sistema_SATE_Aislamiento_Exterior_ES_Approval_V2.3.svg",
            "de": "EcoViva_A4_WDVS_Aussendaemmung_Putzfassade_DE_Approval_V2.3.svg",
        },
        "stem": {
            "en": "EcoViva_A4_ETICS_External_Wall_Insulation_EN",
            "es": "EcoViva_A4_Sistema_SATE_Aislamiento_Exterior_ES",
            "de": "EcoViva_A4_WDVS_Aussendaemmung_Putzfassade_DE",
        },
    },
    "natural-stone": {
        "source_dir": PROJECT
        / "outputs/EcoViva_Natural_Stone_V1_2_Production_Artwork/01_approval",
        "source": {
            "en": "EcoViva_A4_Natural_Stone_Facade_System_EN_Approval_V1.2.svg",
            "es": "EcoViva_A4_Sistema_Fachada_Piedra_Natural_ES_Approval_V1.2.svg",
            "de": "EcoViva_A4_Naturstein_Fassadensystem_DE_Approval_V1.2.svg",
        },
        "stem": {
            "en": "EcoViva_A4_Natural_Stone_Facade_System_EN",
            "es": "EcoViva_A4_Sistema_Fachada_Piedra_Natural_ES",
            "de": "EcoViva_A4_Naturstein_Fassadensystem_DE",
        },
    },
}

TEXT_REPAIRS = {
    ("traditional-roof", "en"): [
        (
            "This ventilated roof build-up combines",
            [
                "This ventilated roof combines traditional Mallorcan curved clay tiles",
                "with modern insulation, moisture control and precise detailing.",
                "It improves thermal performance while preserving Mallorca’s",
                "architectural character.",
            ],
        ),
        (
            "Continuous insulation reduces energy demand",
            ["Continuous insulation lowers heating and cooling demand."],
        ),
        (
            "Ventilation and moisture control help reduce",
            ["Ventilation and moisture control reduce humidity and condensation risk."],
        ),
        (
            "Professional design, installation knowledge",
            ["Professional design, installation and project-specific verification."],
        ),
    ],
    ("traditional-roof", "es"): [
        (
            "Esta solución de cubierta ventilada combina",
            [
                "Esta cubierta ventilada combina tejas curvas mallorquinas con",
                "aislamiento moderno, control de humedad y detalles precisos.",
                "Mejora el rendimiento térmico y conserva el carácter",
                "arquitectónico de Mallorca.",
            ],
        ),
        (
            "El aislamiento continuo reduce la demanda energética",
            ["El aislamiento continuo reduce la demanda de calefacción y refrigeración."],
        ),
        (
            "La ventilación y el control de humedad ayudan",
            ["La ventilación y el control de humedad reducen humedad y condensación."],
        ),
        (
            "Diseño profesional, experiencia de instalación",
            ["Diseño, instalación y verificación específicos del proyecto."],
        ),
    ],
    ("traditional-roof", "de"): [
        (
            "Dieser hinterlüftete Dachaufbau verbindet traditionelle",
            [
                "Dieser hinterlüftete Dachaufbau verbindet mallorquinische Hohlziegel",
                "mit moderner Dämmung, Feuchteschutz und präzisen Anschlüssen.",
                "Er verbessert die thermische Leistung und bewahrt Mallorcas",
                "architektonischen Charakter.",
            ],
        ),
        (
            "Durchgehende Dämmung reduziert den Energiebedarf",
            ["Durchgehende Dämmung senkt Heiz- und Kühlbedarf."],
        ),
        (
            "Belüftung und Feuchteschutz helfen",
            ["Belüftung und Feuchteschutz mindern Feuchte- und Kondensationsrisiken."],
        ),
        (
            "Professionelle Planung, Ausführungserfahrung",
            ["Fachplanung, Ausführung und projektspezifische Prüfung."],
        ),
    ],
    ("etics", "en"): [
        (
            "This ETICS build-up combines",
            [
                "This ETICS build-up combines graphite EPS insulation, reinforced",
                "base coats, primer and textured render. Correct detailing and",
                "mutually compatible components create a durable, thermally",
                "efficient façade for Mallorca.",
            ],
        ),
        (
            "A complete Baumit ETICS solution uses",
            [
                "Adhesive, insulation, fixings, reinforced coats, PVC profiles,",
                "primer and render must form one documented system.",
            ],
        ),
        (
            "Use complete, mutually compatible Baumit system components",
            [
                "Use a complete, compatible Baumit system supported by its ETA, CE and manufacturer",
                "documentation. Selection and installation must comply with the Spanish Building Code",
                "and project requirements.",
            ],
        ),
    ],
    ("etics", "es"): [
        (
            "Este sistema SATE combina",
            [
                "Este sistema SATE combina EPS grafito, capas base reforzadas,",
                "imprimación y acabado texturizado. La ejecución correcta y los",
                "componentes compatibles crean una fachada duradera y térmicamente",
                "eficiente para Mallorca.",
            ],
        ),
        (
            "Una solución SATE Baumit completa utiliza",
            [
                "Adhesivo, aislamiento, fijaciones, capas de refuerzo, perfiles de PVC,",
                "imprimación y acabado deben formar un sistema documentado.",
            ],
        ),
        (
            "Utilizar componentes compatibles de un sistema SATE Baumit completo",
            [
                "Utilizar un sistema SATE Baumit completo y compatible, respaldado por su ETE,",
                "marcado CE y documentación del fabricante. La ejecución debe cumplir el CTE",
                "y los requisitos del proyecto.",
            ],
        ),
    ],
    ("etics", "de"): [
        (
            "Dieses WDVS kombiniert",
            [
                "Dieses WDVS kombiniert Graphit-EPS, armierte Unterputzlagen,",
                "Grundierung und strukturierten Oberputz. Fachgerechte Details",
                "und abgestimmte Komponenten schaffen eine langlebige, thermisch",
                "leistungsfähige Fassade für Mallorca.",
            ],
        ),
        (
            "Ein vollständiges Baumit-WDVS verwendet",
            [
                "Kleber, Dämmung, Befestigungen, Armierung, PVC-Profile, Grundierung",
                "und Oberputz müssen ein dokumentiertes System bilden.",
            ],
        ),
        (
            "Es sind aufeinander abgestimmte Komponenten eines vollständigen Baumit-WDVS",
            [
                "Ein vollständiges, abgestimmtes Baumit-WDVS gemäß ETA, CE- und",
                "Herstellerdokumentation verwenden. Ausführung gemäß spanischem Baurecht",
                "und Projektanforderungen.",
            ],
        ),
    ],
    ("natural-stone", "en"): [
        (
            "This façade build-up combines",
            [
                "External insulation, reinforced base coats and Mallorca natural stone form a",
                "durable, thermally improved façade. Adhesive, support and joints must suit",
                "the stone weight, substrate and exposure. Final design remains project-specific.",
            ],
        ),
        (
            "Use complete, mutually compatible components selected",
            [
                "Use compatible components selected for substrate, insulation, stone weight, height and exposure.",
                "Verify support, waterproofing, movement joints, drainage, fire performance and connections.",
                "Design and execution must meet the CTE and project requirements.",
            ],
        ),
    ],
    ("natural-stone", "es"): [
        (
            "Este sistema combina",
            [
                "Aislamiento exterior, capas de refuerzo y piedra natural de Mallorca forman una",
                "fachada duradera y térmicamente mejorada. Adhesivo, soporte y juntas deben",
                "adaptarse al peso, soporte y exposición. El diseño final es específico del proyecto.",
            ],
        ),
        (
            "Deben utilizarse componentes completos y compatibles",
            [
                "Usar componentes compatibles según soporte, aislamiento, peso de piedra, altura y exposición.",
                "Verificar soporte, impermeabilización, juntas, drenaje, fuego y encuentros.",
                "Diseño y ejecución deben cumplir el CTE y el proyecto.",
            ],
        ),
    ],
    ("natural-stone", "de"): [
        (
            "Dieser Fassadenaufbau verbindet",
            [
                "Außendämmung, Armierungslagen und mallorquinischer Naturstein bilden eine",
                "langlebige, thermisch verbesserte Fassade. Kleber, Halterung und Fugen sind",
                "auf Steingewicht, Untergrund und Exposition abzustimmen. Die Planung bleibt projektspezifisch.",
            ],
        ),
        (
            "Es sind vollständige, abgestimmte Komponenten",
            [
                "Abgestimmte Komponenten nach Untergrund, Dämmung, Steingewicht, Höhe und Exposition wählen.",
                "Halterung, Abdichtung, Fugen, Entwässerung, Brandverhalten und Anschlüsse prüfen.",
                "Ausführung gemäß CTE und Projekt.",
            ],
        ),
    ],
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


LEGACY = import_module(REPO / "scripts/repair-targeted-a4-pdf-layout.py", "legacy_a4")


def normalized_text(element: ET.Element) -> str:
    return " ".join(" ".join(element.itertext()).split())


def replace_text_lines(
    tree: ET.ElementTree, prefix: str, lines: list[str]
) -> None:
    candidates = [
        item
        for item in tree.getroot().iter(f"{{{SVG_NS}}}text")
        if normalized_text(item).startswith(prefix)
    ]
    if len(candidates) != 1:
        raise RuntimeError(
            f"Expected one text object beginning {prefix!r}, found {len(candidates)}"
        )
    text = candidates[0]
    old_spans = list(text)
    x = text.attrib.get("x", old_spans[0].attrib.get("x", "0") if old_spans else "0")
    line_dy = "2.2"
    if len(old_spans) > 1:
        line_dy = old_spans[1].attrib.get("dy", line_dy)
    for child in old_spans:
        text.remove(child)
    text.text = None
    for index, line in enumerate(lines):
        span = ET.SubElement(
            text,
            f"{{{SVG_NS}}}tspan",
            {"x": x, "dy": "0" if index == 0 else line_dy},
        )
        span.text = line


def repair_etics_endpoint(tree: ET.ElementTree) -> None:
    group = next(
        (
            item
            for item in tree.getroot().iter()
            if item.attrib.get("id") == "hero-callout-8"
        ),
        None,
    )
    if group is None:
        raise RuntimeError("ETICS hero-callout-8 is missing")
    paths = [item for item in group if item.tag == f"{{{SVG_NS}}}path"]
    endpoint = next(
        (
            item
            for item in group
            if item.tag == f"{{{SVG_NS}}}circle"
            and item.attrib.get("cx") == "92"
        ),
        None,
    )
    if len(paths) != 2 or endpoint is None:
        raise RuntimeError("Unexpected ETICS callout-8 geometry")
    for path in paths:
        path.attrib["d"] = "M13.55 90.2 L19.5 90 L98 72.8"
    endpoint.attrib["cx"] = "98"
    endpoint.attrib["cy"] = "72.8"


def repair_old_svg(family: str, lang: str, source: Path, output: Path) -> None:
    tree = ET.parse(source)
    LEGACY.replace_logo(tree)
    LEGACY.replace_qr(tree, QR_ROOT / f"qr-{lang.upper()}.png")
    for prefix, lines in TEXT_REPAIRS[(family, lang)]:
        replace_text_lines(tree, prefix, lines)
    if family == "etics":
        repair_etics_endpoint(tree)
    if family == "natural-stone" and lang == "es":
        LEGACY.repair_natural_stone_spacing(tree)
    tree.write(output, encoding="utf-8", xml_declaration=True)


def render_svg(svg: Path, pdf: Path, print_ready: bool) -> None:
    environment = dict(os.environ)
    environment["NODE_PATH"] = str(NODE_MODULES)
    subprocess.run(
        [
            str(NODE),
            str(SVG_RENDERER),
            str(svg),
            str(pdf),
            "216" if print_ready else "210",
            "303" if print_ready else "297",
        ],
        check=True,
        env=environment,
    )
    LEGACY.finalize_boxes(pdf, print_ready)


def generate_old_families() -> list[Path]:
    outputs: list[Path] = []
    for family, config in OLD_FAMILIES.items():
        for lang in LANGS:
            source = config["source_dir"] / config["source"][lang]
            corrected = FINAL_SOURCE / f"{family}-{lang}-definitive.svg"
            print_svg = FINAL_SOURCE / f"{family}-{lang}-definitive-print-wrapper.svg"
            repair_old_svg(family, lang, source, corrected)
            LEGACY.make_print_svg(corrected, print_svg)
            for print_ready, artwork in ((False, corrected), (True, print_svg)):
                suffix = "Print_3mmBleed" if print_ready else "Download"
                target = FINAL_PDF / f"{config['stem'][lang]}_{suffix}.pdf"
                render_svg(artwork, target, print_ready)
                outputs.append(target)
    return outputs


def qr_image(lang: str) -> Image.Image:
    return Image.open(QR_ROOT / f"qr-{lang.upper()}.png").convert("RGB")


def generate_modern_family(script: str, kind: str) -> list[Path]:
    module = import_module(REPO / "scripts" / script, f"definitive_{kind}")
    module.DOWNLOADS = FINAL_PDF
    if kind == "thermowood":
        module.technical_library_qr = qr_image
        module.register_fonts()
        generate = lambda content, ready: module.generate_one(content, ready)
    elif kind == "universal-facade":
        module.base.technical_library_qr = qr_image
        module.base.register_fonts()
        generate = lambda content, ready: module.generate_one(content, ready)
    else:
        module.technical_library_qr = qr_image
        module.base.register_fonts()
        generate = lambda content, ready: module.generate_pdf(
            content, content["lang"].lower(), ready
        )
    outputs: list[Path] = []
    for lang in LANGS:
        content = module.CONTENTS[lang]
        outputs.append(generate(content, False))
        outputs.append(generate(content, True))
    for output in outputs:
        LEGACY.remove_empty_standard_font(output)
    return outputs


def install(outputs: list[Path]) -> None:
    public = REPO / "public/downloads"
    public.mkdir(parents=True, exist_ok=True)
    by_name = {path.name: path for path in outputs}
    if len(by_name) != 36:
        raise RuntimeError(f"Expected 36 unique PDF names, found {len(by_name)}")
    for name, source in sorted(by_name.items()):
        shutil.copy2(source, public / name)
        package_match = list(PACKAGE_A4.rglob(name))
        if len(package_match) != 1:
            raise RuntimeError(f"Expected one harmonisation package target for {name}")
        shutil.copy2(source, package_match[0])


def main() -> None:
    FINAL_PDF.mkdir(parents=True, exist_ok=True)
    FINAL_SOURCE.mkdir(parents=True, exist_ok=True)
    outputs = generate_old_families()
    outputs += generate_modern_family(
        "generate-thermowood-production.py", "thermowood"
    )
    outputs += generate_modern_family(
        "generate-universal-facade-production.py", "universal-facade"
    )
    outputs += generate_modern_family(
        "generate-flat-roof-production.py", "flat-roof"
    )
    install(outputs)
    print("\n".join(str(path) for path in sorted(outputs)))


if __name__ == "__main__":
    main()
