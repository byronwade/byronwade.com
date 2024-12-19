"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailProps {
	name: string;
	email: string;
	phone: string;
	company: string;
	message: string;
	projectType: string[];
	budget: string;
	timeline: string;
	monthlyBudget: string;
	websiteUrl?: string;
	hearAboutUs: string;
	inspiration: string;
	attachments: Array<{
		name: string;
		type: string;
		size: number;
		data: string;
	}>;
}

interface EmailTemplate {
	subject: string;
	html: string;
}

function formatProjectTypes(types: string[]): string {
	return types.join(", ");
}

function formatBudget(budget: string): string {
	return budget === "na" ? "N/A - Just reaching out" : budget;
}

function formatMonthlyBudget(budget: string): string {
	return budget === "na" ? "N/A - No maintenance needed" : budget;
}

function formatAttachmentsList(attachments: EmailProps["attachments"]): string {
	if (attachments.length === 0) return "";

	const attachmentItems = attachments
		.map((file) => {
			return `
				<li style="font-size: 14px; color: #111827; margin: 12px 0;">
					<strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)}KB)
				</li>
			`;
		})
		.join("");

	return `
		<div style="margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
			<p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 16px;">
				Attached Files
			</p>
			<ul style="margin: 0; padding: 0; list-style: none;">
				${attachmentItems}
			</ul>
		</div>
	`;
}

function prepareAttachments(attachments: EmailProps["attachments"]) {
	return attachments.map((file) => {
		// Remove the "data:image/jpeg;base64," or similar prefix
		const base64Data = file.data.split(";base64,").pop() || "";

		return {
			filename: file.name,
			content: base64Data,
			type: file.type,
		};
	});
}

function generateUserEmailTemplate(data: EmailProps): EmailTemplate {
	const { name, message, projectType, budget, timeline, monthlyBudget, inspiration, attachments } = data;

	return {
		subject: `Thanks for reaching out, ${name}!`,
		html: `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Thanks for reaching out!</title>
				</head>
				<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
					<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
						<div style="text-align: center; padding: 32px 0;">
							<h1 style="font-size: 24px; font-weight: bold; margin: 0;">Byron Wade</h1>
						</div>
						<div style="background-color: white; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
							<p style="font-size: 16px; line-height: 24px; margin: 16px 0;">Hi ${name},</p>
							<p style="font-size: 16px; line-height: 24px; margin: 16px 0;">Thank you for reaching out! I've received your message and will get back to you as soon as possible to discuss how I can help.</p>
							
							<div style="background-color: #f9fafb; padding: 24px; border-radius: 6px; margin: 24px 0;">
								<h3 style="font-size: 18px; margin: 0 0 16px;">Project Summary</h3>
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Services Interested In:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${formatProjectTypes(projectType)}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Project Budget:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${formatBudget(budget)}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Timeline:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${timeline}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Monthly Budget:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${formatMonthlyBudget(monthlyBudget)}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">Project Inspiration:</p>
								<p style="font-size: 16px; color: #111827; white-space: pre-wrap; margin: 0 0 16px;">${inspiration || "Not provided"}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">Your Message:</p>
								<p style="font-size: 16px; color: #111827; white-space: pre-wrap; margin: 0;">${message}</p>
							</div>

							${formatAttachmentsList(attachments)}
							
							<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
							<p style="font-size: 14px; color: #6b7280; text-align: center; margin: 0;">This email was sent from the contact form at byronwade.com</p>
						</div>
					</div>
				</body>
			</html>
		`,
	};
}

function generateAdminEmailTemplate(data: EmailProps): EmailTemplate {
	const { name, email, phone, company, message, projectType, budget, timeline, monthlyBudget, websiteUrl, hearAboutUs, inspiration, attachments } = data;

	return {
		subject: `New Project Inquiry from ${name}`,
		html: `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>New Contact Form Submission</title>
				</head>
				<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
					<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
						<div style="text-align: center; padding: 32px 0;">
							<h1 style="font-size: 24px; font-weight: bold; margin: 0;">Byron Wade</h1>
						</div>
						<div style="background-color: white; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
							<h2 style="font-size: 20px; margin: 0 0 24px;">New Project Inquiry</h2>
							
							<div style="background-color: #f9fafb; padding: 24px; border-radius: 6px; margin: 24px 0;">
								<h3 style="font-size: 18px; margin: 0 0 16px;">Contact Information</h3>
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Name:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${name}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Email:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${email}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Phone:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${phone}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Company:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${company || "Not provided"}</p>
								
								${
									websiteUrl
										? `
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Website:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;"><a href="${websiteUrl}" style="color: #2563eb;">${websiteUrl}</a></p>
								`
										: ""
								}
							</div>
							
							<div style="background-color: #f9fafb; padding: 24px; border-radius: 6px; margin: 24px 0;">
								<h3 style="font-size: 18px; margin: 0 0 16px;">Project Details</h3>
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Services Interested In:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${formatProjectTypes(projectType)}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Project Budget:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${formatBudget(budget)}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Timeline:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${timeline}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Monthly Budget:</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${formatMonthlyBudget(monthlyBudget)}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">How did they hear about us?</p>
								<p style="font-size: 16px; color: #111827; margin: 0 0 16px;">${hearAboutUs}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">Project Inspiration:</p>
								<p style="font-size: 16px; color: #111827; white-space: pre-wrap; margin: 0 0 16px;">${inspiration || "Not provided"}</p>
								
								<p style="font-size: 14px; color: #6b7280; margin: 0 0 8px;">Message:</p>
								<p style="font-size: 16px; color: #111827; white-space: pre-wrap; margin: 0;">${message}</p>
							</div>

							${formatAttachmentsList(attachments)}
							
							<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
							<p style="font-size: 14px; color: #6b7280; text-align: center; margin: 0;">This email was sent from the contact form at byronwade.com</p>
						</div>
					</div>
				</body>
			</html>
		`,
	};
}

interface SendEmailResponse {
	success: boolean;
	data?: any;
	error?: string;
}

export async function sendEmail(formData: EmailProps): Promise<SendEmailResponse> {
	try {
		const userTemplate = generateUserEmailTemplate(formData);
		const adminTemplate = generateAdminEmailTemplate(formData);
		const emailAttachments = prepareAttachments(formData.attachments);

		// Send both emails concurrently
		const [userEmail, adminEmail] = await Promise.all([
			resend.emails.send({
				from: "Byron Wade <byron@byronwade.com>",
				to: formData.email,
				subject: userTemplate.subject,
				replyTo: "byron@byronwade.com",
				html: userTemplate.html,
				attachments: emailAttachments,
			}),
			resend.emails.send({
				from: "Contact Form <byron@byronwade.com>",
				to: "byron@byronwade.com",
				subject: adminTemplate.subject,
				replyTo: formData.email,
				html: adminTemplate.html,
				attachments: emailAttachments,
			}),
		]);

		if (userEmail.error || adminEmail.error) {
			console.error("Email sending error:", userEmail.error || adminEmail.error);
			return {
				success: false,
				error: "Failed to send email. Please try again.",
			};
		}

		return {
			success: true,
			data: { userEmail: userEmail.data, adminEmail: adminEmail.data },
		};
	} catch (error: any) {
		console.error("Email sending error:", error);
		return {
			success: false,
			error: "An unexpected error occurred. Please try again.",
		};
	}
}
