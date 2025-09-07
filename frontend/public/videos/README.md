# Video Background Files

This directory contains video files used for background banners and animations.

## Background Banner Video

**File**: `background-banner.mp4` (or `background-banner.webm`)

**Purpose**: Video background for the homepage headline banner

**Requirements**:
- Format: MP4 (primary) or WebM (fallback)
- Resolution: 1920x1080 or higher recommended
- Duration: 10-30 seconds (will loop)
- File size: Keep under 10MB for fast loading
- Content: Subtle, non-distracting background animation

**Usage**: The video automatically plays on page load, loops continuously, and is muted for better user experience.

## Adding Your Video

1. Place your video file in this directory
2. Name it `background-banner.mp4` (or both `.mp4` and `.webm` formats)
3. Ensure the video is optimized for web (compressed, reasonable file size)
4. The video will automatically appear as the background for the headline banner

## Fallback

If the video fails to load, the system will automatically fall back to the static image background (`/images/pattern.png`).
