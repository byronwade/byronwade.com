"use server";

import { Resend } from "resend";
import { CONTACT_ENCODED, decodeContact } from "@/lib/contact";
import { validateContactSubmission } from "@/lib/contact-form";

type SendEmailResponse = { success: true } | { success: false; error: string };

const DELIVERY_ERROR = "Couldn't send your message. Please try again, or email me directly.";

export async function sendEmail(input: unknown): Promise<SendEmailResponse> {
	const submission = validateContactSubmission(input);
	if (!submission.success) {
		return submission;
	}

	try {
		const resend = new Resend(process.env.RESEND_API_KEY);
		const ownerEmail = decodeContact(CONTACT_ENCODED.email);
		const { name, email, message, topicLabel } = submission.data;
		// Plain text keeps visitor markup literal without maintaining an HTML sanitizer.
		const summary = `Topic: ${topicLabel}\n\n${message}`;
		const ownerDelivery = await resend.emails.send({
			from: `Contact Form <${ownerEmail}>`,
			to: ownerEmail,
			replyTo: email,
			subject: `New contact message from ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n${summary}`,
		});
		if (ownerDelivery.error || !ownerDelivery.data) {
			console.error("Contact message delivery failed.");
			return { success: false, error: DELIVERY_ERROR };
		}

		// A confirmation can only claim receipt after the owner's delivery is accepted.
		// Its failure must not encourage a retry of an already delivered message.
		try {
			const confirmation = await resend.emails.send({
				from: `Byron Wade <${ownerEmail}>`,
				to: email,
				replyTo: ownerEmail,
				subject: "Thanks for reaching out",
				text: `Hi ${name},\n\nThanks for reaching out. I've received your message and will get back to you soon.\n\n${summary}\n\nByron Wade`,
			});
			if (confirmation.error || !confirmation.data) {
				console.warn("Contact confirmation delivery failed.");
			}
		} catch {
			console.warn("Contact confirmation delivery failed.");
		}
		return { success: true };
	} catch {
		// Provider errors can contain request data; keep them out of client responses and logs.
		console.error("Contact message delivery unavailable.");
		return { success: false, error: DELIVERY_ERROR };
	}
}
