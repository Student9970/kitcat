#!/usr/bin/env python3
"""
KitCat Journal — WhatsApp notification sender
Sends a blog launch notification to WhatsApp status + channel.

Usage:
    python scripts/send-whatsapp.py \
        --title "How to Choose the Right Cat Litter" \
        --slug "how-to-choose-the-right-cat-litter" \
        --date "2026-11-03"

Configuration:
    Edit the WHATSAPP_* settings below with your credentials.
"""

import argparse
import os
import sys
import urllib.request
import json
from datetime import date

# ---------------------------------------------------------------------------
# Configuration — edit these with your actual credentials
# ---------------------------------------------------------------------------
# WhatsApp Cloud API
WHATSAPP_TOKEN = ""          # Your WhatsApp Cloud API token
WHATSAPP_PHONE_NUMBER_ID = "" # Your WhatsApp Cloud phone number ID
WHATSAPP_RECIPIENT = ""      # Recipient phone number (e.g., "+1234567890")

# Alternative: WhatsApp Business API
WHATSAPP_BUSINESS_API_URL = "https://graph.facebook.com/v18.0/{phone_number_id}/messages"


def send_whatsapp_text_message(recipient, message_body):
    """
    Send a text message via WhatsApp Cloud API.
    Requires WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and recipient.
    """
    if not WHATSAPP_TOKEN or not WHATSAPP_PHONE_NUMBER_ID:
        print("  [WhatsApp] Token/Phone ID not configured. Skipping.")
        return False

    url = f"https://graph.facebook.com/v18.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "to": recipient,
        "type": "text",
        "text": {"body": message_body},
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            print(f"  [WhatsApp] Success: message ID {result.get('message_id', 'unknown')}")
            return True
    except Exception as e:
        print(f"  [WhatsApp] Error: {e}")
        return False


def send_whatsapp_status_message(title, slug, publish_date, category):
    """Prepare a WhatsApp status-style message (whatsapp status/channel)."""
    message = (
        f"🐱 New KitCat Journal blog:\n"
        f"📌 {title}\n"
        f"🔗 {slug}\n"
        f"📅 {publish_date}\n"
        f"📂 {category}\n"
        f"👉 Read: https://kitcat.pages.dev/blog/{slug}"
    )
    print(f"  WhatsApp Status Message ({len(message)} chars):")
    print(f"  {message}")
    return message


def send_whatsapp_channel_message(title, slug, publish_date, category):
    """Prepare a WhatsApp channel broadcast-style message."""
    message = (
        f"New KitCat Journal post: {title}\n"
        f"Read more: https://kitcat.pages.dev/blog/{slug}\n"
        f"Category: {category}\n"
        f"Published: {publish_date}"
    )
    print(f"  WhatsApp Channel Message ({len(message)} chars):")
    print(f"  {message}")
    return message


def main():
    parser = argparse.ArgumentParser(description="KitCat Journal WhatsApp notifications")
    parser.add_argument("title", help="Blog title")
    parser.add_argument("slug", help="Blog slug")
    parser.add_argument("--date", default=date.today().isoformat(), help="Publish date (YYYY-MM-DD)")
    parser.add_argument("--category", default="Cat Care", help="Category")
    parser.add_argument("--recipient", default="", help="Recipient phone number (with country code)")
    parser.add_argument("--channel", action="store_true", help="Send as channel message")
    args = parser.parse_args()

    print(f"\n{'='*60}")
    print("WhatsApp Notification")
    print(f"{'='*60}")

    # Status-style message (for status/channel)
    send_whatsapp_status_message(args.title, args.slug, args.date, args.category)

    # Channel-style message
    if args.channel:
        send_whatsapp_channel_message(args.title, args.slug, args.date, args.category)

    print(f"\n  [Ready to send.]")
    print(f"  Configure WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_RECIPIENT in the script.")


if __name__ == "__main__":
    main()
