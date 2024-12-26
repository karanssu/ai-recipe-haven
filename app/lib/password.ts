import bcrypt from "bcryptjs";

export function encodePassword(password: string): string {
	return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
	return bcrypt.compareSync(password, hash);
}
