import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const filename = url.searchParams.get("filename") || `upload-${Date.now()}`;
	const contentType =
		url.searchParams.get("contentType") || "application/octet-stream";
	const bucket = process.env.AWS_S3_BUCKET_NAME!;
	const region = process.env.AWS_REGION!;

	const client = new S3Client({ region });

	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: `recipes/${filename}`,
		ContentType: contentType,
	});

	const signedUrl = await getSignedUrl(client, command, {
		expiresIn: 900,
	});

	return NextResponse.json({ url: signedUrl, key: command.input.Key });
}
