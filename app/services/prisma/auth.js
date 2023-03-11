const { PrismaClient } = require('@prisma/client');
const { createTokenUser, createJWT, createRefreshJWT } = require('../../utils');
const { createUserRefreshToken } = require('./refreshToken');
const {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
} = require('../../errors');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const { otpMail } = require('../mail');

const signup = async (req) => {
	const { roleId, email, password, nama, telepon } = req.body;

	// jika email dan status tidak aktif
	let result = await prisma.user.findFirst({
		where: {
			AND: [{ email }, { status: 'tidak aktif' }],
		},
	});

	// kalau ada user tapi blm aktif update
	if (result) {
		result = await prisma.user.update({
			where: {
				email: result.email,
			},
			data: {
				nama,
				email,
				roleId,
				telepon,
				password: await bcrypt.hash(password, 12),
				otp: Math.floor(Math.random() * 9999),
			},
		});
	} else {
		// kalau tidak buat saja baru
		result = await prisma.user.create({
			data: {
				nama,
				email,
				roleId,
				telepon,
				password: await bcrypt.hash(password, 12),
				otp: Math.floor(Math.random() * 9999),
			},
		});
	}
	await otpMail(email, result);

	delete result.id;
	delete result.password;
	delete result.roleId;
	return result;
};

const signin = async (req) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new BadRequestError('Please provide email and password');
	}

	let result = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (!result) {
		throw new UnauthorizedError('Invalid Credentials');
	}

	if (result.status !== 'aktif') {
		throw new UnauthorizedError('Akun anda belum aktif');
	}

	const isPasswordCorrect = await bcrypt.compare(password, result.password);
	if (!isPasswordCorrect) {
		throw new UnauthorizedError('Invalid Credentials');
	}

	const token = createJWT({ payload: createTokenUser(result) });

	const refreshToken = createRefreshJWT({ payload: createTokenUser(result) });

	await createUserRefreshToken({
		refreshToken,
		userId: result.id,
	});

	return { token, refreshToken, role: result.role, email: result.email };
};

module.exports = { signin, signup };
