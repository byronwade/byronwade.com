"use server";

import { type CreateEmailRequestOptions, Resend } from "resend";
import { CONTACT_ENCODED, decodeContact } from "@/lib/contact";
import {
	CONTACT_DELIVERY_ERROR,
	type ContactField,
	validateContactSubmission,
} from "@/lib/contact-form";

type SendEmailResponse =
	| { success: true }
	| { success: false; error: string; field?: ContactField };

const DELIVERY_TIMEOUT_MS = 10_000;
const SUBMISSION_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;

export async function sendEmail(input: unknown, submissionId: unknown): Promise<SendEmailResponse> {
	const submission = validateContactSubmission(input);
	if (!submission.success) {
		return submission;
	}
	if (typeof submissionId !== "string" || !SUBMISSION_ID.test(submissionId)) {
		return { success: false, error: CONTACT_DELIVERY_ERROR };
	}

	try {
		const resend = new Resend(process.env.RESEND_API_KEY);
		const ownerEmail = decodeContact(CONTACT_ENCODED.email);
		const { name, email, message, topicLabel } = submission.data;
		// Plain text keeps visitor markup literal without maintaining an HTML sanitizer.
		const summary = `Topic: ${topicLabel}\n\n${message}`;
		// Resend 4 forwards these options to fetch, but its types omit signal.
		// Cancel stalled headers and body reads; racing the send would leave it running.
		const requestOptions: CreateEmailRequestOptions & { signal: AbortSignal } = {
			signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
			idempotencyKey: `contact/${submissionId}`,
		};
		// The visitor's address is unverified. Keep it as Reply-To only so this
		// public action cannot relay visitor content to arbitrary recipients.
		const ownerDelivery = await resend.emails.send(
			{
				from: `Contact Form <${ownerEmail}>`,
				to: ownerEmail,
				replyTo: email,
				subject: `New contact message from ${name}`,
				text: `Name: ${name}\nEmail: ${email}\n${summary}`,
			},
			requestOptions
		);
		if (ownerDelivery.error || !ownerDelivery.data) {
			console.error("Contact message delivery failed.");
			return { success: false, error: CONTACT_DELIVERY_ERROR };
		}

		return { success: true };
	} catch {
		// Provider errors can contain request data; keep them out of client responses and logs.
		console.error("Contact message delivery unavailable.");
		return { success: false, error: CONTACT_DELIVERY_ERROR };
	}
}
