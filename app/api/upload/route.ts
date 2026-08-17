import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { serverDb } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: 'Upload service active' });
}

export async function POST(req: NextRequest) {
  try {
    ensureUploadsDir();
    const contentType = req.headers.get('content-type') || '';

    let slotKey = 'general';
    let fileBuffer: Buffer | null = null;
    let fileExtension = 'jpg';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      slotKey = (formData.get('slotKey') as string) || 'general';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);

      const mimeType = file.type || 'image/jpeg';
      if (mimeType.includes('png')) fileExtension = 'png';
      else if (mimeType.includes('webp')) fileExtension = 'webp';
      else if (mimeType.includes('svg')) fileExtension = 'svg';
      else if (mimeType.includes('gif')) fileExtension = 'gif';
      else fileExtension = 'jpg';
    } else {
      // JSON with Base64 payload
      const body = await req.json();
      slotKey = body.slotKey || 'general';
      const base64Data = body.base64 || body.image;

      if (!base64Data) {
        return NextResponse.json({ success: false, error: 'No image data provided' }, { status: 400 });
      }

      const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1].toLowerCase();
        fileExtension = ext === 'jpeg' ? 'jpg' : ext;
        fileBuffer = Buffer.from(matches[2], 'base64');
      } else {
        fileBuffer = Buffer.from(base64Data, 'base64');
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return NextResponse.json({ success: false, error: 'Failed to process image data' }, { status: 400 });
    }

    // Sanitize slotKey for safe filesystem name
    const safeSlotKey = slotKey.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `img_${safeSlotKey}_${Date.now()}.${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Write file to /public/uploads/
    fs.writeFileSync(filePath, fileBuffer);

    const relativeUrl = `/uploads/${filename}`;

    // Record in database and remove old image file if replaced
    const saveResult = serverDb.saveUploadedImage(slotKey, relativeUrl, filename);

    return NextResponse.json({
      success: true,
      data: {
        url: relativeUrl,
        filename,
        size: fileBuffer.length,
        settings: saveResult.settings
      },
      url: relativeUrl,
      filename,
      size: fileBuffer.length,
      settings: saveResult.settings
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slotKey = searchParams.get('slotKey');
    if (slotKey) {
      serverDb.removeUploadedImage(slotKey);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete' }, { status: 500 });
  }
}
