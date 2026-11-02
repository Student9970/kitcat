#!/usr/bin/env python3
"""
KitCat Journal — Blog creation pipeline (Hermes model + Gemini images)

Usage:
    python scripts/create_blog.py "How to choose the right cat litter" \
        --category "Cat Care" \
        --tags "cat litter, cat hygiene, indoor cats" \
        --affiliate "https://amzn.to/4x1...,https://example.com/product1" \
        --keywords "cat litter guide, best cat litter, unscented litter"

Flow:
    1. Generate blog post (MDX) using the Hermes model
    2. Review the post (Hermes)
    3. Generate image prompts (Hermes + Gemini)
    4. Save MDX to content/posts/ or content/drafts/
    5. Save images to public/uploads/
    6. Regenerate search index
    7. Build the site (npm run build)
    8. Print the ready-to-publish checklist
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import date

# ---------------------------------------------------------------------------
# Paths (assumes the script lives in scripts/ at the project root)
# ---------------------------------------------------------------------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_POSTS_DIR = os.path.join(PROJECT_ROOT, "content", "posts")
CONTENT_DRAFTS_DIR = os.path.join(PROJECT_ROOT, "content", "drafts")
PUBLIC_UPLOADS_DIR = os.path.join(PROJECT_ROOT, "public", "uploads")
SEARCH_INDEX_PATH = os.path.join(PROJECT_ROOT, "public", "search-index.json")

# Gemini API (loaded from environment or .env)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    _env_path = os.path.join(PROJECT_ROOT, ".env")
    if os.path.exists(_env_path):
        with open(_env_path, "r", encoding="utf-8") as _f:
            for _line in _f:
                _line = _line.strip()
                if _line.startswith("GEMINI_API_KEY="):
                    GEMINI_API_KEY = _line.split("=", 1)[1].strip().strip("\"'")
                    break
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

# Brand colours (from MS Tech Campus brand guide)
NAVY = "#0B2A73"
YELLOW = "#FFC107"


# ---------------------------------------------------------------------------
# Gemini image generation
# ---------------------------------------------------------------------------

def call_gemini(prompt_text, max_output_tokens=2000):
    """Call the Gemini API with retry on 503 (high demand)."""
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt_text}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": max_output_tokens},
    }

    for attempt in range(3):
        try:
            req = urllib.request.Request(
                GEMINI_URL,
                data=json.dumps(data).encode("utf-8"),
                headers=headers,
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 503 and attempt < 2:
                wait = (attempt + 1) * 10
                print(f"  [Gemini] 503 — retrying in {wait}s...")
                time.sleep(wait)
                continue
            return {"error": {"code": e.code, "message": str(e)}}
        except Exception as e:
            return {"error": str(e)}
    return {"error": "Max retries exceeded"}


def extract_json(text):
    """Extract the first JSON object from a text response."""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return None
    return None


def generate_image_prompts(image_prompts, topic):
    """Generate image descriptions/prompts for the blog using the Gemini API."""
    print(f"\n{'='*60}")
    print("STEP 3 — Generating image prompts (Hermes + Gemini)")
    print(f"{'='*60}")

    results = []
    for i, prompt in enumerate(image_prompts, 1):
        gemini_prompt = f"""
You are a blog image assistant for a cat-care blog (KitCat Journal).

Blog topic: {topic}

The following image prompt was generated for this blog:
{prompt}

Your task:
1. Enhance the prompt to be more specific and descriptive for an image generator.
2. Output a JSON object with these fields:
   - "old_prompt": the original prompt
   - "new_prompt": the enhanced, more detailed prompt for an image generator
   - "description": a one-line description of the image for the blog
   - "aspect_ratio": "landscape" or "square"
3. Do NOT include any markdown or text outside the JSON.

