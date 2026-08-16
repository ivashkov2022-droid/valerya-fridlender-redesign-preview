#!/usr/bin/env python3
"""Deduplicate and optionally re-encode exported site images.

The default mode removes only byte-identical duplicates, keeping the original
image encoding and pixels. The optional WebP mode uses lossless encoding for
PNG/transparency and accepts photographs only after a strict quality check.
All references are updated before originals are removed.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
from tempfile import NamedTemporaryFile

from PIL import Image, ImageChops, ImageStat


IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png"}
JPEG_QUALITIES = (92, 94, 96, 98)
SKIP_NAMES = {
    "tild3036-6130-4134-b134-323263346635__img_7708-2.jpg",  # Open Graph
    "tild3431-6263-4936-b434-653064346130__frame_18289.png",  # favicon
    "tildacopy.png",  # used by Tilda's external label script
    "tildacopy_black.png",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def psnr(original: Image.Image, candidate: Image.Image) -> float:
    left = original.convert("RGB")
    right = candidate.convert("RGB")
    stat = ImageStat.Stat(ImageChops.difference(left, right))
    mse = sum(value * value for value in stat.rms) / 3
    if mse == 0:
        return float("inf")
    return 20 * math.log10(255 / math.sqrt(mse))


def visible_pixels_equal(original: Image.Image, candidate: Image.Image) -> bool:
    """Compare transparent images on both light and dark backgrounds."""
    left = original.convert("RGBA")
    right = candidate.convert("RGBA")
    if left.getchannel("A").tobytes() != right.getchannel("A").tobytes():
        return False
    for color in ((255, 255, 255, 255), (0, 0, 0, 255)):
        background_left = Image.new("RGBA", left.size, color)
        background_right = Image.new("RGBA", right.size, color)
        background_left.alpha_composite(left)
        background_right.alpha_composite(right)
        if ImageChops.difference(
            background_left.convert("RGB"), background_right.convert("RGB")
        ).getbbox():
            return False
    return True


def encode_webp(
    source: Path,
    target: Path,
    min_psnr: float,
    min_savings: float,
) -> dict | None:
    with Image.open(source) as image:
        image.load()
        has_alpha = "A" in image.getbands() or "transparency" in image.info
        is_lossless = image.format == "PNG" or has_alpha
        qualities = (100,) if is_lossless else JPEG_QUALITIES

        for quality in qualities:
            with NamedTemporaryFile(
                dir=target.parent, suffix=".webp", delete=False
            ) as temporary:
                temporary_path = Path(temporary.name)
            try:
                save_options = {
                    "format": "WEBP",
                    "method": 6,
                    "lossless": is_lossless,
                    "exact": True,
                }
                if not is_lossless:
                    save_options["quality"] = quality
                image.save(temporary_path, **save_options)

                if temporary_path.stat().st_size >= source.stat().st_size * (
                    1 - min_savings
                ):
                    continue

                with Image.open(temporary_path) as candidate:
                    candidate.load()
                    score = (
                        float("inf")
                        if is_lossless
                        and visible_pixels_equal(image, candidate)
                        else psnr(image, candidate)
                    )
                if score < min_psnr:
                    continue

                os.replace(temporary_path, target)
                return {
                    "quality": "lossless" if is_lossless else quality,
                    "psnr": None if math.isinf(score) else round(score, 2),
                    "before": source.stat().st_size,
                    "after": target.stat().st_size,
                }
            finally:
                temporary_path.unlink(missing_ok=True)
    return None


def replace_references(public_dir: Path, replacements: dict[str, str]) -> dict:
    changed_files = 0
    replacement_count = 0
    encoded = [
        (b"images/" + old.encode(), b"images/" + new.encode())
        for old, new in replacements.items()
    ]

    for path in public_dir.rglob("*"):
        if not path.is_file() or path.parent == public_dir / "images":
            continue
        data = path.read_bytes()
        updated = data
        for index, (old, new) in enumerate(encoded):
            placeholder = f"__ASSET_OPTIMIZER_{index}__".encode()
            updated = updated.replace(new, placeholder)
            count = updated.count(old)
            if count:
                replacement_count += count
                updated = updated.replace(old, new)
            updated = updated.replace(placeholder, new)
        if updated != data:
            path.write_bytes(updated)
            changed_files += 1

    return {"changed_files": changed_files, "replacements": replacement_count}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--public", type=Path, default=Path("public"))
    parser.add_argument("--report", type=Path, default=Path("work/asset-optimization-report.json"))
    parser.add_argument("--min-psnr", type=float, default=42.0)
    parser.add_argument("--min-savings", type=float, default=0.03)
    parser.add_argument(
        "--webp",
        action="store_true",
        help="also create quality-checked WebP replacements",
    )
    args = parser.parse_args()

    public_dir = args.public.resolve()
    image_dir = public_dir / "images"
    images = sorted(
        path
        for path in image_dir.iterdir()
        if path.is_file()
        and path.suffix.lower() in IMAGE_SUFFIXES
        and path.name not in SKIP_NAMES
    )
    before_bytes = sum(path.stat().st_size for path in images)

    by_hash: dict[str, list[Path]] = {}
    for path in images:
        by_hash.setdefault(sha256(path), []).append(path)

    canonical_for: dict[Path, Path] = {}
    duplicate_groups = []
    for group in by_hash.values():
        group.sort(key=lambda path: path.name)
        canonical = group[0]
        for path in group:
            canonical_for[path] = canonical
        if len(group) > 1:
            duplicate_groups.append([path.name for path in group])

    optimized_target: dict[Path, Path] = {}
    optimized = []
    for canonical in sorted(set(canonical_for.values())):
        if not args.webp:
            optimized_target[canonical] = canonical
            continue
        target = canonical.with_name(canonical.name + ".webp")
        result = encode_webp(canonical, target, args.min_psnr, args.min_savings)
        if result:
            optimized_target[canonical] = target
            optimized.append(
                {"source": canonical.name, "target": target.name, **result}
            )
        else:
            optimized_target[canonical] = canonical

    replacements: dict[str, str] = {}
    to_remove: set[Path] = set()
    for source, canonical in canonical_for.items():
        target = optimized_target[canonical]
        if source != target:
            replacements[source.name] = target.name
            to_remove.add(source)

    reference_report = replace_references(public_dir, replacements)

    remaining_references = []
    for path in public_dir.rglob("*"):
        if not path.is_file() or path.parent == image_dir:
            continue
        data = path.read_bytes()
        for old_name, new_name in replacements.items():
            old_reference = b"images/" + old_name.encode()
            new_reference = b"images/" + new_name.encode()
            without_new_references = data.replace(new_reference, b"")
            if old_reference in without_new_references:
                remaining_references.append({"file": str(path), "image": old_name})
    if remaining_references:
        raise RuntimeError(
            "Old image references remain: "
            + json.dumps(remaining_references, ensure_ascii=False)
        )

    for path in sorted(to_remove):
        path.unlink()

    final_images = [path for path in image_dir.iterdir() if path.is_file()]
    after_bytes = sum(path.stat().st_size for path in final_images)
    report = {
        "before": {"files": len(images), "bytes": before_bytes},
        "after": {"files": len(final_images), "bytes": after_bytes},
        "saved": {
            "bytes": before_bytes - after_bytes,
            "percent": round((before_bytes - after_bytes) * 100 / before_bytes, 2),
        },
        "duplicate_groups": duplicate_groups,
        "optimized": optimized,
        "references": reference_report,
        "minimum_psnr": args.min_psnr,
        "webp_enabled": args.webp,
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
