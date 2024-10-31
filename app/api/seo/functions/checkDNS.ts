import dns from "dns";

export const checkDNSInfo = async (domainWithProtocol: string): Promise<Record<string, any>> => {
	// Remove the protocol (e.g., "https://") if it's present
	const domain = domainWithProtocol.replace(/^(https?:\/\/)?/, "");

	const dnsInfo: Record<string, any> = {
		domain,
	};

	try {
		const resolutions = await Promise.allSettled([
			resolveAsync(dns.promises.resolve4, domain),
			resolveAsync(dns.promises.resolve6, domain),
			resolveAsync(dns.promises.resolveCname, domain),
			resolveAsync(dns.promises.resolveMx, domain),
			resolveAsync(dns.promises.resolveTxt, domain),
			resolveAsync(dns.promises.resolveNs, domain), // Nameservers (NS) record
			resolveAsync(dns.promises.resolveSoa, domain), // Start of Authority (SOA) record
			resolveAsync(dns.promises.resolveSrv, domain), // Service (SRV) record
			resolveAsync(dns.promises.resolvePtr, domain), // Pointer (PTR)
			resolveAsync(dns.promises.resolveCaa, domain), // CAA records
			resolveAsync(dns.promises.resolveNaptr, domain), // NAPTR records
		]);

		resolutions.forEach((result, index) => {
			if (result.status === "fulfilled") {
				dnsInfo[resolutionKeys[index]] = result.value;
			} else if (result.reason.code === "ENODATA") {
				// Handle "ENODATA" error by setting the result to an empty array or null
				dnsInfo[resolutionKeys[index]] = [];
			} else {
				// Handle other DNS resolution errors
				dnsInfo[resolutionKeys[index]] = null; // You can set it to null or handle it differently
			}
		});

		return dnsInfo;
	} catch (error) {
		// Handle top-level errors here
		console.error("DNS resolution error:", error);
		throw error; // You can choose to rethrow the error or handle it differently
	}
};

const resolutionKeys = [
	"aRecords",
	"aaaaRecords",
	"cnameRecords",
	"mxRecords",
	"txtRecords",
	"nsRecords", // Nameservers
	"soaRecord", // Start of Authority
	"srvRecords", // Service (SRV)
	"ptrRecords", // Pointer (PTR)
	"caaRecords", // CAA records
	"naptrRecords", // NAPTR records
];

async function resolveAsync(resolver: (domain: string) => Promise<any>, domain: string) {
	try {
		return await resolver(domain);
	} catch (error) {
		throw error; // Propagate the error for handling in the catch block
	}
}