Return only JSON.
"""

        response = call_gemini(gemini_prompt)
        if "error" in response:
            print(f"  Image {i}: ERROR — {response['error']}")
            results.append({"index": i, "prompt": prompt, "status": "error", "error": response["error"]})
            continue

        # Extract the text content from the Gemini response
        candidates = response.get("candidates") or []
        if not candidates:
            response_text = ""
        else:
            candidate = candidates[0]
            content = candidate.get("content") or {}
            parts = content.get("parts") or []
            if parts:
                response_text = parts[0].get("text", "") if isinstance(parts[0], dict) else ""
            else:
                response_text = ""

        # Try to extract JSON from the response
        json_data = extract_json(response_text)
        if json_data:
            description = json_data.get("description", prompt)
            new_prompt = json_data.get("new_prompt", prompt)
            results.append({
                "index": i,
                "description": description,
                "new_prompt": new_prompt,
                "status": "generated",
                "filename": None,
                "source": "gemini",
            })
            print(f"  Image {i}: {description[:80]}...")
        else:
            results.append({
                "index": i,
                "description": prompt,
                "new_prompt": prompt,
                "status": "raw_text",
                "raw": response_text[:200],
                "filename": None,
                "source": "gemini",
            })
            print(f"  Image {i}: (raw text response, preview) {response_text[:100]}...")

    return results


# ---------------------------------------------------------------------------
# MDX file saving
# ---------------------------------------------------------------------------

def save_mdx(post_content, title, category, tags, affiliate_links, author="Usama Ansari", target_dir="content/posts"):
    """Save the MDX file to the specified directory (default: content/posts)."""
    print(f"\n{'='*60}")
    print(f"STEP 4 — Saving MDX file to {target_dir}")
    print(f"{'='*60}")

    # Generate slug (kebab-case)
    slug = re.sub(r'[^\w\s-]', '', title.lower().strip())
    slug = re.sub(r'[-\s]+', '-', slug)

    # Ensure unique filename
    counter = 1
    original_slug = slug
    while os.path.exists(os.path.join(target_dir, f"{slug}.mdx")):
        slug = f"{original_slug}-{counter}"
        counter += 1

    today = date.today().isoformat()

    # Extract description from the post content by finding the closing ---
    body_lines = post_content.split("\n")
    close_idx = None
    dash_count = 0
    for i, line in enumerate(body_lines):
        if line.strip() == "---":
            dash_count += 1
            if dash_count == 2:  # Second --- is the closing frontmatter
                close_idx = i
                break
    if close_idx is not None:
        body = "\n".join(body_lines[close_idx + 1:])
    else:
        body = post_content

    # Generate description from first 150 chars of the body (skip headings)
    body_text = " ".join(body.split())
    description = re.sub(r'^#+\s*', '', body_text)[:150].rstrip() + "." if len(body_text) > 150 else re.sub(r'^#+\s*', '', body_text)
    if not description:
        description = title

    # Build frontmatter
    tags_yaml = "\n  - " + "\n  - ".join(tags) if tags else ""

    affiliate = ""
    if affiliate_links:
        affiliate = f'\naffiliateLinks: {json.dumps(affiliate_links)}'

    frontmatter = f"""---
title: {title}
slug: {slug}
description: >-
  {description}
category: {category}
tags:{tags_yaml}
featuredImage: /uploads/{slug}.webp
author: {author}
publishDate: '{today}'
updatedDate: '{today}'
seoTitle: {title}
seoDescription: >-
  {description}
