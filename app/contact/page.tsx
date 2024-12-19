"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { sendEmail } from "@/app/actions/send-email";
import type { EmailProps } from "@/app/actions/send-email";
import Image from "next/image";

const projectTypes = [
	{ id: "website", label: "Website Development" },
	{ id: "ecommerce", label: "E-commerce" },
	{ id: "webapp", label: "Web Application" },
	{ id: "marketing", label: "Digital Marketing" },
	{ id: "seo", label: "SEO Optimization" },
	{ id: "maintenance", label: "Website Maintenance" },
] as const;

const budgetRanges = [
	{ value: "na", label: "N/A - Just reaching out" },
	{ value: "1000-5000", label: "$1,000 - $5,000" },
	{ value: "5000-10000", label: "$5,000 - $10,000" },
	{ value: "10000-20000", label: "$10,000 - $20,000" },
	{ value: "20000+", label: "$20,000+" },
] as const;

const monthlyBudgetRanges = [
	{ value: "na", label: "N/A - No maintenance needed" },
	{ value: "500-1000", label: "$500 - $1,000" },
	{ value: "1000-2500", label: "$1,000 - $2,500" },
	{ value: "2500-5000", label: "$2,500 - $5,000" },
	{ value: "5000+", label: "$5,000+" },
] as const;

const timelineOptions = [
	{ value: "asap", label: "As soon as possible" },
	{ value: "1-3months", label: "1-3 months" },
	{ value: "3-6months", label: "3-6 months" },
	{ value: "6months+", label: "6+ months" },
] as const;

const referralSources = [
	{ value: "google", label: "Google Search" },
	{ value: "social", label: "Social Media" },
	{ value: "referral", label: "Referral" },
	{ value: "other", label: "Other" },
] as const;

