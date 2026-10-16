"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { sendEmail } from "@/lib/actions/send-email";
import {
	type ContactField,
	DEFAULT_CONTACT_TOPIC,
	validateContactSubmission,
} from "@/lib/contact-form";

type Status = { kind: "idle" } | { kind: "sent" } | { kind: "failed"; reason: string };
interface FieldError {
	field: ContactField;
	reason: string;
}

const EMPTY_FORM: Record<ContactField, string> = {
	name: "",
	email: "",
	topic: DEFAULT_CONTACT_TOPIC,
	message: "",
};

export function useContactForm() {
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [status, setStatus] = useState<Status>({ kind: "idle" });
	const [fieldError, setFieldError] = useState<FieldError | null>(null);
	// State renders feedback; the ref also prevents a second submit before that render.
	const submitting = useRef(false);
	const submittedForm = useRef<HTMLFormElement | null>(null);

	// Move focus after the error and its accessible description have committed.
	useEffect(() => {
		if (fieldError) {
			const control = submittedForm.current?.elements.namedItem(fieldError.field);
			if (control instanceof HTMLElement) {
				control.focus();
			}
		}
	}, [fieldError]);

	const handleChange = useCallback((field: ContactField, value: string) => {
		setFormData((previous) => ({ ...previous, [field]: value }));
		setFieldError((previous) => (previous?.field === field ? null : previous));
		setStatus({ kind: "idle" });
	}, []);

	const showFailure = useCallback((reason: string, field?: ContactField) => {
		setStatus({ kind: "failed", reason });
		if (field) {
			setFieldError({ field, reason });
		}
	}, []);

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (submitting.current) {
				return false;
			}
			submittedForm.current = event.currentTarget;
			const validation = validateContactSubmission(formData);
			if (!validation.success) {
				showFailure(validation.error, "field" in validation ? validation.field : undefined);
				return false;
			}
			submitting.current = true;
			setIsSubmitting(true);
			setFieldError(null);
			setStatus({ kind: "idle" });
			try {
				const result = await sendEmail(formData);
				if (!result.success) {
					showFailure(result.error, result.field);
					return false;
				}
				setStatus({ kind: "sent" });
				// Preserve edits made while the submitted snapshot was being delivered.
				setFormData((current) => (current === formData ? EMPTY_FORM : current));
				toast.success("Message sent", {
					description: "Thanks for reaching out. I'll get back to you soon.",
				});
				return true;
			} catch {
				showFailure("Couldn't send your message. Your draft is still here. Please try again.");
				return false;
			} finally {
				submitting.current = false;
				setIsSubmitting(false);
			}
		},
		[formData, showFailure]
	);

	return { formData, isSubmitting, status, fieldError, handleChange, handleSubmit };
}
