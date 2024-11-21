import { request } from "https";

export const checkSSLCertificate = async (domain: string): Promise<Record<string, any>> => {
	return new Promise(async (resolve, reject) => {
		const options = {
			host: domain,
			port: 443,
			method: "GET",
			agent: false,
			rejectUnauthorized: false, // Ignore certificate validation errors
		};

		const req = request(options, (res) => {
			res.on("data", () => {
				// Do nothing with the response body, just need to trigger the 'end' event
			});
			res.on("end", () => {
				const socket = res.socket as any; // Type assertion to handle missing getPeerCertificate
				const certificate = socket.getPeerCertificate();
				if (certificate) {
					const certificateInfo = {
						https: true, // Indicates that the website uses HTTPS
						validFrom: certificate.valid_from,
						validTo: certificate.valid_to,
						keySize: certificate.bits,
					};
					resolve(certificateInfo);
				} else {
					reject(new Error("Unable to retrieve certificate"));
				}
			});
		});

		req.on("error", (e) => {
			reject(e);
		});

		req.end();
	});
};