interface FileWithPreview extends File {
	preview?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB per file
const MAX_TOTAL_SIZE = 8 * 1024 * 1024; // 8MB total

export default function Contact() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const formRef = useRef<HTMLFormElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);

		// Validate individual file sizes
		const oversizedFiles = selectedFiles.filter((file) => file.size > MAX_FILE_SIZE);
		if (oversizedFiles.length > 0) {
			toast({
				variant: "destructive",
				title: "Files too large",
				description: `Some files exceed the 2MB limit: ${oversizedFiles.map((f) => f.name).join(", ")}`,
			});
			return;
		}

		// Validate total size including existing files
		const totalNewSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
		const currentTotalSize = files.reduce((sum, file) => sum + file.size, 0);
		if (totalNewSize + currentTotalSize > MAX_TOTAL_SIZE) {
			toast({
				variant: "destructive",
				title: "Total size too large",
				description: "Total file size cannot exceed 8MB",
			});
			return;
		}

		const newFiles = selectedFiles.map((file) => {
			const preview = URL.createObjectURL(file);
			return Object.assign(file, { preview });
		});
		setFiles((prev) => [...prev, ...newFiles]);
	};

	const removeFile = (index: number) => {
		setFiles((prev) => {
			const newFiles = [...prev];
			if (newFiles[index].preview) {
				URL.revokeObjectURL(newFiles[index].preview!);
			}
			newFiles.splice(index, 1);
			return newFiles;
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(e.currentTarget);

		// Convert files to base64
		const filePromises = files.map(
			(file) =>
				new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(file);
				})
		);

		try {
			const fileBase64s = await Promise.all(filePromises);

			const data: EmailProps = {
				name: formData.get("name") as string,
				email: formData.get("email") as string,
				phone: formData.get("phone") as string,
				company: formData.get("company") as string,
				websiteUrl: formData.get("websiteUrl") as string,
				projectType: selectedTypes,
				budget: formData.get("budget") as string,
				monthlyBudget: formData.get("monthlyBudget") as string,
				timeline: formData.get("timeline") as string,
				hearAboutUs: formData.get("hearAboutUs") as string,
				message: formData.get("message") as string,
				inspiration: formData.get("inspiration") as string,
				attachments: files.map((file, index) => ({
					name: file.name,
					type: file.type,
					size: file.size,
					data: fileBase64s[index],
				})),
			};

			const result = await sendEmail(data);
			if (result.success) {
				toast({
					title: "Message sent!",
					description: "Thanks for reaching out. I&apos;ll get back to you soon.",
				});
				formRef.current?.reset();
				setSelectedTypes([]);
				setFiles([]);
			} else {
				toast({
					variant: "destructive",
					title: "Error sending message",
					description: result.error || "Please try again later.",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error sending message",
				description: "Please try again later.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container max-w-4xl mx-auto px-4 py-24">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
					<div className="space-y-4 text-center">
						<h1 className="text-4xl font-bold tracking-tight">Let&apos;s Work Together</h1>
						<p className="text-lg text-muted-foreground">Tell me about your project and I&apos;ll help you bring it to life.</p>
					</div>

					<form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
						{/* Contact Information */}
						<div className="space-y-4">
							<h2 className="text-2xl font-semibold">Contact Information</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input id="name" name="name" required placeholder="Your name" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" name="email" type="email" required placeholder="your@email.com" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Phone</Label>
									<Input id="phone" name="phone" type="tel" required placeholder="Your phone number" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="company">Company</Label>
									<Input id="company" name="company" placeholder="Your company name" />
								</div>
								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="websiteUrl">Current Website (if any)</Label>
									<Input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://your-website.com" />
								</div>
							</div>
						</div>

						{/* Project Details */}
						<div className="space-y-4">
							<h2 className="text-2xl font-semibold">Project Details</h2>

							<div className="space-y-4">
								<Label>What services are you interested in?</Label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{projectTypes.map((type) => (
										<div key={type.id} className="flex items-center space-x-2">
											<Checkbox
												id={type.id}
												checked={selectedTypes.includes(type.id)}
												onCheckedChange={(checked) => {
													if (checked) {
														setSelectedTypes([...selectedTypes, type.id]);
													} else {
														setSelectedTypes(selectedTypes.filter((t) => t !== type.id));
													}
												}}
											/>
											<Label htmlFor={type.id}>{type.label}</Label>
										</div>
									))}
								</div>
							</div>

							<div className="space-y-4">
								<Label>Project Inspiration</Label>
								<Textarea id="inspiration" name="inspiration" placeholder="Share links to websites, designs, or brands that inspire you. What do you like about them?" className="min-h-[100px]" />
							</div>

							<div className="space-y-4">
								<Label>Upload Files</Label>
								<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
									<input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
									<Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mx-auto">
										<Upload className="mr-2 h-4 w-4" />
										Upload Files
									</Button>
									<p className="mt-2 text-sm text-muted-foreground">
										Upload logos, brand assets, or any other relevant files
										<br />
										Maximum 2MB per file, 8MB total
									</p>
								</div>

								{files.length > 0 && (
									<div className="mt-4 space-y-2">
										<div className="text-sm text-muted-foreground">Total size: {(files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(1)}MB of 8MB</div>
										{files.map((file, index) => (
											<div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
												<div className="flex items-center space-x-2">
													{file.type.startsWith("image/") && file.preview && (
														<div className="relative w-8 h-8">
															<Image
																src={file.preview}
																alt="Preview"
																fill
																className="object-cover rounded"
																unoptimized // Since we're using object URLs
															/>
														</div>
													)}
													<span className="text-sm truncate max-w-[200px]">{file.name}</span>
													<span className="text-sm text-muted-foreground">({(file.size / 1024).toFixed(1)}KB)</span>
												</div>
												<Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)} className="text-destructive hover:text-destructive/90">
													Remove
												</Button>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="space-y-4">
								<Label>What&apos;s your project budget?</Label>
								<RadioGroup name="budget" className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{budgetRanges.map((range) => (
										<div key={range.value} className="flex items-center space-x-2">
											<RadioGroupItem value={range.value} id={`budget-${range.value}`} />
											<Label htmlFor={`budget-${range.value}`}>{range.label}</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<div className="space-y-4">
								<Label>What&apos;s your monthly maintenance budget?</Label>
								<RadioGroup name="monthlyBudget" className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{monthlyBudgetRanges.map((range) => (
										<div key={range.value} className="flex items-center space-x-2">
											<RadioGroupItem value={range.value} id={`monthly-${range.value}`} />
											<Label htmlFor={`monthly-${range.value}`}>{range.label}</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<div className="space-y-4">
								<Label>When would you like to start?</Label>
								<RadioGroup name="timeline" className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{timelineOptions.map((option) => (
										<div key={option.value} className="flex items-center space-x-2">
											<RadioGroupItem value={option.value} id={`timeline-${option.value}`} />
											<Label htmlFor={`timeline-${option.value}`}>{option.label}</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<div className="space-y-4">
								<Label>How did you hear about us?</Label>
								<RadioGroup name="hearAboutUs" className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{referralSources.map((source) => (
										<div key={source.value} className="flex items-center space-x-2">
											<RadioGroupItem value={source.value} id={`source-${source.value}`} />
											<Label htmlFor={`source-${source.value}`}>{source.label}</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<div className="space-y-2">
								<Label htmlFor="message">Tell me about your project</Label>
								<Textarea id="message" name="message" required placeholder="What are your goals? What problems are you trying to solve?" className="min-h-[150px]" />
							</div>
						</div>

						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									<span>Sending...</span>
								</>
							) : (
								<>
									<Send className="mr-2 h-4 w-4" />
									<span>Send Message</span>
								</>
							)}
						</Button>
					</form>
				</motion.div>
			</div>
		</div>
	);
}
