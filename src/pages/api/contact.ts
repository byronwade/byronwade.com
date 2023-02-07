import sgMail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";

sgMail.setApiKey(process.env.EMAIL_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { email, message, name } = req.body;
	const msg = {
		to: "bcw1995@gmail.com", // Change to your recipient
		from: "bw@wadesinc.io", // Change to your verified sender
		subject: "Website Form - byronwade.com",
		html: `<strong>Name:</strong> ${name} <br> <strong>Email:</strong> ${email} <br> <strong>Message:</strong> ${message}`,
	};

	try {
		await sgMail.send(msg);
		res.json({ message: `Email has been sent` });
	} catch (error) {
		res.status(500).json({ error: "Error sending email" });
	}
};
