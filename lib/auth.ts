"use server";
import { z } from "zod";
import { signupSchema, loginSchema } from "@/types/auth";
import { signIn } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const handleSignup = async (data: z.infer<typeof signupSchema>) => {
	const validatedFields = signupSchema.safeParse(data);
	if (!validatedFields.success) {
		console.log(validatedFields.error.errors);
		return { errors: validatedFields.error.errors };
	}

	const { name, email, password } = validatedFields.data;

	try {
		const existingTeam = await prisma.team.findFirst({
			where: {
				email,
			},
		});

		if (existingTeam) throw "Team already exists with given email";

		const hashedPassword = await bcrypt.hash(password, 12);

		const team = await prisma.team.create({
			data: {
				email,
				teamName:name,
				password: hashedPassword,
			},
		});

		if (!team) throw "Error while creating team. Please try again";
	} catch (error) {
		return { error };
	}

	return { success: true, message: "Signup successful!" };
};

export const handleLogin = async (data: z.infer<typeof loginSchema>) => {
	const validatedFields = loginSchema.safeParse(data);
	if (!validatedFields.success) {
		return { errors: validatedFields.error.errors };
	}

	const { email, password } = validatedFields.data;

	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false
		});
	} catch (error: any) {
		console.error(error);
		if (error.type && error.type === "CredentialsSignin") {
			return { error: "Invalid Credentials" };
		} else return { error: error.message };
	}

	return { success: true, message: "Logged In" };
};
