import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

export default function sendMessage(req: NextApiRequest, res: NextApiResponse) {
	const accountSid = <string>process.env.TWILIO_ACCOUNT_SID;
	const token = <string>process.env.TWILIO_AUTH_TOKEN;
	const client = twilio(accountSid, token);
	const { name, phone, message } = req.body;
	// console.log(name, phone, message);
	client.messages
		.create({
			body: `
Name: ${name}
Phone: ${phone}
Message ${message}`,
			from: "+18316043341",
			to: "18314306011",
		})
		.then((message) =>
			res.json({
				success: true,
			})
		)
		.catch((error) => {
			console.log(error);
			res.json({
				success: false,
			});
		});
}