status: published
{affiliate}
---"""

    # Find the closing --- of frontmatter
    content_lines = post_content.split("\n")
    try:
        idx = content_lines.index("---")
        content_body = "\n".join(content_lines[idx + 1:])
    except ValueError:
        content_body = post_content

    # Write file to target directory
    os.makedirs(target_dir, exist_ok=True)
    file_path = os.path.join(target_dir, f"{slug}.mdx")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(frontmatter + "\n" + content_body)

    print(f"  Saved: {file_path}")
    return slug, file_path


# ---------------------------------------------------------------------------
# Image saving
# ---------------------------------------------------------------------------

def save_images(image_results, slug):
    """Save generated images to public/uploads/ with proper naming."""
    print(f"\n{'='*60}")
    print("STEP 5 — Saving images")
    print(f"{'='*60}")

    os.makedirs(PUBLIC_UPLOADS_DIR, exist_ok=True)

    for r in image_results:
        idx = r.get("index", 0)
        description = r.get("description", f"image_{idx}")
        status = r.get("status", "error")

        if status == "error":
            print(f"  Image {idx}: SKIPPED (error: {r.get('error', 'unknown')})")
            continue

        # Generate a safe filename
        safe_name = re.sub(r'[^\w\s-]', '', description.lower()).strip()
        safe_name = re.sub(r'[-\s]+', '-', safe_name)
        filename = f"{slug}img{idx}.webp"

        file_path = os.path.join(PUBLIC_UPLOADS_DIR, filename)
        with open(file_path, "wb") as f:
            # Placeholder — actual images would be generated here
            f.write(b"placeholder image for " + description.encode("utf-8"))
        r["filename"] = filename
        r["status"] = "saved"
        print(f"  Image {idx}: saved {filename}")

    return image_results


# ---------------------------------------------------------------------------
# Search index regeneration
# ---------------------------------------------------------------------------

def regenerate_search_index():
    """Run the search index build script."""
    print(f"\n{'='*60}")
    print("STEP 6 — Regenerating search index")
    print(f"{'='*60}")

    try:
        result = subprocess.run(
            ["node", "scripts/build-search-index.mjs"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=60,
        )
        print(f"  {result.stdout.strip()}")
        if result.returncode != 0:
            print(f"  ERROR: {result.stderr}")
        return result.returncode == 0
    except Exception as e:
        print(f"  ERROR: {e}")
        return False


# ---------------------------------------------------------------------------
# Site build
# ---------------------------------------------------------------------------

def build_site():
    """Run the Next.js build."""
    print(f"\n{'='*60}")
    print("STEP 7 — Building site")
    print(f"{'='*60}")

    try:
        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=300,
        )
        output_lines = result.stdout.split("\n")
        for line in output_lines[-20:]:
            if line.strip():
                print(f"  {line}")
        if result.returncode != 0:
            print(f"  BUILD WARNING: {result.stderr[-500:]}")
        return result.returncode == 0
    except Exception as e:
        print(f"  ERROR: {e}")
        return False


# ---------------------------------------------------------------------------
# WhatsApp notification
# ---------------------------------------------------------------------------

def notify_whatsapp(title, slug, publish_date, category):
    """Send a notification to WhatsApp status/channel."""
    print(f"\n{'='*60}")
    print("STEP 8 — WhatsApp notification")
    print(f"{'='*60}")

    message = (
        f"🐱 New KitCat Journal blog:\n"
        f"📌 {title}\n"
        f"🔗 {slug}\n"
        f"📅 {publish_date}\n"
        f"📂 {category}\n"
        f"👉 Read here: https://kitcat.pages.dev/blog/{slug}"
    )
    print(f"  Message prepared ({len(message)} chars)")
    print(f"  [To send: use the WhatsApp API / script]")
    return message


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="KitCat Journal blog creation pipeline")
    parser.add_argument("topic", help="Blog topic")
    parser.add_argument("--category", required=True, help="Category")
    parser.add_argument("--tags", required=True, help="Comma-separated tags")
    parser.add_argument("--affiliate", default="", help="Comma-separated affiliate links")
    parser.add_argument("--keywords", default="", help="Comma-separated keywords")
    parser.add_argument("--author", default="Usama Ansari", help="Author name")
    parser.add_argument("--draft", action="store_true", help="Save to drafts instead of published")
    parser.add_argument("--no-build", action="store_true", help="Skip the build step")
    parser.add_argument("--no-notify", action="store_true", help="Skip WhatsApp notification")
    args = parser.parse_args()

    tags = [t.strip() for t in args.tags.split(",") if t.strip()]
    affiliate_links = [t.strip() for t in args.affiliate.split(",") if t.strip()]

    # Step 1: Generate blog post (Hermes model)
    print(f"\n{'='*60}")
    print("STEP 1 — Generating blog post")
    print(f"{'='*60}")
    print("  Generating via Hermes model... (this will happen in the conversation)")
    mdx_content = input("  Paste the generated blog content: ")
    if not mdx_content.strip():
        print("  ERROR: No content.")
        sys.exit(1)

    # Step 2: Review blog post (Hermes model)
    print(f"\n{'='*60}")
    print("STEP 2 — Reviewing blog")
    print(f"{'='*60}")
    print("  Reviewing via Hermes model... (this will happen in the conversation)")
    review = input("  Paste the review result: ")
    if review:
        print(f"  Review: {review[:200]}...")

    # Step 3: Generate image prompts (Gemini)
    image_prompts = [
        f"Featured image for '{args.topic}' — a warm, inviting cat-looking scene",
        f"Image for '{args.topic}' — cat owner reading a guide, cozy lighting",
        f"Image for '{args.topic}' — cat playing with toys, bright and cheerful",
    ]
    image_results = generate_image_prompts(image_prompts, args.topic)

    # Step 4: Save MDX file
    target_dir = CONTENT_DRAFTS_DIR if args.draft else CONTENT_POSTS_DIR
    slug, file_path = save_mdx(mdx_content, args.topic, args.category, tags, affiliate_links, args.author, target_dir)

    # Step 5: Save images
    save_images(image_results, slug)

    # Step 6: Regenerate search index
    regenerate_search_index()

    # Step 7: Build site
    if not args.no_build:
        build_site()

    # Step 8: WhatsApp notification
    if not args.no_notify:
        notify_whatsapp(args.topic, slug, date.today().isoformat(), args.category)

    print(f"\n{'='*60}")
    print("PIPELINE COMPLETE ✓")
    print(f"{'='*60}")
    print(f"\n  Blog post: {file_path}")
    print(f"  Slug: {slug}")
    print(f"  Status: {'draft' if args.draft else 'published'}")
    print(f"  Preview: http://localhost:3000/blog/{slug}")
    print(f"  RSS: https://kitcat.pages.dev/rss.xml")
    print(f"  Sitemap: https://kitcat.pages.dev/sitemap.xml")
    print(f"\n  Next steps:")
    print(f"    - Review the MDX file and images")
    print(f"    - If draft: promote to published and deploy")
    print(f"    - Share on WhatsApp status + channel")


if __name__ == "__main__":
    main()
