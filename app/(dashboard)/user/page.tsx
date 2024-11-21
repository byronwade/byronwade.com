import { redirect } from "next/navigation";
import { getUser } from "../../../actions/auth";

export default async function PrivatePage() {
	const { user, error } = await getUser();
	if (error || !user) {
		redirect("/login");
	}

	return <p>Hello {user?.email}</p>;
}
